import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1Value = string | number | null;
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

function getDb() {
  const context = getCloudflareContext();
  const env = context.env as {
    DB?: {
      prepare: (sql: string) => {
        bind: (...params: D1Value[]) => {
          first: <T>() => Promise<T | null>;
          run: () => Promise<unknown>;
        };
      };
    };
  };

  if (!env.DB) {
    throw new Error("Cloudflare D1 binding is not available.");
  }

  return env.DB;
}

async function d1First<T>(sql: string, ...params: D1Value[]) {
  return getDb().prepare(sql).bind(...params).first<T>();
}

async function d1Run(sql: string, ...params: D1Value[]) {
  return getDb().prepare(sql).bind(...params).run();
}

function createId() {
  return crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

function toDbBoolean(value: unknown) {
  return value ? 1 : 0;
}

function fromDbBoolean(value: unknown) {
  return value === true || value === 1 || value === "1";
}

function mapSettingsRow(row: SettingsRow) {
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

async function ensureSettingsRow() {
  let settings = await d1First<SettingsRow>(
    'SELECT * FROM "AdminSettings" ORDER BY "createdAt" ASC LIMIT 1',
  );

  if (settings) {
    return settings;
  }

  const id = createId();
  const timestamp = nowIso();

  await d1Run(
    `
      INSERT INTO "AdminSettings" (
        "id", "adminEmail", "dailyDigestEnabled", "dailyDigestTime", "weeklyReportEnabled",
        "weeklyReportDay", "weeklyReportTime", "inProgressReportEnabled",
        "inProgressReportFrequency", "taskReminderEnabled", "overdueReminderEnabled",
        "customReminderDates", "reminderDaysBefore", "createdAt", "updatedAt"
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    id,
    process.env.ADMIN_EMAIL || "admin@example.com",
    0,
    "09:00",
    0,
    1,
    "09:00",
    0,
    "daily",
    1,
    1,
    null,
    3,
    timestamp,
    timestamp,
  );

  settings = await d1First<SettingsRow>(
    'SELECT * FROM "AdminSettings" WHERE "id" = ? LIMIT 1',
    id,
  );

  if (!settings) {
    throw new Error("Failed to initialize admin settings.");
  }

  return settings;
}

export async function GET() {
  try {
    const settings = await ensureSettingsRow();
    return NextResponse.json({ settings: mapSettingsRow(settings) });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const current = await ensureSettingsRow();
    const updatedAt = nowIso();

    await d1Run(
      `
        UPDATE "AdminSettings"
        SET
          "adminEmail" = ?,
          "dailyDigestEnabled" = ?,
          "dailyDigestTime" = ?,
          "weeklyReportEnabled" = ?,
          "weeklyReportDay" = ?,
          "weeklyReportTime" = ?,
          "inProgressReportEnabled" = ?,
          "inProgressReportFrequency" = ?,
          "taskReminderEnabled" = ?,
          "overdueReminderEnabled" = ?,
          "customReminderDates" = ?,
          "reminderDaysBefore" = ?,
          "updatedAt" = ?
        WHERE "id" = ?
      `,
      data.adminEmail || current.adminEmail,
      toDbBoolean(data.dailyDigestEnabled),
      data.dailyDigestTime || "09:00",
      toDbBoolean(data.weeklyReportEnabled),
      Number(data.weeklyReportDay ?? 1),
      data.weeklyReportTime || "09:00",
      toDbBoolean(data.inProgressReportEnabled),
      data.inProgressReportFrequency || "daily",
      toDbBoolean(data.taskReminderEnabled ?? true),
      toDbBoolean(data.overdueReminderEnabled ?? true),
      data.customReminderDates || null,
      Number(data.reminderDaysBefore ?? 3),
      updatedAt,
      current.id,
    );

    const settings = await d1First<SettingsRow>(
      'SELECT * FROM "AdminSettings" WHERE "id" = ? LIMIT 1',
      current.id,
    );

    return NextResponse.json({ settings: settings ? mapSettingsRow(settings) : null });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
