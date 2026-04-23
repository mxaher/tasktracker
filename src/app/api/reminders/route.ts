import { NextRequest, NextResponse } from "next/server";
import {

  createId,
  d1All,
  d1Run,
  fromDbBoolean,
  nowIso,
  toDbBoolean,
  toIsoDate,
} from "@/lib/cloudflare-d1";


export const dynamic = 'force-dynamic'
type ScheduledReminderRow = {
  id: string;
  title: string;
  description: string | null;
  reminderDate: string;
  reminderTime: string;
  sendToAdmin: number | boolean;
  sendToOwners: number | boolean;
  taskIds: string | null;
  isActive: number | boolean;
  isSent: number | boolean;
  sentAt: string | null;
  emailsSent: number | null;
  emailsFailed: number | null;
  createdAt: string;
  updatedAt: string;
};

function mapReminderRow(row: ScheduledReminderRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    reminderDate: row.reminderDate,
    reminderTime: row.reminderTime,
    sendToAdmin: fromDbBoolean(row.sendToAdmin),
    sendToOwners: fromDbBoolean(row.sendToOwners),
    taskIds: row.taskIds,
    isActive: fromDbBoolean(row.isActive),
    isSent: fromDbBoolean(row.isSent),
    sentAt: row.sentAt,
    emailsSent: row.emailsSent ?? 0,
    emailsFailed: row.emailsFailed ?? 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// GET /api/reminders - List all scheduled reminders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includePast = searchParams.get("includePast") === "true";

    const rows = await d1All<ScheduledReminderRow>(
      `
        SELECT *
        FROM "ScheduledReminder"
        ${includePast ? "" : 'WHERE "isSent" = 0 OR "reminderDate" >= ?'}
        ORDER BY "reminderDate" ASC
      `,
      ...(includePast ? [] : [new Date().toISOString()]),
    );

    return NextResponse.json({ reminders: rows.map(mapReminderRow) });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 });
  }
}

// POST /api/reminders - Create a new scheduled reminder
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = createId();
    const timestamp = nowIso();

    await d1Run(
      `
        INSERT INTO "ScheduledReminder" (
          "id", "title", "description", "reminderDate", "reminderTime",
          "sendToAdmin", "sendToOwners", "taskIds", "isActive", "isSent",
          "emailsSent", "emailsFailed", "createdAt", "updatedAt"
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      id,
      data.title,
      data.description || null,
      toIsoDate(data.reminderDate),
      data.reminderTime || "09:00",
      toDbBoolean(data.sendToAdmin ?? true),
      toDbBoolean(data.sendToOwners ?? true),
      data.taskIds || null,
      1,
      0,
      0,
      0,
      timestamp,
      timestamp,
    );

    const rows = await d1All<ScheduledReminderRow>(
      'SELECT * FROM "ScheduledReminder" WHERE "id" = ? LIMIT 1',
      id,
    );

    return NextResponse.json({ reminder: rows[0] ? mapReminderRow(rows[0]) : null });
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 });
  }
}

// PUT /api/reminders - Update a scheduled reminder
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: "Reminder ID required" }, { status: 400 });
    }

    await d1Run(
      `
        UPDATE "ScheduledReminder"
        SET
          "title" = COALESCE(?, "title"),
          "description" = ?,
          "reminderDate" = COALESCE(?, "reminderDate"),
          "reminderTime" = COALESCE(?, "reminderTime"),
          "sendToAdmin" = COALESCE(?, "sendToAdmin"),
          "sendToOwners" = COALESCE(?, "sendToOwners"),
          "taskIds" = ?,
          "isActive" = COALESCE(?, "isActive"),
          "updatedAt" = ?
        WHERE "id" = ?
      `,
      data.title ?? null,
      data.description ?? null,
      data.reminderDate ? toIsoDate(data.reminderDate) : null,
      data.reminderTime ?? null,
      data.sendToAdmin === undefined ? null : toDbBoolean(data.sendToAdmin),
      data.sendToOwners === undefined ? null : toDbBoolean(data.sendToOwners),
      data.taskIds ?? null,
      data.isActive === undefined ? null : toDbBoolean(data.isActive),
      nowIso(),
      data.id,
    );

    const rows = await d1All<ScheduledReminderRow>(
      'SELECT * FROM "ScheduledReminder" WHERE "id" = ? LIMIT 1',
      data.id,
    );

    return NextResponse.json({ reminder: rows[0] ? mapReminderRow(rows[0]) : null });
  } catch (error) {
    console.error("Error updating reminder:", error);
    return NextResponse.json({ error: "Failed to update reminder" }, { status: 500 });
  }
}

// DELETE /api/reminders - Delete a scheduled reminder
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Reminder ID required" }, { status: 400 });
    }

    await d1Run('DELETE FROM "ScheduledReminder" WHERE "id" = ?', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json({ error: "Failed to delete reminder" }, { status: 500 });
  }
}
