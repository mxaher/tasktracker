import { d1All, d1First, d1Run, createId, nowIso } from "@/lib/cloudflare-d1";
import type { ChildTaskSummary, ParentTaskSummary } from "@/types/task-hierarchy";

const MAX_DEPTH = 3;

// ---------------------------------------------------------------------------
// Schema bootstrapping — runs idempotently on each cold start
// ---------------------------------------------------------------------------
export async function ensureParentIdColumn() {
  try {
    await d1Run('ALTER TABLE "Task" ADD COLUMN "parentId" TEXT REFERENCES "Task"("id") ON DELETE SET NULL');
  } catch {
    // Column already exists — safe to ignore
  }
  try {
    await d1Run('CREATE INDEX IF NOT EXISTS "Task_parentId_idx" ON "Task"("parentId")');
  } catch {
    // Index already exists — safe to ignore
  }
}

// ---------------------------------------------------------------------------
// Depth helpers
// ---------------------------------------------------------------------------

/**
 * Walks UP the ancestor chain of `taskId` and returns the chain length.
 * A root task (no parent) has depth 1. A child has depth 2, grandchild depth 3.
 */
export async function getTaskDepth(taskId: string): Promise<number> {
  let depth = 1;
  let currentId: string | null = taskId;

  for (let i = 0; i < MAX_DEPTH + 2; i++) {
    const row = await d1First<{ parentId: string | null }>(
      'SELECT "parentId" FROM "Task" WHERE "id" = ? LIMIT 1',
      currentId,
    );
    if (!row || !row.parentId) break;
    depth++;
    currentId = row.parentId;
  }

  return depth;
}

/**
 * Returns the max depth in the subtree rooted at `taskId` (inclusive).
 * Used when reparenting: we need to know how deep the subtree already goes.
 */
export async function getSubtreeMaxDepth(taskId: string, currentDepth = 1): Promise<number> {
  const children = await d1All<{ id: string }>(
    'SELECT "id" FROM "Task" WHERE "parentId" = ?',
    taskId,
  );
  if (children.length === 0) return currentDepth;
  const depths = await Promise.all(
    children.map((c) => getSubtreeMaxDepth(c.id, currentDepth + 1)),
  );
  return Math.max(...depths);
}

// ---------------------------------------------------------------------------
// Circular reference detection
// ---------------------------------------------------------------------------

/**
 * Returns true if `ancestorCandidateId` is an ancestor of `taskId`
 * (i.e. setting taskId.parentId = ancestorCandidateId would create a cycle).
 */
export async function wouldCreateCycle(
  taskId: string,
  newParentId: string,
): Promise<boolean> {
  if (taskId === newParentId) return true;

  // Walk UP from newParentId; if we hit taskId, it's a cycle
  let currentId: string | null = newParentId;
  for (let i = 0; i < MAX_DEPTH + 5; i++) {
    const row = await d1First<{ parentId: string | null }>(
      'SELECT "parentId" FROM "Task" WHERE "id" = ? LIMIT 1',
      currentId,
    );
    if (!row || !row.parentId) break;
    if (row.parentId === taskId) return true;
    currentId = row.parentId;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Children / parent query helpers
// ---------------------------------------------------------------------------

export async function getChildren(taskId: string): Promise<ChildTaskSummary[]> {
  type ChildRow = {
    id: string;
    title: string;
    status: string;
    priority: string;
    completion: number | null;
    assigneeId: string | null;
    assignee_id: string | null;
    assignee_name: string | null;
    assignee_email: string | null;
  };

  const rows = await d1All<ChildRow>(
    `
      SELECT
        t.id, t.title, t.status, t.priority, t.completion, t.assigneeId,
        u.id AS assignee_id, u.name AS assignee_name, u.email AS assignee_email
      FROM "Task" t
      LEFT JOIN "User" u ON u.id = t.assigneeId
      WHERE t.parentId = ?
      ORDER BY t.createdAt ASC
    `,
    taskId,
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    status: r.status,
    priority: r.priority,
    completion: r.completion ?? 0,
    assigneeId: r.assigneeId,
    assignee:
      r.assignee_id && r.assignee_email
        ? { id: r.assignee_id, name: r.assignee_name, email: r.assignee_email }
        : null,
  }));
}

export async function getParent(parentId: string): Promise<ParentTaskSummary | null> {
  const row = await d1First<{ id: string; title: string; status: string }>(
    'SELECT "id", "title", "status" FROM "Task" WHERE "id" = ? LIMIT 1',
    parentId,
  );
  return row ?? null;
}

export async function getChildrenCount(taskId: string): Promise<number> {
  const row = await d1First<{ cnt: number }>(
    'SELECT COUNT(*) AS cnt FROM "Task" WHERE "parentId" = ?',
    taskId,
  );
  return row?.cnt ?? 0;
}

// ---------------------------------------------------------------------------
// Completion roll-up
// ---------------------------------------------------------------------------

/**
 * If all children of `parentId` are completed, auto-complete the parent.
 * This is a shallow roll-up — it does NOT recursively walk up further ancestors.
 * Cascade up is intentionally left to the caller if needed.
 */
export async function rollUpCompletion(parentId: string): Promise<void> {
  const children = await d1All<{ status: string; completion: number | null }>(
    'SELECT "status", "completion" FROM "Task" WHERE "parentId" = ?',
    parentId,
  );

  if (children.length === 0) return;

  const allCompleted = children.every((c) => c.status === "completed");
  if (!allCompleted) return;

  await d1Run(
    'UPDATE "Task" SET "status" = ?, "completion" = ?, "completedAt" = ?, "updatedAt" = ? WHERE "id" = ?',
    "completed",
    1,
    nowIso(),
    nowIso(),
    parentId,
  );
}

// ---------------------------------------------------------------------------
// Audit log for parentId changes
// ---------------------------------------------------------------------------

export async function logParentChange(
  taskId: string,
  oldParentId: string | null,
  newParentId: string | null,
): Promise<void> {
  const [oldTitle, newTitle] = await Promise.all([
    oldParentId
      ? d1First<{ title: string }>('SELECT "title" FROM "Task" WHERE "id" = ? LIMIT 1', oldParentId).then((r) => r?.title ?? null)
      : Promise.resolve(null),
    newParentId
      ? d1First<{ title: string }>('SELECT "title" FROM "Task" WHERE "id" = ? LIMIT 1', newParentId).then((r) => r?.title ?? null)
      : Promise.resolve(null),
  ]);

  await d1Run(
    `INSERT INTO "TaskAuditLog" ("id", "taskId", "userId", "action", "field", "oldValue", "newValue", "createdAt")
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    createId(),
    taskId,
    null,
    "update",
    "parentId",
    oldTitle,
    newTitle,
    nowIso(),
  );
}
