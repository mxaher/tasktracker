import { resolveUserMessagingContact } from "@/lib/contacts";
import { db } from "@/lib/db";
import { runReminderCycle } from "@/lib/notifications/reminderService";
import { sendWhatsAppMessage } from "@/lib/notifications/sentdm";
import {
  getAllowedTelegramChatIds,
  sendTelegramMessage,
} from "@/lib/notifications/telegram";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

type TelegramWebhookPayload = {
  message?: {
    text?: string;
    chat?: {
      id?: number | string;
    };
  };
};

type ParsedTaskCommand = {
  title: string;
  username: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  notes: string | null;
};

const COMMAND_USAGE =
  'Correct format: /task "Task Title" @username due:YYYY-MM-DD priority:high|medium|low notes:optional text';

function parseTaskCommand(text: string): ParsedTaskCommand | null {
  const commandMatch = text.match(/^\/task\s+"([^"]+)"\s+@([A-Za-z0-9_]+)\s+(.+)$/i);

  if (!commandMatch) {
    return null;
  }

  const [, rawTitle, rawUsername, rest] = commandMatch;
  const dueDateMatch = rest.match(/(?:^|\s)due:(\d{4}-\d{2}-\d{2})(?=\s|$)/i);

  if (!dueDateMatch) {
    return null;
  }

  const priorityMatch = rest.match(/(?:^|\s)priority:(high|medium|low)(?=\s|$)/i);
  const notesMatch = rest.match(/(?:^|\s)notes:(.+)$/i);

  return {
    title: rawTitle.trim(),
    username: rawUsername.trim().toLowerCase(),
    dueDate: dueDateMatch[1],
    priority: (priorityMatch?.[1]?.toLowerCase() as ParsedTaskCommand["priority"] | undefined) || "medium",
    notes: notesMatch?.[1]?.trim() || null,
  };
}

async function replyToTelegram(chatId: string, text: string) {
  try {
    await sendTelegramMessage(chatId, text);
  } catch (error) {
    console.error("Failed to reply to Telegram chat:", error);
  }
}

// To register the webhook run:
// POST https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<domain>/api/inbound/telegram
/** Processes inbound Telegram bot commands and creates tasks. */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TelegramWebhookPayload;
    const chatIdValue = body.message?.chat?.id;
    const chatId = chatIdValue !== undefined ? String(chatIdValue) : null;
    const messageText = body.message?.text?.trim() || "";
    const allowedChatIds = getAllowedTelegramChatIds();

    if (!chatId || !allowedChatIds.includes(chatId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsedCommand = parseTaskCommand(messageText);

    if (!parsedCommand) {
      await replyToTelegram(chatId, `Unable to parse task command.\n${COMMAND_USAGE}`);
      return NextResponse.json({ ok: true });
    }

    const users = await db.user.findMany({
      where: {
        username: {
          not: null,
        },
      },
    });

    const assignee =
      users.find(
        (user) => user.username && user.username.toLowerCase() === parsedCommand.username,
      ) || null;

    if (!assignee) {
      await replyToTelegram(
        chatId,
        `User @${parsedCommand.username} was not found.\n${COMMAND_USAGE}`,
      );
      return NextResponse.json({ ok: true });
    }

    const dueDate = new Date(`${parsedCommand.dueDate}T09:00:00`);

    if (Number.isNaN(dueDate.getTime())) {
      await replyToTelegram(chatId, `The due date is invalid.\n${COMMAND_USAGE}`);
      return NextResponse.json({ ok: true });
    }

    const task = await db.task.create({
      data: {
        title: parsedCommand.title,
        assigneeId: assignee.id,
        department: assignee.department,
        priority: parsedCommand.priority,
        status: "pending",
        dueDate,
        notes: parsedCommand.notes,
        source: "telegram",
      },
      include: {
        assignee: true,
      },
    });

    await db.taskAuditLog.create({
      data: {
        taskId: task.id,
        action: "create",
        newValue: JSON.stringify({
          title: task.title,
          assigneeId: task.assigneeId,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate,
          notes: task.notes,
          source: task.source,
        }),
      },
    });

    await runReminderCycle();

    const contact = await resolveUserMessagingContact(assignee.id);
    if (contact?.phone) {
      const dueDateLabel = format(dueDate, "MMMM d, yyyy");
      await sendWhatsAppMessage(
        contact.phone,
        `Hi ${contact.name}, you have been assigned a new task: '${task.title}'. Due: ${dueDateLabel}. Priority: ${task.priority}. Check the system for full details.`,
      );
    }

    await replyToTelegram(
      chatId,
      `✅ Task created:\nTitle: ${task.title}\nAssigned to: ${contact?.name || assignee.name || assignee.email}\nDue: ${format(dueDate, "MMMM d, yyyy")}\nPriority: ${task.priority}\nReminders are now active.`,
    );

    return NextResponse.json({ ok: true, taskId: task.id });
  } catch (error) {
    console.error("Error handling Telegram webhook:", error);
    return NextResponse.json({ error: "Failed to process Telegram webhook" }, { status: 500 });
  }
}
