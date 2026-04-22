import { NextRequest, NextResponse } from 'next/server'

const TEMPLATES: Record<string, { filename: string; content: string }> = {
  properties: {
    filename: 'properties_template.csv',
    content: 'code,nameAr,type,location,totalUnits,managerId\nPROP-001,مجمع الرياض التجاري,commercial_market,الرياض,120,\n',
  },
  collection: {
    filename: 'collection_actuals_template.csv',
    content: 'propertyCode,year,month,collected,invoiced\nPROP-001,2026,4,125000,140000\n',
  },
  aging: {
    filename: 'aging_report_template.csv',
    content: 'propertyCode,year,month,bucket0to20,bucket21to60,bucket61to90,bucketOver90\nPROP-001,2026,3,50000,25000,15000,10000\n',
  },
  employees: {
    filename: 'employees_template.csv',
    content: 'nameAr,email,positionId,department,managedById\nأحمد محمد العمري,ahmed@company.com,,إدارة العقارات,\n',
  },
  kpi_actuals: {
    filename: 'kpi_actuals_template.csv',
    content: 'employeeEmail,kpiCode,year,month,actual\nahmed@company.com,FIN-001,2026,3,92.5\n',
  },
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  const template = TEMPLATES[type]
  if (!template) {
    return NextResponse.json({ success: false, error: 'Unknown template type' }, { status: 404 })
  }
  return new NextResponse(template.content, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${template.filename}"`,
    },
  })
}
