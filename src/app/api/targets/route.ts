import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'



export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const propertyId = searchParams.get('propertyId')
    const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))

    if (!propertyId) return NextResponse.json({ success: false, error: 'propertyId required' }, { status: 400 })

    const [annual, monthly] = await Promise.all([
      db.propertyAnnualTarget.findUnique({ where: { propertyId_year: { propertyId, year } } }),
      db.propertyMonthlyTarget.findMany({ where: { propertyId, year }, orderBy: { month: 'asc' } }),
    ])

    return NextResponse.json({ success: true, data: { annual, monthly } })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
