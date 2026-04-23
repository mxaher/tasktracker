import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { EmailService } from "@/lib/email";
import { routeErrorResponse } from "@/lib/api-error";



export const dynamic = 'force-dynamic'
// This endpoint can be called by a cron service (like cron-job.org, Vercel Cron, or Cloudflare Scheduled Workers)
// It handles all scheduled email notifications

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret if provided
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const results = {
      overdueReminders: { sent: 0, failed: 0 },
      upcomingReminders: { sent: 0, failed: 0 },
      inProgressReport: null as { success: boolean; error?: string } | null,
      scheduledReminders: { processed: 0, totalSent: 0, totalFailed: 0 },
      customDateReminders: { sent: 0, failed: 0 },
    };
    
    const settings = await db.adminSettings.findFirst();
    
    // Send overdue reminders if enabled
    if (settings?.overdueReminderEnabled) {
      results.overdueReminders = await EmailService.sendOverdueReminders();
    }
    
    // Send upcoming due reminders if enabled
    if (settings?.taskReminderEnabled) {
      const daysBefore = settings.reminderDaysBefore || 3;
      results.upcomingReminders = await EmailService.sendUpcomingDueReminders(daysBefore);
    }
    
    // Process scheduled reminders
    results.scheduledReminders = await EmailService.processScheduledReminders();
    
    // Send custom date reminders
    results.customDateReminders = await EmailService.sendCustomDateReminders();
    
    // Send in-progress report if enabled
    if (settings?.inProgressReportEnabled) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const currentDay = now.getDay();
      
      let shouldSendReport = false;
      
      if (settings.inProgressReportFrequency === "daily") {
        // Check if current time matches daily digest time
        if (settings.dailyDigestTime && currentTime.startsWith(settings.dailyDigestTime.substring(0, 2))) {
          shouldSendReport = true;
        }
      } else if (settings.inProgressReportFrequency === "weekly") {
        // Check if today is the weekly report day and time matches
        if (currentDay === settings.weeklyReportDay && 
            settings.weeklyReportTime && 
            currentTime.startsWith(settings.weeklyReportTime.substring(0, 2))) {
          shouldSendReport = true;
        }
      }
      
      if (shouldSendReport) {
        const reportType = settings.inProgressReportFrequency === "weekly" ? "weekly" : "daily";
        results.inProgressReport = await EmailService.sendInProgressReport(
          settings.adminEmail,
          reportType
        );
      }
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    return routeErrorResponse("/api/cron GET", error, {
      status: 500,
      body: { error: "Cron job failed" },
    });
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}
