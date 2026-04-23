'use client'

import { Suspense, lazy } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNav from './MobileNav'
import { useAppStore } from '@/lib/store'
import { Skeleton } from '@/components/ui/skeleton'

const TaskTrackerApp = lazy(() => import('@/components/TaskTrackerApp'))
const DashboardSection = lazy(() => import('@/components/sections/dashboard-section'))
const PropertiesSection = lazy(() => import('@/components/sections/properties-section'))
const ManagersSection = lazy(() => import('@/components/sections/managers-section'))
const EmployeesSection = lazy(() => import('@/components/sections/employees-section'))
const CompanyKpisSection = lazy(() => import('@/components/sections/company-kpis-section'))
const AlertsSection = lazy(() => import('@/components/sections/alerts-section'))
const SettingsSection = lazy(() => import('@/components/sections/settings-section'))

function SectionFallback() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

function ActiveSection({ section }: { section: string }) {
  switch (section) {
    case 'dashboard': return <DashboardSection />
    case 'tasks': return <TaskTrackerApp />
    case 'properties': return <PropertiesSection />
    case 'managers': return <ManagersSection />
    case 'employees': return <EmployeesSection />
    case 'company-kpis': return <CompanyKpisSection />
    case 'alerts': return <AlertsSection />
    case 'settings': return <SettingsSection />
    default: return <DashboardSection />
  }
}

export default function AppShell() {
  const { activeSection } = useAppStore()

  return (
    <div dir="rtl" className="flex h-screen overflow-hidden bg-background text-right">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <Suspense fallback={<SectionFallback />}>
            <ActiveSection section={activeSection} />
          </Suspense>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}
