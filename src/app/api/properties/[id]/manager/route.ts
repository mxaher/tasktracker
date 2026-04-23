import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { routeErrorResponse } from '@/lib/api-error'



export const dynamic = 'force-dynamic'
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { managerId } = await req.json()
    const property = await db.property.update({
      where: { id },
      data: { managerId: managerId ?? null },
    })
    return NextResponse.json({ success: true, data: property })
  } catch (e) {
    return routeErrorResponse('/api/properties/[id]/manager PUT', e, { body: { success: false } })
  }
}
