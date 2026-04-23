// This module is imported by the Cloudflare Worker scheduled handler
// It runs the same logic as GET /api/cron but without HTTP overhead
import { EmailService } from "@/lib/email";
import { db } from "@/lib/db";

export async function runScheduledCron(): Promise<void> {
  try {
    const settings = await db.adminSettings.findFirst();

    if (settings?.overdueReminderEnabled) {
      await EmailService.sendOverdueReminders();
    }

    if (settings?.taskReminderEnabled) {
      const daysBefore = settings.reminderDaysBefore || 3;
      await EmailService.sendUpcomingDueReminders(daysBefore);
    }

    await EmailService.processScheduledReminders();
    await EmailService.sendCustomDateReminders();

    if (settings?.inProgressReportEnabled && settings.adminEmail) {
      const reportType =
        settings.inProgressReportFrequency === "weekly" ? "weekly" : "daily";
      await EmailService.sendInProgressReport(settings.adminEmail, reportType);
    }

    console.log("[Cron] Scheduled run completed successfully.");
  } catch (error) {
    console.error("[Cron] Scheduled run failed:", error);
    throw error;
  }
}
