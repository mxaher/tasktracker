import { NextRequest, NextResponse } from "next/server";
import {

  buildTaskSelectSql,
  createId,
  d1All,
  d1First,
  d1Run,
  getAllDescendantIds,
  getTaskDepth,
  mapTaskRow,
  nowIso,
  toIsoDate,
} from "@/lib/cloudflare-d1";


export const dynamic = 'force-dynamic'
type TaskRow = Parameters<typeof mapTaskRow>[0];

export async function GET(request: NextRequest) {
  try {
    // Ensure optional columns exist (idempotent — fails silently if already present)
    try { await d1Run('ALTER TABLE "Task" ADD COLUMN "source" TEXT'); } catch {}
    try { await d1Run('ALTER TABLE "Task" ADD COLUMN "parentId" TEXT REFERENCES "Task"("id") ON DELETE SET NULL'); } catch {}

    const { searchParams } = new URL(request.url);
    const statuses = searchParams
      .getAll("status")
      .flatMap((value) => value.split(","))
      .map((value) => value.trim())
      .filter(Boolean);
    const priority = searchParams.get("priority");
    const department = searchParams.get("department");
    const search = searchParams.get("search");
    const parentIdFilter = searchParams.get("parentId");
    const rootOnly = searchParams.get("rootOnly");
    const taskSelectSql = await buildTaskSelectSql();

    const clauses: string[] = [];
    const params: Array<string | number | null> = [];

    if (statuses.length > 0 && !statuses.includes("all")) {
      clauses.push(`t.status IN (${statuses.map(() => "?").join(", ")})`);
      params.push(...statuses);
    }

    if (priority && priority !== "all") {
      clauses.push("t.priority = ?");
      params.push(priority);
    }

    if (department && department !== "all") {
      clauses.push("t.department = ?");
      params.push(department);
    }

    if (search) {
      clauses.push(
        "(t.title LIKE ? OR t.description LIKE ? OR t.taskId LIKE ? OR t.department LIKE ?)",
      );
      const query = `%${search}%`;
      params.push(query, query, query, query);
    }

    if (parentIdFilter) {
      clauses.push("t.parentId = ?");
      params.push(parentIdFilter);
    } else if (rootOnly === "true") {
      clauses.push("t.parentId IS NULL");
    }

    const whereClause = clauses.length > 0 ? ` WHERE ${clauses.join(" AND ")}` : "";
    const rows = await d1All<TaskRow>(
      `${taskSelectSql}${whereClause} ORDER BY t.updatedAt DESC`,
      ...params,
    );

    // Attach childrenCount for each task
    const tasksWithCount = await Promise.all(
      rows.map(async (row) => {
        const mapped = mapTaskRow(row);
        const countRow = await d1First<{ cnt: number }>(
          'SELECT COUNT(*) AS cnt FROM "Task" WHERE "parentId" = ?',
          mapped.id,
        );
        return { ...mapped, childrenCount: countRow?.cnt ?? 0 };
      }),
    );

    return NextResponse.json({ tasks: tasksWithCount });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    try { await d1Run('ALTER TABLE "Task" ADD COLUMN "source" TEXT'); } catch {}
    try { await d1Run('ALTER TABLE "Task" ADD COLUMN "parentId" TEXT REFERENCES "Task"("id") ON DELETE SET NULL'); } catch {}
    try { await d1Run('CREATE INDEX IF NOT EXISTS "Task_parentId_idx" ON "Task"("parentId")'); } catch {}

    const data = await request.json();
    const taskSelectSql = await buildTaskSelectSql();
    const id = data.id || createId();
    const timestamp = data.updatedAt || nowIso();
    const createdAt = data.createdAt || timestamp;
    const status = data.status || "not_started";
    const completion = Number(data.completion ?? 0);
    const completedAt =
      status === "completed" ? toIsoDate(data.completedAt) ?? timestamp : null;

    // Validate parentId if provided
    let parentId: string | null = data.parentId || null;
    if (parentId) {
      const parentTask = await d1First<{ id: string; title: string }>(
        'SELECT "id", "title" FROM "Task" WHERE "id" = ?',
        parentId,
      );
      if (!parentTask) {
        return NextResponse.json({ error: "Parent task not found" }, { status: 400 });
      }

      // Check max depth: the new task will be at parentDepth + 1
      const parentDepth = await getTaskDepth(parentId);
      if (parentDepth >= 3) {
        return NextResponse.json(
          { error: "Maximum task nesting depth of 3 levels exceeded" },
          { status: 400 },
        );
      }
    }

    await d1Run(
      `
        INSERT INTO "Task" (
          "id", "taskId", "title", "description", "ownerId", "assigneeId", "department",
          "priority", "status", "strategicPillar", "completion", "riskIndicator",
          "startDate", "dueDate", "completedAt", "notes", "nextStep", "ceoNotes",
          "sourceMonth", "source", "dataSourceId", "parentId", "createdAt", "updatedAt"
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      id,
      data.taskId || null,
      data.title,
      data.description || null,
      data.ownerId || null,
      data.assigneeId || null,
      data.department || null,
      data.priority || "medium",
      status,
      data.strategicPillar || null,
      Number.isFinite(completion) ? completion : 0,
      data.riskIndicator || null,
      toIsoDate(data.startDate),
      toIsoDate(data.dueDate),
      completedAt,
      data.notes || null,
      data.nextStep || null,
      data.ceoNotes || null,
      data.sourceMonth || null,
      data.source || null,
      null,
      parentId,
      createdAt,
      timestamp,
    );

    // Audit log — include parentId change if set
    const auditNewValue: Record<string, unknown> = {
      taskId: data.taskId || null,
      title: data.title,
      description: data.description || null,
      ownerId: data.ownerId || null,
      assigneeId: data.assigneeId || null,
      department: data.department || null,
      priority: data.priority || "medium",
      status,
    };
    if (parentId) auditNewValue.parentId = parentId;

    await d1Run(
      `
        INSERT INTO "TaskAuditLog" (
          "id", "taskId", "userId", "action", "field", "oldValue", "newValue", "createdAt"
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      createId(),
      id,
      null,
      "create",
      null,
      null,
      JSON.stringify(auditNewValue),
      timestamp,
    );

    const task = await d1First<TaskRow>(`${taskSelectSql} WHERE t.id = ?`, id);

    return NextResponse.json({ task: task ? mapTaskRow(task) : null }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
