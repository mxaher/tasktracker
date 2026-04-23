import { sendSingleOwnerTaskReminder } from "@/lib/notifications/ownerReminderService";
import { NextRequest, NextResponse } from "next/server";



export const dynamic = 'force-dynamic'
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
    const message = error instanceof Error ? error.message : "تعذر إرسال التذكير.";

    if (message.includes("already sent today")) {
      return NextResponse.json(
        { error: "تم إرسال تذكير لهذه المهمة اليوم بالفعل." },
        { status: 409 },
      );
    }

    if (message.includes("Task not found")) {
      return NextResponse.json({ error: "المهمة غير موجودة." }, { status: 404 });
    }

    if (message.includes("No WhatsApp phone number found")) {
      return NextResponse.json({ error: "لا يوجد رقم واتساب محفوظ لصاحب المهمة." }, { status: 400 });
    }

    if (message.includes("No email address found")) {
      return NextResponse.json({ error: "لا يوجد بريد إلكتروني محفوظ لصاحب المهمة." }, { status: 400 });
    }

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
