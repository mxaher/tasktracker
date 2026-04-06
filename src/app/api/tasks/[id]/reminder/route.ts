import { sendSingleOwnerTaskReminder } from "@/lib/notifications/ownerReminderService";
import { NextRequest, NextResponse } from "next/server";

/**
 * Sends a reminder for a single task using the selected channel.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { channel?: "whatsapp" | "email"; force?: boolean };

    if (body.channel !== "whatsapp" && body.channel !== "email") {
      return NextResponse.json({ error: "Choose either WhatsApp or email." }, { status: 400 });
    }

    const result = await sendSingleOwnerTaskReminder(id, body.channel, body.force === true);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error sending task reminder:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send reminder." },
      { status: 500 },
    );
  }
}
