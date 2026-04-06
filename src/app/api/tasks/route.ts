import { NextRequest, NextResponse } from "next/server";
import {
  buildTaskSelectSql,
  createId,
  d1All,
  d1First,
  d1Run,
  mapTaskRow,
  nowIso,
  toIsoDate,
} from "@/lib/cloudflare-d1";

export const runtime = "edge";

type TaskRow = Parameters<typeof mapTaskRow>[0];

export async function GET(request: NextRequest) {
  try {
    // Ensure source column exists (idempotent — fails silently if already present)
    try { await d1Run('ALTER TABLE "Task" ADD COLUMN "source" TEXT'); } catch {}

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const department = searchParams.get("department");
    const search = searchParams.get("search");
    const taskSelectSql = await buildTaskSelectSql();

    const clauses: string[] = [];
    const params: Array<string | number | null> = [];

    if (status && status !== "all") {
      clauses.push("t.status = ?");
      params.push(status);
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

    const whereClause = clauses.length > 0 ? ` WHERE ${clauses.join(" AND ")}` : "";
    const rows = await d1All<TaskRow>(
      `${taskSelectSql}${whereClause} ORDER BY t.updatedAt DESC`,
      ...params,
    );

    return NextResponse.json({ tasks: rows.map(mapTaskRow) });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    try { await d1Run('ALTER TABLE "Task" ADD COLUMN "source" TEXT'); } catch {}
    const data = await request.json();
    const taskSelectSql = await buildTaskSelectSql();
    const id = data.id || createId();
    const timestamp = data.updatedAt || nowIso();
    const createdAt = data.createdAt || timestamp;
    const status = data.status || "not_started";
    const completion = Number(data.completion ?? 0);
    const completedAt =
      status === "completed" ? toIsoDate(data.completedAt) ?? timestamp : null;

    await d1Run(
      `
        INSERT INTO "Task" (
          "id", "taskId", "title", "description", "ownerId", "assigneeId", "department",
          "priority", "status", "strategicPillar", "completion", "riskIndicator",
          "startDate", "dueDate", "completedAt", "notes", "nextStep", "ceoNotes",
          "sourceMonth", "source", "dataSourceId", "createdAt", "updatedAt"
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      createdAt,
      timestamp,
    );

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
      JSON.stringify({
        taskId: data.taskId || null,
        title: data.title,
        description: data.description || null,
        ownerId: data.ownerId || null,
        assigneeId: data.assigneeId || null,
        department: data.department || null,
        priority: data.priority || "medium",
        status,
      }),
      timestamp,
    );

    const task = await d1First<TaskRow>(`${taskSelectSql} WHERE t.id = ?`, id);

    return NextResponse.json({ task: task ? mapTaskRow(task) : null }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
