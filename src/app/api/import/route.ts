import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { routeErrorResponse } from '@/lib/api-error'



export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  const db = getDb()
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const type = form.get('type') as string
    const period = form.get('period') as string | null

    if (!file || !type) {
      return NextResponse.json({ success: false, error: 'file and type required' }, { status: 400 })
    }

    const record = await db.importRecord.create({
      data: {
        type,
        filename: file.name,
        period: period ?? undefined,
        rowCount: 0,
        status: 'processing',
      },
    })

    // Parse CSV
    const text = await file.text()
    const cleanText = text.replace(/^\uFEFF/, '')
    const lines = cleanText.split(/\r?\n/)
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
    const rows = lines.slice(1).filter((l) => l.trim())

    let imported = 0
    let failed = 0
    const errors: string[] = []

    for (let i = 0; i < rows.length; i++) {
      const line = rows[i]
      // Simple CSV split that handles quotes
      const cols: string[] = []
      let current = ''
      let inQuotes = false
      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') inQuotes = !inQuotes
        else if (char === ',' && !inQuotes) {
          cols.push(current.trim().replace(/^"|"$/g, ''))
          current = ''
        } else current += char
      }
      cols.push(current.trim().replace(/^"|"$/g, ''))

      const row: Record<string, string> = {}
      headers.forEach((h, idx) => {
        if (h) row[h] = cols[idx] ?? ''
      })

      try {
        if (Object.keys(row).length === 0) continue
        await processRow(type, row, db)
        imported++
      } catch (e) {
        failed++
        const errorMsg = e instanceof Error ? e.message : String(e)
        errors.push(`Row ${i + 2}: ${errorMsg}`)
        console.error(`Import error at row ${i + 2}:`, e)
      }
    }

    const updated = await db.importRecord.update({
      where: { id: record.id },
      data: {
        status: failed > 0 && imported === 0 ? 'failed' : 'complete',
        rowCount: imported,
        errorLog: errors.length > 0 ? errors.slice(0, 50).join('\n') : null,
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (e) {
    return routeErrorResponse('/api/import POST', e, { body: { success: false } })
  }
}

async function processRow(type: string, row: Record<string, string>, db: ReturnType<typeof getDb>) {
  switch (type) {
    case 'properties': {
      await db.property.upsert({
        where: { code: row.code },
        create: {
          code: row.code,
          nameAr: row.nameAr,
          nameEn: row.nameEn || undefined,
          type: row.type || 'commercial_market',
          location: row.location || undefined,
          totalUnits: row.totalUnits ? parseInt(row.totalUnits) : 0,
        },
        update: {
          nameAr: row.nameAr,
          nameEn: row.nameEn || undefined,
          type: row.type || undefined,
          location: row.location || undefined,
          totalUnits: row.totalUnits ? parseInt(row.totalUnits) : undefined,
        },
      })
      break
    }
    case 'collection': {
      const property = await db.property.findUnique({ where: { code: row.propertyCode } })
      if (!property) throw new Error(`Property not found: ${row.propertyCode}`)
      await db.propertyCollectionActual.upsert({
        where: {
          propertyId_year_month: {
            propertyId: property.id,
            year: parseInt(row.year),
            month: parseInt(row.month),
          },
        },
        create: {
          propertyId: property.id,
          year: parseInt(row.year),
          month: parseInt(row.month),
          collected: parseFloat(row.collected || '0'),
          invoiced: row.invoiced ? parseFloat(row.invoiced) : 0,
        },
        update: {
          collected: row.collected ? parseFloat(row.collected) : undefined,
          invoiced: row.invoiced ? parseFloat(row.invoiced) : undefined,
        },
      })
      break
    }
    case 'aging': {
      const property = await db.property.findUnique({ where: { code: row.propertyCode } })
      if (!property) throw new Error(`Property not found: ${row.propertyCode}`)
      await db.propertyAgingReport.upsert({
        where: {
          propertyId_year_month: {
            propertyId: property.id,
            year: parseInt(row.year),
            month: parseInt(row.month),
          },
        },
        create: {
          propertyId: property.id,
          year: parseInt(row.year),
          month: parseInt(row.month),
          bucket0to20: parseFloat(row.bucket0to20 || '0'),
          bucket21to60: parseFloat(row.bucket21to60 || '0'),
          bucket61to90: parseFloat(row.bucket61to90 || '0'),
          bucketOver90: parseFloat(row.bucketOver90 || '0'),
        },
        update: {
          bucket0to20: row.bucket0to20 ? parseFloat(row.bucket0to20) : undefined,
          bucket21to60: row.bucket21to60 ? parseFloat(row.bucket21to60) : undefined,
          bucket61to90: row.bucket61to90 ? parseFloat(row.bucket61to90) : undefined,
          bucketOver90: row.bucketOver90 ? parseFloat(row.bucketOver90) : undefined,
        },
      })
      break
    }
    case 'employees': {
      const empEmail = row.email || undefined
      if (empEmail) {
        await db.employee.upsert({
          where: { email: empEmail },
          create: {
            nameAr: row.nameAr,
            nameEn: row.nameEn || undefined,
            email: empEmail,
            department: row.department || undefined,
          },
          update: {
            nameAr: row.nameAr,
            nameEn: row.nameEn || undefined,
            department: row.department || undefined,
          },
        })
      } else {
        await db.employee.create({
          data: {
            nameAr: row.nameAr,
            nameEn: row.nameEn || undefined,
            department: row.department || undefined,
          },
        })
      }
      break
    }
    case 'kpi_actuals': {
      const employee = row.employeeEmail
        ? await db.employee.findUnique({ where: { email: row.employeeEmail } })
        : null
      const kpi = await db.kPI.findUnique({ where: { code: row.kpiCode } })
      if (!kpi) throw new Error(`KPI not found: ${row.kpiCode}`)
      await db.kPIActual.upsert({
        where: {
          employeeId_kpiId_year_month: {
            employeeId: employee?.id ?? '',
            kpiId: kpi.id,
            year: parseInt(row.year),
            month: parseInt(row.month),
          },
        },
        create: {
          employeeId: employee?.id ?? undefined,
          kpiId: kpi.id,
          year: parseInt(row.year),
          month: parseInt(row.month),
          actual: parseFloat(row.actual || '0'),
        },
        update: { actual: row.actual ? parseFloat(row.actual) : undefined },
      })
      break
    }
    default:
      throw new Error(`Unknown import type: ${type}`)
  }
}
