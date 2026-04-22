'use client'

import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { LayoutDashboard, CheckSquare, Building2, Users, MoreHorizontal } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { UserCheck, BarChart3, Bell, Settings } from 'lucide-react'

const primary = [
  { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { id: 'tasks', label: 'المهام', icon: CheckSquare },
  { id: 'properties', label: 'العقارات', icon: Building2 },
  { id: 'employees', label: 'الموظفون', icon: Users },
]

const more = [
  { id: 'managers', label: 'المديرون', icon: UserCheck },
  { id: 'company-kpis', label: 'مؤشرات الشركة', icon: BarChart3 },
  { id: 'alerts', label: 'التنبيهات', icon: Bell },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
]

export default function MobileNav() {
  const { activeSection, setActiveSection } = useAppStore()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-background border-t flex md:hidden">
      {primary.map((item) => {
        const Icon = item.icon
        const isActive = activeSection === item.id
        return (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        )
      })}
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs text-muted-foreground">
            <MoreHorizontal className="h-5 w-5" />
            <span>المزيد</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-1 mb-1" side="top" align="end">
          {more.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </PopoverContent>
      </Popover>
    </nav>
  )
}
