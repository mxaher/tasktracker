import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { routeErrorResponse } from '@/lib/api-error'



export const dynamic = 'force-dynamic'
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const department = searchParams.get('department')
    const active = searchParams.get('active')

    const where: Record<string, unknown> = {}
    if (department) where.department = department
    if (active !== null) where.isActive = active !== 'false'

    const employees = await db.employee.findMany({
      where,
      include: {
        position: true,
        managedBy: { select: { id: true, nameAr: true } },
        properties: { include: { property: { select: { id: true, code: true, nameAr: true } } } },
      },
      orderBy: { nameAr: 'asc' },
    })
    return NextResponse.json({ success: true, data: employees })
  } catch (e) {
    return routeErrorResponse('/api/employees GET', e, { body: { success: false } })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { propertyIds, ...raw } = await req.json()
    const data = {
      ...raw,
      nameEn: raw.nameEn || undefined,
      email: raw.email || undefined,
      department: raw.department || undefined,
    }
    const employee = await db.employee.create({
      data: {
        ...data,
        properties: propertyIds?.length
          ? { create: propertyIds.map((pid: string) => ({ propertyId: pid })) }
          : undefined,
      },
      include: { position: true },
    })
    return NextResponse.json({ success: true, data: employee }, { status: 201 })
  } catch (e) {
    return routeErrorResponse('/api/employees POST', e, { body: { success: false } })
  }
}
