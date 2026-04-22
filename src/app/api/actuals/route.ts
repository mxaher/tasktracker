import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const propertyId = searchParams.get('propertyId')
    const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))

    if (!propertyId) return NextResponse.json({ success: false, error: 'propertyId required' }, { status: 400 })

    const actuals = await db.propertyCollectionActual.findMany({
      where: { propertyId, year },
      orderBy: { month: 'asc' },
    })
    return NextResponse.json({ success: true, data: actuals })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { propertyId, year, month, collected, invoiced } = await req.json()
    const record = await db.propertyCollectionActual.upsert({
      where: { propertyId_year_month: { propertyId, year, month } },
      create: { propertyId, year, month, collected, invoiced: invoiced ?? 0 },
      update: { collected, invoiced: invoiced ?? 0 },
    })
    return NextResponse.json({ success: true, data: record })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
