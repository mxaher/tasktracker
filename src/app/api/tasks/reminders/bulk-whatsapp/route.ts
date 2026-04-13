import { sendGroupedOwnerWhatsAppReminders } from "@/lib/notifications/ownerReminderService";
import { NextRequest, NextResponse } from "next/server";

/**
 * Sends grouped WhatsApp reminders for selected tasks, grouped by owner.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { taskIds?: string[]; force?: boolean };
    const taskIds = Array.isArray(body.taskIds) ? body.taskIds.filter(Boolean) : [];

    if (taskIds.length === 0) {
      return NextResponse.json({ error: "Select at least one task." }, { status: 400 });
    }

    const result = await sendGroupedOwnerWhatsAppReminders(taskIds, body.force === true);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error sending grouped WhatsApp reminders:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send grouped reminders." },
      { status: 500 },
    );
  }
}
