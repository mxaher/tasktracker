import { NextRequest, NextResponse } from "next/server";
import { buildReminderEmailHtml } from "@/lib/reminder-email-template";
import { createId, d1First, d1Run, nowIso } from "@/lib/cloudflare-d1";

const ASCII_EMAIL_REGEX =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

type ReminderRecipientRow = {
  owner_name: string | null;
  owner_email: string | null;
  assignee_name: string | null;
  assignee_email: string | null;
  owner_contact_name: string | null;
  owner_contact_email: string | null;
  assignee_contact_name: string | null;
  assignee_contact_email: string | null;
};

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

function isDeliverableEmail(value: string) {
  if (!value || !/^[\x00-\x7F]+$/.test(value) || !ASCII_EMAIL_REGEX.test(value)) {
    return false;
  }

  return !value.toLowerCase().endsWith(".local");
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

    const normalizedRequestedRecipientEmail = normalizeEmailAddress(String(recipientEmail));
    const recipientRow = await d1First<ReminderRecipientRow>(
      `
        SELECT
          owner.name AS owner_name,
          owner.email AS owner_email,
          assignee.name AS assignee_name,
          assignee.email AS assignee_email,
          owner_contact.name AS owner_contact_name,
          owner_contact.email AS owner_contact_email,
          assignee_contact.name AS assignee_contact_name,
          assignee_contact.email AS assignee_contact_email
        FROM "Task" task
        LEFT JOIN "User" owner ON owner.id = task.ownerId
        LEFT JOIN "User" assignee ON assignee.id = task.assigneeId
        LEFT JOIN "Contact" owner_contact ON owner_contact.userId = owner.id
        LEFT JOIN "Contact" assignee_contact ON assignee_contact.userId = assignee.id
        WHERE task.id = ?
        LIMIT 1
      `,
      taskId
    );

    const emailCandidates = [
      recipientRow?.owner_contact_email,
      recipientRow?.assignee_contact_email,
      normalizedRequestedRecipientEmail,
      recipientRow?.owner_email,
      recipientRow?.assignee_email,
    ]
      .map((value) => (value ? normalizeEmailAddress(String(value)) : ""))
      .filter(Boolean);

    const resolvedRecipientEmail = emailCandidates.find(isDeliverableEmail);

    if (!resolvedRecipientEmail) {
      console.warn("send-reminder-email: no deliverable email found", {
        taskId,
        candidates: emailCandidates,
      });
      return NextResponse.json(
        {
          error:
            "لا يوجد بريد إلكتروني صالح قابل للإرسال لهذه المهمة. يبدو أن البريد الحالي عنوان داخلي مثل tasktracker.local أو يحتوي أحرف غير مدعومة. حدّث بريد المسؤول من جهات الاتصال أو المستخدمين ثم أعد المحاولة.",
        },
        { status: 400 }
      );
    }

    const normalizedRecipientName = String(
      recipientRow?.owner_contact_name ||
        recipientRow?.owner_name ||
        recipientRow?.assignee_contact_name ||
        recipientRow?.assignee_name ||
        recipientName ||
        resolvedRecipientEmail
    ).trim();
    const normalizedTaskTitle = String(taskTitle).trim();

    const html = buildReminderEmailHtml({
      recipientName: normalizedRecipientName || resolvedRecipientEmail,
      taskTitle: normalizedTaskTitle,
      startDate: startDate || "غير محدد",
      latestUpdate: latestUpdate || null,
    });

    const emailPayload = {
      from: `${encodeEmailHeader("متتبع المهام")} <noreply@almarshad.com>`,
      to: [resolvedRecipientEmail],
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
    const updateContent = `📧 تم إرسال تذكير بالبريد الإلكتروني إلى ${normalizedRecipientName || resolvedRecipientEmail}`;

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
