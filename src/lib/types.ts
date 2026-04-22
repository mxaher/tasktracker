// ─── ENUMS ─────────────────────────────────────────────────
export type PropertyType =
  | 'commercial_market'
  | 'warehouse'
  | 'industrial'
  | 'hotel'
  | 'residential'
  | 'offices'
  | 'land'
  | 'mixed'

export type AlertSeverity = 'critical' | 'warning' | 'info'
export type KPICategory = 'financial' | 'organizational'
export type CompanyKPICategory = 'financial' | 'strategic' | 'operational' | 'organizational'
export type ImportType =
  | 'properties'
  | 'employees'
  | 'kpi_actuals'
  | 'aging'
  | 'collection'
export type ImportStatus = 'pending' | 'processing' | 'complete' | 'failed'

// ─── API ENVELOPE ──────────────────────────────────────────
export interface ApiSuccess<T> {
  success: true
  data: T
}
export interface ApiError {
  success: false
  error: string
}
export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ─── COMPANY ───────────────────────────────────────────────
export interface Company {
  id: string
  name: string
  nameAr?: string
  logo?: string
  fiscalStart: number
  currency: string
  language: string
  createdAt: string
  updatedAt: string
}

// ─── EMPLOYEE POSITION ─────────────────────────────────────
export interface EmployeePosition {
  id: string
  nameAr: string
  nameEn?: string
  grade?: string
  createdAt: string
}

// ─── EMPLOYEE ──────────────────────────────────────────────
export interface Employee {
  id: string
  nameAr: string
  nameEn?: string
  email?: string
  positionId?: string
  position?: EmployeePosition
  department?: string
  managedById?: string
  managedBy?: Pick<Employee, 'id' | 'nameAr'>
  isActive: boolean
  joinedAt?: string
  userId?: string
  createdAt: string
  updatedAt: string
  properties?: Property[]
  // Computed
  financialAchievement?: number
  orgAchievement?: number
  overallAchievement?: number
}

// ─── PROPERTY ──────────────────────────────────────────────
export interface Property {
  id: string
  code: string
  nameAr: string
  nameEn?: string
  type: PropertyType
  location?: string
  totalUnits: number
  managerId?: string
  manager?: Pick<Employee, 'id' | 'nameAr'>
  occupancyRate: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  // Computed metrics
  annualTarget?: number
  ytdCollected?: number
  monthlyTarget?: number
  monthlyCollected?: number
  achievement?: number
  agingTotal?: number
}

export interface PropertyAnnualTarget {
  id: string
  propertyId: string
  year: number
  annualTarget: number
  createdAt: string
  updatedAt: string
}

export interface PropertyMonthlyTarget {
  id: string
  propertyId: string
  year: number
  month: number
  target: number
  createdAt: string
}

export interface PropertyCollectionActual {
  id: string
  propertyId: string
  year: number
  month: number
  collected: number
  invoiced: number
  createdAt: string
}

export interface PropertyAgingReport {
  id: string
  propertyId: string
  year: number
  month: number
  bucket0to20: number
  bucket21to60: number
  bucket61to90: number
  bucketOver90: number
  createdAt: string
}

export interface PropertyTargetVersion {
  id: string
  propertyId: string
  year: number
  version: number
  annualTarget: number
  note?: string
  createdAt: string
}

// ─── MANAGER METRICS ───────────────────────────────────────
export interface PropertyMetric {
  propertyId: string
  propertyCode: string
  propertyName: string
  target: number
  collected: number
  achievement: number
}

export interface ManagerMetrics {
  employee: Employee
  propertiesCount: number
  totalTarget: number
  totalCollected: number
  achievement: number
  propertyBreakdown: PropertyMetric[]
}

// ─── KPI ───────────────────────────────────────────────────
export interface KPI {
  id: string
  code: string
  nameAr: string
  nameEn?: string
  category: KPICategory
  unit?: string
  weight: number
  isActive: boolean
  createdAt: string
}

export interface EmployeeKPITarget {
  id: string
  employeeId: string
  kpiId: string
  kpi?: KPI
  year: number
  target: number
  weight: number
  createdAt: string
}

export interface EmployeeCustomKPI {
  id: string
  employeeId: string
  nameAr: string
  nameEn?: string
  category: KPICategory
  unit?: string
  year: number
  target: number
  actual: number
  weight: number
  createdAt: string
  updatedAt: string
}

export interface KPIActual {
  id: string
  employeeId?: string
  kpiId: string
  year: number
  month: number
  actual: number
  createdAt: string
}

// ─── COMPANY KPI ───────────────────────────────────────────
export interface CompanyKPI {
  id: string
  year: number
  code: string
  nameAr: string
  nameEn?: string
  category: CompanyKPICategory
  weight: number
  target: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  monthlyData?: CompanyKPIMonthly[]
  // Computed
  achievement?: number
}

export interface CompanyKPIMonthly {
  id: string
  kpiId: string
  year: number
  month: number
  actual: number
  createdAt: string
}

// ─── ALERT ─────────────────────────────────────────────────
export interface Alert {
  id: string
  title: string
  titleAr?: string
  message: string
  severity: AlertSeverity
  propertyId?: string
  property?: Pick<Property, 'id' | 'code' | 'nameAr'>
  isRead: boolean
  isResolved: boolean
  createdAt: string
  resolvedAt?: string
}

// ─── TELEGRAM ──────────────────────────────────────────────
export interface TelegramUser {
  id: string
  chatId: string
  userId?: string
  username?: string
  firstName?: string
  isActive: boolean
  createdAt: string
}

export interface TelegramLog {
  id: string
  chatId: string
  direction: 'inbound' | 'outbound'
  type: 'command' | 'message' | 'callback'
  payload: string
  taskId?: string
  createdAt: string
}

// ─── IMPORT ────────────────────────────────────────────────
export interface ImportRecord {
  id: string
  type: ImportType
  filename: string
  period?: string
  rowCount: number
  status: ImportStatus
  errorLog?: string
  uploadedBy?: string
  createdAt: string
}

// ─── DASHBOARD STATS ───────────────────────────────────────
export interface DashboardStats {
  tasks: {
    total: number
    completed: number
    inProgress: number
    delayed: number
    notStarted: number
  }
  properties: {
    total: number
    avgAchievement: number
    avgOccupancy: number
    totalTarget: number
    totalCollected: number
  }
}

// ─── PERIOD SELECTOR ───────────────────────────────────────
export interface Period {
  year: number
  month: number
}
