'use client'

import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckSquare, Clock, AlertTriangle, Building2, TrendingUp, Percent,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const MONTHS_SHORT = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']

function StatCard({
  title, value, subtitle, icon: Icon, color,
}: { title: string; value: string | number; subtitle?: string; icon: React.ElementType; color: string }) {
  return (
    <Card className="card-strategy-hover animate-fade-in-up">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardSection() {
  const { selectedYear, selectedMonth } = useAppStore()

  const { data: taskStats } = useQuery({
    queryKey: ['task-stats'],
    queryFn: async () => {
      const res = await fetch('/api/tasks/stats')
      const json = await res.json()
      return json.data
    },
  })

  const { data: properties } = useQuery({
    queryKey: ['properties-dashboard', selectedYear, selectedMonth],
    queryFn: async () => {
      const res = await fetch(`/api/properties?year=${selectedYear}&month=${selectedMonth}`)
      const json = await res.json()
      return json.success ? json.data : []
    },
  })

  const { data: recentAlerts } = useQuery({
    queryKey: ['alerts-recent-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/alerts?resolved=false')
      const json = await res.json()
      return json.success ? json.data?.slice(0, 5) : []
    },
  })

  const avgAchievement = properties?.length
    ? properties.reduce((s: number, p: { achievement?: number }) => s + (p.achievement ?? 0), 0) / properties.length
    : 0

  const avgOccupancy = properties?.length
    ? properties.reduce((s: number, p: { occupancyRate?: number }) => s + (p.occupancyRate ?? 0), 0) / properties.length
    : 0

  // Build monthly revenue chart data from properties
  const chartData = MONTHS_SHORT.map((month, i) => {
    const m = i + 1
    const target = properties?.reduce((s: number, p: { monthlyTarget?: number }) => s + (p.monthlyTarget ?? 0), 0) ?? 0
    return { month, target: m === selectedMonth ? target : 0, actual: 0 }
  })

  const severityColor: Record<string, string> = {
    critical: 'text-destructive',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {MONTHS_SHORT[selectedMonth - 1]} {selectedYear}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="إجمالي المهام"
          value={taskStats?.total ?? 0}
          icon={CheckSquare}
          color="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
        />
        <StatCard
          title="مكتملة"
          value={taskStats?.completed ?? 0}
          icon={CheckSquare}
          color="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
        />
        <StatCard
          title="قيد التنفيذ"
          value={taskStats?.in_progress ?? 0}
          icon={Clock}
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
        />
        <StatCard
          title="متأخرة"
          value={taskStats?.delayed ?? 0}
          icon={AlertTriangle}
          color="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
        />
        <StatCard
          title="متوسط الإنجاز"
          value={`${avgAchievement.toFixed(1)}%`}
          subtitle="العقارات"
          icon={TrendingUp}
          color="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
        />
        <StatCard
          title="متوسط الإشغال"
          value={`${avgOccupancy.toFixed(1)}%`}
          subtitle="العقارات"
          icon={Percent}
          color="bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">الإيرادات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="target" name="الهدف" fill="#6366f1" radius={[3, 3, 0, 0]} />
                <Bar dataKey="actual" name="الفعلي" fill="#22c55e" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">أحدث التنبيهات</CardTitle>
          </CardHeader>
          <CardContent>
            {!recentAlerts?.length ? (
              <p className="text-muted-foreground text-sm text-center py-8">لا توجد تنبيهات</p>
            ) : (
              <div className="space-y-3">
                {recentAlerts.map((alert: { id: string; severity: string; titleAr?: string; title: string; message: string }) => (
                  <div key={alert.id} className="flex items-start gap-3 text-sm">
                    <span className={`font-bold shrink-0 ${severityColor[alert.severity] ?? ''}`}>
                      {alert.severity === 'critical' ? '🔴' : alert.severity === 'warning' ? '🟡' : '🔵'}
                    </span>
                    <div>
                      <p className="font-medium">{alert.titleAr ?? alert.title}</p>
                      <p className="text-muted-foreground text-xs line-clamp-1">{alert.message}</p>
                    </div>
                    <Badge
                      variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                      className="shrink-0 text-xs"
                    >
                      {alert.severity === 'critical' ? 'حرج' : alert.severity === 'warning' ? 'تحذير' : 'معلومة'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Properties summary */}
      {properties?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              ملخص العقارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">إجمالي العقارات</p>
                <p className="text-xl font-bold">{properties.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">إجمالي الهدف السنوي</p>
                <p className="text-xl font-bold">
                  {(properties.reduce((s: number, p: { annualTarget?: number }) => s + (p.annualTarget ?? 0), 0) / 1_000_000).toFixed(1)}م
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">إجمالي المحصل</p>
                <p className="text-xl font-bold text-green-600">
                  {(properties.reduce((s: number, p: { ytdCollected?: number }) => s + (p.ytdCollected ?? 0), 0) / 1_000_000).toFixed(1)}م
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">متوسط نسبة الإنجاز</p>
                <p className={`text-xl font-bold ${avgAchievement >= 90 ? 'text-green-600' : avgAchievement >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {avgAchievement.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
