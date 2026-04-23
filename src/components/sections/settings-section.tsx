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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import ContactsManagementTab from '@/components/settings/ContactsTab'
import {
  Settings,
  Building,
  LayoutDashboard,
  Upload,
  Contact,
  Bell,
  Check,
  AlertCircle,
  Download,
  FileText,
  MessageSquare,
  Mail,
  RefreshCw,
  Link2,
  Unlink,
} from 'lucide-react'
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company'] })
      toast({ title: 'تم الحفظ' })
    },
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
          <Select value={String(form.fiscalStart)} onValueChange={(v) => setForm((p) => ({ ...p, fiscalStart: parseInt(v, 10) }))}>
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
  const qc = useQueryClient()
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
        // Invalidate related caches so tables reflect imported data
        qc.invalidateQueries({ queryKey: ['properties'] })
        qc.invalidateQueries({ queryKey: ['employees'] })
        qc.invalidateQueries({ queryKey: ['kpis'] })
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

  const reset = () => {
    setStep(1)
    setImportType('')
    setFile(null)
    setPreview([])
    setResult(null)
  }

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
                    <tr>{preview[0].map((h, i) => <th key={i} className="px-3 py-2 text-right font-medium">{h}</th>)}</tr>
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
                    <th className="text-right py-2 px-3">النوع</th>
                    <th className="text-right py-2 px-3 hidden md:table-cell">الملف</th>
                    <th className="text-right py-2 px-3">الفترة</th>
                    <th className="text-right py-2 px-3">الصفوف</th>
                    <th className="text-right py-2 px-3">الحالة</th>
                    <th className="text-right py-2 px-3 hidden md:table-cell">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((r: ImportHistoryRow) => (
                    <tr key={r.id} className="border-t">
                      <td className="py-2 px-3">{IMPORT_TYPES[r.type as ImportType] ?? r.type}</td>
                      <td className="py-2 px-3 hidden md:table-cell text-muted-foreground text-xs truncate max-w-[150px]">{r.filename}</td>
                      <td className="py-2 px-3 text-muted-foreground text-xs">{r.period ?? '—'}</td>
                      <td className="py-2 px-3 text-right">{r.rowCount}</td>
                      <td className="py-2 px-3 text-right">
                        <span className={`text-xs font-medium ${STATUS_COLOR[r.status] ?? ''}`}>
                          {STATUS_LABEL[r.status] ?? r.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-muted-foreground text-xs hidden md:table-cell">
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

interface GlobalSettings {
  adminEmail: string
  dailyDigestEnabled: boolean
  dailyDigestTime: string
  weeklyReportEnabled: boolean
  weeklyReportDay: number
  weeklyReportTime: string
  inProgressReportEnabled: boolean
  inProgressReportFrequency: 'daily' | 'weekly'
  taskReminderEnabled: boolean
  overdueReminderEnabled: boolean
  customReminderDates: string
  reminderDaysBefore: number
  whatsappOwnerRemindersEnabled: boolean
  whatsappReminderOffsets: string
  whatsappReminderTemplate: string
}

interface ReminderRunSummary {
  sentOwners: Array<{ ownerName: string }>
  skippedTasks: Array<{ taskId: string; ownerName: string; reason: string }>
  failedOwners: Array<{ ownerName: string; error: string }>
}

interface TelegramAccount {
  id: string
  chatId: string
  userId: string
  createdAt: string
  user: {
    name: string | null
    email: string
    role: string
  }
}

interface TelegramLog {
  id: string
  chatId: string
  messagePreview: string
  parsed: boolean
  parseError: string | null
  taskId: string | null
  createdAt: string
}

interface WebhookInfo {
  url?: string
  pending_update_count?: number
  last_error_message?: string
}

const DEFAULT_SETTINGS: GlobalSettings = {
  adminEmail: '',
  dailyDigestEnabled: false,
  dailyDigestTime: '09:00',
  weeklyReportEnabled: false,
  weeklyReportDay: 1,
  weeklyReportTime: '09:00',
  inProgressReportEnabled: false,
  inProgressReportFrequency: 'daily',
  taskReminderEnabled: true,
  overdueReminderEnabled: true,
  customReminderDates: '',
  reminderDaysBefore: 3,
  whatsappOwnerRemindersEnabled: false,
  whatsappReminderOffsets: '0,1',
  whatsappReminderTemplate: 'مرحبًا {{ownerName}}، هذا تذكير بخصوص المهمة {{taskTitle}} (رقم المهمة {{taskId}}). تاريخ الاستحقاق: {{dueDate}}. الأولوية: {{priority}}.',
}

function NotificationsTab() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS)
  const [sendingTest, setSendingTest] = useState(false)
  const [sendingTaskReminders, setSendingTaskReminders] = useState(false)
  const [sendingOwnerRemindersNow, setSendingOwnerRemindersNow] = useState(false)
  const [ownerReminderSummary, setOwnerReminderSummary] = useState<ReminderRunSummary | null>(null)
  const [appUrl, setAppUrl] = useState('')
  const [chatId, setChatId] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')

  useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings')
      if (!response.ok) throw new Error('تعذر تحميل الإعدادات')
      const data = await response.json()
      if (data.settings) {
        setSettings({
          adminEmail: data.settings.adminEmail || '',
          dailyDigestEnabled: data.settings.dailyDigestEnabled || false,
          dailyDigestTime: data.settings.dailyDigestTime || '09:00',
          weeklyReportEnabled: data.settings.weeklyReportEnabled || false,
          weeklyReportDay: data.settings.weeklyReportDay || 1,
          weeklyReportTime: data.settings.weeklyReportTime || '09:00',
          inProgressReportEnabled: data.settings.inProgressReportEnabled || false,
          inProgressReportFrequency: data.settings.inProgressReportFrequency || 'daily',
          taskReminderEnabled: data.settings.taskReminderEnabled ?? true,
          overdueReminderEnabled: data.settings.overdueReminderEnabled ?? true,
          customReminderDates: data.settings.customReminderDates || '',
          reminderDaysBefore: data.settings.reminderDaysBefore ?? 3,
          whatsappOwnerRemindersEnabled: data.settings.whatsappOwnerRemindersEnabled ?? false,
          whatsappReminderOffsets: data.settings.whatsappReminderOffsets || '0,1',
          whatsappReminderTemplate: data.settings.whatsappReminderTemplate || DEFAULT_SETTINGS.whatsappReminderTemplate,
        })
      }
      return data.settings
    },
  })

  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!response.ok) {
        throw new Error('تعذر حفظ الإعدادات')
      }
      return response.json()
    },
    onSuccess: () => {
      toast({ title: 'تم حفظ الإعدادات بنجاح' })
      queryClient.invalidateQueries({ queryKey: ['global-settings'] })
    },
    onError: (error) => {
      toast({ title: 'خطأ', description: String(error), variant: 'destructive' })
    },
  })

  const { data: webhookInfo, refetch: refetchWebhookInfo } = useQuery({
    queryKey: ['telegram-webhook-info'],
    queryFn: async () => {
      const response = await fetch('/api/telegram/settings/webhook')
      const data = await response.json()
      return (data.webhookInfo ?? null) as WebhookInfo | null
    },
  })

  const { data: linkedAccounts = [] } = useQuery({
    queryKey: ['telegram-linked-accounts'],
    queryFn: async () => {
      const response = await fetch('/api/telegram/settings/linked-accounts')
      const data = await response.json()
      return (data.accounts ?? []) as TelegramAccount[]
    },
  })

  const { data: telegramLogs = [] } = useQuery({
    queryKey: ['telegram-logs'],
    queryFn: async () => {
      const response = await fetch('/api/telegram/settings/logs')
      const data = await response.json()
      return (data.logs ?? []) as TelegramLog[]
    },
  })

  const { data: users = [] } = useQuery({
    queryKey: ['users-list-settings'],
    queryFn: async () => {
      const response = await fetch('/api/users')
      const data = await response.json()
      return (data.users ?? data.data ?? []) as Array<{ id: string; name?: string; email: string }>
    },
  })

  const setupWebhookMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/telegram/settings/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appUrl }),
      })
      const data = await response.json()
      if (!response.ok || data.ok === false) {
        throw new Error(data.description || data.error || 'تعذر إعداد Webhook')
      }
      return data
    },
    onSuccess: () => {
      toast({ title: 'تم إعداد Webhook بنجاح' })
      refetchWebhookInfo()
    },
    onError: (error) => {
      toast({ title: 'خطأ', description: String(error), variant: 'destructive' })
    },
  })

  const linkAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/telegram/settings/linked-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, userId: selectedUserId }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'تعذر ربط الحساب')
      }
      return data
    },
    onSuccess: () => {
      toast({ title: 'تم ربط الحساب بنجاح' })
      setChatId('')
      setSelectedUserId('')
      queryClient.invalidateQueries({ queryKey: ['telegram-linked-accounts'] })
    },
    onError: (error) => {
      toast({ title: 'خطأ', description: String(error), variant: 'destructive' })
    },
  })

  const unlinkAccountMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/telegram/settings/linked-accounts/${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'تعذر فك الربط')
      }
      return data
    },
    onSuccess: () => {
      toast({ title: 'تم فك الربط' })
      queryClient.invalidateQueries({ queryKey: ['telegram-linked-accounts'] })
    },
    onError: (error) => {
      toast({ title: 'خطأ', description: String(error), variant: 'destructive' })
    },
  })

  const handleSendTestEmail = async () => {
    if (!settings.adminEmail) {
      toast({ title: 'خطأ', description: 'يرجى إدخال البريد الإلكتروني للمشرف أولًا', variant: 'destructive' })
      return
    }
    setSendingTest(true)
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'in-progress-report', reportType: 'daily' }),
      })
      if (!response.ok) throw new Error('تعذر إرسال رسالة الاختبار')
      toast({ title: 'تم إرسال رسالة الاختبار بنجاح' })
    } catch (error) {
      toast({ title: 'خطأ', description: String(error), variant: 'destructive' })
    } finally {
      setSendingTest(false)
    }
  }

  const handleSendTaskReminders = async () => {
    setSendingTaskReminders(true)
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'overdue-all' }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'تعذر إرسال التذكيرات')
      }
      toast({ title: `تم إرسال ${data.sent ?? 0} تذكير، وفشل ${data.failed ?? 0}` })
    } catch (error) {
      toast({ title: 'خطأ', description: String(error), variant: 'destructive' })
    } finally {
      setSendingTaskReminders(false)
    }
  }

  const handleSendOwnerReminderNow = async () => {
    setSendingOwnerRemindersNow(true)
    try {
      const response = await fetch('/api/settings/reminders/send-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: false }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'تعذر تشغيل تذكيرات واتساب')
      }
      setOwnerReminderSummary(data.result as ReminderRunSummary)
      toast({ title: 'تم تشغيل تذكيرات واتساب الآن' })
    } catch (error) {
      toast({ title: 'خطأ', description: String(error), variant: 'destructive' })
    } finally {
      setSendingOwnerRemindersNow(false)
    }
  }

  return (
    <Tabs defaultValue="email" className="space-y-6">
      <TabsList className="flex-wrap h-auto gap-1">
        <TabsTrigger value="email" className="gap-1.5"><Mail className="h-3.5 w-3.5" /> البريد والتذكيرات</TabsTrigger>
        <TabsTrigger value="telegram" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> تيليجرام</TabsTrigger>
      </TabsList>

      <TabsContent value="email" className="space-y-6 mt-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">إعدادات البريد والتقارير</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 max-w-3xl">
            <div className="space-y-1.5">
              <Label>البريد الإلكتروني للمشرف</Label>
              <Input
                value={settings.adminEmail}
                onChange={(e) => setSettings((p) => ({ ...p, adminEmail: e.target.value }))}
                placeholder="admin@example.com"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">تقرير يومي</Label>
                  <Switch
                    checked={settings.dailyDigestEnabled}
                    onCheckedChange={(checked) => setSettings((p) => ({ ...p, dailyDigestEnabled: checked }))}
                  />
                </div>
                <Input
                  type="time"
                  value={settings.dailyDigestTime}
                  onChange={(e) => setSettings((p) => ({ ...p, dailyDigestTime: e.target.value }))}
                />
              </div>

              <div className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">تقرير أسبوعي</Label>
                  <Switch
                    checked={settings.weeklyReportEnabled}
                    onCheckedChange={(checked) => setSettings((p) => ({ ...p, weeklyReportEnabled: checked }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={String(settings.weeklyReportDay)}
                    onValueChange={(value) => setSettings((p) => ({ ...p, weeklyReportDay: parseInt(value, 10) }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">الأحد</SelectItem>
                      <SelectItem value="1">الاثنين</SelectItem>
                      <SelectItem value="2">الثلاثاء</SelectItem>
                      <SelectItem value="3">الأربعاء</SelectItem>
                      <SelectItem value="4">الخميس</SelectItem>
                      <SelectItem value="5">الجمعة</SelectItem>
                      <SelectItem value="6">السبت</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="time"
                    value={settings.weeklyReportTime}
                    onChange={(e) => setSettings((p) => ({ ...p, weeklyReportTime: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">تنبيهات المهام</Label>
                  <Switch
                    checked={settings.taskReminderEnabled}
                    onCheckedChange={(checked) => setSettings((p) => ({ ...p, taskReminderEnabled: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تنبيهات التأخير</Label>
                  <Switch
                    checked={settings.overdueReminderEnabled}
                    onCheckedChange={(checked) => setSettings((p) => ({ ...p, overdueReminderEnabled: checked }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>قبل الاستحقاق (أيام)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={settings.reminderDaysBefore}
                    onChange={(e) => setSettings((p) => ({ ...p, reminderDaysBefore: parseInt(e.target.value, 10) || 3 }))}
                  />
                </div>
              </div>

              <div className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">واتساب للمسؤولين</Label>
                  <Switch
                    checked={settings.whatsappOwnerRemindersEnabled}
                    onCheckedChange={(checked) => setSettings((p) => ({ ...p, whatsappOwnerRemindersEnabled: checked }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Offsets (أيام)</Label>
                  <Input
                    value={settings.whatsappReminderOffsets}
                    onChange={(e) => setSettings((p) => ({ ...p, whatsappReminderOffsets: e.target.value }))}
                    placeholder="0,1,3"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>قالب الرسالة</Label>
                  <Textarea
                    value={settings.whatsappReminderTemplate}
                    onChange={(e) => setSettings((p) => ({ ...p, whatsappReminderTemplate: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>تواريخ مخصصة (CSV)</Label>
              <Textarea
                value={settings.customReminderDates}
                onChange={(e) => setSettings((p) => ({ ...p, customReminderDates: e.target.value }))}
                rows={2}
                placeholder="2026-05-01,2026-05-15"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => saveSettingsMutation.mutate()} disabled={saveSettingsMutation.isPending}>
                {saveSettingsMutation.isPending ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                حفظ إعدادات الإشعارات
              </Button>
              <Button variant="outline" onClick={handleSendTestEmail} disabled={sendingTest || !settings.adminEmail}>
                {sendingTest ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                إرسال اختبار بريد
              </Button>
              <Button variant="outline" onClick={handleSendTaskReminders} disabled={sendingTaskReminders}>
                {sendingTaskReminders ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                إرسال تذكيرات المهام الآن
              </Button>
              <Button variant="outline" onClick={handleSendOwnerReminderNow} disabled={sendingOwnerRemindersNow}>
                {sendingOwnerRemindersNow ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                تشغيل تذكيرات واتساب الآن
              </Button>
            </div>

            {ownerReminderSummary && (
              <div className="rounded-lg border p-3 text-sm">
                <p>تم الإرسال لـ {ownerReminderSummary.sentOwners.length} مسؤول</p>
                <p>تم تخطي {ownerReminderSummary.skippedTasks.length} مهمة</p>
                <p>فشل {ownerReminderSummary.failedOwners.length} مسؤول</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="telegram" className="space-y-6 mt-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Webhook تيليجرام</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5 max-w-xl">
              <Label>رابط التطبيق الأساسي (App URL)</Label>
              <Input value={appUrl} onChange={(e) => setAppUrl(e.target.value)} placeholder="https://your-domain.com" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setupWebhookMutation.mutate()} disabled={setupWebhookMutation.isPending || !appUrl}>
                {setupWebhookMutation.isPending ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                إعداد Webhook تلقائيًا
              </Button>
              <Button variant="outline" onClick={() => refetchWebhookInfo()}>
                تحديث الحالة
              </Button>
            </div>
            <div className="rounded-lg border p-3 text-sm space-y-1">
              <p>Webhook الحالي: {webhookInfo?.url || 'غير مضبوط'}</p>
              <p>Pending updates: {webhookInfo?.pending_update_count ?? 0}</p>
              {webhookInfo?.last_error_message ? (
                <p className="text-destructive">آخر خطأ: {webhookInfo.last_error_message}</p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ربط الحسابات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-2">
              <Input value={chatId} onChange={(e) => setChatId(e.target.value)} placeholder="Chat ID" />
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger><SelectValue placeholder="اختر مستخدم" /></SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name || u.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => linkAccountMutation.mutate()}
                disabled={linkAccountMutation.isPending || !chatId || !selectedUserId}
              >
                <Link2 className="h-4 w-4 mr-2" />
                ربط
              </Button>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-right px-3 py-2">Chat ID</th>
                    <th className="text-right px-3 py-2">المستخدم</th>
                    <th className="text-right px-3 py-2">التاريخ</th>
                    <th className="text-right px-3 py-2">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedAccounts.map((a) => (
                    <tr key={a.id} className="border-t">
                      <td className="px-3 py-2 font-mono text-xs">{a.chatId}</td>
                      <td className="px-3 py-2">{a.user.name || a.user.email}</td>
                      <td className="px-3 py-2 text-muted-foreground text-xs">{format(new Date(a.createdAt), 'yyyy/MM/dd')}</td>
                      <td className="px-3 py-2 text-right">
                        <Button variant="ghost" size="sm" onClick={() => unlinkAccountMutation.mutate(a.id)}>
                          <Unlink className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {linkedAccounts.length === 0 && (
                    <tr>
                      <td className="px-3 py-3 text-muted-foreground text-sm" colSpan={4}>لا توجد حسابات مرتبطة</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">سجل رسائل تيليجرام (آخر 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-right px-3 py-2">Chat</th>
                    <th className="text-right px-3 py-2">الرسالة</th>
                    <th className="text-right px-3 py-2">الحالة</th>
                    <th className="text-right px-3 py-2">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {telegramLogs.map((log) => (
                    <tr key={log.id} className="border-t">
                      <td className="px-3 py-2 font-mono text-xs">{log.chatId}</td>
                      <td className="px-3 py-2 text-xs">{log.messagePreview}</td>
                      <td className="px-3 py-2">
                        <Badge variant={log.parsed ? 'secondary' : 'destructive'} className="text-xs">
                          {log.parsed ? 'Parsed' : 'Failed'}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground text-xs">{format(new Date(log.createdAt), 'yyyy/MM/dd HH:mm')}</td>
                    </tr>
                  ))}
                  {telegramLogs.length === 0 && (
                    <tr>
                      <td className="px-3 py-3 text-muted-foreground text-sm" colSpan={4}>لا توجد سجلات</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

// ─── MAIN SETTINGS SECTION ─────────────────────────────────
export default function SettingsSection() {
  return (
    <div dir="rtl" className="p-6 space-y-6 text-right">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="h-6 w-6" /> الإعدادات العامة
      </h1>
      <Tabs defaultValue="company">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="company" className="gap-1.5"><Building className="h-3.5 w-3.5" /> الشركة</TabsTrigger>
          <TabsTrigger value="dashboard" className="gap-1.5"><LayoutDashboard className="h-3.5 w-3.5" /> لوحة التحكم</TabsTrigger>
          <TabsTrigger value="import" className="gap-1.5"><Upload className="h-3.5 w-3.5" /> استيراد البيانات</TabsTrigger>
          <TabsTrigger value="contacts" className="gap-1.5"><Contact className="h-3.5 w-3.5" /> قائمة جهات الاتصال</TabsTrigger>
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

        <TabsContent value="contacts" className="mt-6">
          <ContactsManagementTab />
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
          <Input type="number" value={defaultYear} onChange={(e) => setDefaultYear(parseInt(e.target.value, 10))} />
        </div>
        <div className="space-y-1.5">
          <Label>الشهر الافتراضي</Label>
          <Input type="number" min={1} max={12} value={defaultMonth} onChange={(e) => setDefaultMonth(parseInt(e.target.value, 10))} />
        </div>
      </div>
      <Button onClick={() => toast({ title: 'تم الحفظ' })}>حفظ</Button>
    </div>
  )
}
