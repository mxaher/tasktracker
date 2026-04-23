import { NextRequest, NextResponse } from "next/server";
import { d1First, d1Run } from "@/lib/cloudflare-d1";



export const dynamic = 'force-dynamic'
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; logId: string }> },
) {
  try {
    const { id, logId } = await params;

    // Verify the audit log entry exists and belongs to this task
    const log = await d1First<{ id: string; taskId: string }>(
      'SELECT "id", "taskId" FROM "TaskAuditLog" WHERE "id" = ? AND "taskId" = ?',
      logId,
      id,
    );

    if (!log) {
      return NextResponse.json({ error: "History entry not found" }, { status: 404 });
    }

    await d1Run('DELETE FROM "TaskAuditLog" WHERE "id" = ?', logId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task history entry:", error);
    return NextResponse.json({ error: "Failed to delete history entry" }, { status: 500 });
  }
}
