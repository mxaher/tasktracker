import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { routeErrorResponse } from '@/lib/api-error'



export const dynamic = 'force-dynamic'
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const kpi = await db.employeeCustomKPI.update({ where: { id }, data: body })
    return NextResponse.json({ success: true, data: kpi })
  } catch (e) {
    return routeErrorResponse('/api/employee-custom-kpis/[id] PUT', e, { body: { success: false } })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.employeeCustomKPI.delete({ where: { id } })
    return NextResponse.json({ success: true, data: { id } })
  } catch (e) {
    return routeErrorResponse('/api/employee-custom-kpis/[id] DELETE', e, { body: { success: false } })
  }
}
