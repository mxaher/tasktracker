import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()))
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined

    const employees = await db.employee.findMany({
      where: { isActive: true },
      include: {
        position: true,
        kpiTargets: {
          where: { year },
          include: { kpi: true },
        },
        kpiActuals: {
          where: { year, ...(month ? { month } : {}) },
        },
        customKpis: { where: { year } },
      },
      orderBy: { nameAr: 'asc' },
    })

    const data = employees.map((emp) => {
      const computeAchievement = (category: string) => {
        const targets = emp.kpiTargets.filter((t) => t.kpi.category === category)
        const totalWeight = targets.reduce((s, t) => s + t.weight, 0)
        if (totalWeight === 0) return 0

        let weightedScore = 0
        for (const t of targets) {
          const actuals = emp.kpiActuals.filter((a) => a.kpiId === t.kpiId)
          const actual = actuals.reduce((s, a) => s + a.actual, 0)
          const achievement = t.target > 0 ? (actual / t.target) * 100 : 0
          weightedScore += achievement * (t.weight / totalWeight)
        }
        return weightedScore
      }

      const financialAchievement = computeAchievement('financial')
      const orgAchievement = computeAchievement('organizational')
      const overallAchievement = financialAchievement * 0.6 + orgAchievement * 0.4

      return {
        id: emp.id,
        nameAr: emp.nameAr,
        nameEn: emp.nameEn,
        department: emp.department,
        position: emp.position,
        financialAchievement,
        orgAchievement,
        overallAchievement,
      }
    })

    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
