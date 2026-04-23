import {
  sendGroupedOwnerEmailReminders,
  sendGroupedOwnerWhatsAppReminders,
} from "@/lib/notifications/ownerReminderService";
import { NextRequest, NextResponse } from "next/server";



export const dynamic = 'force-dynamic'
/**
 * Sends grouped reminders for selected tasks (WhatsApp + email), grouped by owner.
 * Keeps `result` as the WhatsApp payload for backward-compatible UI handling.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { taskIds?: string[]; force?: boolean };
    const taskIds = Array.isArray(body.taskIds) ? body.taskIds.filter(Boolean) : [];

    if (taskIds.length === 0) {
      return NextResponse.json({ error: "Select at least one task." }, { status: 400 });
    }

    const force = body.force === true;
    const [whatsappRun, emailRun] = await Promise.allSettled([
      sendGroupedOwnerWhatsAppReminders(taskIds, force),
      sendGroupedOwnerEmailReminders(taskIds, force),
    ]);

    if (whatsappRun.status === "rejected" && emailRun.status === "rejected") {
      throw new Error(
        `WhatsApp failed: ${String(whatsappRun.reason)} | Email failed: ${String(emailRun.reason)}`,
      );
    }

    const whatsappResult = whatsappRun.status === "fulfilled" ? whatsappRun.value : null;
    const emailResult = emailRun.status === "fulfilled" ? emailRun.value : null;

    return NextResponse.json({
      result: whatsappResult ?? emailResult,
      channels: {
        whatsapp: whatsappRun.status === "fulfilled" ? { ok: true } : { ok: false, error: String(whatsappRun.reason) },
        email: emailRun.status === "fulfilled" ? { ok: true } : { ok: false, error: String(emailRun.reason) },
      },
    });
  } catch (error) {
    console.error("Error sending grouped reminders:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send grouped reminders." },
      { status: 500 },
    );
  }
}
