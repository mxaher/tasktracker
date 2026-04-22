import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const employeeId = searchParams.get('employeeId')
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined

    const where: Record<string, unknown> = {}
    if (employeeId) where.employeeId = employeeId
    if (year) where.year = year

    const kpis = await db.employeeCustomKPI.findMany({ where, orderBy: { createdAt: 'asc' } })
    return NextResponse.json({ success: true, data: kpis })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const kpi = await db.employeeCustomKPI.create({ data: body })
    return NextResponse.json({ success: true, data: kpi }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
