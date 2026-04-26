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
 
 // Run migrations once at module load
 const runTaskMigrations = async () => {
   try { await d1Run('ALTER TABLE "Task" ADD COLUMN "source" TEXT'); } catch {}
   try { await d1Run('ALTER TABLE "Task" ADD COLUMN "parentId" TEXT REFERENCES "Task"("id") ON DELETE SET NULL'); } catch {}
 };
 
 // Call migrations
 runTaskMigrations().catch(console.error);
type TaskRow = Parameters<typeof mapTaskRow>[0];
type TaskUpdateRow = {
  id: string;
  content: string;
  source: string;
  createdAt: string;
};

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
  parentId: string | null;
};

async function getTaskRow(id: string) {
  const taskSelectSql = await buildTaskSelectSql();
  return d1First<TaskRow>(`${taskSelectSql} WHERE t.id = ?`, id);
}

async function getTaskUpdates(taskId: string) {
  return d1All<TaskUpdateRow>(
    `
      SELECT "id", "content", "source", "createdAt"
      FROM "TaskUpdate"
      WHERE "taskId" = ?
      ORDER BY "createdAt" DESC
    `,
    taskId,
  );
}

async function checkAndCompleteParent(taskId: string) {
  const task = await d1First<{ parentId: string | null; status: string }>(
    'SELECT "parentId", "status" FROM "Task" WHERE "id" = ?',
    taskId,
  );
  if (task?.parentId) {
    const parentId = task.parentId;
    const incompleteCount = await d1First<{ cnt: number }>(
      'SELECT COUNT(*) AS cnt FROM "Task" WHERE "parentId" = ? AND "status" != \'completed\'',
      parentId,
    );
    if ((incompleteCount?.cnt ?? 0) === 0) {
      const now = nowIso();
      // Get parent's current status for audit log
      const parentTask = await d1First<{ status: string }>(
        'SELECT "status" FROM "Task" WHERE "id" = ?',
        parentId,
      );
      const oldStatus = parentTask?.status ?? 'unknown';
      
      await d1Run(
        'UPDATE "Task" SET "status" = \'completed\', "completion" = 1, "completedAt" = ?, "updatedAt" = ? WHERE "id" = ?',
        now,
        now,
        parentId,
      );
      await d1Run(
        `INSERT INTO "TaskAuditLog" ("id", "taskId", "userId", "action", "field", "oldValue", "newValue", "createdAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        createId(),
        parentId,
        null,
        "update",
        "status",
        oldStatus,
        "completed",
        now,
      );
      
      // Recursively check if the parent's parent should also be completed
      await checkAndCompleteParent(parentId);
    }
  }
}

async function buildTaskResponse(taskId: string) {
  const task = await getTaskRow(taskId);

  if (!task) {
    return null;
  }

  const mapped = mapTaskRow(task);
  const taskUpdates = await getTaskUpdates(taskId).catch(() => [] as TaskUpdateRow[]);

  // Fetch parent (shallow)
  let parent: { id: string; title: string; status: string } | null = null;
  if (mapped.parentId) {
    const parentRow = await d1First<{ id: string; title: string; status: string }>(
      'SELECT "id", "title", "status" FROM "Task" WHERE "id" = ?',
      mapped.parentId,
    );
    parent = parentRow ?? null;
  }

  // Fetch children (shallow)
  const childRows = await d1All<{
    id: string;
    title: string;
    status: string;
    priority: string;
    completion: number | null;
    assigneeId: string | null;
  }>(
    'SELECT "id", "title", "status", "priority", "completion", "assigneeId" FROM "Task" WHERE "parentId" = ? ORDER BY "createdAt" ASC',
    taskId,
  );

  const children = childRows.map((c) => ({
    ...c,
    completion: c.completion ?? 0,
  }));

  return {
    ...mapped,
    parent,
    children,
    taskUpdates,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const task = await buildTaskResponse(id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task });
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
     const { id } = await params;
    const data = (await request.json()) as Record<string, unknown> & { newUpdateContent?: string | null };
    const currentTask = await d1First<BaseTaskRow>(
      'SELECT * FROM "Task" WHERE "id" = ? LIMIT 1',
      id,
    );

    if (!currentTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // --- Status constraint: cannot complete a task with incomplete children ---
    if (data.status === "completed" && currentTask.status !== "completed") {
      const incompleteChildren = await d1First<{ cnt: number }>(
        'SELECT COUNT(*) AS cnt FROM "Task" WHERE "parentId" = ? AND "status" != \'completed\'',
        id,
      );
      if ((incompleteChildren?.cnt ?? 0) > 0) {
        return NextResponse.json(
          { error: "Cannot complete a task with incomplete sub-tasks" },
          { status: 400 },
        );
      }
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

      let nextValue: string | number | null = data[field] as string | number | null;
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

    // --- Handle parentId update ---
    if ("parentId" in data) {
      const newParentId = data.parentId as string | null;
      const oldParentId = currentTask.parentId;

      if (newParentId !== oldParentId) {
        if (newParentId) {
          // Ensure new parent exists
          const newParentTask = await d1First<{ id: string; title: string }>(
            'SELECT "id", "title" FROM "Task" WHERE "id" = ?',
            newParentId,
          );
          if (!newParentTask) {
            return NextResponse.json({ error: "Parent task not found" }, { status: 400 });
          }

          // Prevent circular reference: new parent cannot be the task itself or any of its descendants
          if (newParentId === id) {
            return NextResponse.json({ error: "A task cannot be its own parent" }, { status: 400 });
          }
          const descendants = await getAllDescendantIds(id);
          if (descendants.has(newParentId)) {
            return NextResponse.json(
              { error: "Circular reference detected: cannot set a descendant as parent" },
              { status: 400 },
            );
          }

          // Enforce max depth of 3
          const parentDepth = await getTaskDepth(newParentId);
          if (parentDepth >= 3) {
            return NextResponse.json(
              { error: "Maximum task nesting depth of 3 levels exceeded" },
              { status: 400 },
            );
          }
        }

        updates.push('"parentId" = ?');
        paramsToBind.push(newParentId);

        // Audit log with parent task titles
        let oldParentTitle: string | null = null;
        let newParentTitle: string | null = null;

        if (oldParentId) {
          const oldParent = await d1First<{ title: string }>(
            'SELECT "title" FROM "Task" WHERE "id" = ?',
            oldParentId,
          );
          oldParentTitle = oldParent?.title ?? oldParentId;
        }
        if (newParentId) {
          const newParent = await d1First<{ title: string }>(
            'SELECT "title" FROM "Task" WHERE "id" = ?',
            newParentId,
          );
          newParentTitle = newParent?.title ?? newParentId;
        }

        auditLogs.push({
          field: "parentId",
          oldValue: oldParentTitle,
          newValue: newParentTitle,
        });
      }
    }

    if (data.status === "completed" && currentTask.status !== "completed") {
      updates.push('"completedAt" = ?', '"completion" = ?');
      paramsToBind.push(nowIso(), 1);
    }

    const hasNewUpdateContent = typeof data.newUpdateContent === "string" && data.newUpdateContent.trim().length > 0;

    if (updates.length === 0 && !hasNewUpdateContent) {
      const task = await buildTaskResponse(id);
      return NextResponse.json({ task });
    }

    updates.push('"updatedAt" = ?');
    const updatedAt = nowIso();
    paramsToBind.push(updatedAt, id);

    await d1Run(`UPDATE "Task" SET ${updates.join(", ")} WHERE "id" = ?`, ...paramsToBind);

    if (hasNewUpdateContent) {
      await d1Run(
        `
          INSERT INTO "TaskUpdate" (
            "id", "taskId", "source", "content", "createdAt"
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        createId(),
        id,
        "manual",
        String(data.newUpdateContent).trim(),
        updatedAt,
      );
    }

    const logTimestamp = updatedAt;
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

     // --- Completion roll-up: if all children completed, mark parent as completed ---
     const taskAfterUpdate = await d1First<{ parentId: string | null; status: string }>(
       'SELECT "parentId", "status" FROM "Task" WHERE "id" = ?',
       id,
     );
     if (taskAfterUpdate?.parentId) {
       const parentId = taskAfterUpdate.parentId;
       const incompleteCount = await d1First<{ cnt: number }>(
         'SELECT COUNT(*) AS cnt FROM "Task" WHERE "parentId" = ? AND "status" != \'completed\'',
         parentId,
       );
       if ((incompleteCount?.cnt ?? 0) === 0) {
         const now = nowIso();
         // Get parent's current status for audit log
         const parentTask = await d1First<{ status: string }>(
           'SELECT "status" FROM "Task" WHERE "id" = ?',
           parentId,
         );
         const oldStatus = parentTask?.status ?? 'unknown';
         
         await d1Run(
           'UPDATE "Task" SET "status" = \'completed\', "completion" = 1, "completedAt" = ?, "updatedAt" = ? WHERE "id" = ?',
           now,
           now,
           parentId,
         );
         await d1Run(
           `INSERT INTO "TaskAuditLog" ("id", "taskId", "userId", "action", "field", "oldValue", "newValue", "createdAt") VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
           createId(),
           parentId,
           null,
           "update",
           "status",
           oldStatus,
           "completed",
           now,
         );
         
         // Recursively check if the parent's parent should also be completed
         await checkAndCompleteParent(parentId);
       }
     }

    const task = await buildTaskResponse(id);
    return NextResponse.json({ task });
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

    // Orphan children instead of cascade delete
    await d1Run('UPDATE "Task" SET "parentId" = NULL WHERE "parentId" = ?', id);

    await d1Run('DELETE FROM "Notification" WHERE "taskId" = ?', id);
    await d1Run('DELETE FROM "TaskAuditLog" WHERE "taskId" = ?', id);
    await d1Run('DELETE FROM "Task" WHERE "id" = ?', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
