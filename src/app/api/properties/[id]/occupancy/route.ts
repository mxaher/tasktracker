import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { occupancyRate } = await req.json()
    const property = await db.property.update({
      where: { id },
      data: { occupancyRate: Number(occupancyRate) },
    })
    return NextResponse.json({ success: true, data: property })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
