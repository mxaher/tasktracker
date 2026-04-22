'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertsApi } from '@/lib/api'
import type { Alert } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Check, CheckCheck, Trash2, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'

const SEVERITY_CONFIG = {
  critical: { label: 'حرج', icon: '🔴', badge: 'destructive' as const, bg: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900' },
  warning: { label: 'تحذير', icon: '🟡', badge: 'secondary' as const, bg: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900' },
  info: { label: 'معلومة', icon: '🔵', badge: 'secondary' as const, bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900' },
}

export default function AlertsSection() {
  const [severityFilter, setSeverityFilter] = useState('all')
  const [showResolved, setShowResolved] = useState(false)
  const qc = useQueryClient()
  const { toast } = useToast()

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts-page', severityFilter, showResolved],
    queryFn: async () => {
      const res = await alertsApi.list({
        severity: severityFilter === 'all' ? undefined : severityFilter,
        resolved: showResolved,
      })
      return res.success ? res.data : []
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Alert> }) => alertsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alerts-page'] })
      qc.invalidateQueries({ queryKey: ['alerts-unread'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => alertsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alerts-page'] })
      qc.invalidateQueries({ queryKey: ['alerts-unread'] })
      toast({ title: 'تم الحذف' })
    },
  })

  const markAllRead = useMutation({
    mutationFn: () => alertsApi.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alerts-page'] })
      qc.invalidateQueries({ queryKey: ['alerts-unread'] })
      toast({ title: 'تم تحديد الكل كمقروء' })
    },
  })

  const unreadCount = alerts.filter((a: Alert) => !a.isRead).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" /> التنبيهات
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">{unreadCount} غير مقروء</Badge>
          )}
        </h1>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => markAllRead.mutate()} className="gap-2">
              <CheckCheck className="h-4 w-4" /> تحديد الكل
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="المستوى" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="critical">حرج</SelectItem>
            <SelectItem value="warning">تحذير</SelectItem>
            <SelectItem value="info">معلومة</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={showResolved ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowResolved(!showResolved)}
        >
          {showResolved ? 'إخفاء المحلولة' : 'عرض المحلولة'}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-12">جارٍ التحميل...</p>
      ) : alerts.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">لا توجد تنبيهات</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert: Alert) => {
            const cfg = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.info
            return (
              <Card key={alert.id} className={`border transition-opacity ${cfg.bg} ${alert.isRead ? 'opacity-70' : ''}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl shrink-0">{cfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold">{alert.titleAr ?? alert.title}</p>
                        <Badge variant={cfg.badge} className="text-xs">{cfg.label}</Badge>
                        {alert.isResolved && <Badge variant="secondary" className="text-xs">محلولة</Badge>}
                        {!alert.isRead && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true, locale: ar })}
                        {alert.property && ` — ${alert.property.nameAr}`}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {!alert.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="تحديد كمقروء"
                          onClick={() => updateMutation.mutate({ id: alert.id, data: { isRead: true } })}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {!alert.isResolved && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-600"
                          title="تحديد كمحلولة"
                          onClick={() => updateMutation.mutate({ id: alert.id, data: { isResolved: true, resolvedAt: new Date().toISOString() } })}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteMutation.mutate(alert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
