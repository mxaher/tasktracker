'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/lib/store'
import { companyKpisApi } from '@/lib/api'
import type { CompanyKPI, CompanyKPIMonthly, CompanyKPICategory } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, Plus, Edit, Trash2, AlertCircle, TrendingUp, TrendingDown, Minus, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const CATEGORIES: Record<string, string> = {
  financial: 'مالي',
  strategic: 'استراتيجي',
  operational: 'تشغيلي',
  organizational: 'تنظيمي',
}

const CATEGORY_COLORS: Record<string, string> = {
  financial: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
  strategic: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300',
  operational: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300',
  organizational: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300',
}

const CATEGORY_BG: Record<string, string> = {
  financial: 'border-blue-200 bg-blue-50/30 dark:bg-blue-950/10',
  strategic: 'border-purple-200 bg-purple-50/30 dark:bg-purple-950/10',
  operational: 'border-orange-200 bg-orange-50/30 dark:bg-orange-950/10',
  organizational: 'border-green-200 bg-green-50/30 dark:bg-green-950/10',
}

const MONTHS_SHORT = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']

// Non-financial categories use a single percentage achievement — no monthly tracking
const NON_FINANCIAL_CATEGORIES = ['strategic', 'organizational', 'operational']

const emptyForm = { code: '', nameAr: '', nameEn: '', category: 'financial', weight: 0, target: 0 }

function getColor(pct: number) {
  if (pct >= 90) return { hex: '#16a34a', cls: 'text-green-600', bg: 'bg-green-500' }
  if (pct >= 70) return { hex: '#d97706', cls: 'text-yellow-600', bg: 'bg-yellow-500' }
  return { hex: '#dc2626', cls: 'text-red-600', bg: 'bg-red-500' }
}

/**
 * calcAchievement — Cumulative annual achievement.
 * Formula: achievement = (totalActual / annualTarget) × 100
 * Capped at 150% to prevent UI distortion from extreme outliers.
 */
function calcAchievement(totalActual: number, annualTarget: number): number {
  if (annualTarget <= 0) return 0
  return Math.min((totalActual / annualTarget) * 100, 150)
}

function MiniSparkline({ data, target }: { data: CompanyKPIMonthly[]; target: number }) {
  if (!data || data.length === 0) return null
  const sorted = [...data].sort((a, b) => a.month - b.month)
  const maxVal = Math.max(...sorted.map(d => d.actual), target > 0 ? target / 12 : 1)
  const width = 120
  const height = 32
  const points = sorted.map((d, i) => {
    const x = (i / Math.max(sorted.length - 1, 1)) * width
    const y = height - (d.actual / maxVal) * height
    return `${x},${y}`
  }).join(' ')
  const lastTwo = sorted.slice(-2)
  const trend = lastTwo.length === 2 ? lastTwo[1].actual - lastTwo[0].actual : 0
  return (
    <div className="flex items-center gap-2">
      <svg width={width} height={height} className="opacity-70">
        {points && <polyline fill="none" stroke="#6366f1" strokeWidth="1.5" points={points} />}
        {sorted.map((d, i) => {
          const x = (i / Math.max(sorted.length - 1, 1)) * width
          const y = height - (d.actual / maxVal) * height
          return <circle key={i} cx={x} cy={y} r="2" fill="#6366f1" />
        })}
      </svg>
      {trend > 0 ? <TrendingUp className="h-3 w-3 text-green-500" /> :
       trend < 0 ? <TrendingDown className="h-3 w-3 text-red-500" /> :
       <Minus className="h-3 w-3 text-muted-foreground" />}
    </div>
  )
}

/**
 * SingleAchievementInput — used for non-financial KPIs (strategic, org, operational).
 * These KPIs are percentage-based with a single year-end achievement value.
 * The user enters one number (0–100) representing the achieved percentage.
 * We store this value in month=0 (a sentinel slot) via the monthly upsert API.
 */
function SingleAchievementInput({ kpi, year }: { kpi: CompanyKPI; year: number }) {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState('')

  // Sentinel: we store the single achievement in month=0
  const storedEntry = kpi.monthlyData?.find((m: CompanyKPIMonthly) => m.month === 0)
  const achieved = storedEntry?.actual ?? 0
  const hasValue = achieved > 0

  const upsert = useMutation({
    mutationFn: (actual: number) =>
      companyKpisApi.monthly.upsert({ kpiId: kpi.id, year, month: 0, actual }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-kpis'] })
      setEditing(false)
    },
  })

  const { hex: color, bg: colorBg } = getColor(achieved)

  return (
    <div className="space-y-3">
      {/* Achievement bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">الهدف: <span className="font-medium text-foreground">100%</span></span>
            <span className="font-bold tabular-nums" style={{ color }}>{achieved.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${colorBg}`}
              style={{ width: `${Math.min(achieved, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Single value input */}
      <div className="border rounded-lg p-3 bg-muted/20">
        <p className="text-[10px] text-muted-foreground font-medium mb-2 uppercase tracking-wide">نسبة الإنجاز المحققة</p>
        {editing ? (
          <div className="flex items-center gap-2">
            <Input
              autoFocus
              type="number"
              min={0}
              max={100}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onBlur={() => {
                if (inputVal !== '') {
                  upsert.mutate(parseFloat(inputVal))
                } else {
                  setEditing(false)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                if (e.key === 'Escape') setEditing(false)
              }}
              className="h-8 text-sm w-32 text-center"
              placeholder="0 – 100"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        ) : (
          <button
            onClick={() => { setEditing(true); setInputVal(hasValue ? String(achieved) : '') }}
            className="flex items-center gap-2 group"
            title="انقر لتعديل نسبة الإنجاز"
          >
            {hasValue ? (
              <>
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color }} />
                <span className="text-2xl font-black tabular-nums" style={{ color }}>{achieved.toFixed(1)}%</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                انقر لإدخال نسبة الإنجاز
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

function KPICard({ kpi, year, onEdit, onDelete }: {
  kpi: CompanyKPI; year: number;
  onEdit: () => void; onDelete: () => void;
}) {
  const qc = useQueryClient()
  const [editingMonth, setEditingMonth] = useState<number | null>(null)
  const [monthValue, setMonthValue] = useState('')

  const isNonFinancial = NON_FINANCIAL_CATEGORIES.includes(kpi.category)

  const upsertMonthly = useMutation({
    mutationFn: ({ month, actual }: { month: number; actual: number }) =>
      companyKpisApi.monthly.upsert({ kpiId: kpi.id, year, month, actual }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-kpis'] })
      setEditingMonth(null)
    },
  })

  // For non-financial: achievement comes from the single sentinel entry (month=0)
  // For financial: cumulative sum of monthly actuals vs annual target
  let achievement: number
  let totalActual: number

  if (isNonFinancial) {
    const sentinelEntry = kpi.monthlyData?.find((m: CompanyKPIMonthly) => m.month === 0)
    achievement = sentinelEntry?.actual ?? 0
    totalActual = achievement
  } else {
    const enteredMonths = kpi.monthlyData?.filter(m => m.actual > 0 && m.month > 0) ?? []
    totalActual = enteredMonths.reduce((s, m) => s + m.actual, 0)
    achievement = calcAchievement(totalActual, kpi.target)
  }

  const { hex: color, bg: colorBg } = getColor(achievement)

  const getMonthActual = (month: number) =>
    kpi.monthlyData?.find((m: CompanyKPIMonthly) => m.month === month)?.actual ?? 0

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{kpi.code}</span>
              <Badge className={`text-xs border ${CATEGORY_COLORS[kpi.category]}`}>
                {CATEGORIES[kpi.category]}
              </Badge>
              <Badge variant="outline" className="text-xs">وزن {kpi.weight}%</Badge>
            </div>
            <CardTitle className="text-sm font-semibold leading-tight">{kpi.nameAr}</CardTitle>
            {kpi.nameEn && <p className="text-xs text-muted-foreground mt-0.5">{kpi.nameEn}</p>}
          </div>
          <div className="flex gap-0.5 shrink-0">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-3">
        {isNonFinancial ? (
          /* ── Non-financial KPI: single percentage achievement ── */
          <SingleAchievementInput kpi={kpi} year={year} />
        ) : (
          /* ── Financial KPI: monthly grid + cumulative progress ── */
          <>
            {/* Achievement row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    الفعلي: <span className="font-medium text-foreground">{totalActual.toLocaleString('ar-SA')}</span>
                    {' / '}
                    هدف: <span className="font-medium text-foreground">{kpi.target.toLocaleString('ar-SA')}</span>
                  </span>
                  <span className="font-bold tabular-nums" style={{ color }}>{achievement.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${colorBg}`}
                    style={{ width: `${Math.min(achievement, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sparkline */}
            {(kpi.monthlyData?.filter(m => m.month > 0).length ?? 0) > 1 && (
              <MiniSparkline
                data={(kpi.monthlyData ?? []).filter(m => m.month > 0)}
                target={kpi.target}
              />
            )}

            {/* Monthly grid — 2 rows × 6 cols */}
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-6 divide-x divide-y divide-border">
                {MONTHS_SHORT.map((m, i) => {
                  const month = i + 1
                  const actual = getMonthActual(month)
                  const isEditing = editingMonth === month
                  const hasValue = actual > 0
                  return (
                    <div key={month} className={`text-center p-1 ${hasValue ? 'bg-muted/30' : ''}`}>
                      <p className="text-[10px] text-muted-foreground font-medium">{m.slice(0, 3)}</p>
                      {isEditing ? (
                        <Input
                          autoFocus
                          type="number"
                          value={monthValue}
                          onChange={(e) => setMonthValue(e.target.value)}
                          onBlur={() => {
                            if (monthValue !== '') {
                              upsertMonthly.mutate({ month, actual: parseFloat(monthValue) })
                            } else {
                              setEditingMonth(null)
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                            if (e.key === 'Escape') { setEditingMonth(null) }
                          }}
                          className="h-6 text-[11px] text-center px-0.5 mt-0.5"
                        />
                      ) : (
                        <button
                          onClick={() => { setEditingMonth(month); setMonthValue(actual > 0 ? String(actual) : '') }}
                          className={`w-full text-[11px] py-0.5 rounded hover:bg-primary/10 transition-colors tabular-nums ${
                            hasValue ? 'font-semibold text-foreground' : 'text-muted-foreground/50'
                          }`}
                          title="انقر للتعديل"
                        >
                          {hasValue ? actual.toLocaleString('ar-SA', { notation: 'compact', maximumFractionDigits: 1 }) : '—'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function CompanyKpisSection() {
  const { selectedYear } = useAppStore()
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingKpi, setEditingKpi] = useState<CompanyKPI | null>(null)
  const [form, setForm] = useState<typeof emptyForm>(emptyForm)
  const qc = useQueryClient()
  const { toast } = useToast()

  const { data: kpis = [], isLoading, error } = useQuery({
    queryKey: ['company-kpis', selectedYear],
    queryFn: async () => {
      const res = await companyKpisApi.list({ year: selectedYear })
      if (!res.success) throw new Error('Failed to fetch KPIs')
      return res.data
    },
  })

  const saveMutation = useMutation({
    mutationFn: (data: typeof emptyForm) => {
      const typed = { ...data, category: data.category as CompanyKPICategory, year: selectedYear }
      return editingKpi
        ? companyKpisApi.update(editingKpi.id, typed)
        : companyKpisApi.create(typed)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-kpis'] })
      setShowForm(false)
      setEditingKpi(null)
      setForm(emptyForm)
      toast({ title: editingKpi ? 'تم تحديث المؤشر' : 'تم إنشاء المؤشر' })
    },
    onError: (e) => toast({ title: 'خطأ', description: String(e), variant: 'destructive' }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => companyKpisApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-kpis'] })
      toast({ title: 'تم حذف المؤشر' })
    },
  })

  const filtered = categoryFilter === 'all' ? kpis : kpis.filter((k: CompanyKPI) => k.category === categoryFilter)

  // Overall weighted achievement
  const kpisWithData = kpis.filter((k: CompanyKPI) => {
    if (NON_FINANCIAL_CATEGORIES.includes(k.category)) {
      return (k.monthlyData?.some((m: CompanyKPIMonthly) => m.month === 0 && m.actual > 0))
    }
    return k.monthlyData?.some((m: CompanyKPIMonthly) => m.actual > 0 && m.month > 0)
  })

  const totalWeight = kpis.reduce((s: number, k: CompanyKPI) => s + k.weight, 0)
  const weightOk = Math.abs(totalWeight - 100) < 0.1

  const overallAchievement = kpis.reduce((acc: number, kpi: CompanyKPI) => {
    let ach: number
    if (NON_FINANCIAL_CATEGORIES.includes(kpi.category)) {
      const sentinelEntry = kpi.monthlyData?.find((m: CompanyKPIMonthly) => m.month === 0)
      ach = sentinelEntry?.actual ?? 0
    } else {
      const entered = kpi.monthlyData?.filter((m: CompanyKPIMonthly) => m.actual > 0 && m.month > 0) ?? []
      const totalActual = entered.reduce((s: number, m: CompanyKPIMonthly) => s + m.actual, 0)
      ach = calcAchievement(totalActual, kpi.target)
    }
    return acc + (ach * (kpi.weight / 100))
  }, 0)
  const { hex: overallColor, bg: overallBg } = getColor(overallAchievement)

  // Group by category for summary
  const categoryStats = Object.keys(CATEGORIES).map(cat => {
    const catKpis = kpis.filter((k: CompanyKPI) => k.category === cat)
    if (!catKpis.length) return null
    const catAch = catKpis.reduce((acc: number, kpi: CompanyKPI) => {
      let ach: number
      if (NON_FINANCIAL_CATEGORIES.includes(kpi.category)) {
        const sentinelEntry = kpi.monthlyData?.find((m: CompanyKPIMonthly) => m.month === 0)
        ach = sentinelEntry?.actual ?? 0
      } else {
        const entered = kpi.monthlyData?.filter((m: CompanyKPIMonthly) => m.actual > 0 && m.month > 0) ?? []
        const totalActual = entered.reduce((s: number, m: CompanyKPIMonthly) => s + m.actual, 0)
        ach = calcAchievement(totalActual, kpi.target)
      }
      return acc + ach
    }, 0) / catKpis.length
    return { cat, label: CATEGORIES[cat], count: catKpis.length, ach: catAch }
  }).filter(Boolean)

  const openEdit = (kpi: CompanyKPI) => {
    setEditingKpi(kpi)
    setForm({ code: kpi.code, nameAr: kpi.nameAr, nameEn: kpi.nameEn ?? '', category: kpi.category, weight: kpi.weight, target: kpi.target })
    setShowForm(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" /> مؤشرات أداء الشركة
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">سنة {selectedYear} — {kpis.length} مؤشر</p>
        </div>
        <Button onClick={() => { setEditingKpi(null); setForm(emptyForm); setShowForm(true) }} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> إضافة مؤشر
        </Button>
      </div>

      {/* Overall achievement banner */}
      {kpis.length > 0 && (
        <Card className="border-2" style={{ borderColor: overallColor + '40' }}>
          <CardContent className="pt-5 pb-5">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">الإنجاز الكلي المرجح</p>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black tabular-nums" style={{ color: overallColor }}>
                    {overallAchievement.toFixed(1)}%
                  </span>
                  {kpisWithData.length < kpis.length && (
                    <span className="text-xs text-muted-foreground mb-1">
                      ({kpisWithData.length} من {kpis.length} مؤشرات بيانات)
                    </span>
                  )}
                </div>
                <div className="h-3 w-64 bg-muted rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${overallBg}`}
                    style={{ width: `${Math.min(overallAchievement, 100)}%` }}
                  />
                </div>
              </div>
              {/* Category mini-stats */}
              <div className="flex flex-wrap gap-3">
                {categoryStats.map(s => s && (
                  <div key={s.cat} className={`rounded-lg border px-3 py-2 text-center min-w-[80px] ${CATEGORY_BG[s.cat]}`}>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-lg font-bold" style={{ color: getColor(s.ach).hex }}>{s.ach.toFixed(0)}%</p>
                    <p className="text-[10px] text-muted-foreground">{s.count} مؤشر</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weight warning */}
      {kpis.length > 0 && !weightOk && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>مجموع الأوزان = <strong>{totalWeight.toFixed(1)}%</strong> — يجب أن يكون 100% لحساب صحيح</span>
        </div>
      )}

      {/* Category filter tabs */}
      <div className="flex gap-2 flex-wrap border-b pb-3">
        {[['all', 'الكل', kpis.length], ...Object.entries(CATEGORIES).map(([v, l]) => [v, l, kpis.filter((k: CompanyKPI) => k.category === v).length])]
          .map(([v, l, count]) => (
          <button
            key={v}
            onClick={() => setCategoryFilter(String(v))}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              categoryFilter === v
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {l} <span className="text-xs opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {/* KPI Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-destructive font-medium">فشل تحميل المؤشرات</p>
          <p className="text-sm text-muted-foreground">{String(error)}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <BarChart3 className="h-10 w-10 opacity-30" />
          <p className="text-sm">{kpis.length === 0 ? 'لا توجد مؤشرات بعد، أضف مؤشرك الأول' : 'لا توجد مؤشرات في هذه الفئة'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((kpi: CompanyKPI) => (
            <KPICard
              key={kpi.id}
              kpi={kpi}
              year={selectedYear}
              onEdit={() => openEdit(kpi)}
              onDelete={() => { if (confirm('هل تريد حذف هذا المؤشر؟')) deleteMutation.mutate(kpi.id) }}
            />
          ))}
        </div>
      )}

      {/* Form dialog */}
      <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setEditingKpi(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingKpi ? 'تعديل مؤشر' : 'إضافة مؤشر جديد'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1">
              <Label className="text-xs">رمز المؤشر</Label>
              <Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} className="h-8 text-sm" placeholder="KPI-01" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">الفئة</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIES).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">الاسم بالعربي</Label>
              <Input value={form.nameAr} onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))} className="h-8 text-sm" />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">الاسم بالإنجليزي (اختياري)</Label>
              <Input value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">الوزن (%)</Label>
              <Input type="number" min={0} max={100} value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: parseFloat(e.target.value) || 0 }))} className="h-8 text-sm" />
            </div>
            {/* Target field only shown for financial KPIs — non-financial always target 100% */}
            {!NON_FINANCIAL_CATEGORIES.includes(form.category) && (
              <div className="space-y-1">
                <Label className="text-xs">الهدف السنوي</Label>
                <Input type="number" min={0} value={form.target} onChange={(e) => setForm((p) => ({ ...p, target: parseFloat(e.target.value) || 0 }))} className="h-8 text-sm" />
              </div>
            )}
            {NON_FINANCIAL_CATEGORIES.includes(form.category) && (
              <div className="space-y-1 flex items-end">
                <p className="text-xs text-muted-foreground pb-1">الهدف: 100% (نسبة مئوية)</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>إلغاء</Button>
            <Button
              onClick={() => saveMutation.mutate(form)}
              disabled={saveMutation.isPending || !form.nameAr || !form.code}
            >
              {saveMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
