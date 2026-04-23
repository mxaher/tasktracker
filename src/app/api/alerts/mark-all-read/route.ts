import { NextResponse } from 'next/server'
import { db } from '@/lib/db'



export const dynamic = 'force-dynamic'
export async function POST() {
  try {
    const result = await db.alert.updateMany({ where: { isRead: false }, data: { isRead: true } })
    return NextResponse.json({ success: true, data: { updated: result.count } })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
