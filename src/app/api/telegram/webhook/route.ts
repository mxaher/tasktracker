/**
 * POST /api/telegram/webhook
 *
 * Handles all inbound Telegram updates.
 * - If the user sends /task (or is already mid-wizard), routes to the
 *   multi-step guided wizard (handleTelegramWizard).
 * - Legacy single-shot /task <fields> format is no longer supported;
 *   users are guided to the interactive wizard instead.
 */

import { NextRequest, NextResponse } from "next/server";
import { d1First } from "@/lib/cloudflare-d1";
import { handleTelegramWizard } from "@/lib/telegram-wizard";
import { sendTelegramMessage } from "@/lib/notifications/telegram";

type TelegramWebhookBody = {
  message?: {
    text?: string;
    chat?: { id?: number | string };
    from?: {
      id?: number;
      first_name?: string;
      last_name?: string;
      username?: string;
    };
  };
};

type TelegramUserRow = {
  id: string;
  chatId: string;
  userId: string;
  user_name: string | null;
  user_email: string;
  user_role: string;
};

async function replyToChat(chatId: string, text: string): Promise<void> {
  try {
    await sendTelegramMessage(chatId, text);
  } catch (err) {
    console.error("[Telegram Webhook] Failed to send reply:", err);
  }
}

export async function POST(request: NextRequest) {
  // 1. Validate secret token
  const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse body
  let body: TelegramWebhookBody;
  try {
    body = (await request.json()) as TelegramWebhookBody;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const chatIdValue = body.message?.chat?.id;
  const chatId = chatIdValue !== undefined ? String(chatIdValue) : null;
  const messageText = body.message?.text?.trim() ?? "";

  if (!chatId || !messageText) {
    return NextResponse.json({ ok: true });
  }

  // 3. Check allowed chat IDs
  const allowedIds = (process.env.TELEGRAM_ALLOWED_CHAT_IDS ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  if (allowedIds.length > 0 && !allowedIds.includes(chatId)) {
    await replyToChat(chatId, "غير مصرح بالوصول.");
    return NextResponse.json({ ok: true });
  }

  // 4. Look up linked TelegramUser
  const telegramUser = await d1First<TelegramUserRow>(
    `SELECT tu.id, tu.chatId, tu.userId,
            u.name AS user_name, u.email AS user_email, u.role AS user_role
     FROM "TelegramUser" tu
     JOIN "User" u ON u.id = tu.userId
     WHERE tu.chatId = ?`,
    chatId,
  ).catch(() => null);

  if (!telegramUser) {
    await replyToChat(
      chatId,
      "لم يتم ربط حسابك بعد.\nيرجى الذهاب إلى إعدادات النظام > تيليغرام لربط حسابك.",
    );
    return NextResponse.json({ ok: true });
  }

  // 5. Route to wizard — handles /task, step replies, and /cancel
  await handleTelegramWizard(chatId, messageText, telegramUser);

  return NextResponse.json({ ok: true });
}
