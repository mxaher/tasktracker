import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDeliverableEmails } from "@/lib/email-address";
import { format, isPast } from "date-fns";

type D1Value = string | number | null;

type NotificationRow = {
  id: string;
  taskId: string | null;
  userId: string | null;
  type: string;
  channel: string;
  subject: string;
  message: string;
  status: string;
  scheduledAt: string | null;
  sentAt: string | null;
  error: string | null;
  createdAt: string;
  task_title: string | null;
  task_taskId: string | null;
  user_name: string | null;
  user_email: string | null;
};

type ReportTaskRow = {
  title: string;
  taskId: string | null;
  dueDate: string | null;
  priority: string;
  completion: number | null;
  department: string | null;
  owner_name: string | null;
  owner_email: string | null;
};

type SettingsRow = {
  adminEmail: string;
};

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

function getWorkerEnv() {
  const context = getCloudflareContext();
  return (context.env ?? {}) as WorkerEnv;
}

function getDb() {
  const env = getWorkerEnv();

  if (!env.DB) {
    throw new Error("Cloudflare D1 binding is not available.");
  }

  return env.DB;
}

async function d1All<T>(sql: string, ...params: D1Value[]) {
  const result = await getDb().prepare(sql).bind(...params).all<T>();
  return result.results ?? [];
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
  const fromEmail = env.FROM_EMAIL || process.env.FROM_EMAIL || "noreply@wealix.app";

  if (!resendApiKey) {
    return {
      success: false as const,
      error: "RESEND_API_KEY is not configured in the Worker runtime.",
    };
  }

  const recipients = getDeliverableEmails(
    Array.isArray(payload.to) ? payload.to : [payload.to]
  );

  if (recipients.length === 0) {
    return {
      success: false as const,
      error: "No deliverable recipient email addresses were found.",
    };
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
  try {
    responseBody = await response.json();
  } catch {}

  if (!response.ok) {
    const message = responseBody?.message || responseBody?.name || "Failed to send email";
    return { success: false as const, error: message };
  }

  return {
    success: true as const,
    resendId: responseBody?.id || null,
  };
}

function buildInProgressReport(tasks: ReportTaskRow[], reportType: "daily" | "weekly") {
  const subject = `In-Progress Tasks Report (${reportType}) - ${format(new Date(), "MMM d, yyyy")}`;
  const highPriorityCount = tasks.filter(
    (task) => task.priority === "critical" || task.priority === "high",
  ).length;
  const overdueCount = tasks.filter((task) => task.dueDate && isPast(new Date(task.dueDate))).length;

  const rowsHtml = tasks
    .map(
      (task) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${task.taskId || "-"}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${task.title}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${task.department || "-"}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${task.owner_name || task.owner_email || "-"}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "-"}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${task.priority}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${Math.round((task.completion ?? 0) * 100)}%</td>
        </tr>
      `,
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
      <h1>In-Progress Tasks Report</h1>
      <p>${reportType === "daily" ? "Daily" : "Weekly"} summary for ${format(new Date(), "MMMM d, yyyy")}</p>
      <p>Total in progress: <strong>${tasks.length}</strong></p>
      <p>High priority: <strong>${highPriorityCount}</strong></p>
      <p>Overdue: <strong>${overdueCount}</strong></p>
      <table style="width:100%; border-collapse:collapse; margin-top:16px;">
        <thead>
          <tr style="background:#f3f4f6; text-align:left;">
            <th style="padding:8px;">ID</th>
            <th style="padding:8px;">Title</th>
            <th style="padding:8px;">Department</th>
            <th style="padding:8px;">Owner</th>
            <th style="padding:8px;">Due Date</th>
            <th style="padding:8px;">Priority</th>
            <th style="padding:8px;">Progress</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
  `;

  const text = [
    `In-Progress Tasks Report (${reportType})`,
    format(new Date(), "MMMM d, yyyy"),
    "",
    `Total in progress: ${tasks.length}`,
    `High priority: ${highPriorityCount}`,
    `Overdue: ${overdueCount}`,
    "",
    ...tasks.map(
      (task) =>
        `- ${task.title} | ${task.department || "-"} | ${task.owner_name || task.owner_email || "-"} | ${task.dueDate || "-"} | ${Math.round((task.completion ?? 0) * 100)}%`,
    ),
  ].join("\n");

  return { subject, html, text };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, type } = body;

    if (type !== "in-progress-report") {
      return NextResponse.json(
        { error: "Only in-progress-report is currently supported in production." },
        { status: 400 },
      );
    }

    const settings = await d1First<SettingsRow>(
      'SELECT "adminEmail" FROM "AdminSettings" ORDER BY "createdAt" ASC LIMIT 1',
    );
    const env = getWorkerEnv();
    const adminEmail = settings?.adminEmail || env.ADMIN_EMAIL || process.env.ADMIN_EMAIL || "tasks@wealix.app";
    const reportType = body.reportType === "weekly" ? "weekly" : "daily";

    const tasks = await d1All<ReportTaskRow>(
      `
        SELECT
          t.title,
          t.taskId,
          t.dueDate,
          t.priority,
          t.completion,
          t.department,
          owner.name AS owner_name,
          owner.email AS owner_email
        FROM "Task" t
        LEFT JOIN "User" owner ON owner.id = t.ownerId
        WHERE t.status = 'in_progress'
        ORDER BY
          CASE t.priority
            WHEN 'critical' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            ELSE 4
          END,
          t.dueDate ASC
      `,
    );

    const template = buildInProgressReport(tasks, reportType);
    const runtimeEnv = getWorkerEnv();
    const resolvedFromEmail =
      runtimeEnv.FROM_EMAIL || process.env.FROM_EMAIL || "noreply@wealix.app";
    const hasResendApiKey = Boolean(
      runtimeEnv.RESEND_API_KEY || process.env.RESEND_API_KEY,
    );

    const result = await sendEmail({
      to: adminEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (!result.success) {
      console.error("[Notifications] Email send failed", {
        error: result.error,
        hasResendApiKey,
        fromEmail: resolvedFromEmail,
        adminEmail,
      });
    } else {
      console.info("[Notifications] Email sent", {
        resendId: result.resendId,
        fromEmail: resolvedFromEmail,
        adminEmail,
      });
    }

    await d1Run(
      `
        INSERT INTO "Notification" (
          "id", "taskId", "userId", "type", "channel", "subject", "message",
          "status", "scheduledAt", "sentAt", "error", "createdAt"
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      createId(),
      taskId || null,
      null,
      "status_change",
      "email",
      template.subject,
      template.text,
      result.success ? "sent" : "failed",
      null,
      result.success ? nowIso() : null,
      result.success ? null : result.error || "Unknown email error",
      nowIso(),
    );

    return NextResponse.json(
      {
        ...result,
        debug: {
          hasResendApiKey,
          fromEmail: resolvedFromEmail,
          adminEmail,
        },
      },
      { status: result.success ? 200 : 500 },
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      {
        error: "Failed to send notification",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "50", 10);
    const status = searchParams.get("status");

    const where = status ? 'WHERE n."status" = ?' : "";
    const notifications = await d1All<NotificationRow>(
      `
        SELECT
          n.id,
          n.taskId,
          n.userId,
          n.type,
          n.channel,
          n.subject,
          n.message,
          n.status,
          n.scheduledAt,
          n.sentAt,
          n.error,
          n.createdAt,
          t.title AS task_title,
          t.taskId AS task_taskId,
          u.name AS user_name,
          u.email AS user_email
        FROM "Notification" n
        LEFT JOIN "Task" t ON t.id = n.taskId
        LEFT JOIN "User" u ON u.id = n.userId
        ${where}
        ORDER BY n.createdAt DESC
        LIMIT ?
      `,
      ...(status ? [status, limit] : [limit]),
    );

    return NextResponse.json({
      notifications: notifications.map((notification) => ({
        id: notification.id,
        taskId: notification.taskId,
        userId: notification.userId,
        type: notification.type,
        channel: notification.channel,
        subject: notification.subject,
        message: notification.message,
        status: notification.status,
        scheduledAt: notification.scheduledAt,
        sentAt: notification.sentAt,
        error: notification.error,
        createdAt: notification.createdAt,
        task: notification.task_title
          ? {
              id: notification.taskId,
              title: notification.task_title,
              taskId: notification.task_taskId,
            }
          : null,
        user: notification.user_email
          ? {
              id: notification.userId,
              name: notification.user_name,
              email: notification.user_email,
            }
          : null,
      })),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
