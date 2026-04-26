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
import { BarChart3, Plus, Edit, Trash2, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const CATEGORIES: Record<string, string> = {
  financial: 'مالي',
  strategic: 'استراتيجي',
  operational: 'تشغيلي',
  organizational: 'تنظيمي',
}

const CATEGORY_COLORS: Record<string, string> = {
  financial: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  strategic: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  operational: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  organizational: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
}

const MONTHS_SHORT = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']

const emptyForm = { code: '', nameAr: '', nameEn: '', category: 'financial', weight: 0, target: 0 }

function KPICard({ kpi, year, onEdit, onDelete }: {
  kpi: CompanyKPI; year: number;
  onEdit: () => void; onDelete: () => void;
}) {
  const qc = useQueryClient()
  const [editingMonth, setEditingMonth] = useState<number | null>(null)
  const [monthValue, setMonthValue] = useState('')

  const upsertMonthly = useMutation({
    mutationFn: ({ month, actual }: { month: number; actual: number }) =>
      companyKpisApi.monthly.upsert({ kpiId: kpi.id, year, month, actual }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-kpis'] })
      setEditingMonth(null)
    },
  })

  const totalActual = kpi.monthlyData?.reduce((s, m) => s + m.actual, 0) ?? 0
  const achievement = kpi.target > 0 ? (totalActual / kpi.target) * 100 : 0
  const color = achievement >= 90 ? '#34C759' : achievement >= 70 ? '#FF9500' : '#FF3B30'

  const getMonthActual = (month: number) =>
    kpi.monthlyData?.find((m: CompanyKPIMonthly) => m.month === month)?.actual ?? 0

  return (
    <Card className="card-strategy-hover">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-muted-foreground">{kpi.code}</span>
              <Badge className={`text-xs ${CATEGORY_COLORS[kpi.category]}`}>
                {CATEGORIES[kpi.category]}
              </Badge>
              <Badge variant="outline" className="text-xs">{kpi.weight}%</Badge>
            </div>
            <CardTitle className="text-base mt-1">{kpi.nameAr}</CardTitle>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">الهدف: {kpi.target.toLocaleString()}</span>
          <span style={{ color }} className="font-semibold">{achievement.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(achievement, 100)}%`, backgroundColor: color }} />
        </div>

        {/* Monthly grid */}
        <div className="grid grid-cols-6 gap-1 mt-3">
          {MONTHS_SHORT.map((m, i) => {
            const month = i + 1
            const actual = getMonthActual(month)
            const isEditing = editingMonth === month
            return (
              <div key={month} className="text-center">
                <p className="text-xs text-muted-foreground">{m.slice(0, 3)}</p>
                {isEditing ? (
                  <Input
                    autoFocus
                    type="number"
                    value={monthValue}
                    onChange={(e) => setMonthValue(e.target.value)}
                    onBlur={() => {
                      if (monthValue !== '') {
                        upsertMonthly.mutate({ month, actual: parseFloat(monthValue) })
                      }
                      setEditingMonth(null)
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                    className="h-7 text-xs text-center px-1"
                  />
                ) : (
                  <button
                    onClick={() => { setEditingMonth(month); setMonthValue(String(actual)) }}
                    className="w-full text-xs py-1 rounded hover:bg-muted transition-colors"
                  >
                    {actual > 0 ? actual.toLocaleString('ar-SA', { notation: 'compact', maximumFractionDigits: 1 }) : '—'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
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
    queryKey: ['company-kpis', selectedYear, categoryFilter],
    queryFn: async () => {
      const res = await companyKpisApi.list({ year: selectedYear, category: categoryFilter === 'all' ? undefined : categoryFilter })
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
      toast({ title: editingKpi ? 'تم التحديث' : 'تم الإنشاء' })
    },
    onError: (e) => toast({ title: 'خطأ', description: String(e), variant: 'destructive' }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => companyKpisApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['company-kpis'] }); toast({ title: 'تم الحذف' }) },
  })

  const totalWeight = kpis.reduce((s: number, k: CompanyKPI) => s + k.weight, 0)
  const weightOk = Math.abs(totalWeight - 100) < 0.1

  const openEdit = (kpi: CompanyKPI) => {
    setEditingKpi(kpi)
    setForm({ code: kpi.code, nameAr: kpi.nameAr, nameEn: kpi.nameEn ?? '', category: kpi.category, weight: kpi.weight, target: kpi.target })
    setShowForm(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" /> مؤشرات الشركة
        </h1>
        <Button onClick={() => { setEditingKpi(null); setForm(emptyForm); setShowForm(true) }} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> إضافة مؤشر
        </Button>
      </div>

      {/* Weight warning */}
      {kpis.length > 0 && !weightOk && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>مجموع الأوزان = {totalWeight.toFixed(1)}% — يجب أن يكون 100%</span>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {[['all', 'الكل'], ...Object.entries(CATEGORIES)].map(([v, l]) => (
          <Button
            key={v}
            variant={categoryFilter === v ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryFilter(v)}
          >
            {l}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-12">جارٍ التحميل...</p>
      ) : error ? (
        <p className="text-center text-destructive py-12">خطأ: {String(error)}</p>
      ) : kpis.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">لا توجد مؤشرات</p>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {kpis.map((kpi: CompanyKPI) => (
            <KPICard
              key={kpi.id}
              kpi={kpi}
              year={selectedYear}
              onEdit={() => openEdit(kpi)}
              onDelete={() => { if (confirm('حذف هذا المؤشر؟')) deleteMutation.mutate(kpi.id) }}
            />
          ))}
        </div>
      )}

      {/* Form dialog */}
      <Dialog open={showForm} onOpenChange={(o) => { setShowForm(o); if (!o) setEditingKpi(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingKpi ? 'تعديل مؤشر' : 'إضافة مؤشر جديد'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {([['code', 'رمز المؤشر'], ['nameAr', 'الاسم بالعربي'], ['nameEn', 'الاسم بالإنجليزي']] as [keyof typeof emptyForm, string][]).map(([f, l]) => (
              <div key={f} className="space-y-1">
                <Label className="text-xs">{l}</Label>
                <Input value={String(form[f])} onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))} className="h-8 text-sm" />
              </div>
            ))}
            <div className="space-y-1">
              <Label className="text-xs">الفئة</Label>
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIES).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">الوزن (%)</Label>
              <Input type="number" value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: parseFloat(e.target.value) || 0 }))} className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">الهدف السنوي</Label>
              <Input type="number" value={form.target} onChange={(e) => setForm((p) => ({ ...p, target: parseFloat(e.target.value) || 0 }))} className="h-8 text-sm" />
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
