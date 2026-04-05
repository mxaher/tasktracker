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
  createdAt: string;
  updatedAt: string;
  owner_user_id: string | null;
  owner_name: string | null;
  owner_email: string | null;
  assignee_user_id: string | null;
  assignee_name: string | null;
  assignee_email: string | null;
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
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
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

export const TASK_SELECT_SQL = `
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
    t.nextStep,
    t.ceoNotes,
    t.sourceMonth,
    t.source,
    t.dataSourceId,
    t.createdAt,
    t.updatedAt,
    owner.id AS owner_user_id,
    owner.name AS owner_name,
    owner.email AS owner_email,
    assignee.id AS assignee_user_id,
    assignee.name AS assignee_name,
    assignee.email AS assignee_email
  FROM "Task" t
  LEFT JOIN "User" owner ON owner.id = t.ownerId
  LEFT JOIN "User" assignee ON assignee.id = t.assigneeId
`;
