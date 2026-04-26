/**
 * Returns the configured Telegram chat IDs allowed to interact with the bot.
 */
export function getAllowedTelegramChatIds(): string[] {
  return (process.env.TELEGRAM_ALLOWED_CHAT_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

type InlineKeyboardButton = {
  text: string;
  callback_data?: string;
};

type InlineKeyboard = InlineKeyboardButton[][];

/**
 * Sends a message through the configured Telegram bot.
 */
export async function sendTelegramMessage(
  chatId: string,
  text: string,
  replyMarkup?: InlineKeyboard,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  }

  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  };

  if (replyMarkup) {
    payload.reply_markup = {
      inline_keyboard: replyMarkup,
    };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { description?: string } | null;
    throw new Error(data?.description || "Failed to send Telegram message");
  }
}
