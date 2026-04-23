import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { routeErrorResponse } from '@/lib/api-error'



export const dynamic = 'force-dynamic'
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const raw = await req.json()
    const body = { ...raw, nameEn: raw.nameEn || undefined }
    const kpi = await db.companyKPI.update({ where: { id }, data: body })
    return NextResponse.json({ success: true, data: kpi })
  } catch (e) {
    return routeErrorResponse('/api/company-kpis/[id] PUT', e, { body: { success: false } })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.companyKPI.delete({ where: { id } })
    return NextResponse.json({ success: true, data: { id } })
  } catch (e) {
    return routeErrorResponse('/api/company-kpis/[id] DELETE', e, { body: { success: false } })
  }
}
