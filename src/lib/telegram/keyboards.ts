import type { InlineKeyboard, InlineKeyboardButton } from './types'

export const keyboards = {
  taskActions: (taskId: string): InlineKeyboard => ({
    inline_keyboard: [
      [
        { text: '✅ مكتمل', callback_data: `status:${taskId}:completed` },
        { text: '🔄 قيد التنفيذ', callback_data: `status:${taskId}:in_progress` },
      ],
      [
        { text: '⚠️ متأخر', callback_data: `status:${taskId}:delayed` },
        { text: '⭕ لم يبدأ', callback_data: `status:${taskId}:not_started` },
      ],
      [
        { text: '🗑️ حذف', callback_data: `delete:${taskId}` },
        { text: '🔙 رجوع', callback_data: 'back:list' },
      ],
    ],
  }),

  confirmDelete: (taskId: string): InlineKeyboard => ({
    inline_keyboard: [
      [
        { text: '✅ تأكيد الحذف', callback_data: `confirm_delete:${taskId}` },
        { text: '❌ إلغاء', callback_data: `status_view:${taskId}` },
      ],
    ],
  }),

  pagination: (page: number, total: number, filter: string): InlineKeyboard => {
    const buttons: InlineKeyboardButton[] = []
    if (page > 0) buttons.push({ text: '⬅️ السابق', callback_data: `list:${page - 1}:${filter}` })
    if ((page + 1) * 10 < total) buttons.push({ text: 'التالي ➡️', callback_data: `list:${page + 1}:${filter}` })
    const filterButtons = [
      { text: '🟢 المفتوحة', callback_data: 'list:0:open' },
      { text: '✅ المكتملة', callback_data: 'list:0:completed' },
      { text: '📋 الكل', callback_data: 'list:0:all' },
    ]
    const rows: InlineKeyboard['inline_keyboard'] = []
    if (buttons.length > 0) rows.push(buttons)
    rows.push(filterButtons)
    return { inline_keyboard: rows }
  },
}
