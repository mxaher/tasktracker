import { NextRequest, NextResponse } from "next/server";
import { createId, d1All, d1First, d1Run, nowIso } from "@/lib/cloudflare-d1";



export const dynamic = 'force-dynamic'
type TelegramUserRow = {
  id: string;
  chatId: string;
  userId: string;
  createdAt: string;
  user_name: string | null;
  user_email: string;
  user_role: string;
};

export async function GET() {
  try {
    const rows = await d1All<TelegramUserRow>(
      `SELECT tu.id, tu.chatId, tu.userId, tu.createdAt,
              u.name AS user_name, u.email AS user_email, u.role AS user_role
       FROM "TelegramUser" tu
       JOIN "User" u ON u.id = tu.userId
       ORDER BY tu.createdAt DESC`,
    );

    const accounts = rows.map((r) => ({
      id: r.id,
      chatId: r.chatId,
      userId: r.userId,
      createdAt: r.createdAt,
      user: { name: r.user_name, email: r.user_email, role: r.user_role },
    }));

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Error fetching linked accounts:", error);
    return NextResponse.json({ error: "Failed to fetch linked accounts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { chatId, userId } = (await request.json()) as { chatId?: string; userId?: string };

    if (!chatId || !userId) {
      return NextResponse.json({ error: "chatId and userId are required" }, { status: 400 });
    }

    // Verify user exists
    const user = await d1First<{ id: string }>(
      'SELECT "id" FROM "User" WHERE "id" = ?',
      userId,
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for existing binding on the same chatId or userId
    const existing = await d1First<{ id: string }>(
      'SELECT "id" FROM "TelegramUser" WHERE "chatId" = ? OR "userId" = ?',
      chatId,
      userId,
    );
    if (existing) {
      return NextResponse.json(
        { error: "This chat ID or user is already linked" },
        { status: 409 },
      );
    }

    await d1Run(
      'INSERT INTO "TelegramUser" ("id","chatId","userId","createdAt") VALUES (?,?,?,?)',
      createId(),
      chatId,
      userId,
      nowIso(),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error linking account:", error);
    return NextResponse.json({ error: "Failed to link account" }, { status: 500 });
  }
}
