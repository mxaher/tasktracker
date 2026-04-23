import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'



export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  try {
    const { propertyId, year, annualTarget } = await req.json()
    const record = await db.propertyAnnualTarget.upsert({
      where: { propertyId_year: { propertyId, year } },
      create: { propertyId, year, annualTarget },
      update: { annualTarget },
    })
    return NextResponse.json({ success: true, data: record })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
