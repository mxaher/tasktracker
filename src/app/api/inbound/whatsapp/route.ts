import {
  findContactByPhone,
  findMostRecentOpenTaskForUser,
  findUserByPhone,
  isCompletionUpdateMessage,
  resolveUserMessagingContact,
} from "@/lib/contacts";
import { db } from "@/lib/db";
import { sendWhatsAppMessage } from "@/lib/notifications/sentdm";
import { getAllowedTelegramChatIds, sendTelegramMessage } from "@/lib/notifications/telegram";
import { NextRequest, NextResponse } from "next/server";

type SentDmWebhookPayload = {
  from?: string;
  message?: string;
  replyTo?: string | null;
};

async function notifyTelegramChats(message: string) {
  const chatIds = getAllowedTelegramChatIds();

  await Promise.all(
    chatIds.map(async (chatId) => {
      try {
        await sendTelegramMessage(chatId, message);
      } catch (error) {
        console.error(`Failed to notify Telegram chat ${chatId}:`, error);
      }
    }),
  );
}

// Register this webhook in the sent.dm dashboard:
// Webhook URL: https://<your-domain>/api/inbound/whatsapp
/** Processes inbound WhatsApp replies from sent.dm and attaches them to tasks. */
export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.SENTDM_WEBHOOK_SECRET;
    const headerSecret = request.headers.get("x-sentdm-secret");

    if (!webhookSecret || headerSecret !== webhookSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as SentDmWebhookPayload;
    const from = body.from?.trim();
    const message = body.message?.trim();
    const replyTo = body.replyTo?.trim() || null;

    if (!from || !message) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    let task =
      (replyTo
        ? await db.task.findFirst({
            where: {
              sentdmMessageId: replyTo,
            },
            include: {
              assignee: true,
            },
          })
        : null) || null;

    if (!task) {
      const contact = await findContactByPhone(from);
      if (contact?.userId) {
        task = await findMostRecentOpenTaskForUser(contact.userId);
      }
    }

    if (!task) {
      const user = await findUserByPhone(from);
      if (user) {
        task = await findMostRecentOpenTaskForUser(user.id);
      }
    }

    if (!task) {
      await sendWhatsAppMessage(
        from,
        "⚠️ We couldn't match your reply to an open task. Please update the task directly in the system or contact your manager.",
      );

      return NextResponse.json({ matched: false });
    }

    await db.taskUpdate.create({
      data: {
        taskId: task.id,
        source: "whatsapp",
        content: message,
      },
    });

    let currentStatus = task.status;
    if (isCompletionUpdateMessage(message) && task.status !== "completed") {
      const updatedTask = await db.task.update({
        where: { id: task.id },
        data: {
          status: "completed",
          completion: 1,
          completedAt: new Date(),
        },
        include: {
          assignee: true,
        },
      });

      task = updatedTask;
      currentStatus = updatedTask.status;
    }

    const assigneeName = task.assigneeId
      ? (await resolveUserMessagingContact(task.assigneeId))?.name ||
        task.assignee?.name ||
        task.assignee?.email ||
        "Unknown assignee"
      : "Unknown assignee";

    await sendWhatsAppMessage(
      from,
      currentStatus === "completed"
        ? `✅ Task '${task.title}' has been marked as complete. Great work!`
        : `✅ Your update has been recorded on Task '${task.title}'.`,
    );

    await notifyTelegramChats(
      `📋 Task Update Received\nTask: ${task.title}\nFrom: ${assigneeName}\nUpdate: ${message}\nStatus: ${currentStatus}`,
    );

    return NextResponse.json({ matched: true, taskId: task.id, status: currentStatus });
  } catch (error) {
    console.error("Error handling sent.dm webhook:", error);
    return NextResponse.json({ error: "Failed to process WhatsApp webhook" }, { status: 500 });
  }
}
