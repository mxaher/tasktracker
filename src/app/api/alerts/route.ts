import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'



export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const unread = searchParams.get('unread')
    const propertyId = searchParams.get('propertyId')
    const severity = searchParams.get('severity')
    const resolved = searchParams.get('resolved')

    const where: Record<string, unknown> = {}
    if (unread === 'true') where.isRead = false
    if (propertyId) where.propertyId = propertyId
    if (severity) where.severity = severity
    if (resolved === 'true') where.isResolved = true
    if (resolved === 'false') where.isResolved = false

    const alerts = await db.alert.findMany({
      where,
      include: { property: { select: { id: true, code: true, nameAr: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ success: true, data: alerts })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const alert = await db.alert.create({ data: body })
    return NextResponse.json({ success: true, data: alert }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
