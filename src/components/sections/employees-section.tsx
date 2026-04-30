'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/lib/store'
import { employeesApi, kpiApi } from '@/lib/api'
import type { Employee } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Users, Search, Plus, Edit, Trash2,
  ChevronDown, ChevronRight, TrendingUp,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

/* ─────────────────────────── constants ─────────────────────────── */

// Same 4 categories as company KPIs
const CATEGORIES: Record<string, string> = {
  financial:      'مالي',
  strategic:      'استراتيجي',
  operational:    'تشغيلي',
  organizational: 'تنظيمي',
}

const CATEGORY_COLORS: Record<string, string> = {
  financial:      'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
  strategic:      'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300',
  operational:    'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300',
  organizational: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300',
}

const CATEGORY_STRIP: Record<string, string> = {
  financial:      'border-blue-400',
  strategic:      'border-purple-400',
  operational:    'border-orange-400',
  organizational: 'border-green-400',
}

/* ─────────────────────────── types ─────────────────────────── */

interface KPITargetRow {
  id: string
  kpi: { id: string; nameAr: string; category: string }
  target: number
  weight: number
}
interface KpiActualRow {
  id: string
  kpiId: string
  actual: number
  year: number
  month?: number
}
interface CustomKpiRow {
  id: string
  nameAr: string
  category: string
  target: number
  actual: number
  weight: number
}
interface EmployeeDetail extends Omit<Employee, 'properties'> {
  email?: string
  kpiTargets?: KPITargetRow[]
  kpiActuals?: KpiActualRow[]
  customKpis?: CustomKpiRow[]
  properties?: Array<{ propertyId: string; property?: { nameAr: string } }>
}

/* ─────────────────────────── helpers ─────────────────────────── */

function achColor(pct: number) {
  if (pct >= 90) return { text: 'text-green-600', bg: 'bg-green-500', badge: 'text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20' }
  if (pct >= 70) return { text: 'text-yellow-600', bg: 'bg-yellow-500', badge: 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20' }
  return { text: 'text-red-600', bg: 'bg-red-500', badge: 'text-red-600 border-red-200 bg-red-50 dark:bg-red-950/20' }
}

function AchBar({ value, label }: { value: number; label?: string }) {
  const { text, bg } = achColor(value)
  return (
    <div className="space-y-0.5">
      {label && (
        <div className="flex justify-between text-[11px]">
          <span className="text-muted-foreground truncate pe-2">{label}</span>
          <span className={`font-bold tabular-nums shrink-0 ${text}`}>{value.toFixed(1)}%</span>
        </div>
      )}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${bg}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  )
}

/* ─────────────────────────── EmployeeKpiPanel ─────────────────────────── */

function EmployeeKpiPanel({ employeeId, year }: { employeeId: string; year: number }) {
  const { data: detail, isLoading } = useQuery<EmployeeDetail | null>({
    queryKey: ['employee-detail', employeeId],
    queryFn: async () => {
      const res = await employeesApi.get(employeeId)
      return res.success ? (res.data as unknown as EmployeeDetail) : null
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-5 px-8 text-sm text-muted-foreground bg-muted/10 border-t">
        <div className="h-4 w-4 rounded-full bg-muted animate-pulse" />
        جارٍ تحميل المؤشرات...
      </div>
    )
  }

  // Build a flat list of all KPIs with their achievement
  type KpiRow = { id: string; nameAr: string; category: string; ach: number; target: number; actual: number; weight: number; isCustom?: boolean }
  const allKpis: KpiRow[] = []

  detail?.kpiTargets?.forEach(t => {
    const actuals = detail.kpiActuals?.filter(a => a.kpiId === t.kpi.id) ?? []
    const totalActual = actuals.reduce((s, a) => s + a.actual, 0)
    const ach = t.target > 0 ? Math.min((totalActual / t.target) * 100, 150) : 0
    allKpis.push({ id: t.id, nameAr: t.kpi.nameAr, category: t.kpi.category, ach, target: t.target, actual: totalActual, weight: t.weight })
  })

  detail?.customKpis?.forEach(ck => {
    const ach = ck.target > 0 ? Math.min((ck.actual / ck.target) * 100, 150) : 0
    allKpis.push({ id: ck.id, nameAr: ck.nameAr, category: ck.category, ach, target: ck.target, actual: ck.actual, weight: ck.weight, isCustom: true })
  })

  if (!allKpis.length) {
    return (
      <div className="py-6 px-8 text-center text-sm text-muted-foreground bg-muted/10 border-t">
        لا توجد مؤشرات مسندة لهذا الموظف
      </div>
    )
  }

  // Group by category — only show categories that have KPIs
  const groups = Object.entries(CATEGORIES)
    .map(([cat, label]) => {
      const kpis = allKpis.filter(k => k.category === cat)
      if (!kpis.length) return null
      const totalW = kpis.reduce((s, k) => s + k.weight, 0) || 1
      const catAch = kpis.reduce((s, k) => s + (k.ach * (k.weight / totalW)), 0)
      return { cat, label, kpis, catAch }
    })
    .filter(Boolean) as { cat: string; label: string; kpis: KpiRow[]; catAch: number }[]

  return (
    <div className="bg-muted/10 border-t px-6 py-5">
      <div className={`grid gap-4 ${groups.length === 1 ? 'grid-cols-1 max-w-sm' : groups.length === 2 ? 'grid-cols-1 md:grid-cols-2' : groups.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        {groups.map(g => (
          <div key={g.cat} className={`rounded-xl border-s-4 border bg-background shadow-sm p-4 space-y-3 ${CATEGORY_STRIP[g.cat]}`}>
            {/* Category header */}
            <div className="flex items-center justify-between">
              <Badge className={`text-xs border ${CATEGORY_COLORS[g.cat]}`}>{g.label}</Badge>
              <span className={`text-sm font-bold tabular-nums ${achColor(g.catAch).text}`}>{g.catAch.toFixed(1)}%</span>
            </div>
            {/* KPI rows */}
            <div className="space-y-3">
              {g.kpis.map(k => (
                <div key={k.id} className="space-y-1 pt-1 border-t first:border-t-0 first:pt-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium flex-1 truncate">{k.nameAr}</span>
                    {k.isCustom && <span className="text-[9px] text-orange-500 bg-orange-50 border border-orange-200 rounded px-1 shrink-0">خاص</span>}
                  </div>
                  <AchBar value={k.ach} />
                  <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
                    <span>هدف: {k.target.toLocaleString()}</span>
                    <span>فعلي: {k.actual.toLocaleString()}</span>
                    <span>وزن: {k.weight}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────── EditEmployeeDialog ─────────────────────────── */

function EditEmployeeDialog({
  employee,
  year,
  onClose,
}: {
  employee: Employee
  year: number
  onClose: () => void
}) {
  const qc = useQueryClient()
  const { toast } = useToast()
  const [section, setSection] = useState<'details' | 'kpis'>('details')

  const [form, setForm] = useState({
    nameAr:     employee.nameAr     ?? '',
    nameEn:     employee.nameEn     ?? '',
    email:      '',
    department: employee.department ?? '',
  })

  // Fetch detail
  const { data: detail, isLoading: detailLoading } = useQuery<EmployeeDetail | null>({
    queryKey: ['employee-detail', employee.id],
    queryFn: async () => {
      const res = await employeesApi.get(employee.id)
      return res.success ? (res.data as unknown as EmployeeDetail) : null
    },
  })

  // Sync email from detail once loaded
  useEffect(() => {
    if (detail?.email) setForm(f => ({ ...f, email: detail.email ?? '' }))
  }, [detail?.email])

  // All shared KPIs list
  const { data: allKpis = [] } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const res = await kpiApi.list()
      return res.success ? res.data : []
    },
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['employee-detail', employee.id] })
    qc.invalidateQueries({ queryKey: ['employees-kpis'] })
  }

  // Save details
  const saveMutation = useMutation({
    mutationFn: () => employeesApi.update(employee.id, form),
    onSuccess: () => { invalidate(); toast({ title: 'تم حفظ بيانات الموظف' }) },
    onError: (e) => toast({ title: 'خطأ', description: String(e), variant: 'destructive' }),
  })

  // KPI target assign
  const [newTarget, setNewTarget] = useState({ kpiId: '', target: 0, weight: 0 })
  const [showAddTarget, setShowAddTarget] = useState(false)

  const upsertTargetMutation = useMutation({
    mutationFn: () => kpiApi.targets.upsert({ ...newTarget, employeeId: employee.id, year }),
    onSuccess: () => {
      invalidate()
      setShowAddTarget(false)
      setNewTarget({ kpiId: '', target: 0, weight: 0 })
      toast({ title: 'تم إسناد المؤشر' })
    },
    onError: (e) => toast({ title: 'خطأ', description: String(e), variant: 'destructive' }),
  })

  const deleteTargetMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/kpi-targets/${id}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => { invalidate(); toast({ title: 'تم الحذف' }) },
  })

  // Custom KPI
  const [newCustom, setNewCustom] = useState({ nameAr: '', category: 'financial', target: 0, actual: 0, weight: 0 })
  const [showAddCustom, setShowAddCustom] = useState(false)

  const addCustomMutation = useMutation({
    mutationFn: () => employeesApi.customKpis.create({ ...newCustom, employeeId: employee.id, year }),
    onSuccess: () => {
      invalidate()
      setShowAddCustom(false)
      setNewCustom({ nameAr: '', category: 'financial', target: 0, actual: 0, weight: 0 })
      toast({ title: 'تم إضافة المؤشر الخاص' })
    },
    onError: (e) => toast({ title: 'خطأ', description: String(e), variant: 'destructive' }),
  })

  const deleteCustomMutation = useMutation({
    mutationFn: (id: string) => employeesApi.customKpis.delete(id),
    onSuccess: () => { invalidate(); toast({ title: 'تم الحذف' }) },
  })

  const targets    = detail?.kpiTargets  ?? []
  const customKpis = detail?.customKpis  ?? []
  const totalWeight = [...targets.map(t => t.weight), ...customKpis.map(k => k.weight)].reduce((s, w) => s + w, 0)
  const weightOk = Math.abs(totalWeight - 100) < 0.1

  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* ── Header ── */}
        <DialogHeader className="pb-0">
          <DialogTitle className="text-base font-bold">{employee.nameAr}</DialogTitle>
          {employee.position && <p className="text-xs text-muted-foreground mt-0.5">{employee.position.nameAr}</p>}
        </DialogHeader>

        {/* ── Section Switcher ── */}
        <div className="flex border rounded-lg p-1 gap-1 bg-muted/40 mt-2">
          {([
            ['details', 'بيانات الموظف'],
            ['kpis', `المؤشرات (${targets.length + customKpis.length})`],
          ] as [typeof section, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`flex-1 text-sm py-1.5 rounded-md transition-all font-medium ${
                section === key
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ══════════════ SECTION: Employee Details ══════════════ */}
        {section === 'details' && (
          <div className="space-y-5 pt-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">الاسم بالعربي <span className="text-destructive">*</span></Label>
                <Input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">الاسم بالإنجليزي</Label>
                <Input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">البريد الإلكتروني</Label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">الإدارة / القسم</Label>
                <Input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className="h-9" />
              </div>
            </div>

            {/* Properties */}
            {(detail?.properties?.length ?? 0) > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">العقارات المسندة</p>
                <div className="flex flex-wrap gap-2">
                  {(detail?.properties ?? []).map(ep => (
                    <Badge key={ep.propertyId} variant="secondary" className="text-xs">{ep.property?.nameAr}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end border-t pt-4">
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.nameAr} className="gap-2">
                {saveMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
              </Button>
            </div>
          </div>
        )}

        {/* ══════════════ SECTION: KPIs ══════════════ */}
        {section === 'kpis' && (
          <div className="space-y-6 pt-1">

            {/* Weight indicator */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border ${
              totalWeight === 0   ? 'bg-muted text-muted-foreground border-border'
              : weightOk          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20'
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20'
            }`}>
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              <span>
                مجموع الأوزان: <strong>{totalWeight.toFixed(1)}%</strong>
                {!weightOk && totalWeight > 0 && ' — يجب أن يساوي 100%'}
              </span>
            </div>

            {/* ── Shared KPIs ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold border-s-4 border-primary ps-2">المؤشرات العامة</h3>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setShowAddTarget(v => !v)}>
                  <Plus className="h-3 w-3" /> إسناد مؤشر
                </Button>
              </div>

              {/* Add target form */}
              {showAddTarget && (
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="pt-4 pb-3 space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">اختر المؤشر</Label>
                      <Select value={newTarget.kpiId} onValueChange={v => setNewTarget(p => ({ ...p, kpiId: v }))}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="اختر مؤشرًا..." /></SelectTrigger>
                        <SelectContent>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(allKpis as any[]).map(k => (
                            <SelectItem key={k.id} value={k.id}>
                              <span className="flex items-center gap-2">
                                {k.nameAr}
                                <Badge className={`text-[9px] border ms-1 ${CATEGORY_COLORS[k.category] ?? 'bg-muted'}`}>
                                  {CATEGORIES[k.category] ?? k.category}
                                </Badge>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">المستهدف</Label>
                        <Input type="number" value={newTarget.target} onChange={e => setNewTarget(p => ({ ...p, target: parseFloat(e.target.value) || 0 }))} className="h-8 text-xs" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">الوزن (%)</Label>
                        <Input type="number" min={0} max={100} value={newTarget.weight} onChange={e => setNewTarget(p => ({ ...p, weight: parseFloat(e.target.value) || 0 }))} className="h-8 text-xs" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setShowAddTarget(false)}>إلغاء</Button>
                      <Button size="sm" onClick={() => upsertTargetMutation.mutate()} disabled={!newTarget.kpiId || upsertTargetMutation.isPending}>إسناد</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="text-start px-3 py-2 font-medium">المؤشر</th>
                      <th className="text-center px-3 py-2 font-medium">الفئة</th>
                      <th className="text-end px-3 py-2 font-medium">الهدف</th>
                      <th className="text-end px-3 py-2 font-medium">الوزن</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {detailLoading ? (
                      <tr><td colSpan={5} className="px-3 py-5 text-center text-muted-foreground">جارٍ التحميل...</td></tr>
                    ) : targets.length === 0 ? (
                      <tr><td colSpan={5} className="px-3 py-5 text-center text-muted-foreground">لا توجد مؤشرات عامة مسندة</td></tr>
                    ) : targets.map(t => (
                      <tr key={t.id} className="border-t hover:bg-muted/30">
                        <td className="px-3 py-2 font-medium">{t.kpi.nameAr}</td>
                        <td className="px-3 py-2 text-center">
                          <Badge className={`text-[10px] border ${CATEGORY_COLORS[t.kpi.category] ?? 'bg-muted text-foreground border-border'}`}>
                            {CATEGORIES[t.kpi.category] ?? t.kpi.category}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-end tabular-nums">{t.target.toLocaleString()}</td>
                        <td className="px-3 py-2 text-end">{t.weight}%</td>
                        <td className="px-3 py-2 text-center">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => deleteTargetMutation.mutate(t.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Custom KPIs ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold border-s-4 border-orange-500 ps-2">المؤشرات الخاصة</h3>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setShowAddCustom(v => !v)}>
                  <Plus className="h-3 w-3" /> إضافة خاص
                </Button>
              </div>

              {/* Add custom form */}
              {showAddCustom && (
                <Card className="border-orange-400/40 bg-orange-50/30 dark:bg-orange-950/10">
                  <CardContent className="pt-4 pb-3 space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">اسم المؤشر</Label>
                      <Input value={newCustom.nameAr} onChange={e => setNewCustom(p => ({ ...p, nameAr: e.target.value }))} className="h-8 text-xs" placeholder="مثال: تحقيق مستهدف التوسع العقاري" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">الفئة</Label>
                        <Select value={newCustom.category} onValueChange={v => setNewCustom(p => ({ ...p, category: v }))}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {Object.entries(CATEGORIES).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">الوزن (%)</Label>
                        <Input type="number" min={0} max={100} value={newCustom.weight} onChange={e => setNewCustom(p => ({ ...p, weight: parseFloat(e.target.value) || 0 }))} className="h-8 text-xs" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">المستهدف</Label>
                        <Input type="number" min={0} value={newCustom.target} onChange={e => setNewCustom(p => ({ ...p, target: parseFloat(e.target.value) || 0 }))} className="h-8 text-xs" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">الفعلي الحالي</Label>
                        <Input type="number" min={0} value={newCustom.actual} onChange={e => setNewCustom(p => ({ ...p, actual: parseFloat(e.target.value) || 0 }))} className="h-8 text-xs" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setShowAddCustom(false)}>إلغاء</Button>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => addCustomMutation.mutate()} disabled={!newCustom.nameAr || addCustomMutation.isPending}>إضافة</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="text-start px-3 py-2 font-medium">المؤشر</th>
                      <th className="text-center px-3 py-2 font-medium">الفئة</th>
                      <th className="text-end px-3 py-2 font-medium">الهدف</th>
                      <th className="text-end px-3 py-2 font-medium">الفعلي</th>
                      <th className="text-end px-3 py-2 font-medium">الوزن</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {detailLoading ? (
                      <tr><td colSpan={6} className="px-3 py-5 text-center text-muted-foreground">جارٍ التحميل...</td></tr>
                    ) : customKpis.length === 0 ? (
                      <tr><td colSpan={6} className="px-3 py-5 text-center text-muted-foreground">لا توجد مؤشرات خاصة</td></tr>
                    ) : customKpis.map(ck => (
                      <tr key={ck.id} className="border-t hover:bg-muted/30">
                        <td className="px-3 py-2 font-medium">{ck.nameAr}</td>
                        <td className="px-3 py-2 text-center">
                          <Badge className={`text-[10px] border ${CATEGORY_COLORS[ck.category] ?? 'bg-muted text-foreground border-border'}`}>
                            {CATEGORIES[ck.category] ?? ck.category}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-end tabular-nums">{ck.target.toLocaleString()}</td>
                        <td className="px-3 py-2 text-end tabular-nums">{ck.actual.toLocaleString()}</td>
                        <td className="px-3 py-2 text-end">{ck.weight}%</td>
                        <td className="px-3 py-2 text-center">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => deleteCustomMutation.mutate(ck.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  )
}

/* ─────────────────────────── Main Section ─────────────────────────── */

export default function EmployeesSection() {
  const { selectedYear } = useAppStore()
  const [search, setSearch]           = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm]         = useState({ nameAr: '', nameEn: '', email: '', department: '' })
  const qc = useQueryClient()
  const { toast } = useToast()

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees-kpis', selectedYear],
    queryFn: async () => {
      const res = await employeesApi.kpiMetrics({ year: selectedYear })
      return res.success ? res.data : []
    },
  })

  const addMutation = useMutation({
    mutationFn: () => employeesApi.create(addForm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees-kpis'] })
      setShowAddForm(false)
      setAddForm({ nameAr: '', nameEn: '', email: '', department: '' })
      toast({ title: 'تم إضافة الموظف' })
    },
    onError: (e) => toast({ title: 'خطأ', description: String(e), variant: 'destructive' }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees-kpis'] })
      toast({ title: 'تم حذف الموظف' })
    },
  })

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = employees.filter((e: Employee) => {
    if (!search) return true
    const q = search.toLowerCase()
    return e.nameAr.includes(q) || (e.nameEn ?? '').toLowerCase().includes(q) || (e.department ?? '').toLowerCase().includes(q)
  })

  // Summary
  const avgOverall   = employees.length ? employees.reduce((s: number, e: Employee) => s + (e.overallAchievement ?? 0), 0) / employees.length : 0
  const atRisk       = employees.filter((e: Employee) => (e.overallAchievement ?? 0) < 70)
  const departments  = [...new Set(employees.map((e: Employee) => e.department).filter(Boolean))]
  const topPerformer = [...employees].sort((a: Employee, b: Employee) => (b.overallAchievement ?? 0) - (a.overallAchievement ?? 0))[0]

  return (
    <div className="p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" /> مؤشرات الموظفين
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{employees.length} موظف — سنة {selectedYear}</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4" /> إضافة موظف
        </Button>
      </div>

      {/* ── Summary cards ── */}
      {employees.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl border bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground">متوسط الإنجاز</p>
            <p className={`text-2xl font-bold tabular-nums ${achColor(avgOverall).text}`}>{avgOverall.toFixed(1)}%</p>
          </div>
          <div className="rounded-xl border bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground">في خطر (أقل من 70%)</p>
            <p className="text-2xl font-bold text-red-600">{atRisk.length}</p>
          </div>
          <div className="rounded-xl border bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground">الأقسام</p>
            <p className="text-2xl font-bold">{departments.length}</p>
          </div>
          <div className="rounded-xl border bg-muted/30 px-4 py-3">
            <p className="text-xs text-muted-foreground">الأعلى أداءً</p>
            <p className="text-sm font-semibold truncate">{topPerformer?.nameAr ?? '—'}</p>
            <p className={`text-xs font-medium ${achColor(topPerformer?.overallAchievement ?? 0).text}`}>{(topPerformer?.overallAchievement ?? 0).toFixed(1)}%</p>
          </div>
        </div>
      )}

      {/* ── Search ── */}
      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو القسم..." className="ps-9 h-9" />
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
          <Users className="h-10 w-10 opacity-30" />
          <p className="text-sm">{employees.length === 0 ? 'لا يوجد موظفون بعد' : 'لا توجد نتائج للبحث'}</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="w-10" />
                <th className="text-start px-4 py-3 font-medium">الموظف</th>
                <th className="text-start px-4 py-3 font-medium hidden md:table-cell">الإدارة</th>
                <th className="text-center px-3 py-3 font-medium">مالي</th>
                <th className="text-center px-3 py-3 font-medium hidden md:table-cell">تنظيمي</th>
                <th className="text-center px-3 py-3 font-medium">الإجمالي</th>
                <th className="text-end px-4 py-3 font-medium">الحالة</th>
                <th className="text-end px-4 py-3 font-medium w-20">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((emp: Employee) => {
                const overall   = emp.overallAchievement  ?? 0
                const financial = emp.financialAchievement ?? 0
                const org       = emp.orgAchievement       ?? 0
                const expanded  = expandedIds.has(emp.id)
                const { text: oText, bg: oBg, badge: oBadge } = achColor(overall)

                return (
                  <React.Fragment key={emp.id}>
                    <tr
                      className={`hover:bg-muted/30 transition-colors cursor-pointer group ${expanded ? 'bg-muted/20' : ''}`}
                      onClick={() => toggleExpand(emp.id)}
                    >
                      {/* expand chevron */}
                      <td className="px-3 py-3 text-center text-muted-foreground">
                        {expanded
                          ? <ChevronDown  className="h-4 w-4 mx-auto" />
                          : <ChevronRight className="h-4 w-4 mx-auto" />
                        }
                      </td>

                      {/* name */}
                      <td className="px-4 py-3">
                        <p className="font-medium">{emp.nameAr}</p>
                        {emp.position && <p className="text-xs text-muted-foreground">{emp.position.nameAr}</p>}
                      </td>

                      {/* department */}
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">{emp.department ?? '—'}</td>

                      {/* financial */}
                      <td className="px-3 py-3 text-center">
                        <span className={`text-xs font-semibold tabular-nums ${achColor(financial).text}`}>{financial.toFixed(1)}%</span>
                      </td>

                      {/* organizational */}
                      <td className="px-3 py-3 text-center hidden md:table-cell">
                        <span className={`text-xs font-semibold tabular-nums ${achColor(org).text}`}>{org.toFixed(1)}%</span>
                      </td>

                      {/* overall */}
                      <td className="px-3 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-sm font-bold tabular-nums ${oText}`}>{overall.toFixed(1)}%</span>
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${oBg}`} style={{ width: `${Math.min(overall, 100)}%` }} />
                          </div>
                        </div>
                      </td>

                      {/* status badge */}
                      <td className="px-4 py-3 text-end">
                        <Badge variant="outline" className={`text-xs ${oBadge}`}>
                          {overall >= 90 ? 'ممتاز' : overall >= 70 ? 'جيد' : 'يحتاج تحسين'}
                        </Badge>
                      </td>

                      {/* actions */}
                      <td className="px-4 py-3 text-end" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost" size="sm" className="h-7 w-7 p-0"
                            onClick={() => setEditingEmployee(emp)}
                            title="تعديل"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive"
                            onClick={() => { if (confirm(`حذف ${emp.nameAr}؟`)) deleteMutation.mutate(emp.id) }}
                            title="حذف"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable KPI panel */}
                    {expanded && (
                      <tr>
                        <td colSpan={8} className="p-0">
                          <EmployeeKpiPanel employeeId={emp.id} year={selectedYear} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Edit Dialog ── */}
      {editingEmployee && (
        <EditEmployeeDialog
          employee={editingEmployee}
          year={selectedYear}
          onClose={() => setEditingEmployee(null)}
        />
      )}

      {/* ── Add Employee Dialog ── */}
      <Dialog open={showAddForm} onOpenChange={o => { setShowAddForm(o); if (!o) setAddForm({ nameAr: '', nameEn: '', email: '', department: '' }) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة موظف جديد</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {([
              ['nameAr',     'الاسم بالعربي *',    'text'],
              ['nameEn',     'الاسم بالإنجليزي',   'text'],
              ['email',      'البريد الإلكتروني',  'email'],
              ['department', 'الإدارة / القسم',    'text'],
            ] as [keyof typeof addForm, string, string][]).map(([field, label, type]) => (
              <div key={field} className="space-y-1.5">
                <Label className="text-xs">{label}</Label>
                <Input
                  type={type}
                  value={addForm[field]}
                  onChange={e => setAddForm(f => ({ ...f, [field]: e.target.value }))}
                  className="h-9"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>إلغاء</Button>
            <Button onClick={() => addMutation.mutate()} disabled={addMutation.isPending || !addForm.nameAr}>
              {addMutation.isPending ? 'جارٍ الإضافة...' : 'إضافة موظف'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
