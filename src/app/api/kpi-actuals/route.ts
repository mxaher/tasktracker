import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'



export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const employeeId = searchParams.get('employeeId')
    const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined

    const where: Record<string, unknown> = { year }
    if (employeeId) where.employeeId = employeeId
    if (month) where.month = month

    const actuals = await db.kPIActual.findMany({ where, orderBy: { month: 'asc' } })
    return NextResponse.json({ success: true, data: actuals })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { employeeId, kpiId, year, month, actual } = await req.json()
    const record = await db.kPIActual.upsert({
      where: { employeeId_kpiId_year_month: { employeeId: employeeId ?? null, kpiId, year, month } },
      create: { employeeId, kpiId, year, month, actual },
      update: { actual },
    })
    return NextResponse.json({ success: true, data: record })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
