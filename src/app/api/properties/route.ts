import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))
    const month = parseInt(searchParams.get('month') ?? String(new Date().getMonth() + 1))
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const active = searchParams.get('active')

    const where: Record<string, unknown> = {}
    if (type) where.type = type
    if (active !== null && active !== undefined) where.isActive = active === 'true'
    if (search) {
      where.OR = [
        { nameAr: { contains: search } },
        { nameEn: { contains: search } },
        { code: { contains: search } },
      ]
    }

    const properties = await db.property.findMany({
      where,
      include: {
        manager: { select: { id: true, nameAr: true } },
        annualTargets: { where: { year } },
        monthlyTargets: { where: { year, month } },
        collectionActuals: { where: { year } },
        agingReports: { where: { year, month } },
      },
      orderBy: { code: 'asc' },
    })

    const data = properties.map((p) => {
      const annualTarget = p.annualTargets[0]?.annualTarget ?? 0
      const monthlyTarget = p.monthlyTargets[0]?.target ?? 0
      const ytdActuals = p.collectionActuals.filter((a) => a.month <= month)
      const ytdCollected = ytdActuals.reduce((sum, a) => sum + a.collected, 0)
      const monthlyCollected = p.collectionActuals.find((a) => a.month === month)?.collected ?? 0
      const ytdTarget = p.monthlyTargets
        ? ytdActuals.length > 0
          ? ytdCollected
          : 0
        : 0
      const achievement = annualTarget > 0 ? (ytdCollected / annualTarget) * 100 : 0
      const aging = p.agingReports[0]
      const agingTotal = aging
        ? aging.bucket0to20 + aging.bucket21to60 + aging.bucket61to90 + aging.bucketOver90
        : 0

      return {
        id: p.id,
        code: p.code,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        type: p.type,
        location: p.location,
        totalUnits: p.totalUnits,
        managerId: p.managerId,
        manager: p.manager,
        occupancyRate: p.occupancyRate,
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        annualTarget,
        monthlyTarget,
        ytdCollected,
        monthlyCollected,
        achievement,
        agingTotal,
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const property = await db.property.create({ data: body })
    return NextResponse.json({ success: true, data: property }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
