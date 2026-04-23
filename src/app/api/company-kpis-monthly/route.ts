import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'



export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  try {
    const { kpiId, year, month, actual } = await req.json()
    const record = await db.companyKPIMonthly.upsert({
      where: { kpiId_year_month: { kpiId, year, month } },
      create: { kpiId, year, month, actual },
      update: { actual },
    })
    return NextResponse.json({ success: true, data: record })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
