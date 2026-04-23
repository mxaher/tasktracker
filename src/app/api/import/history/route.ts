import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { routeErrorResponse } from '@/lib/api-error'



export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const records = await db.importRecord.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ success: true, data: records })
  } catch (e) {
    return routeErrorResponse('/api/import/history GET', e, { body: { success: false } })
  }
}
