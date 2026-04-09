import { NextRequest, NextResponse } from "next/server";
import { buildReminderEmailHtml } from "@/lib/reminder-email-template";
import { createId, d1Run, nowIso } from "@/lib/cloudflare-d1";

const ASCII_EMAIL_REGEX =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

function encodeEmailHeader(text: string) {
  const utf8Bytes = new TextEncoder().encode(text);
  let binary = "";

  for (const byte of utf8Bytes) {
    binary += String.fromCharCode(byte);
  }

  return `=?UTF-8?B?${btoa(binary)}?=`;
}

function normalizeEmailAddress(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/[\u200B-\u200D\uFEFF\u2060]/g, "")
    .replace(/\s+/g, "");
}

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

    const normalizedRecipientEmail = normalizeEmailAddress(String(recipientEmail));
    if (
      !normalizedRecipientEmail ||
      !/^[\x00-\x7F]+$/.test(normalizedRecipientEmail) ||
      !ASCII_EMAIL_REGEX.test(normalizedRecipientEmail)
    ) {
      return NextResponse.json(
        {
          error:
            "عنوان البريد الإلكتروني للمستلم غير صالح. تأكد من عدم وجود مسافات أو أحرف عربية داخل البريد الإلكتروني.",
        },
        { status: 400 }
      );
    }

    const normalizedRecipientName = String(recipientName || normalizedRecipientEmail).trim();
    const normalizedTaskTitle = String(taskTitle).trim();

    const html = buildReminderEmailHtml({
      recipientName: normalizedRecipientName || normalizedRecipientEmail,
      taskTitle: normalizedTaskTitle,
      startDate: startDate || "غير محدد",
      latestUpdate: latestUpdate || null,
    });

    const emailPayload = {
      from: `${encodeEmailHeader("متتبع المهام")} <noreply@almarshad.com>`,
      to: [normalizedRecipientEmail],
      cc: ["m.zaher@almarshad.com"],
      reply_to: "m.zaher@almarshad.com",
      subject: encodeEmailHeader(`تذكير: ${normalizedTaskTitle}`),
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
    const updateContent = `📧 تم إرسال تذكير بالبريد الإلكتروني إلى ${normalizedRecipientName || normalizedRecipientEmail}`;

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
