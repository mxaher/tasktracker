'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/lib/store'
import { employeesApi, kpiApi } from '@/lib/api'
import type { Employee, KPICategory } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Users, Search, Plus, Edit, Trash2, TrendingUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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
interface EmployeeDetail extends Omit<Employee, 'properties'> {
  email?: string
  kpiTargets?: KPITargetRow[]
  kpiActuals?: KpiActualRow[]
  customKpis?: {
    id: string
    nameAr: string
    category: string
    target: number
    actual: number
    weight: number
  }[]
  properties?: Array<{ propertyId: string; property?: { nameAr: string } }>
}

function AchievementBar({ label, value, isCustom }: { label: string; value: number; isCustom?: boolean }) {
  const pct = Math.min(Math.max(value, 0), 150)
  const displayPct = Math.min(pct, 100)
  const colorCls = pct >= 90 ? 'bg-green-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-red-500'
  const textCls = pct >= 90 ? 'text-green-600' : pct >= 70 ? 'text-yellow-600' : 'text-red-600'
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5">
          {label}
          {isCustom && <Badge variant="outline" className="text-[10px] h-4 px-1 leading-none">خاص</Badge>}
        </span>
        <span className={`font-bold tabular-nums ${textCls}`}>{pct.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${colorCls}`} style={{ width: `${displayPct}%` }} />
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 mt-4">
      {[1,2,3].map(i => <div key={i} className="h-10 bg-muted animate-pulse rounded-lg" />)}
    </div>
  )
}

function KpiManagementTab({ employeeId, year, currentTargets, customKpis }: {
  employeeId: string
  year: number
  currentTargets: KPITargetRow[]
  customKpis: NonNullable<EmployeeDetail['customKpis']>
}) {
  const qc = useQueryClient()
  const { toast } = useToast()
  const [showAdd, setShowAdd] = useState(false)
  const [showAddCustom, setShowAddCustom] = useState(false)
  const [newTarget, setNewTarget] = useState({ kpiId: '', target: 0, weight: 0 })
  const [newCustom, setNewCustom] = useState<{ nameAr: string; category: KPICategory; target: number; actual: number; weight: number }>(
    { nameAr: '', category: 'financial', target: 0, actual: 0, weight: 0 }
  )

  const { data: allKpis = [] } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const res = await kpiApi.list()
      return res.success ? res.data : []
    },
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['employee-detail', employeeId] })
    qc.invalidateQueries({ queryKey: ['employees-kpis'] })
  }

  const upsertMutation = useMutation({
    mutationFn: (data: typeof newTarget) => kpiApi.targets.upsert({ ...data, employeeId, year }),
    onSuccess: () => { invalidate(); setShowAdd(false); setNewTarget({ kpiId: '', target: 0, weight: 0 }); toast({ title: 'تم إسناد المؤشر' }) },
    onError: (e) => toast({ title: 'خطأ', description: String(e), variant: 'destructive' }),
  })

  const addCustomMutation = useMutation({
    mutationFn: (data: typeof newCustom) => employeesApi.customKpis.create({ ...data, employeeId, year }),
    onSuccess: () => { invalidate(); setShowAddCustom(false); setNewCustom({ nameAr: '', category: 'financial', target: 0, actual: 0, weight: 0 }); toast({ title: 'تم إضافة المؤشر الخاص' }) },
    onError: (e) => toast({ title: 'خطأ', description: String(e), variant: 'destructive' }),
  })

  const deleteMutation = useMutation({
    mutationFn: (targetId: string) => fetch(`/api/kpi-targets/${targetId}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => { invalidate(); toast({ title: 'تم الحذف' }) },
  })

  const deleteCustomMutation = useMutation({
    mutationFn: (id: string) => employeesApi.customKpis.delete(id),
    onSuccess: () => { invalidate(); toast({ title: 'تم حذف المؤشر الخاص' }) },
  })

  const totalWeight = [...currentTargets.map(t => t.weight), ...customKpis.map(k => k.weight)].reduce((s, w) => s + w, 0)
  const weightOk = Math.abs(totalWeight - 100) < 0.1

  return (
    <div className="space-y-5 mt-3">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs border ${
        totalWeight === 0 ? 'bg-muted text-muted-foreground border-border'
        : weightOk ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20'
        : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20'
      }`}>
        <TrendingUp className="h-3.5 w-3.5" />
        <span>مجموع الأوزان: <strong>{totalWeight.toFixed(1)}%</strong>{!weightOk && totalWeight > 0 && ' — يجب أن يساوي 100%'}</span>
      </div>

      {/* Shared KPIs */}
      <section className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold border-s-4 border-primary ps-2">المؤشرات العامة</h3>
          <Button size="sm" onClick={() => setShowAdd(true)} className="h-7 gap-1 text-xs" variant="outline">
            <Plus className="h-3 w-3" /> إسناد مؤشر
          </Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-muted/60">
              <tr>
                <th className="text-start px-3 py-2 font-medium">المؤشر</th>
                <th className="text-end px-3 py-2 font-medium">الفئة</th>
                <th className="text-end px-3 py-2 font-medium">المستهدف</th>
                <th className="text-end px-3 py-2 font-medium">الوزن</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {currentTargets.length === 0 ? (
                <tr><td colSpan={5} className="px-3 py-5 text-center text-muted-foreground">لا توجد مؤشرات عامة مسندة</td></tr>
              ) : currentTargets.map((t) => (
                <tr key={t.id} className="border-t hover:bg-muted/30">
                  <td className="px-3 py-2">{t.kpi.nameAr}</td>
                  <td className="px-3 py-2 text-end">
                    <Badge variant="secondary" className="text-[10px]">
                      {t.kpi.category === 'financial' ? 'مالي' : 'تنظيمي'}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-end tabular-nums">{t.target.toLocaleString()}</td>
                  <td className="px-3 py-2 text-end">{t.weight}%</td>
                  <td className="px-3 py-2 text-end">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => deleteMutation.mutate(t.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAdd && (
          <Card className="border-primary/30 bg-primary/5">
            <div className="pt-4 px-4 pb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">اختر المؤشر</Label>
                  <Select value={newTarget.kpiId} onValueChange={(v) => setNewTarget(p => ({ ...p, kpiId: v }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="اختر مؤشرًا..." /></SelectTrigger>
                    <SelectContent>
                      {allKpis.map(k => (
                        <SelectItem key={k.id} value={k.id}>{k.nameAr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">المستهدف</Label>
                  <Input type="number" value={newTarget.target} onChange={(e) => setNewTarget(p => ({ ...p, target: parseFloat(e.target.value) || 0 }))} className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">الوزن (%)</Label>
                  <Input type="number" min={0} max={100} value={newTarget.weight} onChange={(e) => setNewTarget(p => ({ ...p, weight: parseFloat(e.target.value) || 0 }))} className="h-8 text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>إلغاء</Button>
                <Button size="sm" onClick={() => upsertMutation.mutate(newTarget)} disabled={!newTarget.kpiId || upsertMutation.isPending}>إسناد</Button>
              </div>
            </div>
          </Card>
        )}
      </section>

      {/* Custom KPIs */}
      <section className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold border-s-4 border-orange-500 ps-2">المؤشرات الخاصة</h3>
          <Button size="sm" onClick={() => setShowAddCustom(true)} className="h-7 gap-1 text-xs" variant="outline">
            <Plus className="h-3 w-3" /> إضافة مؤشر خاص
          </Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-muted/60">
              <tr>
                <th className="text-start px-3 py-2 font-medium">المؤشر</th>
                <th className="text-end px-3 py-2 font-medium">الفئة</th>
                <th className="text-end px-3 py-2 font-medium">الهدف</th>
                <th className="text-end px-3 py-2 font-medium">الفعلي</th>
                <th className="text-end px-3 py-2 font-medium">الوزن</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {customKpis.length === 0 ? (
                <tr><td colSpan={6} className="px-3 py-5 text-center text-muted-foreground">لا توجد مؤشرات خاصة</td></tr>
              ) : customKpis.map((ck) => (
                <tr key={ck.id} className="border-t hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium">{ck.nameAr}</td>
                  <td className="px-3 py-2 text-end">
                    <Badge variant="outline" className="text-[10px]">
                      {ck.category === 'financial' ? 'مالي' : 'تنظيمي'}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-end tabular-nums">{ck.target.toLocaleString()}</td>
                  <td className="px-3 py-2 text-end tabular-nums">{ck.actual.toLocaleString()}</td>
                  <td className="px-3 py-2 text-end">{ck.weight}%</td>
                  <td className="px-3 py-2 text-end">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => deleteCustomMutation.mutate(ck.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddCustom && (
          <Card className="border-orange-400/40 bg-orange-50/30 dark:bg-orange-950/10">
            <div className="pt-4 px-4 pb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">اسم المؤشر</Label>
                  <Input value={newCustom.nameAr} onChange={(e) => setNewCustom(p => ({ ...p, nameAr: e.target.value }))} className="h-8 text-xs" placeholder="مثال: تحقيق مستهدف التوسع العقاري" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">الفئة</Label>
                  <Select value={newCustom.category} onValueChange={(v) => setNewCustom(p => ({ ...p, category: v as KPICategory }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">مالي</SelectItem>
                      <SelectItem value="organizational">تنظيمي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">الوزن (%)</Label>
                  <Input type="number" min={0} max={100} value={newCustom.weight} onChange={(e) => setNewCustom(p => ({ ...p, weight: parseFloat(e.target.value) || 0 }))} className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">المستهدف</Label>
                  <Input type="number" min={0} value={newCustom.target} onChange={(e) => setNewCustom(p => ({ ...p, target: parseFloat(e.target.value) || 0 }))} className="h-8 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">الفعلي الحالي</Label>
                  <Input type="number" min={0} value={newCustom.actual} onChange={(e) => setNewCustom(p => ({ ...p, actual: parseFloat(e.target.value) || 0 }))} className="h-8 text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowAddCustom(false)}>إلغاء</Button>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => addCustomMutation.mutate(newCustom)} disabled={!newCustom.nameAr || addCustomMutation.isPending}>إضافة</Button>
              </div>
            </div>
          </Card>
        )}
      </section>
    </div>
  )
}

export default function EmployeesSection() {
  const { selectedYear } = useAppStore()
  const [search, setSearch] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [form, setForm] = useState({ nameAr: '', nameEn: '', email: '', department: '' })
  const qc = useQueryClient()
  const { toast } = useToast()

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees-kpis', selectedYear],
    queryFn: async () => {
      const res = await employeesApi.kpiMetrics({ year: selectedYear })
      return res.success ? res.data : []
    },
  })

  const { data: employeeDetail, isLoading: detailLoading } = useQuery<EmployeeDetail | null>({
    queryKey: ['employee-detail', selectedEmployee?.id],
    queryFn: async () => {
      if (!selectedEmployee) return null
      const res = await employeesApi.get(selectedEmployee.id)
      return res.success ? (res.data as unknown as EmployeeDetail) : null
    },
    enabled: !!selectedEmployee,
  })

  const saveMutation = useMutation({
    mutationFn: (data: typeof form) =>
      editingEmployee ? employeesApi.update(editingEmployee.id, data) : employeesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees-kpis'] })
      setShowForm(false)
      setEditingEmployee(null)
      setForm({ nameAr: '', nameEn: '', email: '', department: '' })
      toast({ title: editingEmployee ? 'تم تحديث بيانات الموظف' : 'تم إضافة الموظف' })
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

  const filtered = employees.filter((e: Employee) => {
    if (!search) return true
    const q = search.toLowerCase()
    return e.nameAr.includes(q) || (e.nameEn ?? '').toLowerCase().includes(q) || (e.department ?? '').toLowerCase().includes(q)
  })

  const departments = [...new Set(employees.map((e: Employee) => e.department).filter(Boolean))]
  const avgOverall = employees.length
    ? employees.reduce((s: number, e: Employee) => s + (e.overallAchievement ?? 0), 0) / employees.length : 0
  const topPerformers = [...employees].sort((a: Employee, b: Employee) => (b.overallAchievement ?? 0) - (a.overallAchievement ?? 0)).slice(0, 3)
  const atRisk = employees.filter((e: Employee) => (e.overallAchievement ?? 0) < 70)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" /> مؤشرات الموظفين
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{employees.length} موظف — سنة {selectedYear}</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => { setEditingEmployee(null); setForm({ nameAr: '', nameEn: '', email: '', department: '' }); setShowForm(true) }}>
          <Plus className="h-4 w-4" /> إضافة موظف
        </Button>
      </div>

      {employees.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-muted/30">
            <div className="pt-4 pb-3 px-4">
              <p className="text-xs text-muted-foreground">متوسط الإنجاز</p>
              <p className={`text-2xl font-bold tabular-nums ${avgOverall >= 90 ? 'text-green-600' : avgOverall >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>{avgOverall.toFixed(1)}%</p>
            </div>
          </Card>
          <Card className="bg-muted/30">
            <div className="pt-4 pb-3 px-4">
              <p className="text-xs text-muted-foreground">في خطر (أقل من 70%)</p>
              <p className="text-2xl font-bold text-red-600">{atRisk.length}</p>
            </div>
          </Card>
          <Card className="bg-muted/30">
            <div className="pt-4 pb-3 px-4">
              <p className="text-xs text-muted-foreground">الأقسام</p>
              <p className="text-2xl font-bold">{departments.length}</p>
            </div>
          </Card>
          <Card className="bg-muted/30">
            <div className="pt-4 pb-3 px-4">
              <p className="text-xs text-muted-foreground">الأعلى أداءً</p>
              <p className="text-sm font-semibold truncate">{topPerformers[0]?.nameAr ?? '—'}</p>
              <p className="text-xs text-green-600 font-medium">{(topPerformers[0]?.overallAchievement ?? 0).toFixed(1)}%</p>
            </div>
          </Card>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم أو القسم..." className="ps-9 h-9" />
      </div>

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
                <th className="text-start px-4 py-3 font-medium">الموظف</th>
                <th className="text-start px-4 py-3 font-medium hidden md:table-cell">الإدارة</th>
                <th className="text-center px-3 py-3 font-medium">مالي</th>
                <th className="text-center px-3 py-3 font-medium hidden md:table-cell">تنظيمي</th>
                <th className="text-center px-3 py-3 font-medium">الإجمالي</th>
                <th className="text-end px-4 py-3 font-medium">الحالة</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((emp: Employee) => {
                const overall = emp.overallAchievement ?? 0
                const financial = emp.financialAchievement ?? 0
                const org = emp.orgAchievement ?? 0
                return (
                  <tr key={emp.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{emp.nameAr}</p>
                      {emp.position && <p className="text-xs text-muted-foreground">{emp.position.nameAr}</p>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">{emp.department ?? '—'}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={`text-xs font-semibold tabular-nums ${financial >= 90 ? 'text-green-600' : financial >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>{financial.toFixed(1)}%</span>
                    </td>
                    <td className="px-3 py-3 text-center hidden md:table-cell">
                      <span className={`text-xs font-semibold tabular-nums ${org >= 90 ? 'text-green-600' : org >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>{org.toFixed(1)}%</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-sm font-bold tabular-nums ${overall >= 90 ? 'text-green-600' : overall >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>{overall.toFixed(1)}%</span>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${overall >= 90 ? 'bg-green-500' : overall >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(overall, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <Badge variant="outline" className={`text-xs ${overall >= 90 ? 'text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20' : overall >= 70 ? 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20' : 'text-red-600 border-red-200 bg-red-50 dark:bg-red-950/20'}`}>
                        {overall >= 90 ? 'ممتاز' : overall >= 70 ? 'جيد' : 'يحتاج تحسين'}
                      </Badge>
                    </td>
                    <td className="px-2 py-3">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={(e) => { e.stopPropagation(); if (confirm(`حذف ${emp.nameAr}؟`)) deleteMutation.mutate(emp.id) }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Detail Dialog */}
      <Dialog open={!!selectedEmployee} onOpenChange={(o) => !o && setSelectedEmployee(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div>
              <DialogTitle className="text-lg">{selectedEmployee?.nameAr}</DialogTitle>
              {selectedEmployee?.position && <p className="text-sm text-muted-foreground mt-0.5">{selectedEmployee.position.nameAr}</p>}
            </div>
          </DialogHeader>
          <Tabs defaultValue="overview">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="overview" className="text-xs">نظرة عامة</TabsTrigger>
              <TabsTrigger value="financial" className="text-xs">مالي</TabsTrigger>
              <TabsTrigger value="org" className="text-xs">تنظيمي</TabsTrigger>
              <TabsTrigger value="manage" className="text-xs">إدارة المؤشرات</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              {detailLoading ? <LoadingSkeleton /> : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['الإدارة', selectedEmployee?.department ?? '—'],
                      ['البريد', employeeDetail?.email ?? '—'],
                      ['المنصب', selectedEmployee?.position?.nameAr ?? '—'],
                      ['الحالة', selectedEmployee?.isActive ? 'نشط' : 'غير نشط'],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg border bg-muted/30 px-3 py-2">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-medium mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">ملخص الأداء</p>
                    <AchievementBar label="الأداء المالي" value={selectedEmployee?.financialAchievement ?? 0} />
                    <AchievementBar label="الأداء التنظيمي" value={selectedEmployee?.orgAchievement ?? 0} />
                    <div className="pt-1 border-t">
                      <AchievementBar label="الأداء الإجمالي" value={selectedEmployee?.overallAchievement ?? 0} />
                    </div>
                  </div>
                  {(employeeDetail?.properties?.length ?? 0) > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">العقارات المسندة</p>
                      <div className="flex flex-wrap gap-2">
                        {(employeeDetail?.properties ?? []).map((ep) => (
                          <Badge key={ep.propertyId} variant="secondary" className="text-xs">{ep.property?.nameAr}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="financial" className="mt-4">
              {detailLoading ? <LoadingSkeleton /> : (
                <div className="space-y-3">
                  {(() => {
                    const items: React.ReactElement[] = []
                    employeeDetail?.kpiTargets?.filter(t => t.kpi.category === 'financial').forEach(t => {
                      const actuals = employeeDetail.kpiActuals?.filter(a => a.kpiId === t.kpi.id) ?? []
                      const actual = actuals.reduce((s, a) => s + a.actual, 0)
                      const val = t.target > 0 ? (actual / t.target) * 100 : 0
                      items.push(<AchievementBar key={t.id} label={t.kpi.nameAr} value={val} />)
                    })
                    employeeDetail?.customKpis?.filter(k => k.category === 'financial').forEach(k => {
                      const val = k.target > 0 ? (k.actual / k.target) * 100 : 0
                      items.push(<AchievementBar key={k.id} label={k.nameAr} value={val} isCustom />)
                    })
                    return items.length > 0 ? items : <p className="text-center text-muted-foreground py-8 text-sm">لا توجد مؤشرات مالية مسندة</p>
                  })()}
                </div>
              )}
            </TabsContent>

            <TabsContent value="org" className="mt-4">
              {detailLoading ? <LoadingSkeleton /> : (
                <div className="space-y-3">
                  {(() => {
                    const items: React.ReactElement[] = []
                    employeeDetail?.kpiTargets?.filter(t => t.kpi.category === 'organizational').forEach(t => {
                      const actuals = employeeDetail.kpiActuals?.filter(a => a.kpiId === t.kpi.id) ?? []
                      const actual = actuals.reduce((s, a) => s + a.actual, 0)
                      const val = t.target > 0 ? (actual / t.target) * 100 : 0
                      items.push(<AchievementBar key={t.id} label={t.kpi.nameAr} value={val} />)
                    })
                    employeeDetail?.customKpis?.filter(k => k.category === 'organizational').forEach(k => {
                      const val = k.target > 0 ? (k.actual / k.target) * 100 : 0
                      items.push(<AchievementBar key={k.id} label={k.nameAr} value={val} isCustom />)
                    })
                    return items.length > 0 ? items : <p className="text-center text-muted-foreground py-8 text-sm">لا توجد مؤشرات تنظيمية مسندة</p>
                  })()}
                </div>
              )}
            </TabsContent>

            <TabsContent value="manage">
              {detailLoading ? <LoadingSkeleton /> : (
                <KpiManagementTab
                  employeeId={selectedEmployee?.id ?? ''}
                  year={selectedYear}
                  currentTargets={employeeDetail?.kpiTargets ?? []}
                  customKpis={employeeDetail?.customKpis ?? []}
                />
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-2">
            <Button variant="ghost" size="sm" onClick={() => {
              setEditingEmployee(selectedEmployee)
              setForm({ nameAr: selectedEmployee?.nameAr ?? '', nameEn: selectedEmployee?.nameEn ?? '', email: employeeDetail?.email ?? '', department: selectedEmployee?.department ?? '' })
              setShowForm(true)
            }}>
              <Edit className="h-4 w-4 me-2" /> تعديل البيانات
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(null)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setEditingEmployee(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'تعديل بيانات موظف' : 'إضافة موظف جديد'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {([
              ['nameAr', 'الاسم بالعربي', 'text'],
              ['nameEn', 'الاسم بالإنجليزي', 'text'],
              ['email', 'البريد الإلكتروني', 'email'],
              ['department', 'الإدارة / القسم', 'text'],
            ] as [keyof typeof form, string, string][]).map(([field, label, type]) => (
              <div key={field} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <Input type={type} value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} className="h-8 text-sm" />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>إلغاء</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.nameAr}>
              {saveMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
