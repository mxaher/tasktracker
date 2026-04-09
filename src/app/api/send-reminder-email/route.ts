import { NextRequest, NextResponse } from "next/server";
import { buildReminderEmailHtml } from "@/lib/reminder-email-template";
import { createId, d1Run, nowIso } from "@/lib/cloudflare-d1";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipientEmail, recipientName, taskTitle, startDate, latestUpdate, taskId } = body;

    if (!recipientEmail || !taskTitle || !taskId) {
      return NextResponse.json(
        { error: "recipientEmail, taskTitle, and taskId are required" },
        { status: 400 }
      );
    }

    const RESEND_API_KEY = (process.env as Record<string, string>).RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
    }

    const html = buildReminderEmailHtml({
      recipientName: recipientName || recipientEmail,
      taskTitle,
      startDate: startDate || "غير محدد",
      latestUpdate: latestUpdate || null,
    });

    const emailPayload = {
      from: "متتبع المهام <noreply@almarshad.com>",
      to: [recipientEmail],
      cc: ["m.zaher@almarshad.com"],
      reply_to: "m.zaher@almarshad.com",
      subject: `تذكير: ${taskTitle}`,
      html,
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Resend API error:", errorBody);
      return NextResponse.json(
        { error: "Failed to send email", details: errorBody },
        { status: 502 }
      );
    }

    const data = await res.json();
    const sentAt = nowIso();
    const updateId = createId();
    const updateContent = `📧 تم إرسال تذكير بالبريد الإلكتروني إلى ${recipientName || recipientEmail}`;

    await d1Run(
      `INSERT INTO "TaskUpdate" ("id", "taskId", "content", "source", "createdAt")
       VALUES (?, ?, ?, ?, ?)`,
      updateId,
      taskId,
      updateContent,
      "email_reminder",
      sentAt
    );

    return NextResponse.json({ success: true, emailId: data.id, loggedAt: sentAt });
  } catch (error) {
    console.error("send-reminder-email error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
