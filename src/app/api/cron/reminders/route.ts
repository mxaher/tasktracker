import { runReminderCycle } from "@/lib/notifications/reminderService";
import { NextRequest, NextResponse } from "next/server";



export const dynamic = 'force-dynamic'
/** Executes the WhatsApp reminder cycle for the scheduled cron trigger. */
export async function GET(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const headerSecret = request.headers.get("x-cron-secret");

    if (!cronSecret || !headerSecret || headerSecret !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await runReminderCycle();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error running reminder cron:", error);
    return NextResponse.json({ error: "Failed to run reminder cycle" }, { status: 500 });
  }
}
