-- Migration 0004: Performance Management Platform expansion

-- Add new relations to User
ALTER TABLE "User" ADD COLUMN "employeeId" TEXT;

-- ─── COMPANY ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Company" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "nameAr" TEXT,
  "logo" TEXT,
  "fiscalStart" INTEGER NOT NULL DEFAULT 1,
  "currency" TEXT NOT NULL DEFAULT 'SAR',
  "language" TEXT NOT NULL DEFAULT 'ar',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "DashboardSettings" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "DashboardSettings_key_key" ON "DashboardSettings"("key");

-- ─── EMPLOYEE POSITIONS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS "EmployeePosition" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "nameAr" TEXT NOT NULL,
  "nameEn" TEXT,
  "grade" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── EMPLOYEES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Employee" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "nameAr" TEXT NOT NULL,
  "nameEn" TEXT,
  "email" TEXT,
  "positionId" TEXT,
  "department" TEXT,
  "managedById" TEXT,
  "isActive" INTEGER NOT NULL DEFAULT 1,
  "joinedAt" DATETIME,
  "userId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Employee_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "EmployeePosition" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "Employee_managedById_fkey" FOREIGN KEY ("managedById") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Employee_email_key" ON "Employee"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Employee_userId_key" ON "Employee"("userId");

-- ─── PROPERTIES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Property" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "nameAr" TEXT NOT NULL,
  "nameEn" TEXT,
  "type" TEXT NOT NULL,
  "location" TEXT,
  "totalUnits" INTEGER NOT NULL DEFAULT 0,
  "managerId" TEXT,
  "occupancyRate" REAL NOT NULL DEFAULT 0,
  "isActive" INTEGER NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Property_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Property_code_key" ON "Property"("code");

CREATE TABLE IF NOT EXISTS "EmployeeProperty" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "employeeId" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "role" TEXT,
  "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmployeeProperty_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "EmployeeProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "EmployeeProperty_employeeId_propertyId_key" ON "EmployeeProperty"("employeeId", "propertyId");

CREATE TABLE IF NOT EXISTS "PropertyAnnualTarget" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "propertyId" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "annualTarget" REAL NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PropertyAnnualTarget_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "PropertyAnnualTarget_propertyId_year_key" ON "PropertyAnnualTarget"("propertyId", "year");

CREATE TABLE IF NOT EXISTS "PropertyMonthlyTarget" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "propertyId" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "month" INTEGER NOT NULL,
  "target" REAL NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PropertyMonthlyTarget_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "PropertyMonthlyTarget_propertyId_year_month_key" ON "PropertyMonthlyTarget"("propertyId", "year", "month");

CREATE TABLE IF NOT EXISTS "PropertyCollectionActual" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "propertyId" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "month" INTEGER NOT NULL,
  "collected" REAL NOT NULL DEFAULT 0,
  "invoiced" REAL NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PropertyCollectionActual_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "PropertyCollectionActual_propertyId_year_month_key" ON "PropertyCollectionActual"("propertyId", "year", "month");

CREATE TABLE IF NOT EXISTS "PropertyAgingReport" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "propertyId" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "month" INTEGER NOT NULL,
  "bucket0to20" REAL NOT NULL DEFAULT 0,
  "bucket21to60" REAL NOT NULL DEFAULT 0,
  "bucket61to90" REAL NOT NULL DEFAULT 0,
  "bucketOver90" REAL NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PropertyAgingReport_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "PropertyAgingReport_propertyId_year_month_key" ON "PropertyAgingReport"("propertyId", "year", "month");

CREATE TABLE IF NOT EXISTS "PropertyTargetVersion" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "propertyId" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "version" INTEGER NOT NULL,
  "annualTarget" REAL NOT NULL,
  "note" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PropertyTargetVersion_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ─── KPIs ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "KPI" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "nameAr" TEXT NOT NULL,
  "nameEn" TEXT,
  "category" TEXT NOT NULL,
  "unit" TEXT,
  "weight" REAL NOT NULL DEFAULT 0,
  "isActive" INTEGER NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "KPI_code_key" ON "KPI"("code");

CREATE TABLE IF NOT EXISTS "EmployeeKPITarget" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "employeeId" TEXT NOT NULL,
  "kpiId" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "target" REAL NOT NULL,
  "weight" REAL NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmployeeKPITarget_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "EmployeeKPITarget_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "KPI" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "EmployeeKPITarget_employeeId_kpiId_year_key" ON "EmployeeKPITarget"("employeeId", "kpiId", "year");

CREATE TABLE IF NOT EXISTS "EmployeeCustomKPI" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "employeeId" TEXT NOT NULL,
  "nameAr" TEXT NOT NULL,
  "nameEn" TEXT,
  "category" TEXT NOT NULL,
  "unit" TEXT,
  "year" INTEGER NOT NULL,
  "target" REAL NOT NULL DEFAULT 0,
  "actual" REAL NOT NULL DEFAULT 0,
  "weight" REAL NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmployeeCustomKPI_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "KPIActual" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "employeeId" TEXT,
  "kpiId" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "month" INTEGER NOT NULL,
  "actual" REAL NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "KPIActual_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "KPIActual_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "KPI" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "KPIActual_employeeId_kpiId_year_month_key" ON "KPIActual"("employeeId", "kpiId", "year", "month");

-- ─── COMPANY KPIs ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CompanyKPI" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "year" INTEGER NOT NULL,
  "code" TEXT NOT NULL,
  "nameAr" TEXT NOT NULL,
  "nameEn" TEXT,
  "category" TEXT NOT NULL,
  "weight" REAL NOT NULL DEFAULT 0,
  "target" REAL NOT NULL DEFAULT 0,
  "isActive" INTEGER NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "CompanyKPI_year_code_key" ON "CompanyKPI"("year", "code");

CREATE TABLE IF NOT EXISTS "CompanyKPIMonthly" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "kpiId" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "month" INTEGER NOT NULL,
  "actual" REAL NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CompanyKPIMonthly_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "CompanyKPI" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "CompanyKPIMonthly_kpiId_year_month_key" ON "CompanyKPIMonthly"("kpiId", "year", "month");

-- ─── ALERTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Alert" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "titleAr" TEXT,
  "message" TEXT NOT NULL,
  "severity" TEXT NOT NULL DEFAULT 'info',
  "propertyId" TEXT,
  "isRead" INTEGER NOT NULL DEFAULT 0,
  "isResolved" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" DATETIME,
  CONSTRAINT "Alert_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- ─── TELEGRAM ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "TelegramUser" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "chatId" TEXT NOT NULL,
  "userId" TEXT,
  "username" TEXT,
  "firstName" TEXT,
  "isActive" INTEGER NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TelegramUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "TelegramUser_chatId_key" ON "TelegramUser"("chatId");
CREATE UNIQUE INDEX IF NOT EXISTS "TelegramUser_userId_key" ON "TelegramUser"("userId");

CREATE TABLE IF NOT EXISTS "TelegramLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "chatId" TEXT NOT NULL,
  "direction" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "payload" TEXT NOT NULL,
  "taskId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── IMPORT TRACKING ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ImportRecord" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "type" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "period" TEXT,
  "rowCount" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "errorLog" TEXT,
  "uploadedBy" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── AI INSIGHTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "AIInsight" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "year" INTEGER NOT NULL,
  "month" INTEGER NOT NULL,
  "type" TEXT NOT NULL,
  "entityId" TEXT,
  "insight" TEXT NOT NULL,
  "severity" TEXT NOT NULL DEFAULT 'info',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
