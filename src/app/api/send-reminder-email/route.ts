import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { buildReminderEmailHtml } from "@/lib/reminder-email-template";
import { createId, d1First, d1Run, nowIso } from "@/lib/cloudflare-d1";
import {

  getDeliverableEmails,
  normalizeEmailAddress,
} from "@/lib/email-address";


export const dynamic = 'force-dynamic'
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

type WorkerEnv = {
  RESEND_API_KEY?: string;
  FROM_EMAIL?: string;
};

function encodeEmailHeader(text: string) {
  const utf8Bytes = new TextEncoder().encode(text);
  let binary = "";

  for (const byte of utf8Bytes) {
    binary += String.fromCharCode(byte);
  }

  return `=?UTF-8?B?${btoa(binary)}?=`;
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

    const runtimeEnv = (getCloudflareContext().env ?? {}) as WorkerEnv;
    const resendApiKey = runtimeEnv.RESEND_API_KEY || process.env.RESEND_API_KEY || "";
    const fromEmail = runtimeEnv.FROM_EMAIL || process.env.FROM_EMAIL || "";
    if (!resendApiKey) {
      return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
    }
    if (!fromEmail) {
      return NextResponse.json({ error: "FROM_EMAIL not configured" }, { status: 500 });
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

    // Build separate candidate lists for assignee and owner
    const assigneeCandidates = [
      recipientRow?.assignee_contact_email,
      normalizedRequestedRecipientEmail,
      recipientRow?.assignee_email,
    ].map((value) => (value ? normalizeEmailAddress(String(value)) : ""));

    const ownerCandidates = [
      recipientRow?.owner_contact_email,
      recipientRow?.owner_email,
    ].map((value) => (value ? normalizeEmailAddress(String(value)) : ""));

    const resolvedAssigneeEmail = getDeliverableEmails(assigneeCandidates)[0];
    const resolvedOwnerEmail = getDeliverableEmails(ownerCandidates)[0];

    // Collect all To recipients (assignee + owner), deduplicated
    const toEmailsRaw = [resolvedAssigneeEmail, resolvedOwnerEmail].filter(Boolean) as string[];
    const toEmails = [...new Set(toEmailsRaw)];

    if (toEmails.length === 0) {
      console.warn("send-reminder-email: no deliverable email found", {
        taskId,
        assigneeCandidates,
        ownerCandidates,
      });
      return NextResponse.json(
        {
          error:
            "لا يوجد بريد إلكتروني صالح قابل للإرسال لهذه المهمة. يبدو أن البريد الحالي عنوان داخلي مثل tasktracker.local أو يحتوي أحرف غير مدعومة. حدّث بريد المسؤول من جهات الاتصال أو المستخدمين ثم أعد المحاولة.",
        },
        { status: 400 }
      );
    }

    // Primary display name for the email body (prefer assignee)
    const normalizedRecipientName = String(
      recipientRow?.assignee_contact_name ||
        recipientRow?.assignee_name ||
        recipientRow?.owner_contact_name ||
        recipientRow?.owner_name ||
        recipientName ||
        toEmails[0]
    ).trim();
    const normalizedTaskTitle = String(taskTitle).trim();

    const html = buildReminderEmailHtml({
      recipientName: normalizedRecipientName || toEmails[0],
      taskTitle: normalizedTaskTitle,
      startDate: startDate || "غير محدد",
      latestUpdate: latestUpdate || null,
    });

    const emailPayload = {
      from: `${encodeEmailHeader("متتبع المهام")} <${fromEmail}>`,
      to: toEmails,
      cc: ["m.zaher@almarshad.com"],
      reply_to: "m.zaher@almarshad.com",
      subject: encodeEmailHeader(`تذكير: ${normalizedTaskTitle}`),
      html,
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
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
    const toNames = [
      recipientRow?.assignee_name || resolvedAssigneeEmail,
      recipientRow?.owner_name || resolvedOwnerEmail,
    ]
      .filter(Boolean)
      .join(" و ");
    const updateContent = `📧 تم إرسال تذكير بالبريد الإلكتروني إلى ${toNames || normalizedRecipientName || toEmails[0]}`;

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
