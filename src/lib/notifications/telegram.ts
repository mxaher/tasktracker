/**
 * Returns the configured Telegram chat IDs allowed to interact with the bot.
 */
export function getAllowedTelegramChatIds(): string[] {
  return (process.env.TELEGRAM_ALLOWED_CHAT_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

/**
 * Sends a message through the configured Telegram bot.
 */
export async function sendTelegramMessage(chatId: string, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { description?: string } | null;
    throw new Error(payload?.description || "Failed to send Telegram message");
  }
}
