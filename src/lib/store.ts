import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppStore {
  // Global period selector
  selectedYear: number
  selectedMonth: number
  setSelectedYear: (year: number) => void
  setSelectedMonth: (month: number) => void

  // UI state
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  activeSection: string
  setActiveSection: (section: string) => void

  // Alerts
  unreadAlertCount: number
  setUnreadAlertCount: (count: number) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      setSelectedYear: (year) => set({ selectedYear: year }),
      setSelectedMonth: (month) => set({ selectedMonth: month }),

      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      activeSection: 'dashboard',
      setActiveSection: (section) => set({ activeSection: section }),

      unreadAlertCount: 0,
      setUnreadAlertCount: (count) => set({ unreadAlertCount: count }),
    }),
    {
      name: 'strategy-platform-store',
      partialize: (state) => ({
        selectedYear: state.selectedYear,
        selectedMonth: state.selectedMonth,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)
