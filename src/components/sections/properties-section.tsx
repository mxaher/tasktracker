'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/lib/store'
import { propertiesApi, employeesApi } from '@/lib/api'
import type { Property, PropertyType, Employee } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building2, Search, Plus, Edit, Trash2, TrendingUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const PROPERTY_TYPES: Record<string, string> = {
  commercial_market: 'مركز تجاري',
  warehouse: 'مستودع',
  industrial: 'صناعي',
  hotel: 'فندق',
  residential: 'سكني',
  offices: 'مكاتب',
  land: 'أرض',
  mixed: 'متعدد الاستخدامات',
}

function AchievementRing({ value }: { value: number }) {
  const r = 20
  const circ = 2 * Math.PI * r
  const pct = Math.min(Math.max(value, 0), 100)
  const offset = circ - (pct / 100) * circ
  const color = pct >= 90 ? '#34C759' : pct >= 70 ? '#FF9500' : '#FF3B30'
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="shrink-0">
      <circle cx="26" cy="26" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-muted/30" />
      <circle
        cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
      />
      <text x="26" y="30" textAnchor="middle" fontSize="10" fontWeight="bold" fill={color}>
        {pct.toFixed(0)}%
      </text>
    </svg>
  )
}

function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.min(Math.max(value, 0), 100)
  const color = pct >= 90 ? 'bg-green-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className={`h-2 bg-muted rounded-full overflow-hidden ${className}`}>
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

const emptyForm = {
  code: '', nameAr: '', nameEn: '', type: 'commercial_market', location: '', totalUnits: 0, managerId: '' as string | null,
}

export default function PropertiesSection() {
  const { selectedYear, selectedMonth } = useAppStore()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<typeof emptyForm>(emptyForm)
  const qc = useQueryClient()
  const { toast } = useToast()

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties', selectedYear, selectedMonth, typeFilter],
    queryFn: async () => {
      const res = await propertiesApi.list({ year: selectedYear, month: selectedMonth, type: typeFilter === 'all' ? undefined : typeFilter })
      return res.success ? res.data : []
    },
  })

  const { data: employees = [] } = useQuery({
    queryKey: ['employees', 'active'],
    queryFn: async () => {
      const res = await employeesApi.list({ active: true })
      return res.success ? res.data : []
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertiesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['properties'] }); toast({ title: 'تم الحذف' }) },
  })

  const saveMutation = useMutation({
    mutationFn: (data: typeof emptyForm) => {
      const typed = { ...data, type: data.type as PropertyType, managerId: data.managerId || null }
      return editingProperty ? propertiesApi.update(editingProperty.id, typed) : propertiesApi.create(typed)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['properties'] })
      setShowForm(false)
      setEditingProperty(null)
      setForm(emptyForm)
      toast({ title: editingProperty ? 'تم التحديث' : 'تم الإنشاء' })
    },
    onError: (e) => toast({ title: 'خطأ', description: String(e), variant: 'destructive' }),
  })

  const filtered = properties.filter((p: Property) => {
    if (!search) return true
    const q = search.toLowerCase()
    return p.nameAr.includes(q) || p.code.toLowerCase().includes(q) || (p.nameEn ?? '').toLowerCase().includes(q)
  })

  const totalTarget = properties.reduce((s: number, p: Property) => s + (p.annualTarget ?? 0), 0)
  const totalCollected = properties.reduce((s: number, p: Property) => s + (p.ytdCollected ?? 0), 0)
  const avgAchievement = properties.length
    ? properties.reduce((s: number, p: Property) => s + (p.achievement ?? 0), 0) / properties.length : 0
  const avgOccupancy = properties.length
    ? properties.reduce((s: number, p: Property) => s + p.occupancyRate, 0) / properties.length : 0

  const openCreate = () => { setEditingProperty(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (p: Property) => {
    setEditingProperty(p)
    setForm({
      code: p.code,
      nameAr: p.nameAr,
      nameEn: p.nameEn ?? '',
      type: p.type,
      location: p.location ?? '',
      totalUnits: p.totalUnits,
      managerId: p.managerId ?? '',
    })
    setShowForm(true)
  }

  const formatNum = (n: number) => new Intl.NumberFormat('ar-SA', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6" /> العقارات
        </h1>
        <Button onClick={openCreate} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> إضافة عقار
        </Button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي العقارات', value: properties.length },
          { label: 'الهدف السنوي', value: formatNum(totalTarget) },
          { label: 'إجمالي المحصل', value: formatNum(totalCollected) },
          { label: 'متوسط الإنجاز', value: `${avgAchievement.toFixed(1)}%` },
          { label: 'متوسط الإشغال', value: `${avgOccupancy.toFixed(1)}%` },
        ].slice(0, 4).map((s) => (
          <Card key={s.label} className="card-strategy-hover">
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className="ps-9 h-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="نوع العقار" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            {Object.entries(PROPERTY_TYPES).map(([v, l]) => (
              <SelectItem key={v} value={v}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Properties grid */}
      {isLoading ? (
        <p className="text-center text-muted-foreground py-12">جارٍ التحميل...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">لا توجد عقارات</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p: Property) => (
            <Card key={p.id} className="card-strategy-hover">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">{p.code}</span>
                      <Badge variant="secondary" className="text-xs">
                        {PROPERTY_TYPES[p.type] ?? p.type}
                      </Badge>
                    </div>
                    <p className="font-semibold mt-1 truncate">{p.nameAr}</p>
                    {p.manager && (
                      <p className="text-xs text-muted-foreground">{p.manager.nameAr}</p>
                    )}
                  </div>
                  <AchievementRing value={p.achievement ?? 0} />
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">الهدف الشهري</span>
                    <span>{formatNum(p.monthlyTarget ?? 0)}</span>
                  </div>
                  <ProgressBar value={p.monthlyTarget ? ((p.monthlyCollected ?? 0) / p.monthlyTarget) * 100 : 0} />

                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-muted-foreground">الإشغال</span>
                    <span>{p.occupancyRate.toFixed(1)}%</span>
                  </div>
                  {(p.agingTotal ?? 0) > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">المتأخرات</span>
                      <span className="text-red-500">{formatNum(p.agingTotal ?? 0)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs gap-1" onClick={() => openEdit(p)}>
                    <Edit className="h-3 w-3" /> تعديل
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-destructive hover:text-destructive"
                    onClick={() => { if (confirm('حذف هذا العقار؟')) deleteMutation.mutate(p.id) }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setEditingProperty(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProperty ? 'تعديل عقار' : 'إضافة عقار جديد'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {([
              ['code', 'رمز العقار'],
              ['nameAr', 'الاسم بالعربي'],
              ['nameEn', 'الاسم بالإنجليزي'],
              ['location', 'الموقع'],
            ] as [keyof typeof emptyForm, string][]).map(([field, label]) => (
              <div key={field} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <Input
                  value={String(form[field])}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  className="h-8 text-sm"
                />
              </div>
            ))}
            <div className="space-y-1">
              <Label className="text-xs">نوع العقار</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PROPERTY_TYPES).map(([v, l]) => (
                    <SelectItem key={v} value={v}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">عدد الوحدات</Label>
              <Input
                type="number"
                value={form.totalUnits}
                onChange={(e) => setForm((f) => ({ ...f, totalUnits: parseInt(e.target.value) || 0 }))}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">مدير العقار</Label>
              <Select value={form.managerId || 'none'} onValueChange={(v) => setForm((f) => ({ ...f, managerId: v === 'none' ? null : v }))}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="اختر مديراً" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون مدير</SelectItem>
                  {employees.map((emp: Employee) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.nameAr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
