import type { SendMessageParams, InlineKeyboard } from './types'

const BASE = 'https://api.telegram.org/bot'

function getToken() {
  return process.env.TELEGRAM_BOT_TOKEN ?? ''
}

async function call<T>(method: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BASE}${getToken()}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json() as { ok: boolean; result: T }
  if (!json.ok) throw new Error(`Telegram API error: ${JSON.stringify(json)}`)
  return json.result
}

export async function sendMessage(
  chatId: number | string,
  text: string,
  replyMarkup?: InlineKeyboard,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
) {
  const params: SendMessageParams = { chat_id: chatId, text, parse_mode: parseMode }
  if (replyMarkup) params.reply_markup = replyMarkup
  return call('sendMessage', params as unknown as Record<string, unknown>)
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  return call('answerCallbackQuery', { callback_query_id: callbackQueryId, text })
}

export async function editMessageText(
  chatId: number | string,
  messageId: number,
  text: string,
  replyMarkup?: InlineKeyboard
) {
  return call('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: 'HTML',
    reply_markup: replyMarkup,
  })
}

export async function setWebhook(url: string) {
  return call('setWebhook', { url })
}
