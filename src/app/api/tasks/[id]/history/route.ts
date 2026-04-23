import { NextRequest, NextResponse } from "next/server";
import { d1All, d1First } from "@/lib/cloudflare-d1";



export const dynamic = 'force-dynamic'
type AuditLogRow = {
  id: string;
  taskId: string;
  userId: string | null;
  action: string;
  field: string | null;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
  user_name: string | null;
  user_email: string | null;
  user_avatar: string | null;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    // Verify task exists
    const task = await d1First<{ id: string }>(
      'SELECT "id" FROM "Task" WHERE "id" = ?',
      id,
    );
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const rows = await d1All<AuditLogRow>(
      `
        SELECT
          al.id,
          al.taskId,
          al.userId,
          al.action,
          al.field,
          al.oldValue,
          al.newValue,
          al.createdAt,
          u.name AS user_name,
          u.email AS user_email,
          u.avatar AS user_avatar
        FROM "TaskAuditLog" al
        LEFT JOIN "User" u ON u.id = al.userId
        WHERE al.taskId = ?
        ORDER BY al.createdAt DESC
        LIMIT ?
      `,
      id,
      limit,
    );

    const history = rows.map((row) => ({
      id: row.id,
      taskId: row.taskId,
      action: row.action,
      field: row.field,
      oldValue: row.oldValue,
      newValue: row.newValue,
      createdAt: row.createdAt,
      user: row.userId
        ? {
            id: row.userId,
            name: row.user_name,
            email: row.user_email,
            avatar: row.user_avatar,
          }
        : null,
    }));

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error fetching task history:", error);
    return NextResponse.json({ error: "Failed to fetch task history" }, { status: 500 });
  }
}
