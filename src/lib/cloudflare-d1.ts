import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1PreparedStatementLike = {
  bind: (...params: D1Value[]) => D1PreparedStatementLike;
  all: <T>() => Promise<{ results?: T[] }>;
  first: <T>() => Promise<T | null>;
  run: () => Promise<unknown>;
};

type D1DatabaseBinding = {
  prepare: (sql: string) => D1PreparedStatementLike;
};

type D1Value = string | number | null;

type TaskRow = {
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
  dataSourceId: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  owner_user_id: string | null;
  owner_name: string | null;
  owner_email: string | null;
  assignee_user_id: string | null;
  assignee_name: string | null;
  assignee_email: string | null;
  latest_update_content: string | null;
  latest_update_created_at: string | null;
};

type SettingsRow = {
  id: string;
  adminEmail: string;
  dailyDigestEnabled: number | boolean;
  dailyDigestTime: string;
  weeklyReportEnabled: number | boolean;
  weeklyReportDay: number;
  weeklyReportTime: string;
  inProgressReportEnabled: number | boolean;
  inProgressReportFrequency: string;
  taskReminderEnabled: number | boolean;
  overdueReminderEnabled: number | boolean;
  customReminderDates: string | null;
  reminderDaysBefore: number;
  createdAt: string;
  updatedAt: string;
};

type TableInfoRow = {
  name: string;
};

const tableColumnsCache = new Map<string, string[]>();

function getDatabase(): D1DatabaseBinding {
  const context = getCloudflareContext();
  const database = (context.env as { DB?: D1DatabaseBinding }).DB;

  if (!database) {
    throw new Error("Cloudflare D1 binding is not available.");
  }

  return database;
}

export async function d1All<T>(sql: string, ...params: D1Value[]) {
  const result = await getDatabase()
    .prepare(sql)
    .bind(...params)
    .all<T>();

  return result.results ?? [];
}

export async function d1First<T>(sql: string, ...params: D1Value[]) {
  return getDatabase()
    .prepare(sql)
    .bind(...params)
    .first<T>();
}

export async function d1Run(sql: string, ...params: D1Value[]) {
  return getDatabase()
    .prepare(sql)
    .bind(...params)
    .run();
}

export async function getTableColumns(tableName: string) {
  const cachedColumns = tableColumnsCache.get(tableName);
  if (cachedColumns) {
    return cachedColumns;
  }

  const rows = await d1All<TableInfoRow>(`PRAGMA table_info("${tableName}")`);
  const columns = rows.map((row) => row.name);
  tableColumnsCache.set(tableName, columns);
  return columns;
}

export function createId() {
  return crypto.randomUUID();
}

export function toDbBoolean(value: unknown) {
  return value ? 1 : 0;
}

export function fromDbBoolean(value: unknown) {
  return value === true || value === 1 || value === "1";
}

export function toIsoDate(value: unknown) {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function nowIso() {
  return new Date().toISOString();
}

export function mapTaskRow(row: TaskRow) {
  return {
    id: row.id,
    taskId: row.taskId,
    title: row.title,
    description: row.description,
    ownerId: row.ownerId,
    assigneeId: row.assigneeId,
    department: row.department,
    priority: row.priority,
    status: row.status,
    strategicPillar: row.strategicPillar,
    completion: row.completion ?? 0,
    riskIndicator: row.riskIndicator,
    startDate: row.startDate,
    dueDate: row.dueDate,
    completedAt: row.completedAt,
    notes: row.notes,
    nextStep: row.nextStep,
    ceoNotes: row.ceoNotes,
    sourceMonth: row.sourceMonth,
    source: row.source,
    parentId: row.parentId ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    latestUpdate:
      row.latest_update_content && row.latest_update_created_at
        ? {
            content: row.latest_update_content,
            createdAt: row.latest_update_created_at,
          }
        : null,
    owner:
      row.owner_user_id && row.owner_email
        ? {
            id: row.owner_user_id,
            name: row.owner_name,
            email: row.owner_email,
          }
        : null,
    assignee:
      row.assignee_user_id && row.assignee_email
        ? {
            id: row.assignee_user_id,
            name: row.assignee_name,
            email: row.assignee_email,
          }
        : null,
  };
}

export function mapSettingsRow(row: SettingsRow) {
  return {
    id: row.id,
    adminEmail: row.adminEmail,
    dailyDigestEnabled: fromDbBoolean(row.dailyDigestEnabled),
    dailyDigestTime: row.dailyDigestTime,
    weeklyReportEnabled: fromDbBoolean(row.weeklyReportEnabled),
    weeklyReportDay: row.weeklyReportDay,
    weeklyReportTime: row.weeklyReportTime,
    inProgressReportEnabled: fromDbBoolean(row.inProgressReportEnabled),
    inProgressReportFrequency: row.inProgressReportFrequency,
    taskReminderEnabled: fromDbBoolean(row.taskReminderEnabled),
    overdueReminderEnabled: fromDbBoolean(row.overdueReminderEnabled),
    customReminderDates: row.customReminderDates,
    reminderDaysBefore: row.reminderDaysBefore,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/**
 * Builds a task select query that tolerates older D1 schemas by substituting
 * missing optional columns with NULL aliases instead of failing the query.
 */
export async function buildTaskSelectSql() {
  const taskColumns = new Set(await getTableColumns("Task"));
  const taskUpdateColumns = new Set(await getTableColumns("TaskUpdate").catch(() => [] as string[]));
  const selectTaskColumn = (columnName: string) =>
    taskColumns.has(columnName) ? `t.${columnName}` : `NULL AS ${columnName}`;
  const latestUpdateContentSql =
    taskUpdateColumns.size > 0
      ? `(
          SELECT tu.content
          FROM "TaskUpdate" tu
          WHERE tu.taskId = t.id
          ORDER BY tu.createdAt DESC
          LIMIT 1
        ) AS latest_update_content`
      : `NULL AS latest_update_content`;
  const latestUpdateCreatedAtSql =
    taskUpdateColumns.size > 0
      ? `(
          SELECT tu.createdAt
          FROM "TaskUpdate" tu
          WHERE tu.taskId = t.id
          ORDER BY tu.createdAt DESC
          LIMIT 1
        ) AS latest_update_created_at`
      : `NULL AS latest_update_created_at`;

  return `
    SELECT
      t.id,
      t.taskId,
      t.title,
      t.description,
      t.ownerId,
      t.assigneeId,
      t.department,
      t.priority,
      t.status,
      t.strategicPillar,
      t.completion,
      t.riskIndicator,
      t.startDate,
      t.dueDate,
      t.completedAt,
      t.notes,
      ${selectTaskColumn("nextStep")},
      ${selectTaskColumn("ceoNotes")},
      ${selectTaskColumn("sourceMonth")},
      ${selectTaskColumn("source")},
      ${selectTaskColumn("dataSourceId")},
      ${selectTaskColumn("parentId")},
      t.createdAt,
      t.updatedAt,
      owner.id AS owner_user_id,
      owner.name AS owner_name,
      owner.email AS owner_email,
      assignee.id AS assignee_user_id,
      assignee.name AS assignee_name,
      assignee.email AS assignee_email,
      ${latestUpdateContentSql},
      ${latestUpdateCreatedAtSql}
    FROM "Task" t
    LEFT JOIN "User" owner ON owner.id = t.ownerId
    LEFT JOIN "User" assignee ON assignee.id = t.assigneeId
  `;
}

/**
 * Calculate the depth of a task in the hierarchy.
 * Returns 1 for root tasks, 2 for children, 3 for grandchildren, etc.
 */
export async function getTaskDepth(taskId: string): Promise<number> {
  let depth = 1;
  let currentId: string | null = taskId;
  const visited = new Set<string>();

  while (currentId) {
    if (visited.has(currentId)) break; // circular reference guard
    visited.add(currentId);
    const row = await d1First<{ parentId: string | null }>(
      'SELECT "parentId" FROM "Task" WHERE "id" = ?',
      currentId,
    );
    if (!row || !row.parentId) break;
    depth++;
    currentId = row.parentId;
  }

  return depth;
}

/**
 * Collect all descendant IDs of a task (children, grandchildren, etc.)
 * Used to prevent circular references.
 */
export async function getAllDescendantIds(taskId: string): Promise<Set<string>> {
  const descendants = new Set<string>();
  const queue = [taskId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const children = await d1All<{ id: string }>(
      'SELECT "id" FROM "Task" WHERE "parentId" = ?',
      current,
    );
    for (const child of children) {
      if (!descendants.has(child.id)) {
        descendants.add(child.id);
        queue.push(child.id);
      }
    }
  }

  return descendants;
}
