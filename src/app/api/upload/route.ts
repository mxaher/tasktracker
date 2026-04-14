import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../generated/prisma/edge";
import { db } from "@/lib/db";
import * as XLSX from "xlsx";

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
    
    // Detect header row by best mapping score (supports templates with title/instructions rows)
    let headerRowIndex = -1;
    let bestScore = -1;

    for (let i = 0; i < Math.min(15, rawData.length); i++) {
      const row = rawData[i] as unknown[] | undefined;
      if (!row || row.length === 0) continue;

      const score = row.reduce((count, cell) => count + (mapHeaderToColumn(cell) ? 1 : 0), 0);
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
    
    // Get or create users for owners
    const userCache = new Map<string, string>();
    
    const getOrCreateUser = async (name: string): Promise<string | null> => {
      if (!name || name.trim() === "") return null;
      const trimmedName = name.trim();
      
      if (userCache.has(trimmedName)) {
        return userCache.get(trimmedName)!;
      }
      
      // Try to find existing user
      const existingUser = await db.user.findFirst({
        where: {
          OR: [
            { name: trimmedName },
            { email: trimmedName },
          ],
        },
      });
      
      if (existingUser) {
        userCache.set(trimmedName, existingUser.id);
        return existingUser.id;
      }
      
      // Create new user
      const newUser = await db.user.create({
        data: {
          email: `user-${crypto.randomUUID().slice(0, 12)}@tasktracker.local`,
          name: trimmedName,
          role: "viewer",
        },
      });
      
      userCache.set(trimmedName, newUser.id);
      return newUser.id;
    };
    
    // Process rows
    const tasks: Prisma.TaskCreateManyInput[] = [];
    let imported = 0;
    
    for (const row of dataRows) {
      if (!row || !Array.isArray(row)) continue;
      
      const taskData: Record<string, unknown> = {};
      
      // Map each column
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
          case "completion":
            let completion = parseFloat(String(value));
            if (isNaN(completion)) completion = 0;
            if (completion > 1) completion = completion / 100;
            taskData.completion = Math.min(1, Math.max(0, completion));
            break;
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
      
      // Only create if we have a title
      if (taskData.title) {
        // Get or create owner
        let ownerId: string | null = null;
        if (taskData.ownerName) {
          ownerId = await getOrCreateUser(taskData.ownerName as string);
        }
        
        // Determine status based on due date and completion
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
        
        const { ownerName, ...taskWithoutOwnerName } = taskData;
        
        tasks.push({
          ...(taskWithoutOwnerName as Omit<Prisma.TaskCreateManyInput, "title">),
          title: String(taskData.title),
          ownerId
        });
        imported++;
      }
    }
    
    if (tasks.length === 0) {
      return NextResponse.json(
        {
          error: "No importable rows found.",
          message: "لم يتم العثور على صفوف صالحة للاستيراد. تأكد أن عمود العنوان يحتوي على بيانات.",
        },
        { status: 400 },
      );
    }

    // Create data source record after validating rows
    const dataSource = await db.dataSource.create({
      data: {
        fileName: file.name,
        originalName: file.name,
        fileSize: file.size,
        rowCount: dataRows.length,
        columnMapping: JSON.stringify(columnMap),
      },
    });

    // Bulk create tasks
    await db.task.createMany({
      data: tasks.map((task) => ({
        ...task,
        dataSourceId: dataSource.id,
      })),
    });
    
    return NextResponse.json({
      success: true,
      imported,
      total: dataRows.length,
      dataSourceId: dataSource.id,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to process upload", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
