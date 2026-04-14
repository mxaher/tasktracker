import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDeliverableEmails } from "@/lib/email-address";
import { format } from "date-fns";

type D1Value = string | number | null;

type WorkerEnv = {
  DB?: {
    prepare: (sql: string) => {
      bind: (...params: D1Value[]) => {
        all: <T>() => Promise<{ results?: T[] }>;
        first: <T>() => Promise<T | null>;
        run: () => Promise<unknown>;
      };
    };
  };
  RESEND_API_KEY?: string;
  FROM_EMAIL?: string;
  ADMIN_EMAIL?: string;
};

type TaskRow = {
  id: string;
  title: string;
  taskId: string | null;
  description: string | null;
  status: string;
  priority: string;
  completion: number | null;
  department: string | null;
  dueDate: string | null;
  notes: string | null;
  owner_name: string | null;
  owner_email: string | null;
  assignee_name: string | null;
  assignee_email: string | null;
};

type SettingsRow = {
  adminEmail: string;
};

function getWorkerEnv() {
  const context = getCloudflareContext();
  return (context.env ?? {}) as WorkerEnv;
}

function getDb() {
  const env = getWorkerEnv();
  if (!env.DB) throw new Error("Cloudflare D1 binding is not available.");
  return env.DB;
}

async function d1First<T>(sql: string, ...params: D1Value[]) {
  return getDb().prepare(sql).bind(...params).first<T>();
}

async function d1Run(sql: string, ...params: D1Value[]) {
  return getDb().prepare(sql).bind(...params).run();
}

function createId() {
  return crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

async function sendEmail(payload: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}) {
  const env = getWorkerEnv();
  const resendApiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY || "";
  const fromEmail = env.FROM_EMAIL || process.env.FROM_EMAIL || "";

  if (!resendApiKey) {
    return { success: false as const, error: "RESEND_API_KEY is not configured." };
  }
  if (!fromEmail) {
    return { success: false as const, error: "FROM_EMAIL is not configured." };
  }

  const recipients = getDeliverableEmails(
    Array.isArray(payload.to) ? payload.to : [payload.to]
  );

  if (recipients.length === 0) {
    return { success: false as const, error: "No deliverable recipient email addresses were found." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: recipients,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  let responseBody: { id?: string; message?: string; name?: string } | null = null;
  try { responseBody = await response.json(); } catch {}

  if (!response.ok) {
    const message = responseBody?.message || responseBody?.name || "Failed to send email";
    return { success: false as const, error: message };
  }

  return { success: true as const, resendId: responseBody?.id || null };
}

function buildReminderEmail(task: TaskRow, message: string | null, adminEmail: string) {
  const priorityLabels: Record<string, string> = {
    critical: "حرج", high: "عالي", medium: "متوسط", low: "منخفض",
  };
  const statusLabels: Record<string, string> = {
    pending: "بانتظار البدء", not_started: "لم يبدأ", in_progress: "قيد التنفيذ",
    delayed: "متأخر", completed: "مكتمل",
  };

  const subject = `تذكير بمهمة: ${task.title}`;
  const dueDateStr = task.dueDate ? format(new Date(task.dueDate), "MMMM d, yyyy") : "غير محدد";
  const completionPct = Math.round((task.completion ?? 0) * 100);

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; direction: rtl; text-align: right;">
      <h2 style="color: #1d4ed8;">تذكير بمهمة</h2>
      ${message ? `<p style="background:#f0f9ff;border-right:4px solid #2563eb;padding:12px;border-radius:4px;">${message}</p>` : ""}
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <tr><td style="padding:8px;font-weight:bold;width:140px;">المهمة</td><td style="padding:8px;">${task.title}</td></tr>
        ${task.taskId ? `<tr><td style="padding:8px;font-weight:bold;">رقم المهمة</td><td style="padding:8px;">#${task.taskId}</td></tr>` : ""}
        ${task.department ? `<tr><td style="padding:8px;font-weight:bold;">القسم</td><td style="padding:8px;">${task.department}</td></tr>` : ""}
        <tr><td style="padding:8px;font-weight:bold;">الحالة</td><td style="padding:8px;">${statusLabels[task.status] || task.status}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">الأولوية</td><td style="padding:8px;">${priorityLabels[task.priority] || task.priority}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">نسبة الإنجاز</td><td style="padding:8px;">${completionPct}%</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">تاريخ الاستحقاق</td><td style="padding:8px;">${dueDateStr}</td></tr>
        ${task.owner_name || task.owner_email ? `<tr><td style="padding:8px;font-weight:bold;">المالك</td><td style="padding:8px;">${task.owner_name || task.owner_email}</td></tr>` : ""}
        ${task.description ? `<tr><td style="padding:8px;font-weight:bold;">الوصف</td><td style="padding:8px;">${task.description}</td></tr>` : ""}
      </table>
      <p style="margin-top:24px;color:#6b7280;font-size:12px;">هذا التذكير أُرسل بواسطة متتبع المهام في ${format(new Date(), "MMMM d, yyyy HH:mm")}</p>
    </div>
  `;

  const text = [
    "تذكير بمهمة",
    message || "",
    "",
    `المهمة: ${task.title}`,
    task.taskId ? `رقم المهمة: #${task.taskId}` : "",
    `الحالة: ${statusLabels[task.status] || task.status}`,
    `الأولوية: ${priorityLabels[task.priority] || task.priority}`,
    `نسبة الإنجاز: ${completionPct}%`,
    `تاريخ الاستحقاق: ${dueDateStr}`,
    task.owner_name || task.owner_email ? `المالك: ${task.owner_name || task.owner_email}` : "",
  ].filter(Boolean).join("\n");

  // Collect recipient emails
  const recipients = getDeliverableEmails([adminEmail, task.owner_email, task.assignee_email]);

  return { subject, html, text, recipients };
}

// POST /api/tasks/[id]/remind — Send a manual reminder for a specific task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const message: string | null = body.message || null;
    const sendToOwner: boolean = body.sendToOwner !== false;
    const sendToAdmin: boolean = body.sendToAdmin !== false;

    // Fetch the task
    const task = await d1First<TaskRow>(
      `SELECT
        t.id, t.title, t.taskId, t.description, t.status, t.priority,
        t.completion, t.department, t.dueDate, t.notes,
        owner.name AS owner_name, owner.email AS owner_email,
        assignee.name AS assignee_name, assignee.email AS assignee_email
       FROM "Task" t
       LEFT JOIN "User" owner ON owner.id = t.ownerId
       LEFT JOIN "User" assignee ON assignee.id = t.assigneeId
       WHERE t.id = ?`,
      id
    );

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Get admin email from settings
    const settings = await d1First<SettingsRow>(
      'SELECT "adminEmail" FROM "AdminSettings" ORDER BY "createdAt" ASC LIMIT 1'
    );
    const env = getWorkerEnv();
    const adminEmail = settings?.adminEmail || env.ADMIN_EMAIL || process.env.ADMIN_EMAIL || "tasks@wealix.app";

    // Build the email
    const { subject, html, text, recipients: allRecipients } = buildReminderEmail(task, message, adminEmail);

    // Filter recipients based on options
    const recipients = getDeliverableEmails([
      sendToAdmin ? adminEmail : null,
      sendToOwner ? task.owner_email : null,
      sendToOwner ? task.assignee_email : null,
    ]);

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "No deliverable recipient email addresses were found" },
        { status: 400 }
      );
    }

    // Send the email
    const result = await sendEmail({ to: recipients, subject, html, text });

    // Log to Notification table
    await d1Run(
      `INSERT INTO "Notification" (
        "id", "taskId", "userId", "type", "channel", "subject", "message",
        "status", "scheduledAt", "sentAt", "error", "createdAt"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      createId(),
      id,
      null,
      "manual_reminder",
      "email",
      subject,
      text,
      result.success ? "sent" : "failed",
      null,
      result.success ? nowIso() : null,
      result.success ? null : (result.error || "Unknown error"),
      nowIso()
    );

    return NextResponse.json({
      success: result.success,
      recipients,
      ...(result.success ? { resendId: result.resendId } : { error: result.error }),
    }, { status: result.success ? 200 : 500 });

  } catch (error) {
    console.error("Error sending task reminder:", error);
    return NextResponse.json(
      { error: "Failed to send reminder", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
