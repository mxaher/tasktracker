import { NextResponse } from "next/server";
import { d1All } from "@/lib/cloudflare-d1";



export const dynamic = 'force-dynamic'
type TelegramLogRow = {
  id: string;
  chatId: string;
  rawMessage: string;
  parsed: number | boolean;
  parseError: string | null;
  taskId: string | null;
  createdAt: string;
};

export async function GET() {
  try {
    const rows = await d1All<TelegramLogRow>(
      `SELECT "id","chatId","rawMessage","parsed","parseError","taskId","createdAt"
       FROM "TelegramLog"
       ORDER BY "createdAt" DESC
       LIMIT 10`,
    );

    const logs = rows.map((r) => ({
      id: r.id,
      chatId: r.chatId,
      messagePreview: r.rawMessage.slice(0, 60),
      parsed: r.parsed === 1 || r.parsed === true,
      parseError: r.parseError,
      taskId: r.taskId,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Error fetching Telegram logs:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
