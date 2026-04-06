import { NextRequest, NextResponse } from "next/server";
import {
  buildTaskSelectSql,
  createId,
  d1First,
  d1Run,
  mapTaskRow,
  nowIso,
  toIsoDate,
} from "@/lib/cloudflare-d1";

export const runtime = "edge";

type TaskRow = Parameters<typeof mapTaskRow>[0];

type BaseTaskRow = {
  id: string;
  taskId: string | null;
  title: string;
  description: string | null;
  ownerId: string | null;
  assigneeId: string | null;
  department: string | null;
  priority: string;
  status: string;
  strategicPillar: string | null;
  completion: number | null;
  riskIndicator: string | null;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  notes: string | null;
  nextStep: string | null;
  ceoNotes: string | null;
  sourceMonth: string | null;
  source: string | null;
};

async function getTaskRow(id: string) {
  const taskSelectSql = await buildTaskSelectSql();
  return d1First<TaskRow>(`${taskSelectSql} WHERE t.id = ?`, id);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const task = await getTaskRow(id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task: mapTaskRow(task) });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    try { await d1Run('ALTER TABLE "Task" ADD COLUMN "source" TEXT'); } catch {}
    const { id } = await params;
    const data = await request.json();
    const currentTask = await d1First<BaseTaskRow>(
      'SELECT * FROM "Task" WHERE "id" = ? LIMIT 1',
      id,
    );

    if (!currentTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const fieldsToCheck = [
      "taskId",
      "title",
      "description",
      "ownerId",
      "assigneeId",
      "department",
      "priority",
      "status",
      "strategicPillar",
      "completion",
      "riskIndicator",
      "startDate",
      "dueDate",
      "notes",
      "nextStep",
      "ceoNotes",
      "sourceMonth",
      "source",
    ] as const;

    const updates: string[] = [];
    const paramsToBind: Array<string | number | null> = [];
    const auditLogs: Array<{ field: string; oldValue: string | null; newValue: string | null }> = [];

    for (const field of fieldsToCheck) {
      if (data[field] === undefined) continue;

      let nextValue: string | number | null = data[field];
      let oldValue = currentTask[field];

      if (field === "startDate" || field === "dueDate") {
        nextValue = toIsoDate(data[field]);
        oldValue = currentTask[field];
      }

      if (field === "completion") {
        nextValue = Number(data[field] ?? 0);
        oldValue = Number(currentTask.completion ?? 0);
      }

      if (JSON.stringify(oldValue) === JSON.stringify(nextValue)) {
        continue;
      }

      updates.push(`"${field}" = ?`);
      paramsToBind.push(nextValue as string | number | null);
      auditLogs.push({
        field,
        oldValue: oldValue == null ? null : String(oldValue),
        newValue: nextValue == null ? null : String(nextValue),
      });
    }

    if (data.status === "completed" && currentTask.status !== "completed") {
      updates.push('"completedAt" = ?', '"completion" = ?');
      paramsToBind.push(nowIso(), 1);
    }

    if (updates.length === 0) {
      const task = await getTaskRow(id);
      return NextResponse.json({ task: task ? mapTaskRow(task) : null });
    }

    updates.push('"updatedAt" = ?');
    paramsToBind.push(nowIso(), id);

    await d1Run(`UPDATE "Task" SET ${updates.join(", ")} WHERE "id" = ?`, ...paramsToBind);

    const logTimestamp = nowIso();
    for (const log of auditLogs) {
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
        "update",
        log.field,
        log.oldValue,
        log.newValue,
        logTimestamp,
      );
    }

    const task = await getTaskRow(id);
    return NextResponse.json({ task: task ? mapTaskRow(task) : null });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const task = await d1First<BaseTaskRow>('SELECT * FROM "Task" WHERE "id" = ? LIMIT 1', id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await d1Run('DELETE FROM "Notification" WHERE "taskId" = ?', id);
    await d1Run('DELETE FROM "TaskAuditLog" WHERE "taskId" = ?', id);
    await d1Run('DELETE FROM "Task" WHERE "id" = ?', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
