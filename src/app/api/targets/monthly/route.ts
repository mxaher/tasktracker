import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { routeErrorResponse } from '@/lib/api-error'



export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  try {
    const { propertyId, year, month, target } = await req.json()
    const record = await db.propertyMonthlyTarget.upsert({
      where: { propertyId_year_month: { propertyId, year, month } },
      create: { propertyId, year, month, target },
      update: { target },
    })
    return NextResponse.json({ success: true, data: record })
  } catch (e) {
    return routeErrorResponse('/api/targets/monthly POST', e, { body: { success: false } })
  }
}
