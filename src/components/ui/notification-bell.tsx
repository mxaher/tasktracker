'use client'

import { useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { alertsApi } from '@/lib/api'
import { useAppStore } from '@/lib/store'
import type { Alert } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

const severityIcon: Record<string, string> = {
  critical: '🔴',
  warning: '🟡',
  info: '🔵',
}

export function NotificationBell() {
  const { setUnreadAlertCount, unreadAlertCount } = useAppStore()
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['alerts-unread'],
    queryFn: async () => {
      const res = await alertsApi.list({ unread: true })
      return res.success ? res.data : []
    },
    refetchInterval: 60_000,
  })

  const { data: recentAlerts } = useQuery({
    queryKey: ['alerts-recent'],
    queryFn: async () => {
      const res = await alertsApi.list({ resolved: false })
      return res.success ? (res.data as Alert[]).slice(0, 10) : []
    },
    refetchInterval: 60_000,
  })

  const markRead = useMutation({
    mutationFn: (id: string) => alertsApi.update(id, { isRead: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts-unread'] })
      queryClient.invalidateQueries({ queryKey: ['alerts-recent'] })
    },
  })

  useEffect(() => {
    if (data) setUnreadAlertCount(data.length)
  }, [data, setUnreadAlertCount])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadAlertCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -end-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-semibold text-sm">الإشعارات</span>
          {unreadAlertCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto py-1"
              onClick={() => alertsApi.markAllRead().then(() => {
                queryClient.invalidateQueries({ queryKey: ['alerts-unread'] })
                queryClient.invalidateQueries({ queryKey: ['alerts-recent'] })
              })}
            >
              تحديد الكل كمقروء
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {!recentAlerts?.length ? (
            <p className="text-center text-muted-foreground text-sm py-6">لا توجد إشعارات</p>
          ) : (
            recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex gap-3 px-4 py-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${!alert.isRead ? 'bg-muted/20' : ''}`}
                onClick={() => !alert.isRead && markRead.mutate(alert.id)}
              >
                <span className="text-lg shrink-0">{severityIcon[alert.severity] ?? '🔵'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{alert.titleAr ?? alert.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true, locale: ar })}
                  </p>
                </div>
                {!alert.isRead && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
        <div className="px-4 py-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => useAppStore.getState().setActiveSection('alerts')}
          >
            عرض كل التنبيهات
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
