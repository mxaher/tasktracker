interface ParsedTask {
  title: string
  dueDate?: Date
  priority?: string
  confidence: number
}

const priorityMap: Record<string, string> = {
  عاجل: 'critical',
  'عالي الأولوية': 'high',
  عالي: 'high',
  متوسط: 'medium',
  منخفض: 'low',
}

const monthMap: Record<string, number> = {
  يناير: 1, فبراير: 2, مارس: 3, أبريل: 4,
  مايو: 5, يونيو: 6, يوليو: 7, أغسطس: 8,
  سبتمبر: 9, أكتوبر: 10, نوفمبر: 11, ديسمبر: 12,
}

function parseArabicDate(text: string): Date | undefined {
  // "بحلول 15 أبريل"
  const match = text.match(/بحلول\s+(\d+)\s+(\S+)/)
  if (match) {
    const day = parseInt(match[1])
    const month = monthMap[match[2]]
    if (month) {
      const d = new Date()
      d.setMonth(month - 1)
      d.setDate(day)
      return d
    }
  }
  // ISO date
  const isoMatch = text.match(/(\d{4}-\d{2}-\d{2})/)
  if (isoMatch) return new Date(isoMatch[1])
  return undefined
}

export function parseTaskMessage(text: string): ParsedTask {
  // Format 1: "مهمة: [title] بحلول [date]"
  const format1 = text.match(/^مهمة:\s*(.+?)(?:\s+بحلول\s+(.+))?$/)
  if (format1) {
    const dueDate = format1[2] ? parseArabicDate('بحلول ' + format1[2]) : undefined
    return { title: format1[1].trim(), dueDate, confidence: 0.9 }
  }

  // Format 2: "[title] - [priority] - [date]"
  const format2 = text.match(/^(.+?)\s*-\s*(.+?)\s*-\s*(.+)$/)
  if (format2) {
    const priority = priorityMap[format2[2].trim()]
    const dueDate = parseArabicDate(format2[3])
    return { title: format2[1].trim(), priority, dueDate, confidence: 0.8 }
  }

  // Format 3: plain text
  return { title: text.trim(), confidence: 0.6 }
}
