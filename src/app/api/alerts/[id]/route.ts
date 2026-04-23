import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { routeErrorResponse } from '@/lib/api-error'



export const dynamic = 'force-dynamic'
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const alert = await db.alert.update({ where: { id }, data: body })
    return NextResponse.json({ success: true, data: alert })
  } catch (e) {
    return routeErrorResponse('/api/alerts/[id] PATCH', e, { body: { success: false } })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.alert.delete({ where: { id } })
    return NextResponse.json({ success: true, data: { id } })
  } catch (e) {
    return routeErrorResponse('/api/alerts/[id] DELETE', e, { body: { success: false } })
  }
}
