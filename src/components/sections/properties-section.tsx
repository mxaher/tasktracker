'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '@/lib/store'
import { propertiesApi, employeesApi, actualsApi, targetsApi } from '@/lib/api'
import type { Property, PropertyType, Employee } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, Search, Plus, Edit, Trash2, TrendingUp, BarChart3, DollarSign, AlertTriangle } from 'lucide-react'
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

const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']

function getColor(pct: number) {
  if (pct >= 90) return { cls: 'text-green-600', bg: 'bg-green-500', badge: 'text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20' }
  if (pct >= 70) return { cls: 'text-yellow-600', bg: 'bg-yellow-500', badge: 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20' }
  return { cls: 'text-red-600', bg: 'bg-red-500', badge: 'text-red-600 border-red-200 bg-red-50 dark:bg-red-950/20' }
}

function AchievementRing({ value }: { value: number }) {
  const r = 20
  const circ = 2 * Math.PI * r
  const pct = Math.min(Math.max(value, 0), 100)
  const offset = circ - (pct / 100) * circ
  const { cls } = getColor(pct)
  const stroke = pct >= 90 ? '#16a34a' : pct >= 70 ? '#d97706' : '#dc2626'
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="shrink-0">
      <circle cx="26" cy="26" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-muted/30" />
      <circle cx="26" cy="26" r={r} fill="none" stroke={stroke} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 26 26)"
      />
      <text x="26" y="30" textAnchor="middle" fontSize="10" fontWeight="bold" fill={stroke}>
        {pct.toFixed(0)}%
      </text>
    </svg>
  )
}

function SummaryCard({ label, value, sub, icon: Icon, colorCls }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; colorCls: string
}) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="pt-4 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-xl font-bold tabular-nums mt-0.5 ${colorCls}`}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
          </div>
          <div className={`p-2 rounded-lg bg-muted/50`}>
            <Icon className={`h-4 w-4 ${colorCls}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PropertyDetailDialog({ property, year, onClose }: {
  property: Property; year: number; onClose: () => void
}) {
  const qc = useQueryClient()
  const { toast } = useToast()
  const [editingMonth, setEditingMonth] = useState<number | null>(null)
  const [collectedVal, setCollectedVal] = useState('')
  const [invoicedVal, setInvoicedVal] = useState('')

  const { data: actuals = [] } = useQuery({
    queryKey: ['property-actuals', property.id, year],
    queryFn: async () => {
      const res = await actualsApi.list({ propertyId: property.id, year })
      return res.success ? res.data : []
    },
  })

  const { data: targets } = useQuery({
    queryKey: ['property-targets', property.id, year],
    queryFn: async () => {
      const res = await targetsApi.list({ propertyId: property.id, year })
      return res.success ? res.data : null
    },
  })

  const upsertActual = useMutation({
    mutationFn: (data: { month: number; collected: number; invoiced?: number }) =>
      actualsApi.upsert({ propertyId: property.id, year, ...data }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['property-actuals', property.id, year] })
      qc.invalidateQueries({ queryKey: ['properties'] })
      setEditingMonth(null)
      toast({ title: 'تم تحديث بيانات التحصيل' })
    },
    onError: (e) => toast({ title: 'خطأ', description: String(e), variant: 'destructive' }),
  })

  const getActual = (month: number) =>
    (actuals as Array<{ month: number; collected: number; invoiced: number }>).find(a => a.month === month)

  const getMonthlyTarget = (month: number) => {
    const monthlyArr = (targets as { monthly?: Array<{ month: number; target: number }> } | null)?.monthly ?? []
    return monthlyArr.find((t: { month: number; target: number }) => t.month === month)?.target ?? 0
  }

  const totalCollected = (actuals as Array<{ collected: number }>).reduce((s, a) => s + a.collected, 0)
  const totalTarget = (targets as { annual?: { annualTarget: number } } | null)?.annual?.annualTarget ?? property.annualTarget ?? 0

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            <span className="font-mono text-xs text-muted-foreground me-2">{property.code}</span>
            {property.nameAr}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {PROPERTY_TYPES[property.type]} — {property.location ?? 'الموقع غير محدد'}
          </p>
        </DialogHeader>

        <Tabs defaultValue="actuals">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="actuals">التحصيل الشهري</TabsTrigger>
            <TabsTrigger value="info">معلومات العقار</TabsTrigger>
          </TabsList>

          <TabsContent value="actuals" className="mt-4 space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'الهدف السنوي', value: fmtNum(totalTarget), cls: 'text-foreground' },
                { label: 'إجمالي المحصل', value: fmtNum(totalCollected), cls: 'text-green-600' },
                { label: 'نسبة الإنجاز', value: totalTarget > 0 ? `${((totalCollected / totalTarget) * 100).toFixed(1)}%` : '—', cls: totalTarget > 0 && totalCollected / totalTarget >= 0.9 ? 'text-green-600' : totalTarget > 0 && totalCollected / totalTarget >= 0.7 ? 'text-yellow-600' : 'text-red-600' },
              ].map(s => (
                <div key={s.label} className="rounded-lg border bg-muted/30 py-2">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className={`text-lg font-bold tabular-nums ${s.cls}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Monthly table */}
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 border-b">
                  <tr>
                    <th className="text-start px-3 py-2 font-medium text-xs">الشهر</th>
                    <th className="text-end px-3 py-2 font-medium text-xs">الهدف</th>
                    <th className="text-end px-3 py-2 font-medium text-xs">المحصل</th>
                    <th className="text-end px-3 py-2 font-medium text-xs">الفاتورة</th>
                    <th className="text-end px-3 py-2 font-medium text-xs">الإنجاز</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {MONTHS_AR.map((month, i) => {
                    const m = i + 1
                    const actual = getActual(m)
                    const mTarget = getMonthlyTarget(m)
                    const ach = mTarget > 0 && actual ? (actual.collected / mTarget) * 100 : 0
                    const isEditing = editingMonth === m
                    return (
                      <tr key={m} className="hover:bg-muted/20">
                        <td className="px-3 py-2 text-xs font-medium">{month}</td>
                        <td className="px-3 py-2 text-end text-xs tabular-nums text-muted-foreground">
                          {mTarget > 0 ? fmtNum(mTarget) : '—'}
                        </td>
                        {isEditing ? (
                          <>
                            <td className="px-1 py-1">
                              <Input autoFocus type="number" value={collectedVal}
                                onChange={(e) => setCollectedVal(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Escape') setEditingMonth(null) }}
                                className="h-7 text-xs text-end w-24" placeholder="المحصل"
                              />
                            </td>
                            <td className="px-1 py-1">
                              <Input type="number" value={invoicedVal}
                                onChange={(e) => setInvoicedVal(e.target.value)}
                                className="h-7 text-xs text-end w-24" placeholder="الفاتورة"
                              />
                            </td>
                            <td colSpan={2} className="px-1 py-1">
                              <div className="flex gap-1">
                                <Button size="sm" className="h-7 text-xs px-2" onClick={() => {
                                  upsertActual.mutate({ month: m, collected: parseFloat(collectedVal) || 0, invoiced: parseFloat(invoicedVal) || undefined })
                                }} disabled={upsertActual.isPending}>حفظ</Button>
                                <Button size="sm" variant="ghost" className="h-7 text-xs px-2" onClick={() => setEditingMonth(null)}>إلغاء</Button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-3 py-2 text-end text-xs tabular-nums">
                              {actual ? <span className="font-medium text-green-700">{fmtNum(actual.collected)}</span> : '—'}
                            </td>
                            <td className="px-3 py-2 text-end text-xs tabular-nums text-muted-foreground">
                              {actual?.invoiced ? fmtNum(actual.invoiced) : '—'}
                            </td>
                            <td className="px-3 py-2 text-end text-xs">
                              {ach > 0 ? (
                                <span className={`font-semibold tabular-nums ${
                                  ach >= 90 ? 'text-green-600' : ach >= 70 ? 'text-yellow-600' : 'text-red-600'
                                }`}>{ach.toFixed(1)}%</span>
                              ) : '—'}
                            </td>
                            <td className="px-2 py-2">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => {
                                setEditingMonth(m)
                                setCollectedVal(actual ? String(actual.collected) : '')
                                setInvoicedVal(actual?.invoiced ? String(actual.invoiced) : '')
                              }}>
                                <Edit className="h-3 w-3" />
                              </Button>
                            </td>
                          </>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['الكود', property.code],
                ['النوع', PROPERTY_TYPES[property.type] ?? property.type],
                ['الموقع', property.location ?? '—'],
                ['الوحدات', String(property.totalUnits)],
                ['الإشغال', `${property.occupancyRate.toFixed(1)}%`],
                ['المدير', property.manager?.nameAr ?? '—'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border bg-muted/30 px-3 py-2">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            {(property.agingTotal ?? 0) > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 text-red-700 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>إجمالي المتأخرات: <strong>{fmtNum(property.agingTotal ?? 0)}</strong></span>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>إغلاق</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function fmtNum(n: number) {
  return new Intl.NumberFormat('ar-SA', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
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
  const [detailProperty, setDetailProperty] = useState<Property | null>(null)
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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['properties'] }); toast({ title: 'تم حذف العقار' }) },
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
      toast({ title: editingProperty ? 'تم تحديث العقار' : 'تم إنشاء العقار' })
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
  const totalAging = properties.reduce((s: number, p: Property) => s + (p.agingTotal ?? 0), 0)

  const openEdit = (p: Property, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setEditingProperty(p)
    setForm({ code: p.code, nameAr: p.nameAr, nameEn: p.nameEn ?? '', type: p.type, location: p.location ?? '', totalUnits: p.totalUnits, managerId: p.managerId ?? '' })
    setShowForm(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6" /> العقارات
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {MONTHS_AR[selectedMonth - 1]} {selectedYear} — {properties.length} عقار
          </p>
        </div>
        <Button onClick={() => { setEditingProperty(null); setForm(emptyForm); setShowForm(true) }} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> إضافة عقار
        </Button>
      </div>

      {/* KPI summary row — all 5 metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <SummaryCard label="إجمالي العقارات" value={properties.length} icon={Building2} colorCls="text-foreground" />
        <SummaryCard label="الهدف السنوي" value={fmtNum(totalTarget)} icon={BarChart3} colorCls="text-blue-600" />
        <SummaryCard label="إجمالي المحصل" value={fmtNum(totalCollected)} icon={DollarSign} colorCls="text-green-600" />
        <SummaryCard
          label="متوسط الإنجاز"
          value={`${avgAchievement.toFixed(1)}%`}
          icon={TrendingUp}
          colorCls={avgAchievement >= 90 ? 'text-green-600' : avgAchievement >= 70 ? 'text-yellow-600' : 'text-red-600'}
        />
        <SummaryCard
          label="متوسط الإشغال"
          value={`${avgOccupancy.toFixed(1)}%`}
          sub={totalAging > 0 ? `متأخرات: ${fmtNum(totalAging)}` : undefined}
          icon={Building2}
          colorCls={avgOccupancy >= 90 ? 'text-green-600' : avgOccupancy >= 70 ? 'text-yellow-600' : 'text-red-600'}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم أو الكود..." className="ps-9 h-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44 h-9"><SelectValue placeholder="نوع العقار" /></SelectTrigger>
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
          <Building2 className="h-10 w-10 opacity-30" />
          <p className="text-sm">{properties.length === 0 ? 'لا توجد عقارات بعد، أضف عقارك الأول' : 'لا توجد نتائج للبحث'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p: Property) => {
            const ach = p.achievement ?? 0
            const { cls: achCls, bg: achBg, badge: achBadge } = getColor(ach)
            const mthAch = p.monthlyTarget ? ((p.monthlyCollected ?? 0) / p.monthlyTarget) * 100 : 0
            return (
              <Card
                key={p.id}
                className="hover:shadow-md transition-all cursor-pointer"
                onClick={() => setDetailProperty(p)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{p.code}</span>
                        <Badge variant="secondary" className="text-xs">{PROPERTY_TYPES[p.type] ?? p.type}</Badge>
                      </div>
                      <p className="font-semibold mt-1 truncate text-sm">{p.nameAr}</p>
                      {p.manager && <p className="text-xs text-muted-foreground">{p.manager.nameAr}</p>}
                    </div>
                    <AchievementRing value={ach} />
                  </div>

                  <div className="space-y-2">
                    {/* Annual */}
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">الهدف السنوي</span>
                      <span className="tabular-nums">{fmtNum(p.annualTarget ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">المحصل حتى الآن</span>
                      <span className={`tabular-nums font-medium ${achCls}`}>{fmtNum(p.ytdCollected ?? 0)}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${achBg}`} style={{ width: `${Math.min(ach, 100)}%` }} />
                    </div>

                    {/* Monthly */}
                    {(p.monthlyTarget ?? 0) > 0 && (
                      <>
                        <div className="flex justify-between text-xs pt-1">
                          <span className="text-muted-foreground">الهدف الشهري ({MONTHS_AR[selectedMonth - 1]})</span>
                          <span className="tabular-nums">{fmtNum(p.monthlyTarget ?? 0)}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${mthAch >= 90 ? 'bg-green-400' : mthAch >= 70 ? 'bg-yellow-400' : 'bg-red-400'}`}
                            style={{ width: `${Math.min(mthAch, 100)}%` }}
                          />
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-muted-foreground">الإشغال</span>
                      <span className="tabular-nums font-medium">{p.occupancyRate.toFixed(1)}%</span>
                    </div>

                    {(p.agingTotal ?? 0) > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-red-500" /> متأخرات
                        </span>
                        <span className="text-red-500 font-semibold tabular-nums">{fmtNum(p.agingTotal ?? 0)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3 pt-3 border-t" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs gap-1" onClick={(e) => openEdit(p, e)}>
                      <Edit className="h-3 w-3" /> تعديل
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      className="h-7 text-xs text-destructive hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); if (confirm('حذف هذا العقار؟')) deleteMutation.mutate(p.id) }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Property detail modal */}
      {detailProperty && (
        <PropertyDetailDialog
          property={detailProperty}
          year={selectedYear}
          onClose={() => setDetailProperty(null)}
        />
      )}

      {/* Create / Edit dialog */}
      <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setEditingProperty(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProperty ? 'تعديل بيانات عقار' : 'إضافة عقار جديد'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {([
              ['code', 'رمز العقار', 'text'],
              ['nameAr', 'الاسم بالعربي', 'text'],
              ['nameEn', 'الاسم بالإنجليزي', 'text'],
              ['location', 'الموقع', 'text'],
            ] as [keyof typeof emptyForm, string, string][]).map(([field, label]) => (
              <div key={field} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <Input value={String(form[field])} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} className="h-8 text-sm" />
              </div>
            ))}
            <div className="space-y-1">
              <Label className="text-xs">نوع العقار</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PROPERTY_TYPES).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">عدد الوحدات</Label>
              <Input type="number" min={0} value={form.totalUnits} onChange={(e) => setForm((f) => ({ ...f, totalUnits: parseInt(e.target.value) || 0 }))} className="h-8 text-sm" />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs">مدير العقار</Label>
              <Select value={form.managerId || 'none'} onValueChange={(v) => setForm((f) => ({ ...f, managerId: v === 'none' ? null : v }))}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="اختر مديراً" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون مدير</SelectItem>
                  {employees.map((emp: Employee) => <SelectItem key={emp.id} value={emp.id}>{emp.nameAr}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>إلغاء</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.nameAr || !form.code}>
              {saveMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
