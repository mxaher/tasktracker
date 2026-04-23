import { sendConfiguredOwnerWhatsAppReminders } from "@/lib/notifications/ownerReminderService";
import { NextRequest, NextResponse } from "next/server";



export const dynamic = 'force-dynamic'
/**
 * Triggers WhatsApp reminders immediately for tasks matching the configured owner reminder rules.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { force?: boolean };
    const result = await sendConfiguredOwnerWhatsAppReminders(body.force === true);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error running owner reminder send-now action:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send WhatsApp reminders." },
      { status: 500 },
    );
  }
}
