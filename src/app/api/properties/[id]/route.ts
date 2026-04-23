import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const property = await db.property.findUnique({
      where: { id },
      include: {
        manager: { select: { id: true, nameAr: true } },
        annualTargets: { orderBy: { year: 'desc' } },
        monthlyTargets: { orderBy: [{ year: 'desc' }, { month: 'asc' }] },
        collectionActuals: { orderBy: [{ year: 'desc' }, { month: 'asc' }] },
        agingReports: { orderBy: [{ year: 'desc' }, { month: 'asc' }] },
        targetVersions: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    })
    if (!property) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: property })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const raw = await req.json()
    const body = {
      ...raw,
      nameEn: raw.nameEn || undefined,
      location: raw.location || undefined,
      managerId: raw.managerId || undefined,
    }
    const property = await db.property.update({ where: { id }, data: body })
    return NextResponse.json({ success: true, data: property })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.property.delete({ where: { id } })
    return NextResponse.json({ success: true, data: { id } })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
