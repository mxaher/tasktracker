import { getOpenTaskStatuses, resolveUserMessagingContact } from "@/lib/contacts";
import { db } from "@/lib/db";
import { sendWhatsAppMessage } from "@/lib/notifications/sentdm";
import { differenceInCalendarDays, format, isSameDay, startOfDay } from "date-fns";

function buildReminderMessage(input: {
  reminderType: "t-3" | "t-1" | "t-0" | "overdue";
  recipientName: string;
  taskId: string;
  title: string;
  dueDate: Date;
}) {
  const dueDateLabel = format(input.dueDate, "MMMM d, yyyy");

  switch (input.reminderType) {
    case "t-3":
      return `Hi ${input.recipientName}, a reminder that Task #${input.taskId} '${input.title}' is due in 3 days on ${dueDateLabel}. Reply to this message with any update.`;
    case "t-1":
      return `Hi ${input.recipientName}, Task #${input.taskId} '${input.title}' is due tomorrow. Please reply with your current progress.`;
    case "t-0":
      return `Hi ${input.recipientName}, Task #${input.taskId} '${input.title}' is due today. Reply with your status update or flag any blockers.`;
    case "overdue":
      return `Hi ${input.recipientName}, Task #${input.taskId} '${input.title}' was due on ${dueDateLabel} and is still open. Please reply with an update immediately.`;
  }
}

function getReminderType(dueDate: Date) {
  const daysUntilDue = differenceInCalendarDays(startOfDay(dueDate), startOfDay(new Date()));

  if (daysUntilDue === 3) {
    return "t-3" as const;
  }

  if (daysUntilDue === 1) {
    return "t-1" as const;
  }

  if (daysUntilDue === 0) {
    return "t-0" as const;
  }

  if (daysUntilDue < 0) {
    return "overdue" as const;
  }

  return null;
}

/**
 * Sends the scheduled WhatsApp reminder cycle for due and overdue tasks.
 */
export async function runReminderCycle(): Promise<{ sent: number }> {
  const tasks = await db.task.findMany({
    where: {
      dueDate: {
        not: null,
      },
      status: {
        in: getOpenTaskStatuses(),
      },
      assigneeId: {
        not: null,
      },
    },
    include: {
      assignee: true,
    },
    orderBy: [
      { dueDate: "asc" },
      { updatedAt: "desc" },
    ],
  });

  let sent = 0;
  const now = new Date();

  for (const task of tasks) {
    if (!task.assigneeId || !task.assignee || !task.dueDate) {
      continue;
    }

    const reminderType = getReminderType(task.dueDate);

    if (!reminderType) {
      continue;
    }

    if (task.lastReminderSentAt && isSameDay(task.lastReminderSentAt, now)) {
      continue;
    }

    const contact = await resolveUserMessagingContact(task.assigneeId);
    const phone = contact?.phone || null;

    if (!phone) {
      continue;
    }

    const recipientName = contact?.name || task.assignee.name || task.assignee.username || task.assignee.email;
    const message = buildReminderMessage({
      reminderType,
      recipientName,
      taskId: task.taskId || task.id,
      title: task.title,
      dueDate: task.dueDate,
    });

    const messageId = await sendWhatsAppMessage(phone, message);

    await db.task.update({
      where: { id: task.id },
      data: {
        sentdmMessageId: messageId || task.sentdmMessageId,
        lastReminderSentAt: now,
      },
    });

    await db.notification.create({
      data: {
        taskId: task.id,
        userId: task.assignee.id,
        type: reminderType === "overdue" ? "overdue" : "reminder",
        channel: "whatsapp",
        subject: `WhatsApp reminder for ${task.title}`,
        message,
        status: messageId ? "sent" : "failed",
        sentAt: messageId ? now : null,
        error: messageId ? null : "sent.dm did not return a message ID",
      },
    });

    if (messageId) {
      sent += 1;
    }
  }

  return { sent };
}
