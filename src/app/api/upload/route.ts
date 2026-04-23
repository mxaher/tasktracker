import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { d1Run, d1First, createId, nowIso } from "@/lib/cloudflare-d1";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

// Column mapping for Arabic/English columns
const columnMapping: Record<string, string> = {
  // Arabic columns
  "#": "taskId",
  "المهمة": "title",
  "القسم": "department",
  "الموظف": "ownerName",
  "الأولوية": "priority",
  "الركيزة الاستراتيجية": "strategicPillar",
  "الحالة": "status",
  "نسبة الإنجاز": "completion",
  "تاريخ البداية": "startDate",
  "تاريخ الانتهاء": "dueDate",
  "الأيام المتبقية": "daysRemaining",
  "مؤشر المخاطر": "riskIndicator",
  "الملاحظات": "notes",
  "الخطوة القادمة": "nextStep",
  "ملاحظات الرئيس التنفيذي": "ceoNotes",
  "الشهر المصدر": "sourceMonth",
  // English columns
  "task id": "taskId",
  "title": "title",
  "description": "description",
  "department": "department",
  "owner": "ownerName",
  "assignee": "assigneeName",
  "priority": "priority",
  "status": "status",
  "start date": "startDate",
  "due date": "dueDate",
  "completion": "completion",
  "completion %": "completion",
  "notes": "notes",
  "source month": "sourceMonth",
  "strategic pillar": "strategicPillar",
};

function normalizeHeader(header: unknown): string {
  return String(header ?? "")
    .replace(/\uFEFF/g, "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function mapHeaderToColumn(header: unknown): string | undefined {
  const raw = String(header ?? "").trim();
  if (!raw) return undefined;

  const normalized = normalizeHeader(raw);
  const compact = normalized.replace(/\s+/g, "");

  return (
    columnMapping[raw] ||
    columnMapping[raw.toLowerCase()] ||
    columnMapping[normalized] ||
    columnMapping[compact]
  );
}

// Status mapping
const statusMapping: Record<string, string> = {
  "مكتملة": "completed",
  "جاري العمل": "in_progress",
  "متوقفة": "delayed",
  "لم تبدأ": "not_started",
  "completed": "completed",
  "in progress": "in_progress",
  "delayed": "delayed",
  "not started": "not_started",
};

// Priority mapping
const priorityMapping: Record<string, string> = {
  "p1 - عاجل": "critical",
  "p2 - مهم": "high",
  "p3 - عادي": "medium",
  "p4 - منخفض": "low",
  "critical": "critical",
  "high": "high",
  "medium": "medium",
  "low": "low",
};

// POST /api/upload - Upload and parse Excel/CSV file
export async function POST(request: NextRequest) {
  try {
    // Ensure DataSource table exists
    try {
      await d1Run(`CREATE TABLE IF NOT EXISTS "DataSource" (
        "id" TEXT PRIMARY KEY,
        "fileName" TEXT NOT NULL,
        "originalName" TEXT NOT NULL,
        "fileSize" INTEGER NOT NULL DEFAULT 0,
        "rowCount" INTEGER NOT NULL DEFAULT 0,
        "columnMapping" TEXT,
        "createdAt" TEXT NOT NULL,
        "updatedAt" TEXT NOT NULL
      )`);
    } catch {}

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Read file
    const buffer = await file.arrayBuffer();

    // Persist original file to R2 for audit trail
    try {
      const { env } = getCloudflareContext();
      type R2BucketLike = { put: (key: string, value: ArrayBuffer, opts?: { httpMetadata?: { contentType?: string } }) => Promise<unknown> };
      const r2Env = env as { FILES_BUCKET?: R2BucketLike };
      if (r2Env.FILES_BUCKET) {
        const r2Key = `uploads/${Date.now()}-${file.name}`;
        await r2Env.FILES_BUCKET.put(r2Key, buffer, {
          httpMetadata: { contentType: file.type },
        });
      }
    } catch (r2Error) {
      console.warn("[Upload] R2 storage failed (non-fatal):", r2Error);
    }

    const workbook = XLSX.read(buffer, { type: "array" });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

    if (rawData.length < 2) {
      return NextResponse.json(
        { error: "File is empty or has no data rows" },
        { status: 400 }
      );
    }

    // Detect header row by best mapping score
    let headerRowIndex = -1;
    let bestScore = -1;

    for (let i = 0; i < Math.min(15, rawData.length); i++) {
      const row = rawData[i] as unknown[] | undefined;
      if (!row || row.length === 0) continue;

      const score = row.reduce<number>(
        (count, cell) => count + (mapHeaderToColumn(cell) ? 1 : 0),
        0,
      );
      if (score > bestScore) {
        bestScore = score;
        headerRowIndex = i;
      }
    }

    if (headerRowIndex < 0 || bestScore <= 0) {
      return NextResponse.json(
        {
          error: "Could not detect valid column headers.",
          message: "لم نتمكن من قراءة عناوين الأعمدة. يرجى استخدام ملف القالب الصحيح.",
        },
        { status: 400 },
      );
    }

    const headers = rawData[headerRowIndex] as unknown[];
    const dataRows = rawData.slice(headerRowIndex + 1);

    // Map columns
    const columnMap: Record<number, string> = {};
    headers.forEach((header, index) => {
      const mappedColumn = mapHeaderToColumn(header);
      if (mappedColumn) {
        columnMap[index] = mappedColumn;
      }
    });

    const hasTitleColumn = Object.values(columnMap).includes("title");
    if (!hasTitleColumn) {
      return NextResponse.json(
        {
          error: "Missing title column.",
          message: "لم نجد عمود عنوان المهمة (Title/المهمة)، لذلك لا يمكن الاستيراد.",
        },
        { status: 400 },
      );
    }

    // Get or create users for owners (raw D1)
    const userCache = new Map<string, string>();

    const getOrCreateUser = async (name: string): Promise<string | null> => {
      if (!name || name.trim() === "") return null;
      const trimmedName = name.trim();

      if (userCache.has(trimmedName)) {
        return userCache.get(trimmedName)!;
      }

      const existingUser = await d1First<{ id: string }>(
        `SELECT "id" FROM "User" WHERE "name" = ? OR "email" = ? LIMIT 1`,
        trimmedName,
        trimmedName,
      );

      if (existingUser) {
        userCache.set(trimmedName, existingUser.id);
        return existingUser.id;
      }

      const newId = createId();
      const now = nowIso();
      await d1Run(
        `INSERT INTO "User" ("id","email","name","role","createdAt","updatedAt")
         VALUES (?,?,?,?,?,?)`,
        newId,
        `user-${crypto.randomUUID().slice(0, 12)}@tasktracker.local`,
        trimmedName,
        "viewer",
        now,
        now,
      );

      userCache.set(trimmedName, newId);
      return newId;
    };

    // Create DataSource record
    const dataSourceId = createId();
    const now = nowIso();
    await d1Run(
      `INSERT INTO "DataSource" ("id","fileName","originalName","fileSize",
       "rowCount","columnMapping","createdAt","updatedAt")
       VALUES (?,?,?,?,?,?,?,?)`,
      dataSourceId,
      file.name,
      file.name,
      file.size,
      dataRows.length,
      JSON.stringify(columnMap),
      now,
      now,
    );

    // Process rows and insert via raw D1
    let imported = 0;

    for (const row of dataRows) {
      if (!row || !Array.isArray(row)) continue;

      const taskData: Record<string, unknown> = {};

      for (const [index, fieldName] of Object.entries(columnMap)) {
        const value = row[parseInt(index)];

        if (value === null || value === undefined || value === "") continue;

        switch (fieldName) {
          case "taskId":
            taskData.taskId = String(value);
            break;
          case "title":
            taskData.title = String(value);
            break;
          case "description":
            taskData.description = String(value);
            break;
          case "department":
            taskData.department = String(value);
            break;
          case "ownerName":
            taskData.ownerName = String(value);
            break;
          case "priority":
            taskData.priority = priorityMapping[String(value).toLowerCase()] || "medium";
            break;
          case "status":
            taskData.status = statusMapping[String(value).toLowerCase()] || "not_started";
            break;
          case "strategicPillar":
            taskData.strategicPillar = String(value);
            break;
          case "completion": {
            let completion = parseFloat(String(value));
            if (isNaN(completion)) completion = 0;
            if (completion > 1) completion = completion / 100;
            taskData.completion = Math.min(1, Math.max(0, completion));
            break;
          }
          case "startDate":
            if (value instanceof Date) {
              taskData.startDate = value;
            } else {
              const date = new Date(String(value));
              if (!isNaN(date.getTime())) {
                taskData.startDate = date;
              }
            }
            break;
          case "dueDate":
            if (value instanceof Date) {
              taskData.dueDate = value;
            } else {
              const date = new Date(String(value));
              if (!isNaN(date.getTime())) {
                taskData.dueDate = date;
              }
            }
            break;
          case "riskIndicator":
            taskData.riskIndicator = String(value);
            break;
          case "notes":
            taskData.notes = String(value);
            break;
          case "nextStep":
            taskData.nextStep = String(value);
            break;
          case "ceoNotes":
            taskData.ceoNotes = String(value);
            break;
          case "sourceMonth":
            taskData.sourceMonth = String(value);
            break;
        }
      }

      if (!taskData.title) continue;

      // Get or create owner
      let ownerId: string | null = null;
      if (taskData.ownerName) {
        ownerId = await getOrCreateUser(taskData.ownerName as string);
      }

      // Determine status
      if (taskData.dueDate && taskData.status !== "completed") {
        const dueDate = new Date(taskData.dueDate as Date);
        const today = new Date();
        if (dueDate < today && (taskData.completion as number) < 1) {
          taskData.status = "delayed";
        }
      }

      // Auto-complete if 100%
      if ((taskData.completion as number) >= 1) {
        taskData.status = "completed";
        taskData.completedAt = new Date();
      }

      const id = createId();
      await d1Run(
        `INSERT OR IGNORE INTO "Task" (
          "id","taskId","title","description","ownerId","assigneeId",
          "department","priority","status","strategicPillar","completion",
          "riskIndicator","startDate","dueDate","completedAt","notes",
          "nextStep","ceoNotes","sourceMonth","source","dataSourceId",
          "parentId","createdAt","updatedAt"
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        id,
        (taskData.taskId as string) ?? null,
        String(taskData.title),
        (taskData.description as string) ?? null,
        ownerId,
        null,
        (taskData.department as string) ?? null,
        (taskData.priority as string) ?? "medium",
        (taskData.status as string) ?? "not_started",
        (taskData.strategicPillar as string) ?? null,
        typeof taskData.completion === "number" ? taskData.completion : 0,
        (taskData.riskIndicator as string) ?? null,
        taskData.startDate ? new Date(taskData.startDate as string).toISOString() : null,
        taskData.dueDate ? new Date(taskData.dueDate as string).toISOString() : null,
        taskData.completedAt ? new Date(taskData.completedAt as string).toISOString() : null,
        (taskData.notes as string) ?? null,
        (taskData.nextStep as string) ?? null,
        (taskData.ceoNotes as string) ?? null,
        (taskData.sourceMonth as string) ?? null,
        null,
        dataSourceId,
        null,
        now,
        now,
      );
      imported++;
    }

    if (imported === 0) {
      return NextResponse.json(
        {
          error: "No importable rows found.",
          message: "لم يتم العثور على صفوف صالحة للاستيراد. تأكد أن عمود العنوان يحتوي على بيانات.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      imported,
      total: dataRows.length,
      dataSourceId,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to process upload", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
