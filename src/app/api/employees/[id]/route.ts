import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const employee = await db.employee.findUnique({
      where: { id },
      include: {
        position: true,
        managedBy: { select: { id: true, nameAr: true } },
        properties: { include: { property: true } },
        kpiTargets: { include: { kpi: true } },
        customKpis: true,
      },
    })
    if (!employee) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: employee })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { propertyIds, ...raw } = await req.json()
    const data = {
      ...raw,
      nameEn: raw.nameEn || undefined,
      email: raw.email || undefined,
      department: raw.department || undefined,
    }
    const employee = await db.$transaction(async (tx) => {
      if (propertyIds !== undefined) {
        await tx.employeeProperty.deleteMany({ where: { employeeId: id } })
        if (propertyIds.length > 0) {
          await tx.employeeProperty.createMany({
            data: propertyIds.map((pid: string) => ({ employeeId: id, propertyId: pid })),
          })
        }
      }
      return tx.employee.update({ where: { id }, data, include: { position: true } })
    })
    return NextResponse.json({ success: true, data: employee })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.employee.delete({ where: { id } })
    return NextResponse.json({ success: true, data: { id } })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
