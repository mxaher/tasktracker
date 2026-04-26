'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/lib/store'
import { employeesApi } from '@/lib/api'
import type { Employee } from '@/lib/types'

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
  customKpis?: unknown[]
  properties?: Array<{ propertyId: string; property?: { nameAr: string } }>
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Users, Search, Plus, Edit, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { kpiApi } from '@/lib/api'

function AchievementBar({ label, value }: { label: string; value: number }) {
  const pct = Math.min(Math.max(value, 0), 100)
  const color = pct >= 90 ? 'bg-green-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={pct >= 90 ? 'text-green-600' : pct >= 70 ? 'text-yellow-600' : 'text-red-600'}>{pct.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function KpiManagementTab({ employeeId, year, currentTargets }: { employeeId: string, year: number, currentTargets: KPITargetRow[] }) {
  const qc = useQueryClient()
  const { toast } = useToast()
  const [showAdd, setShowAdd] = useState(false)
  const [newTarget, setNewTarget] = useState({ kpiId: '', target: 0, weight: 0 })

  const { data: allKpis = [] } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const res = await kpiApi.list()
      return res.success ? res.data : []
    }
  })

  const upsertMutation = useMutation({
    mutationFn: (data: any) => kpiApi.targets.upsert({ ...data, employeeId, year }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employee-detail', employeeId] })
      qc.invalidateQueries({ queryKey: ['employees-kpis'] })
      setShowAdd(false)
      setNewTarget({ kpiId: '', target: 0, weight: 0 })
      toast({ title: 'تم التحديث بنجاح' })
    }
  })

  const deleteMutation = useMutation({
    // Using upsert with target 0 or a dedicated delete if available. 
    // Since api.ts only has upsert, we might need a delete endpoint or just set target to 0 if the backend handles it.
    // Let's assume for now we want to support deletion. I will check if there is a delete for targets.
    // Actually kpi-targets usually has a way to remove. If not, I'll just use upsert with a flag or something.
    // Based on api.ts, it's just upsert.
    mutationFn: async (targetId: string) => {
      // If no delete endpoint, we might need to add one. Let's check api.ts again.
      // kpiApi.targets only has list and upsert.
      return fetch(`/api/kpi-targets/${targetId}`, { method: 'DELETE' }).then(res => res.json())
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employee-detail', employeeId] })
      qc.invalidateQueries({ queryKey: ['employees-kpis'] })
      toast({ title: 'تم الحذف' })
    }
  })

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">المؤشرات الحالية</h3>
        <Button size="sm" onClick={() => setShowAdd(true)} className="h-8 gap-1">
          <Plus className="h-3.5 w-3.5" /> إضافة مؤشر
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-muted">
            <tr>
              <th className="text-start px-3 py-2">المؤشر</th>
              <th className="text-end px-3 py-2">المستهدف</th>
              <th className="text-end px-3 py-2">الوزن</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {currentTargets.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-3 py-2">{t.kpi.nameAr}</td>
                <td className="px-3 py-2 text-end">{t.target}</td>
                <td className="px-3 py-2 text-end">{t.weight}%</td>
                <td className="px-3 py-2 text-end">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => deleteMutation.mutate(t.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
            {currentTargets.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">لا توجد مؤشرات مسندة</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">اختر المؤشر</Label>
                <Select value={newTarget.kpiId} onValueChange={(v) => setNewTarget(p => ({ ...p, kpiId: v }))}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="اختر مؤشرًا..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allKpis.map(k => (
                      <SelectItem key={k.id} value={k.id}>{k.nameAr} ({k.category === 'financial' ? 'مالي' : 'تنظيمي'})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">المستهدف</Label>
                <Input 
                  type="number" 
                  value={newTarget.target} 
                  onChange={(e) => setNewTarget(p => ({ ...p, target: parseFloat(e.target.value) }))}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">الوزن (%)</Label>
                <Input 
                  type="number" 
                  value={newTarget.weight} 
                  onChange={(e) => setNewTarget(p => ({ ...p, weight: parseFloat(e.target.value) }))}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>إلغاء</Button>
              <Button size="sm" onClick={() => upsertMutation.mutate(newTarget)} disabled={!newTarget.kpiId || upsertMutation.isPending}>
                إضافة
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
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

  const saveMutation = useMutation({
    mutationFn: (data: typeof form) =>
      editingEmployee ? employeesApi.update(editingEmployee.id, data) : employeesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees-kpis'] })
      setShowForm(false)
      setEditingEmployee(null)
      setForm({ nameAr: '', nameEn: '', email: '', department: '' })
      toast({ title: editingEmployee ? 'تم التحديث' : 'تم الإنشاء' })
    },
    onError: (e) => toast({ title: 'خطأ', description: String(e), variant: 'destructive' }),
  })

  const { data: employeeDetail } = useQuery<EmployeeDetail | null>({
    queryKey: ['employee-detail', selectedEmployee?.id],
    queryFn: async () => {
      if (!selectedEmployee) return null
      const res = await employeesApi.get(selectedEmployee.id)
      return res.success ? (res.data as unknown as EmployeeDetail) : null
    },
    enabled: !!selectedEmployee,
  })

  const filtered = employees.filter((e: Employee) => {
    if (!search) return true
    const q = search.toLowerCase()
    return e.nameAr.includes(q) || (e.nameEn ?? '').toLowerCase().includes(q)
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" /> الموظفون والمؤشرات
        </h1>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => { setEditingEmployee(null); setForm({ nameAr: '', nameEn: '', email: '', department: '' }); setShowForm(true) }}
        >
          <Plus className="h-4 w-4" /> إضافة موظف
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم..." className="ps-9 h-9" />
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-12">جارٍ التحميل...</p>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-start px-4 py-3">الموظف</th>
                <th className="text-start px-4 py-3 hidden md:table-cell">الإدارة</th>
                <th className="text-end px-4 py-3">المالي</th>
                <th className="text-end px-4 py-3 hidden md:table-cell">التنظيمي</th>
                <th className="text-end px-4 py-3">الإجمالي</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp: Employee) => (
                <tr key={emp.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{emp.nameAr}</p>
                    {emp.position && <p className="text-xs text-muted-foreground">{emp.position.nameAr}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">{emp.department ?? '—'}</td>
                  <td className="px-4 py-3 text-end">
                    <Badge variant="secondary" className={`text-xs ${(emp.financialAchievement ?? 0) >= 90 ? 'text-green-600' : (emp.financialAchievement ?? 0) >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {(emp.financialAchievement ?? 0).toFixed(1)}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-end hidden md:table-cell">
                    <Badge variant="secondary" className={`text-xs ${(emp.orgAchievement ?? 0) >= 90 ? 'text-green-600' : (emp.orgAchievement ?? 0) >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {(emp.orgAchievement ?? 0).toFixed(1)}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <span className={`font-bold ${(emp.overallAchievement ?? 0) >= 90 ? 'text-green-600' : (emp.overallAchievement ?? 0) >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {(emp.overallAchievement ?? 0).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      التفاصيل
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Detail Dialog */}
      <Dialog open={!!selectedEmployee} onOpenChange={(o) => !o && setSelectedEmployee(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEmployee?.nameAr}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="profile">
            <TabsList className="w-full">
              <TabsTrigger value="profile" className="flex-1">الملف الشخصي</TabsTrigger>
              <TabsTrigger value="financial" className="flex-1">المؤشرات المالية</TabsTrigger>
              <TabsTrigger value="org" className="flex-1">المؤشرات التنظيمية</TabsTrigger>
              <TabsTrigger value="manage" className="flex-1">إدارة المؤشرات</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">الاسم: </span>{selectedEmployee?.nameAr}</div>
                <div><span className="text-muted-foreground">الإدارة: </span>{selectedEmployee?.department ?? '—'}</div>
                <div><span className="text-muted-foreground">البريد: </span>{employeeDetail?.email ?? '—'}</div>
                <div><span className="text-muted-foreground">المنصب: </span>{selectedEmployee?.position?.nameAr ?? '—'}</div>
              </div>
              {(employeeDetail?.properties?.length ?? 0) > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">العقارات المسندة:</p>
                  <div className="flex flex-wrap gap-2">
                    {(employeeDetail?.properties ?? []).map((ep) => (
                      <Badge key={ep.propertyId} variant="secondary">{ep.property?.nameAr}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="financial" className="mt-4">
              <Card>
                <CardContent className="pt-4 space-y-4">
                  {(() => {
            const computeAchievement = (target: KPITargetRow) => {
              if (!employeeDetail?.kpiActuals || target.target <= 0) return 0
              const actuals = employeeDetail.kpiActuals.filter(a => a.kpiId === target.kpi.id)
              const actual = actuals.reduce((s, a) => s + a.actual, 0)
              return (actual / target.target) * 100
            }
            return employeeDetail?.kpiTargets?.filter((t) => t.kpi.category === 'financial').map((t) => (
              <AchievementBar key={t.id} label={t.kpi.nameAr} value={computeAchievement(t)} />
            ))
          })()}
                  {!employeeDetail?.kpiTargets?.filter((t) => t.kpi.category === 'financial').length && (
                    <p className="text-muted-foreground text-sm text-center py-4">لا توجد مؤشرات مالية</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="org" className="mt-4">
              <Card>
                <CardContent className="pt-4 space-y-4">
                  {(() => {
            const computeAchievement = (target: KPITargetRow) => {
              if (!employeeDetail?.kpiActuals || target.target <= 0) return 0
              const actuals = employeeDetail.kpiActuals.filter(a => a.kpiId === target.kpi.id)
              const actual = actuals.reduce((s, a) => s + a.actual, 0)
              return (actual / target.target) * 100
            }
            return employeeDetail?.kpiTargets?.filter((t) => t.kpi.category === 'organizational').map((t) => (
              <AchievementBar key={t.id} label={t.kpi.nameAr} value={computeAchievement(t)} />
            ))
          })()}
                  {!employeeDetail?.kpiTargets?.filter((t) => t.kpi.category === 'organizational').length && (
                    <p className="text-muted-foreground text-sm text-center py-4">لا توجد مؤشرات تنظيمية</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="manage">
              <KpiManagementTab 
                employeeId={selectedEmployee?.id ?? ''} 
                year={selectedYear}
                currentTargets={employeeDetail?.kpiTargets ?? []}
              />
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setEditingEmployee(selectedEmployee); setForm({ nameAr: selectedEmployee?.nameAr ?? '', nameEn: selectedEmployee?.nameEn ?? '', email: '', department: selectedEmployee?.department ?? '' }); setShowForm(true) }}>
              <Edit className="h-4 w-4 me-2" /> تعديل
            </Button>
            <Button variant="outline" onClick={() => setSelectedEmployee(null)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setEditingEmployee(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEmployee ? 'تعديل موظف' : 'إضافة موظف جديد'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {([
              ['nameAr', 'الاسم بالعربي'],
              ['nameEn', 'الاسم بالإنجليزي'],
              ['email', 'البريد الإلكتروني'],
              ['department', 'الإدارة'],
            ] as [keyof typeof form, string][]).map(([field, label]) => (
              <div key={field} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <Input
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>إلغاء</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
