'use client'

import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  CheckSquare,
  Building2,
  Users,
  UserCheck,
  BarChart3,
  Bell,
  Settings,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  badge?: number
}

const mainNav: NavItem[] = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { id: 'tasks', label: 'المهام', icon: CheckSquare },
  { id: 'properties', label: 'العقارات', icon: Building2 },
  { id: 'managers', label: 'المديرون', icon: UserCheck },
  { id: 'employees', label: 'الموظفون والمؤشرات', icon: Users },
  { id: 'company-kpis', label: 'مؤشرات الشركة', icon: BarChart3 },
]

const bottomNav: NavItem[] = [
  { id: 'alerts', label: 'التنبيهات', icon: Bell },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, activeSection, setActiveSection, unreadAlertCount } = useAppStore()

  const alertNav = bottomNav.map((n) =>
    n.id === 'alerts' ? { ...n, badge: unreadAlertCount } : n
  )

  const NavLink = ({ item }: { item: NavItem }) => {
    const Icon = item.icon
    const isActive = activeSection === item.id
    return (
      <button
        onClick={() => setActiveSection(item.id)}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
            : 'text-sidebar-foreground',
          sidebarCollapsed && 'justify-center px-2'
        )}
        title={sidebarCollapsed ? item.label : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!sidebarCollapsed && (
          <>
            <span className="flex-1 text-start">{item.label}</span>
            {item.badge != null && item.badge > 0 && (
              <Badge variant="destructive" className="h-5 min-w-5 px-1 text-xs">
                {item.badge > 99 ? '99+' : item.badge}
              </Badge>
            )}
          </>
        )}
        {sidebarCollapsed && item.badge != null && item.badge > 0 && (
          <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-destructive" />
        )}
      </button>
    )
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-sidebar border-e border-sidebar-border transition-all duration-200 shrink-0',
        sidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      {/* Header */}
      <div className={cn('flex items-center border-b border-sidebar-border p-4', sidebarCollapsed && 'justify-center p-3')}>
        {!sidebarCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sidebar-foreground text-sm truncate">منصة الأداء الاستراتيجي</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {sidebarCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {mainNav.map((item) => (
          <NavLink key={item.id} item={item} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="p-2 border-t border-sidebar-border space-y-0.5">
        {alertNav.map((item) => (
          <NavLink key={item.id} item={item} />
        ))}
      </div>
    </aside>
  )
}
