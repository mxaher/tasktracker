import { NextRequest, NextResponse } from "next/server";
import { d1First, d1Run } from "@/lib/cloudflare-d1";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existing = await d1First<{ id: string }>(
      'SELECT "id" FROM "TelegramUser" WHERE "id" = ?',
      id,
    );
    if (!existing) {
      return NextResponse.json({ error: "Linked account not found" }, { status: 404 });
    }

    await d1Run('DELETE FROM "TelegramUser" WHERE "id" = ?', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unlinking account:", error);
    return NextResponse.json({ error: "Failed to unlink account" }, { status: 500 });
  }
}
