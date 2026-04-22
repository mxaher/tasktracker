import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const positions = await db.employeePosition.findMany({ orderBy: { nameAr: 'asc' } })
    return NextResponse.json({ success: true, data: positions })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const position = await db.employeePosition.create({ data: body })
    return NextResponse.json({ success: true, data: position }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
