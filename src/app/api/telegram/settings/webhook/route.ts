import { NextRequest, NextResponse } from "next/server";



export const dynamic = 'force-dynamic'
type WebhookInfo = {
  url?: string;
  has_custom_certificate?: boolean;
  pending_update_count?: number;
  last_error_date?: number;
  last_error_message?: string;
};

async function getTelegramWebhookInfo(token: string): Promise<WebhookInfo | null> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const data = (await res.json()) as { ok: boolean; result?: WebhookInfo };
    return data.ok ? (data.result ?? null) : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not configured" }, { status: 500 });
  }

  const info = await getTelegramWebhookInfo(token);
  return NextResponse.json({ webhookInfo: info });
}

export async function POST(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not configured" }, { status: 500 });
  }

  const { appUrl } = (await request.json()) as { appUrl?: string };
  const webhookUrl = appUrl ? `${appUrl.replace(/\/$/, "")}/api/telegram/webhook` : null;

  if (!webhookUrl) {
    return NextResponse.json({ error: "appUrl is required" }, { status: 400 });
  }

  const payload: Record<string, unknown> = { url: webhookUrl };
  if (secret) {
    payload.secret_token = secret;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
