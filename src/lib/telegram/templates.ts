export const templates = {
  welcome: (firstName: string) =>
    `مرحباً ${firstName}! 👋\n\nأنا مساعدك الذكي لإدارة المهام.\n\nاكتب /help لعرض الأوامر المتاحة.`,

  help: () =>
    `📋 <b>الأوامر المتاحة:</b>\n\n` +
    `/new — إنشاء مهمة جديدة\n` +
    `/list — عرض المهام\n` +
    `/stats — إحصائيات المهام\n` +
    `/help — عرض هذه القائمة\n\n` +
    `<b>صيغ إدخال المهام:</b>\n` +
    `1. مهمة: [العنوان] بحلول [التاريخ]\n` +
    `2. [العنوان] - [الأولوية] - [التاريخ]\n` +
    `3. [العنوان] فقط`,

  taskCreated: (title: string, id: string) =>
    `✅ تم إنشاء المهمة:\n\n<b>${title}</b>\n\nالمعرف: <code>${id}</code>`,

  taskList: (tasks: Array<{ taskId?: string; title: string; status: string; priority: string }>) => {
    if (tasks.length === 0) return '📭 لا توجد مهام حالياً.'
    const statusIcon: Record<string, string> = {
      completed: '✅',
      in_progress: '🔄',
      delayed: '⚠️',
      not_started: '⭕',
    }
    return (
      `📋 <b>المهام (${tasks.length}):</b>\n\n` +
      tasks
        .slice(0, 10)
        .map(
          (t, i) =>
            `${i + 1}. ${statusIcon[t.status] ?? '⭕'} ${t.title}\n   ID: <code>${t.taskId ?? t.title.slice(0, 6)}</code>`
        )
        .join('\n\n')
    )
  },

  stats: (s: { total: number; completed: number; inProgress: number; delayed: number }) =>
    `📊 <b>إحصائيات المهام:</b>\n\n` +
    `📌 الإجمالي: ${s.total}\n` +
    `✅ مكتمل: ${s.completed}\n` +
    `🔄 قيد التنفيذ: ${s.inProgress}\n` +
    `⚠️ متأخر: ${s.delayed}`,

  notRegistered: () =>
    `⚠️ لم يتم ربط حسابك بعد. يرجى التواصل مع المسؤول لربط حسابك بالنظام.`,

  newTaskPrompt: () =>
    `📝 أرسل عنوان المهمة الجديدة.\n\nيمكنك أيضاً إرسال:\n<code>مهمة: [العنوان] بحلول [التاريخ]</code>`,

  error: () => `❌ حدث خطأ. حاول مرة أخرى.`,
}
