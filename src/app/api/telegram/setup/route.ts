import { NextRequest, NextResponse } from 'next/server'
import { setWebhook } from '@/lib/telegram/bot'



export const dynamic = 'force-dynamic'
export async function POST(req: NextRequest) {
  try {
    const { webhookUrl } = await req.json()
    if (!webhookUrl) {
      return NextResponse.json({ success: false, error: 'webhookUrl required' }, { status: 400 })
    }
    const result = await setWebhook(webhookUrl)
    return NextResponse.json({ success: true, data: result })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
