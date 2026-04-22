import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))
    const month = parseInt(searchParams.get('month') ?? String(new Date().getMonth() + 1))
    const ytd = searchParams.get('ytd') === 'true'

    const managers = await db.employee.findMany({
      where: { managedProperties: { some: {} }, isActive: true },
      include: {
        position: true,
        managedProperties: {
          include: {
            monthlyTargets: { where: { year, month: ytd ? undefined : month } },
            collectionActuals: { where: { year, month: ytd ? undefined : month } },
          },
        },
      },
    })

    const data = managers.map((mgr) => {
      const propertyBreakdown = mgr.managedProperties.map((prop) => {
        const targets = prop.monthlyTargets
        const actuals = prop.collectionActuals

        const target = ytd
          ? targets.filter((t) => t.month <= month).reduce((s, t) => s + t.target, 0)
          : (targets.find((t) => t.month === month)?.target ?? 0)

        const collected = ytd
          ? actuals.filter((a) => a.month <= month).reduce((s, a) => s + a.collected, 0)
          : (actuals.find((a) => a.month === month)?.collected ?? 0)

        return {
          propertyId: prop.id,
          propertyCode: prop.code,
          propertyName: prop.nameAr,
          target,
          collected,
          achievement: target > 0 ? (collected / target) * 100 : 0,
        }
      })

      const totalTarget = propertyBreakdown.reduce((s, p) => s + p.target, 0)
      const totalCollected = propertyBreakdown.reduce((s, p) => s + p.collected, 0)

      return {
        employee: {
          id: mgr.id,
          nameAr: mgr.nameAr,
          nameEn: mgr.nameEn,
          department: mgr.department,
          position: mgr.position,
        },
        propertiesCount: mgr.managedProperties.length,
        totalTarget,
        totalCollected,
        achievement: totalTarget > 0 ? (totalCollected / totalTarget) * 100 : 0,
        propertyBreakdown,
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
