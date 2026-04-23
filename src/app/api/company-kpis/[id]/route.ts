import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const raw = await req.json()
    const body = { ...raw, nameEn: raw.nameEn || undefined }
    const kpi = await db.companyKPI.update({ where: { id }, data: body })
    return NextResponse.json({ success: true, data: kpi })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.companyKPI.delete({ where: { id } })
    return NextResponse.json({ success: true, data: { id } })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
