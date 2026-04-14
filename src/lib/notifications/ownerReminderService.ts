import { normalizePhoneNumber } from "@/lib/contact-validation";
import { createId, d1All, d1First, d1Run, nowIso } from "@/lib/cloudflare-d1";
import { getDeliverableEmails } from "@/lib/email-address";
import { sendWhatsAppMessage } from "@/lib/notifications/sentdm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { differenceInCalendarDays, format, startOfDay } from "date-fns";

type ReminderTaskRow = {
  id: string;
  taskId: string | null;
  title: string;
  department: string | null;
  priority: string;
  status: string;
  dueDate: string | null;
  ownerId: string | null;
  owner_name: string | null;
  owner_email: string | null;
  owner_phone: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
};

type ReminderSettingsRow = {
  whatsappOwnerRemindersEnabled: number | boolean;
  whatsappReminderOffsets: string;
  whatsappReminderTemplate: string;
};

type SendNowResult = {
  sentOwners: Array<{ ownerId: string; ownerName: string; taskCount: number }>;
  skippedOwners: Array<{ ownerId: string; ownerName: string; reason: string }>;
  failedOwners: Array<{ ownerId: string; ownerName: string; reason: string }>;
  includedTasks: Array<{ taskId: string; title: string; ownerName: string }>;
  skippedTasks: Array<{ taskId: string; title: string; ownerName: string; reason: string }>;
};

type SingleReminderResult = {
  ok: boolean;
  channel: "whatsapp" | "email";
  taskId: string;
  ownerName: string;
  message: string;
};

const OPEN_TASK_STATUSES = ["pending", "not_started", "in_progress", "delayed"] as const;
const DEFAULT_TEMPLATE =
  "Hi {{ownerName}}, this is a reminder for task {{taskTitle}} (Task #{{taskId}}). Due date: {{dueDate}}. Priority: {{priority}}.";

function getWorkerEnv() {
  const context = getCloudflareContext();
  return (context.env ?? {}) as {
    RESEND_API_KEY?: string;
    FROM_EMAIL?: string;
  };
}

function booleanFromDb(value: number | boolean) {
  return value === true || value === 1;
}

function formatDueDate(value: string | null) {
  if (!value) return "Not set";
  return format(new Date(value), "MMMM d, yyyy");
}

function buildMessageFromTemplate(template: string, task: ReminderTaskRow) {
  const ownerName = task.contact_name || task.owner_name || task.owner_email || "Task Owner";
  return (template || DEFAULT_TEMPLATE)
    .replaceAll("{{ownerName}}", ownerName)
    .replaceAll("{{taskTitle}}", task.title)
    .replaceAll("{{taskId}}", task.taskId || task.id)
    .replaceAll("{{dueDate}}", formatDueDate(task.dueDate))
    .replaceAll("{{priority}}", task.priority)
    .replaceAll("{{department}}", task.department || "-");
}

function buildBulkOwnerMessage(ownerName: string, tasks: ReminderTaskRow[], template: string) {
  const intro =
    tasks.length === 1
      ? `Hi ${ownerName}, here is a reminder for one selected task:`
      : `Hi ${ownerName}, here are reminders for ${tasks.length} selected tasks:`;

  const lines = tasks.map((task, index) => `${index + 1}. ${buildMessageFromTemplate(template, task)}`);
  return [intro, "", ...lines].join("\n");
}

function buildBulkOwnerEmailContent(ownerName: string, tasks: ReminderTaskRow[]) {
  const subject =
    tasks.length === 1
      ? `Task Reminder: ${tasks[0].title}`
      : `Task Reminders: ${tasks.length} tasks`;

  const taskLines = tasks.map((task, index) => {
    const departmentSegment = task.department ? ` | Department: ${task.department}` : "";
    return `${index + 1}. ${task.title} (Task ID: ${task.taskId || task.id}) | Due: ${formatDueDate(task.dueDate)} | Priority: ${task.priority}${departmentSegment}`;
  });

  const text = [
    `Hello ${ownerName},`,
    "",
    tasks.length === 1
      ? "This is a reminder for the following selected task:"
      : `This is a reminder for the following ${tasks.length} selected tasks:`,
    "",
    ...taskLines,
  ].join("\n");

  const htmlRows = tasks
    .map(
      (task) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${task.taskId || task.id}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${task.title}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${formatDueDate(task.dueDate)}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${task.priority}</td>
          <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${task.department || "-"}</td>
        </tr>
      `,
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
      <p>Hello ${ownerName},</p>
      <p>${
        tasks.length === 1
          ? "This is a reminder for the following selected task."
          : `This is a reminder for the following ${tasks.length} selected tasks.`
      }</p>
      <table style="width:100%; border-collapse:collapse; margin-top:12px;">
        <thead>
          <tr style="background:#f3f4f6; text-align:left;">
            <th style="padding:8px;">Task ID</th>
            <th style="padding:8px;">Task</th>
            <th style="padding:8px;">Due Date</th>
            <th style="padding:8px;">Priority</th>
            <th style="padding:8px;">Department</th>
          </tr>
        </thead>
        <tbody>${htmlRows}</tbody>
      </table>
    </div>
  `;

  return { subject, text, html };
}

function buildEmailContent(task: ReminderTaskRow) {
  const ownerName = task.contact_name || task.owner_name || task.owner_email || "Task Owner";
  const subject = `Task Reminder: ${task.title}`;
  const text = [
    `Hello ${ownerName},`,
    "",
    `This is a reminder for task: ${task.title}`,
    `Task ID: ${task.taskId || task.id}`,
    `Due Date: ${formatDueDate(task.dueDate)}`,
    `Priority: ${task.priority}`,
    task.department ? `Department: ${task.department}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
      <p>Hello ${ownerName},</p>
      <p>This is a reminder for the following task.</p>
      <ul>
        <li><strong>Task:</strong> ${task.title}</li>
        <li><strong>Task ID:</strong> ${task.taskId || task.id}</li>
        <li><strong>Due Date:</strong> ${formatDueDate(task.dueDate)}</li>
        <li><strong>Priority:</strong> ${task.priority}</li>
        ${task.department ? `<li><strong>Department:</strong> ${task.department}</li>` : ""}
      </ul>
    </div>
  `;

  return { subject, text, html };
}

async function sendEmailMessage(to: string, subject: string, text: string, html: string) {
  const env = getWorkerEnv();
  const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY || "";
  const fromEmail = env.FROM_EMAIL || process.env.FROM_EMAIL || "";

  if (!apiKey) {
    return { success: false as const, error: "RESEND_API_KEY is not configured." };
  }
  if (!fromEmail) {
    return { success: false as const, error: "FROM_EMAIL is not configured." };
  }

  const recipients = getDeliverableEmails([to]);

  if (recipients.length === 0) {
    return {
      success: false as const,
      error: "No deliverable recipient email addresses were found.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: recipients,
      subject,
      text,
      html,
    }),
  });

  const payload = (await response.json().catch(() => null)) as { message?: string; name?: string } | null;

  if (!response.ok) {
    return {
      success: false as const,
      error: payload?.message || payload?.name || "Failed to send email.",
    };
  }

  return { success: true as const };
}

async function getReminderSettings() {
  const settings = await d1First<ReminderSettingsRow>(
    `
      SELECT
        "whatsappOwnerRemindersEnabled",
        "whatsappReminderOffsets",
        "whatsappReminderTemplate"
      FROM "AdminSettings"
      ORDER BY "createdAt" ASC
      LIMIT 1
    `,
  );

  return {
    whatsappOwnerRemindersEnabled: booleanFromDb(settings?.whatsappOwnerRemindersEnabled ?? false),
    whatsappReminderOffsets: settings?.whatsappReminderOffsets || "0,1",
    whatsappReminderTemplate: settings?.whatsappReminderTemplate || DEFAULT_TEMPLATE,
  };
}

async function getTasksByIds(taskIds: string[]) {
  if (taskIds.length === 0) {
    return [] as ReminderTaskRow[];
  }

  const placeholders = taskIds.map(() => "?").join(", ");
  return d1All<ReminderTaskRow>(
    `
      SELECT
        t.id,
        t.taskId,
        t.title,
        t.department,
        t.priority,
        t.status,
        t.dueDate,
        t.ownerId,
        owner.name AS owner_name,
        owner.email AS owner_email,
        owner.phone AS owner_phone,
        contact.name AS contact_name,
        contact.phone AS contact_phone,
        contact.email AS contact_email
      FROM "Task" t
      LEFT JOIN "User" owner ON owner.id = t.ownerId
      LEFT JOIN "Contact" contact ON contact.userId = owner.id
      WHERE t.id IN (${placeholders})
      ORDER BY t.updatedAt DESC
    `,
    ...taskIds,
  );
}

async function getEligibleAutoReminderTasks(offsets: number[]) {
  const tasks = await d1All<ReminderTaskRow>(
    `
      SELECT
        t.id,
        t.taskId,
        t.title,
        t.department,
        t.priority,
        t.status,
        t.dueDate,
        t.ownerId,
        owner.name AS owner_name,
        owner.email AS owner_email,
        owner.phone AS owner_phone,
        contact.name AS contact_name,
        contact.phone AS contact_phone,
        contact.email AS contact_email
      FROM "Task" t
      LEFT JOIN "User" owner ON owner.id = t.ownerId
      LEFT JOIN "Contact" contact ON contact.userId = owner.id
      WHERE t.ownerId IS NOT NULL
        AND t.dueDate IS NOT NULL
        AND t.status IN (${OPEN_TASK_STATUSES.map((status) => `'${status}'`).join(", ")})
      ORDER BY owner.name ASC, t.dueDate ASC
    `,
  );

  const today = startOfDay(new Date());
  return tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }
    const daysUntilDue = differenceInCalendarDays(startOfDay(new Date(task.dueDate)), today);
    return offsets.includes(daysUntilDue);
  });
}

async function getAlreadyRemindedTaskIds(taskIds: string[], channel: "whatsapp" | "email") {
  if (taskIds.length === 0) {
    return new Set<string>();
  }

  const placeholders = taskIds.map(() => "?").join(", ");
  const dateKey = nowIso().slice(0, 10);
  const rows = await d1All<{ taskId: string }>(
    `
      SELECT DISTINCT "taskId"
      FROM "Notification"
      WHERE "taskId" IN (${placeholders})
        AND "channel" = ?
        AND substr("createdAt", 1, 10) = ?
        AND "type" IN ('task_owner_reminder', 'task_owner_group_reminder', 'task_owner_auto_reminder')
    `,
    ...taskIds,
    channel,
    dateKey,
  );

  return new Set(rows.map((row) => row.taskId));
}

async function createReminderNotifications(input: {
  tasks: ReminderTaskRow[];
  channel: "whatsapp" | "email";
  type: "task_owner_reminder" | "task_owner_group_reminder" | "task_owner_auto_reminder";
  subject: string;
  message: string;
  status: "sent" | "failed";
  error?: string | null;
}) {
  const timestamp = nowIso();
  for (const task of input.tasks) {
    await d1Run(
      `
        INSERT INTO "Notification" (
          "id", "taskId", "userId", "type", "channel", "subject", "message", "status", "sentAt", "error", "createdAt"
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      createId(),
      task.id,
      task.ownerId,
      input.type,
      input.channel,
      input.subject,
      input.message,
      input.status,
      input.status === "sent" ? timestamp : null,
      input.error || null,
      timestamp,
    );
  }
}

/**
 * Sends a reminder for a single task using the selected channel.
 */
export async function sendSingleOwnerTaskReminder(
  taskId: string,
  channel: "whatsapp" | "email",
  force = false,
): Promise<SingleReminderResult> {
  const [task] = await getTasksByIds([taskId]);

  if (!task) {
    throw new Error("Task not found.");
  }

  const ownerName = task.contact_name || task.owner_name || task.owner_email || "Task Owner";
  const duplicateIds = force ? new Set<string>() : await getAlreadyRemindedTaskIds([taskId], channel);

  if (duplicateIds.has(taskId)) {
    throw new Error("A reminder for this task was already sent today.");
  }

  if (channel === "whatsapp") {
    const phone = task.contact_phone || task.owner_phone;
    if (!phone) {
      throw new Error(`No WhatsApp phone number found for ${ownerName}.`);
    }

    const message = buildMessageFromTemplate(DEFAULT_TEMPLATE, task);
    const messageId = await sendWhatsAppMessage(normalizePhoneNumber(phone), message);

    await createReminderNotifications({
      tasks: [task],
      channel: "whatsapp",
      type: "task_owner_reminder",
      subject: `WhatsApp reminder for ${task.title}`,
      message,
      status: messageId ? "sent" : "failed",
      error: messageId ? null : "sent.dm did not return a message ID.",
    });

    if (!messageId) {
      throw new Error(`WhatsApp reminder failed for ${ownerName}.`);
    }

    return { ok: true, channel, taskId, ownerName, message: "WhatsApp reminder sent successfully." };
  }

  const email = task.contact_email || task.owner_email;
  if (!email) {
    throw new Error(`No email address found for ${ownerName}.`);
  }

  const emailContent = buildEmailContent(task);
  const emailResult = await sendEmailMessage(email, emailContent.subject, emailContent.text, emailContent.html);

  await createReminderNotifications({
    tasks: [task],
    channel: "email",
    type: "task_owner_reminder",
    subject: emailContent.subject,
    message: emailContent.text,
    status: emailResult.success ? "sent" : "failed",
    error: emailResult.success ? null : emailResult.error,
  });

  if (!emailResult.success) {
    throw new Error(emailResult.error);
  }

  return { ok: true, channel, taskId, ownerName, message: "Email reminder sent successfully." };
}

/**
 * Sends grouped WhatsApp reminders for selected tasks, one message per owner.
 */
export async function sendGroupedOwnerWhatsAppReminders(taskIds: string[], force = false) {
  const tasks = await getTasksByIds(taskIds);
  const duplicateIds = force ? new Set<string>() : await getAlreadyRemindedTaskIds(taskIds, "whatsapp");
  const settings = await getReminderSettings();
  const byOwner = new Map<string, ReminderTaskRow[]>();
  const result: SendNowResult = {
    sentOwners: [],
    skippedOwners: [],
    failedOwners: [],
    includedTasks: [],
    skippedTasks: [],
  };

  for (const task of tasks) {
    const ownerId = task.ownerId;
    const ownerName = task.contact_name || task.owner_name || task.owner_email || "Unknown owner";

    if (!ownerId) {
      result.skippedTasks.push({
        taskId: task.taskId || task.id,
        title: task.title,
        ownerName,
        reason: "Task has no owner.",
      });
      continue;
    }

    if (duplicateIds.has(task.id)) {
      result.skippedTasks.push({
        taskId: task.taskId || task.id,
        title: task.title,
        ownerName,
        reason: "A WhatsApp reminder was already sent today.",
      });
      continue;
    }

    const phone = task.contact_phone || task.owner_phone;
    if (!phone) {
      result.skippedTasks.push({
        taskId: task.taskId || task.id,
        title: task.title,
        ownerName,
        reason: "Owner is missing a phone number.",
      });
      continue;
    }

    if (!byOwner.has(ownerId)) {
      byOwner.set(ownerId, []);
    }
    byOwner.get(ownerId)?.push(task);
  }

  for (const [ownerId, ownerTasks] of byOwner.entries()) {
    const firstTask = ownerTasks[0];
    const ownerName = firstTask.contact_name || firstTask.owner_name || firstTask.owner_email || "Task Owner";
    const phone = firstTask.contact_phone || firstTask.owner_phone;

    if (!phone) {
      result.skippedOwners.push({ ownerId, ownerName, reason: "Owner is missing a phone number." });
      continue;
    }

    const message = buildBulkOwnerMessage(ownerName, ownerTasks, settings.whatsappReminderTemplate);
    const messageId = await sendWhatsAppMessage(normalizePhoneNumber(phone), message);

    await createReminderNotifications({
      tasks: ownerTasks,
      channel: "whatsapp",
      type: "task_owner_group_reminder",
      subject: `Grouped WhatsApp reminder for ${ownerName}`,
      message,
      status: messageId ? "sent" : "failed",
      error: messageId ? null : "sent.dm did not return a message ID.",
    });

    if (!messageId) {
      result.failedOwners.push({ ownerId, ownerName, reason: "WhatsApp send failed." });
      continue;
    }

    result.sentOwners.push({ ownerId, ownerName, taskCount: ownerTasks.length });
    for (const task of ownerTasks) {
      result.includedTasks.push({
        taskId: task.taskId || task.id,
        title: task.title,
        ownerName,
      });
    }
  }

  return result;
}

/**
 * Sends grouped email reminders for selected tasks, one email per owner.
 */
export async function sendGroupedOwnerEmailReminders(taskIds: string[], force = false) {
  const tasks = await getTasksByIds(taskIds);
  const duplicateIds = force ? new Set<string>() : await getAlreadyRemindedTaskIds(taskIds, "email");
  const byOwner = new Map<string, ReminderTaskRow[]>();
  const result: SendNowResult = {
    sentOwners: [],
    skippedOwners: [],
    failedOwners: [],
    includedTasks: [],
    skippedTasks: [],
  };

  for (const task of tasks) {
    const ownerId = task.ownerId;
    const ownerName = task.contact_name || task.owner_name || task.owner_email || "Unknown owner";

    if (!ownerId) {
      result.skippedTasks.push({
        taskId: task.taskId || task.id,
        title: task.title,
        ownerName,
        reason: "Task has no owner.",
      });
      continue;
    }

    if (duplicateIds.has(task.id)) {
      result.skippedTasks.push({
        taskId: task.taskId || task.id,
        title: task.title,
        ownerName,
        reason: "An email reminder was already sent today.",
      });
      continue;
    }

    const email = task.contact_email || task.owner_email;
    if (!email) {
      result.skippedTasks.push({
        taskId: task.taskId || task.id,
        title: task.title,
        ownerName,
        reason: "Owner is missing an email address.",
      });
      continue;
    }

    if (!byOwner.has(ownerId)) {
      byOwner.set(ownerId, []);
    }
    byOwner.get(ownerId)?.push(task);
  }

  for (const [ownerId, ownerTasks] of byOwner.entries()) {
    const firstTask = ownerTasks[0];
    const ownerName = firstTask.contact_name || firstTask.owner_name || firstTask.owner_email || "Task Owner";
    const email = firstTask.contact_email || firstTask.owner_email;

    if (!email) {
      result.skippedOwners.push({ ownerId, ownerName, reason: "Owner is missing an email address." });
      continue;
    }

    const emailContent = buildBulkOwnerEmailContent(ownerName, ownerTasks);
    const emailResult = await sendEmailMessage(
      email,
      emailContent.subject,
      emailContent.text,
      emailContent.html,
    );

    await createReminderNotifications({
      tasks: ownerTasks,
      channel: "email",
      type: "task_owner_group_reminder",
      subject: emailContent.subject,
      message: emailContent.text,
      status: emailResult.success ? "sent" : "failed",
      error: emailResult.success ? null : emailResult.error,
    });

    if (!emailResult.success) {
      result.failedOwners.push({ ownerId, ownerName, reason: emailResult.error || "Email send failed." });
      continue;
    }

    result.sentOwners.push({ ownerId, ownerName, taskCount: ownerTasks.length });
    for (const task of ownerTasks) {
      result.includedTasks.push({
        taskId: task.taskId || task.id,
        title: task.title,
        ownerName,
      });
    }
  }

  return result;
}

/**
 * Sends owner WhatsApp reminders for tasks matching the configured reminder offsets.
 */
export async function sendConfiguredOwnerWhatsAppReminders(force = false) {
  const settings = await getReminderSettings();
  const offsets = settings.whatsappReminderOffsets
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value, index, array) => Number.isFinite(value) && array.indexOf(value) === index);

  if (offsets.length === 0) {
    throw new Error("No valid WhatsApp reminder timings are configured.");
  }

  const tasks = await getEligibleAutoReminderTasks(offsets);
  return sendGroupedOwnerWhatsAppReminders(tasks.map((task) => task.id), force);
}

/**
 * Returns the current owner reminder settings with defaults.
 */
export async function getOwnerReminderSettings() {
  return getReminderSettings();
}
