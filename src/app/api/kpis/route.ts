import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'



export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const kpis = await db.kPI.findMany({ where: { isActive: true }, orderBy: { code: 'asc' } })
    return NextResponse.json({ success: true, data: kpis })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const kpi = await db.kPI.create({ data: body })
    return NextResponse.json({ success: true, data: kpi }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
