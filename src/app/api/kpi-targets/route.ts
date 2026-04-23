import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { routeErrorResponse } from '@/lib/api-error'



export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const employeeId = searchParams.get('employeeId')
    const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))

    const where: Record<string, unknown> = { year }
    if (employeeId) where.employeeId = employeeId

    const targets = await db.employeeKPITarget.findMany({
      where,
      include: { kpi: true },
      orderBy: { kpi: { code: 'asc' } },
    })
    return NextResponse.json({ success: true, data: targets })
  } catch (e) {
    return routeErrorResponse('/api/kpi-targets GET', e, { body: { success: false } })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { employeeId, kpiId, year, target, weight } = await req.json()
    const record = await db.employeeKPITarget.upsert({
      where: { employeeId_kpiId_year: { employeeId, kpiId, year } },
      create: { employeeId, kpiId, year, target, weight: weight ?? 0 },
      update: { target, weight: weight ?? 0 },
    })
    return NextResponse.json({ success: true, data: record })
  } catch (e) {
    return routeErrorResponse('/api/kpi-targets POST', e, { body: { success: false } })
  }
}
