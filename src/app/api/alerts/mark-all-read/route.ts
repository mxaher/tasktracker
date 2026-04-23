import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { routeErrorResponse } from '@/lib/api-error'



export const dynamic = 'force-dynamic'
export async function POST() {
  try {
    const result = await db.alert.updateMany({ where: { isRead: false }, data: { isRead: true } })
    return NextResponse.json({ success: true, data: { updated: result.count } })
  } catch (e) {
    return routeErrorResponse('/api/alerts/mark-all-read POST', e, { body: { success: false } })
  }
}
