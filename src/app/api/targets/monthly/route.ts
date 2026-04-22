import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

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
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
