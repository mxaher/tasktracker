import type {
  Property,
  Employee,
  EmployeeCustomKPI,
  CompanyKPI,
  Alert,
  ImportRecord,
  ManagerMetrics,
  KPI,
  EmployeeKPITarget,
  KPIActual,
  Company,
  ApiResponse,
  ImportType,
} from './types'

// ─── HELPERS ───────────────────────────────────────────────
function qs(params: Record<string, string | number | boolean | undefined>) {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) p.set(k, String(v))
  }
  return p.toString()
}

function json(data: unknown) {
  return JSON.stringify(data)
}

async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  return res.json() as Promise<ApiResponse<T>>
}

// ─── COMPANY ───────────────────────────────────────────────
export const companyApi = {
  get: () => apiFetch<Company>('/api/company'),
  update: (data: Partial<Company>) =>
    apiFetch<Company>('/api/company', { method: 'PUT', body: json(data) }),
}

// ─── PROPERTIES ────────────────────────────────────────────
export const propertiesApi = {
  list: (params?: {
    year?: number
    month?: number
    type?: string
    search?: string
    active?: boolean
  }) => apiFetch<Property[]>(`/api/properties?${qs(params ?? {})}`),

  get: (id: string) => apiFetch<Property>(`/api/properties/${id}`),

  create: (data: Partial<Property>) =>
    apiFetch<Property>('/api/properties', { method: 'POST', body: json(data) }),

  update: (id: string, data: Partial<Property>) =>
    apiFetch<Property>(`/api/properties/${id}`, { method: 'PUT', body: json(data) }),

  delete: (id: string) =>
    apiFetch<{ id: string }>(`/api/properties/${id}`, { method: 'DELETE' }),

  assignManager: (id: string, managerId: string | null) =>
    apiFetch<Property>(`/api/properties/${id}/manager`, {
      method: 'PATCH',
      body: json({ managerId }),
    }),

  updateOccupancy: (id: string, occupancyRate: number) =>
    apiFetch<Property>(`/api/properties/${id}/occupancy`, {
      method: 'PATCH',
      body: json({ occupancyRate }),
    }),
}

// ─── TARGETS ───────────────────────────────────────────────
export const targetsApi = {
  list: (params: { propertyId: string; year: number }) =>
    apiFetch<{ annual: unknown; monthly: unknown[] }>(`/api/targets?${qs(params)}`),

  upsertAnnual: (data: { propertyId: string; year: number; annualTarget: number }) =>
    apiFetch<unknown>('/api/targets/annual', { method: 'POST', body: json(data) }),

  upsertMonthly: (data: {
    propertyId: string
    year: number
    month: number
    target: number
  }) => apiFetch<unknown>('/api/targets/monthly', { method: 'POST', body: json(data) }),
}

// ─── ACTUALS ───────────────────────────────────────────────
export const actualsApi = {
  list: (params: { propertyId: string; year: number }) =>
    apiFetch<unknown[]>(`/api/actuals?${qs(params)}`),

  upsert: (data: {
    propertyId: string
    year: number
    month: number
    collected: number
    invoiced?: number
  }) => apiFetch<unknown>('/api/actuals', { method: 'POST', body: json(data) }),
}

// ─── MANAGERS ──────────────────────────────────────────────
export const managersApi = {
  metrics: (params: { year: number; month: number; ytd?: boolean }) =>
    apiFetch<ManagerMetrics[]>(`/api/managers?${qs(params)}`),
}

// ─── EMPLOYEES ─────────────────────────────────────────────
export const employeesApi = {
  list: (params?: { department?: string; active?: boolean }) =>
    apiFetch<Employee[]>(`/api/employees?${qs(params ?? {})}`),

  get: (id: string) => apiFetch<Employee>(`/api/employees/${id}`),

  create: (data: Partial<Employee> & { propertyIds?: string[] }) =>
    apiFetch<Employee>('/api/employees', { method: 'POST', body: json(data) }),

  update: (id: string, data: Partial<Employee> & { propertyIds?: string[] }) =>
    apiFetch<Employee>(`/api/employees/${id}`, { method: 'PUT', body: json(data) }),

  delete: (id: string) =>
    apiFetch<{ id: string }>(`/api/employees/${id}`, { method: 'DELETE' }),

  kpiMetrics: (params: { year: number; month?: number }) =>
    apiFetch<Employee[]>(`/api/employees-kpis?${qs(params)}`),

  positions: {
    list: () => apiFetch<unknown[]>('/api/employee-positions'),
    create: (data: { nameAr: string; nameEn?: string; grade?: string }) =>
      apiFetch<unknown>('/api/employee-positions', { method: 'POST', body: json(data) }),
  },

  customKpis: {
    list: (params: { employeeId: string; year: number }) =>
      apiFetch<EmployeeCustomKPI[]>(`/api/employee-custom-kpis?${qs(params)}`),
    create: (data: Partial<EmployeeCustomKPI>) =>
      apiFetch<EmployeeCustomKPI>('/api/employee-custom-kpis', {
        method: 'POST',
        body: json(data),
      }),
    update: (id: string, data: Partial<EmployeeCustomKPI>) =>
      apiFetch<EmployeeCustomKPI>(`/api/employee-custom-kpis/${id}`, {
        method: 'PUT',
        body: json(data),
      }),
    delete: (id: string) =>
      apiFetch<{ id: string }>(`/api/employee-custom-kpis/${id}`, { method: 'DELETE' }),
  },
}

// ─── KPI DEFINITIONS ───────────────────────────────────────
export const kpiApi = {
  list: () => apiFetch<KPI[]>('/api/kpis'),
  create: (data: Partial<KPI>) =>
    apiFetch<KPI>('/api/kpis', { method: 'POST', body: json(data) }),
  update: (id: string, data: Partial<KPI>) =>
    apiFetch<KPI>(`/api/kpis/${id}`, { method: 'PUT', body: json(data) }),
  delete: (id: string) =>
    apiFetch<{ id: string }>(`/api/kpis/${id}`, { method: 'DELETE' }),

  targets: {
    list: (params: { employeeId: string; year: number }) =>
      apiFetch<EmployeeKPITarget[]>(`/api/kpi-targets?${qs(params)}`),
    upsert: (data: Partial<EmployeeKPITarget>) =>
      apiFetch<EmployeeKPITarget>('/api/kpi-targets', { method: 'POST', body: json(data) }),
  },

  actuals: {
    list: (params: { employeeId?: string; year: number; month?: number }) =>
      apiFetch<KPIActual[]>(`/api/kpi-actuals?${qs(params)}`),
    upsert: (data: Partial<KPIActual>) =>
      apiFetch<KPIActual>('/api/kpi-actuals', { method: 'POST', body: json(data) }),
  },
}

// ─── COMPANY KPIs ──────────────────────────────────────────
export const companyKpisApi = {
  list: (params: { year: number; category?: string }) =>
    apiFetch<CompanyKPI[]>(`/api/company-kpis?${qs(params)}`),

  create: (data: Partial<CompanyKPI>) =>
    apiFetch<CompanyKPI>('/api/company-kpis', { method: 'POST', body: json(data) }),

  update: (id: string, data: Partial<CompanyKPI>) =>
    apiFetch<CompanyKPI>(`/api/company-kpis/${id}`, { method: 'PUT', body: json(data) }),

  delete: (id: string) =>
    apiFetch<{ id: string }>(`/api/company-kpis/${id}`, { method: 'DELETE' }),

  monthly: {
    upsert: (data: { kpiId: string; year: number; month: number; actual: number }) =>
      apiFetch<unknown>('/api/company-kpis-monthly', { method: 'POST', body: json(data) }),
  },
}

// ─── ALERTS ────────────────────────────────────────────────
export const alertsApi = {
  list: (params?: {
    unread?: boolean
    propertyId?: string
    severity?: string
    resolved?: boolean
  }) => apiFetch<Alert[]>(`/api/alerts?${qs(params ?? {})}`),

  create: (data: Partial<Alert>) =>
    apiFetch<Alert>('/api/alerts', { method: 'POST', body: json(data) }),

  update: (id: string, data: Partial<Alert>) =>
    apiFetch<Alert>(`/api/alerts/${id}`, { method: 'PUT', body: json(data) }),

  delete: (id: string) =>
    apiFetch<{ id: string }>(`/api/alerts/${id}`, { method: 'DELETE' }),

  markAllRead: () =>
    apiFetch<{ updated: number }>('/api/alerts/mark-all-read', { method: 'POST' }),
}

// ─── IMPORT ────────────────────────────────────────────────
export const importApi = {
  upload: async (type: ImportType, period: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    form.append('type', type)
    form.append('period', period)
    const res = await fetch('/api/import', { method: 'POST', body: form })
    return res.json() as Promise<ApiResponse<ImportRecord>>
  },

  history: () => apiFetch<ImportRecord[]>('/api/import/history'),

  template: (type: ImportType) => fetch(`/api/import/template/${type}`),
}
