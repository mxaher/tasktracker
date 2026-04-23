import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { routeErrorResponse } from '@/lib/api-error'



export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const company = await db.company.findFirst()
    return NextResponse.json({ success: true, data: company ?? null })
  } catch (e) {
    return routeErrorResponse('/api/company GET', e, { body: { success: false } })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const existing = await db.company.findFirst()
    const company = existing
      ? await db.company.update({ where: { id: existing.id }, data: body })
      : await db.company.create({ data: body })
    return NextResponse.json({ success: true, data: company })
  } catch (e) {
    return routeErrorResponse('/api/company PUT', e, { body: { success: false } })
  }
}
