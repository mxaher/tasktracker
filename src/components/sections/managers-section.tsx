'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/lib/store'
import { managersApi } from '@/lib/api'
import type { ManagerMetrics } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserCheck, ChevronDown, ChevronUp } from 'lucide-react'

function AchievementRing({ value }: { value: number }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const pct = Math.min(Math.max(value, 0), 100)
  const offset = circ - (pct / 100) * circ
  const color = pct >= 90 ? '#34C759' : pct >= 70 ? '#FF9500' : '#FF3B30'
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" className="shrink-0">
      <circle cx="34" cy="34" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
      <circle
        cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 34 34)"
      />
      <text x="34" y="38" textAnchor="middle" fontSize="13" fontWeight="bold" fill={color}>
        {pct.toFixed(0)}%
      </text>
    </svg>
  )
}

function ManagerCard({ mgr }: { mgr: ManagerMetrics }) {
  const [expanded, setExpanded] = useState(false)
  const fmt = (n: number) => new Intl.NumberFormat('ar-SA', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

  return (
    <Card className="card-strategy-hover">
      <CardContent className="pt-4">
        <div className="flex items-start gap-4">
          <AchievementRing value={mgr.achievement} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold">{mgr.employee.nameAr}</p>
            {mgr.employee.position && (
              <p className="text-xs text-muted-foreground">{mgr.employee.position.nameAr}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-2 text-xs">
              <span className="text-muted-foreground">
                العقارات: <span className="text-foreground font-medium">{mgr.propertiesCount}</span>
              </span>
              <span className="text-muted-foreground">
                الهدف: <span className="text-foreground font-medium">{fmt(mgr.totalTarget)}</span>
              </span>
              <span className="text-muted-foreground">
                المحصل: <span className="text-green-600 font-medium">{fmt(mgr.totalCollected)}</span>
              </span>
            </div>
          </div>
        </div>

        {mgr.propertyBreakdown.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 h-7 text-xs gap-1"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? 'إخفاء التفاصيل' : 'عرض العقارات'}
          </Button>
        )}

        {expanded && (
          <div className="mt-3 border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-start px-3 py-2">العقار</th>
                  <th className="text-end px-3 py-2">الهدف</th>
                  <th className="text-end px-3 py-2">المحصل</th>
                  <th className="text-end px-3 py-2">%</th>
                </tr>
              </thead>
              <tbody>
                {mgr.propertyBreakdown.map((pb) => (
                  <tr key={pb.propertyId} className="border-t">
                    <td className="px-3 py-2 font-medium">{pb.propertyName}</td>
                    <td className="px-3 py-2 text-end">{fmt(pb.target)}</td>
                    <td className="px-3 py-2 text-end text-green-600">{fmt(pb.collected)}</td>
                    <td className="px-3 py-2 text-end">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${pb.achievement >= 90 ? 'text-green-600' : pb.achievement >= 70 ? 'text-yellow-600' : 'text-red-600'}`}
                      >
                        {pb.achievement.toFixed(0)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function ManagersSection() {
  const { selectedYear, selectedMonth } = useAppStore()
  const [ytd, setYtd] = useState(false)

  const { data: managers = [], isLoading } = useQuery({
    queryKey: ['managers', selectedYear, selectedMonth, ytd],
    queryFn: async () => {
      const res = await managersApi.metrics({ year: selectedYear, month: selectedMonth, ytd })
      return res.success ? res.data : []
    },
  })

  const topPerformer = managers.length
    ? managers.reduce((best: ManagerMetrics, m: ManagerMetrics) => m.achievement > best.achievement ? m : best, managers[0])
    : null

  const totalTarget = managers.reduce((s: number, m: ManagerMetrics) => s + m.totalTarget, 0)
  const totalCollected = managers.reduce((s: number, m: ManagerMetrics) => s + m.totalCollected, 0)
  const fmt = (n: number) => new Intl.NumberFormat('ar-SA', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCheck className="h-6 w-6" /> أداء المديرين
        </h1>
        <div className="flex gap-2">
          <Button variant={ytd ? 'default' : 'outline'} size="sm" onClick={() => setYtd(true)}>منذ بداية السنة</Button>
          <Button variant={!ytd ? 'default' : 'outline'} size="sm" onClick={() => setYtd(false)}>الشهر الحالي</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'عدد المديرين', value: managers.length },
          { label: 'إجمالي الهدف', value: fmt(totalTarget) },
          { label: 'إجمالي المحصل', value: fmt(totalCollected) },
          { label: 'أفضل أداء', value: topPerformer?.employee.nameAr ?? '—' },
        ].map((s) => (
          <Card key={s.label} className="card-strategy-hover">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="font-bold truncate">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-12">جارٍ التحميل...</p>
      ) : managers.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">لا توجد بيانات للمديرين</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {managers.map((mgr: ManagerMetrics) => (
            <ManagerCard key={mgr.employee.id} mgr={mgr} />
          ))}
        </div>
      )}
    </div>
  )
}
