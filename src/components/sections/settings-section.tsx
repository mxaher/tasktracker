'use client'

import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companyApi, importApi } from '@/lib/api'
import type { ImportType } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, Building, LayoutDashboard, Upload, Users, Contact, Bell, Check, AlertCircle, Download, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

// ─── COMPANY TAB ───────────────────────────────────────────
function CompanyTab() {
  const qc = useQueryClient()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', nameAr: '', currency: 'SAR', language: 'ar', fiscalStart: 1 })

  const { isLoading } = useQuery({
    queryKey: ['company'],
    queryFn: async () => {
      const res = await companyApi.get()
      if (res.success && res.data) {
        setForm({ name: res.data.name, nameAr: res.data.nameAr ?? '', currency: res.data.currency, language: res.data.language, fiscalStart: res.data.fiscalStart })
      }
      return res.success ? res.data : null
    },
  })

  const saveMutation = useMutation({
    mutationFn: () => companyApi.update(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['company'] }); toast({ title: 'تم الحفظ' }) },
    onError: (e) => toast({ title: 'خطأ', description: String(e), variant: 'destructive' }),
  })

  if (isLoading) return <p className="text-center text-muted-foreground py-8">جارٍ التحميل...</p>

  return (
    <div className="space-y-6 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        {([
          ['nameAr', 'اسم الشركة (عربي)'],
          ['name', 'اسم الشركة (إنجليزي)'],
        ] as [keyof typeof form, string][]).map(([f, l]) => (
          <div key={f} className="space-y-1.5">
            <Label>{l}</Label>
            <Input value={String(form[f])} onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))} />
          </div>
        ))}
        <div className="space-y-1.5">
          <Label>العملة</Label>
          <Select value={form.currency} onValueChange={(v) => setForm((p) => ({ ...p, currency: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
              <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
              <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>بداية السنة المالية</Label>
          <Select value={String(form.fiscalStart)} onValueChange={(v) => setForm((p) => ({ ...p, fiscalStart: parseInt(v) }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'].map((m, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
        {saveMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
      </Button>
    </div>
  )
}

// ─── IMPORT WIZARD ─────────────────────────────────────────
const IMPORT_TYPES: Record<ImportType, string> = {
  properties: 'العقارات',
  collection: 'التحصيل الفعلي',
  aging: 'تقرير التقادم',
  employees: 'الموظفون',
  kpi_actuals: 'مؤشرات الأداء الفعلية',
}

interface ImportHistoryRow {
  id: string
  type: string
  filename: string
  period?: string
  rowCount: number
  status: string
  errorLog?: string
  createdAt: string
}

function ImportTab() {
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
  const [importType, setImportType] = useState<ImportType | ''>('')
  const [period, setPeriod] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string[][]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ status: string; rowCount: number; errorLog?: string } | null>(null)

  const { data: history = [], refetch: refetchHistory } = useQuery({
    queryKey: ['import-history'],
    queryFn: async () => {
      const res = await importApi.history()
      return res.success ? res.data : []
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const lines = text.trim().split('\n').slice(0, 11)
      setPreview(lines.map((l) => l.split(',').map((c) => c.trim().replace(/^"|"$/g, ''))))
      setStep(5)
    }
    reader.readAsText(f)
  }

  const handleImport = async () => {
    if (!file || !importType) return
    setImporting(true)
    try {
      const res = await importApi.upload(importType, period, file)
      if (res.success) {
        setResult({ status: res.data.status, rowCount: res.data.rowCount, errorLog: res.data.errorLog })
        setStep(6)
        refetchHistory()
      } else {
        toast({ title: 'خطأ في الاستيراد', description: res.error, variant: 'destructive' })
      }
    } catch (e) {
      toast({ title: 'خطأ', description: String(e), variant: 'destructive' })
    } finally {
      setImporting(false)
    }
  }

  const handleDownloadTemplate = async () => {
    if (!importType) return
    const res = await importApi.template(importType)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${importType}_template.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => { setStep(1); setImportType(''); setFile(null); setPreview([]); setResult(null) }

  const STATUS_LABEL: Record<string, string> = { complete: 'مكتمل', failed: 'فاشل', pending: 'معلق', processing: 'جارٍ' }
  const STATUS_COLOR: Record<string, string> = { complete: 'text-green-600', failed: 'text-red-600', processing: 'text-yellow-600', pending: 'text-muted-foreground' }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-4 w-4" /> معالج الاستيراد
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Steps indicator */}
          <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
            {['نوع البيانات', 'الفترة', 'تنزيل القالب', 'رفع الملف', 'معاينة', 'النتيجة'].map((s, i) => (
              <div key={s} className="flex items-center shrink-0">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${step > i + 1 ? 'bg-primary text-primary-foreground' : step === i + 1 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {step > i + 1 ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <span className={`text-xs ms-1 me-2 ${step === i + 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{s}</span>
                {i < 5 && <div className="w-4 h-px bg-border" />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">اختر نوع البيانات التي تريد استيرادها</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(IMPORT_TYPES).map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => { setImportType(v as ImportType); setStep(2) }}
                    className={`p-4 rounded-lg border text-sm font-medium transition-colors hover:bg-muted ${importType === v ? 'border-primary bg-primary/5' : ''}`}
                  >
                    <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">حدد الفترة الزمنية للبيانات</p>
              <div className="max-w-xs">
                <Label>الفترة (YYYY-MM)</Label>
                <Input value={period} onChange={(e) => setPeriod(e.target.value)} className="mt-1" placeholder="2026-04" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>رجوع</Button>
                <Button onClick={() => setStep(3)}>التالي</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">قم بتنزيل القالب وملئه بالبيانات</p>
              <Button variant="outline" onClick={handleDownloadTemplate} className="gap-2">
                <Download className="h-4 w-4" /> تنزيل قالب {importType ? IMPORT_TYPES[importType as ImportType] : ''}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>رجوع</Button>
                <Button onClick={() => setStep(4)}>التالي</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">ارفع ملف CSV أو XLSX</p>
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm">{file ? file.name : 'انقر لاختيار ملف أو اسحب وأفلت هنا'}</p>
                <p className="text-xs text-muted-foreground mt-1">CSV أو XLSX — الحد الأقصى 10 ميجابايت</p>
              </div>
              <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileChange} />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)}>رجوع</Button>
              </div>
            </div>
          )}

          {step === 5 && preview.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm font-medium">معاينة البيانات (أول 10 صفوف)</p>
              <div className="overflow-x-auto rounded border">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50">
                    <tr>{preview[0].map((h, i) => <th key={i} className="px-3 py-2 text-start font-medium">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {preview.slice(1).map((row, ri) => (
                      <tr key={ri} className="border-t">
                        {row.map((c, ci) => <td key={ci} className="px-3 py-2">{c}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">{preview.length - 1} صف في المعاينة</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(4)}>رجوع</Button>
                <Button onClick={handleImport} disabled={importing}>
                  {importing ? 'جارٍ الاستيراد...' : 'تأكيد الاستيراد'}
                </Button>
              </div>
            </div>
          )}

          {step === 6 && result && (
            <div className="space-y-4">
              <div className={`flex items-center gap-3 p-4 rounded-lg ${result.status === 'complete' ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'}`}>
                {result.status === 'complete' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <div>
                  <p className="font-medium">{result.status === 'complete' ? 'تم الاستيراد بنجاح' : 'فشل الاستيراد'}</p>
                  <p className="text-sm">{result.rowCount} صف تم استيراده</p>
                </div>
              </div>
              {result.errorLog && (
                <div className="p-3 rounded bg-muted text-xs font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {result.errorLog}
                </div>
              )}
              <Button onClick={reset}>استيراد جديد</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import history */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">سجل الاستيراد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-start py-2 px-3">النوع</th>
                    <th className="text-start py-2 px-3 hidden md:table-cell">الملف</th>
                    <th className="text-start py-2 px-3">الفترة</th>
                    <th className="text-end py-2 px-3">الصفوف</th>
                    <th className="text-end py-2 px-3">الحالة</th>
                    <th className="text-end py-2 px-3 hidden md:table-cell">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((r: ImportHistoryRow) => (
                    <tr key={r.id} className="border-t">
                      <td className="py-2 px-3">{IMPORT_TYPES[r.type as ImportType] ?? r.type}</td>
                      <td className="py-2 px-3 hidden md:table-cell text-muted-foreground text-xs truncate max-w-[150px]">{r.filename}</td>
                      <td className="py-2 px-3 text-muted-foreground text-xs">{r.period ?? '—'}</td>
                      <td className="py-2 px-3 text-end">{r.rowCount}</td>
                      <td className="py-2 px-3 text-end">
                        <span className={`text-xs font-medium ${STATUS_COLOR[r.status] ?? ''}`}>
                          {STATUS_LABEL[r.status] ?? r.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-end text-muted-foreground text-xs hidden md:table-cell">
                        {format(new Date(r.createdAt), 'yyyy/MM/dd')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─── MAIN SETTINGS SECTION ─────────────────────────────────
export default function SettingsSection() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="h-6 w-6" /> الإعدادات
      </h1>
      <Tabs defaultValue="company">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="company" className="gap-1.5"><Building className="h-3.5 w-3.5" /> الشركة</TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-1.5"><LayoutDashboard className="h-3.5 w-3.5" /> لوحة التحكم</TabsTrigger>
          <TabsTrigger value="import" className="gap-1.5"><Upload className="h-3.5 w-3.5" /> استيراد البيانات</TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5"><Users className="h-3.5 w-3.5" /> المستخدمون</TabsTrigger>
          <TabsTrigger value="contacts" className="gap-1.5"><Contact className="h-3.5 w-3.5" /> جهات الاتصال</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" /> الإشعارات</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-6">
          <CompanyTab />
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          <DashboardSettingsTab />
        </TabsContent>

        <TabsContent value="import" className="mt-6">
          <ImportTab />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UsersTab />
        </TabsContent>

        <TabsContent value="contacts" className="mt-6">
          <ContactsTab />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DashboardSettingsTab() {
  const [defaultYear, setDefaultYear] = useState(new Date().getFullYear())
  const [defaultMonth, setDefaultMonth] = useState(new Date().getMonth() + 1)
  const { toast } = useToast()
  return (
    <div className="space-y-4 max-w-md">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>السنة الافتراضية</Label>
          <Input type="number" value={defaultYear} onChange={(e) => setDefaultYear(parseInt(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <Label>الشهر الافتراضي</Label>
          <Input type="number" min={1} max={12} value={defaultMonth} onChange={(e) => setDefaultMonth(parseInt(e.target.value))} />
        </div>
      </div>
      <Button onClick={() => toast({ title: 'تم الحفظ' })}>حفظ</Button>
    </div>
  )
}

function UsersTab() {
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users')
      const json = await res.json()
      return json.data ?? []
    },
  })
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-start px-4 py-3">المستخدم</th>
            <th className="text-start px-4 py-3">البريد</th>
            <th className="text-start px-4 py-3">الدور</th>
            <th className="text-start px-4 py-3">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u: { id: string; name?: string; email: string; role: string; isActive: boolean }) => (
            <tr key={u.id} className="border-t">
              <td className="px-4 py-3 font-medium">{u.name ?? '—'}</td>
              <td className="px-4 py-3 text-muted-foreground text-xs">{u.email}</td>
              <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{u.role}</Badge></td>
              <td className="px-4 py-3">
                <Badge variant={u.isActive ? 'secondary' : 'destructive'} className="text-xs">
                  {u.isActive ? 'نشط' : 'غير نشط'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ContactsTab() {
  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts-settings'],
    queryFn: async () => {
      const res = await fetch('/api/settings/contacts')
      const json = await res.json()
      return json.data ?? []
    },
  })
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-start px-4 py-3">الاسم</th>
            <th className="text-start px-4 py-3">الهاتف</th>
            <th className="text-start px-4 py-3">البريد</th>
            <th className="text-start px-4 py-3">الدور</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c: { id: string; nameAr: string; phone?: string; email?: string; role?: string }) => (
            <tr key={c.id} className="border-t">
              <td className="px-4 py-3 font-medium">{c.nameAr}</td>
              <td className="px-4 py-3 text-muted-foreground text-xs">{c.phone ?? '—'}</td>
              <td className="px-4 py-3 text-muted-foreground text-xs">{c.email ?? '—'}</td>
              <td className="px-4 py-3 text-muted-foreground text-xs">{c.role ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function NotificationsTab() {
  const { toast } = useToast()
  const [botToken, setBotToken] = useState(process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? '')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [settingWebhook, setSettingWebhook] = useState(false)

  const setupWebhook = async () => {
    if (!webhookUrl) return
    setSettingWebhook(true)
    try {
      const res = await fetch('/api/telegram/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl }),
      })
      const json = await res.json()
      if (json.success) toast({ title: 'تم إعداد Webhook بنجاح' })
      else toast({ title: 'خطأ', description: json.error, variant: 'destructive' })
    } catch (e) {
      toast({ title: 'خطأ', description: String(e), variant: 'destructive' })
    } finally {
      setSettingWebhook(false)
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <Card>
        <CardHeader><CardTitle className="text-sm">بوت تيليجرام</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>رابط Webhook</Label>
            <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://your-domain.com/api/telegram/webhook" />
          </div>
          <Button onClick={setupWebhook} disabled={settingWebhook || !webhookUrl}>
            {settingWebhook ? 'جارٍ الإعداد...' : 'إعداد Webhook'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
