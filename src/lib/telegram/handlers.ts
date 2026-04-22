import { db } from '@/lib/db'
import { sendMessage, answerCallbackQuery, editMessageText } from './bot'
import { templates } from './templates'
import { keyboards } from './keyboards'
import { parseTaskMessage } from './parser'
import type { TelegramMessage, TelegramCallbackQuery } from './types'

async function getOrRegister(chatId: string, from: { id: number; first_name: string; username?: string }) {
  const existing = await db.telegramUser.findUnique({ where: { chatId } })
  if (existing) return existing
  return db.telegramUser.create({
    data: { chatId, firstName: from.first_name, username: from.username, isActive: true },
  })
}

export async function handleMessage(msg: TelegramMessage) {
  const chatId = String(msg.chat.id)
  const text = msg.text ?? ''
  const from = msg.from!

  await getOrRegister(chatId, from)

  if (text.startsWith('/start')) {
    await sendMessage(chatId, templates.welcome(from.first_name))
    return
  }

  if (text.startsWith('/help')) {
    await sendMessage(chatId, templates.help())
    return
  }

  if (text.startsWith('/list')) {
    const tasks = await db.task.findMany({
      where: { status: { not: 'completed' } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    await sendMessage(chatId, templates.taskList(tasks.map((t) => ({ ...t, taskId: t.taskId ?? undefined }))), keyboards.pagination(0, tasks.length, 'open'))
    return
  }

  if (text.startsWith('/stats')) {
    const [total, completed, inProgress, delayed] = await Promise.all([
      db.task.count(),
      db.task.count({ where: { status: 'completed' } }),
      db.task.count({ where: { status: 'in_progress' } }),
      db.task.count({ where: { status: 'delayed' } }),
    ])
    await sendMessage(chatId, templates.stats({ total, completed, inProgress, delayed }))
    return
  }

  if (text.startsWith('/new')) {
    await sendMessage(chatId, templates.newTaskPrompt())
    return
  }

  // Parse as task creation
  const parsed = parseTaskMessage(text)
  if (parsed.confidence >= 0.6 && parsed.title.length > 2) {
    const task = await db.task.create({
      data: {
        title: parsed.title,
        priority: parsed.priority ?? 'medium',
        status: 'not_started',
        dueDate: parsed.dueDate,
      },
    })

    await db.telegramLog.create({
      data: { chatId, direction: 'inbound', type: 'message', payload: text, taskId: task.id },
    })

    await sendMessage(chatId, templates.taskCreated(task.title, task.taskId ?? task.id))
    return
  }

  await sendMessage(chatId, templates.help())
}

export async function handleCallback(query: TelegramCallbackQuery) {
  const chatId = String(query.message?.chat.id ?? query.from.id)
  const data = query.data ?? ''
  const messageId = query.message?.message_id

  await answerCallbackQuery(query.id)

  const [action, ...rest] = data.split(':')

  if (action === 'status' && rest.length >= 2) {
    const [taskId, newStatus] = rest
    await db.task.update({ where: { id: taskId }, data: { status: newStatus } })
    if (messageId) {
      await editMessageText(chatId, messageId, `✅ تم تحديث الحالة إلى: ${newStatus}`)
    }
    return
  }

  if (action === 'delete') {
    const [taskId] = rest
    if (messageId) {
      await editMessageText(chatId, messageId, '⚠️ هل أنت متأكد من الحذف؟', keyboards.confirmDelete(taskId))
    }
    return
  }

  if (action === 'confirm_delete') {
    const [taskId] = rest
    await db.task.delete({ where: { id: taskId } })
    if (messageId) {
      await editMessageText(chatId, messageId, '🗑️ تم حذف المهمة.')
    }
    return
  }

  if (action === 'list') {
    const [pageStr, filter] = rest
    const page = parseInt(pageStr ?? '0')
    const where = filter === 'completed'
      ? { status: 'completed' }
      : filter === 'open'
      ? { status: { not: 'completed' as string } }
      : {}
    const tasks = await db.task.findMany({ where, orderBy: { createdAt: 'desc' }, skip: page * 10, take: 10 })
    const total = await db.task.count({ where })
    if (messageId) {
      await editMessageText(chatId, messageId, templates.taskList(tasks.map((t) => ({ ...t, taskId: t.taskId ?? undefined }))), keyboards.pagination(page, total, filter ?? 'all'))
    }
    return
  }
}
