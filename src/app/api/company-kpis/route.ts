import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'



export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))
    const category = searchParams.get('category')

    const where: Record<string, unknown> = { year, isActive: true }
    if (category) where.category = category

    const kpis = await db.companyKPI.findMany({
      where,
      include: { monthlyData: { orderBy: { month: 'asc' } } },
      orderBy: { code: 'asc' },
    })

    const data = kpis.map((kpi) => {
      const totalActual = kpi.monthlyData.reduce((s, m) => s + m.actual, 0)
      const achievement = kpi.target > 0 ? (totalActual / kpi.target) * 100 : 0
      return { ...kpi, achievement }
    })

    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json()
    const body = { ...raw, nameEn: raw.nameEn || undefined }
    const kpi = await db.companyKPI.create({ data: body })
    return NextResponse.json({ success: true, data: kpi }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
