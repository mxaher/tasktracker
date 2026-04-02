import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Settings API - Admin notification preferences
// GET /api/settings - Get admin settings
export async function GET() {
  try {
    let settings = await db.adminSettings.findFirst();
    
    // Create default settings if none exist
    if (!settings) {
      settings = await db.adminSettings.create({
        data: {
          adminEmail: process.env.ADMIN_EMAIL || "admin@example.com",
          dailyDigestEnabled: false,
          weeklyReportEnabled: false,
          inProgressReportEnabled: false,
          taskReminderEnabled: true,
          overdueReminderEnabled: true,
          customReminderDates: null,
          reminderDaysBefore: 3,
        },
      });
    }
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update admin settings
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    let settings = await db.adminSettings.findFirst();
    
    if (settings) {
      settings = await db.adminSettings.update({
        where: { id: settings.id },
        data: {
          adminEmail: data.adminEmail,
          dailyDigestEnabled: data.dailyDigestEnabled,
          dailyDigestTime: data.dailyDigestTime,
          weeklyReportEnabled: data.weeklyReportEnabled,
          weeklyReportDay: data.weeklyReportDay,
          weeklyReportTime: data.weeklyReportTime,
          inProgressReportEnabled: data.inProgressReportEnabled,
          inProgressReportFrequency: data.inProgressReportFrequency,
          taskReminderEnabled: data.taskReminderEnabled,
          overdueReminderEnabled: data.overdueReminderEnabled,
          customReminderDates: data.customReminderDates || null,
          reminderDaysBefore: data.reminderDaysBefore ?? 3,
        },
      });
    } else {
      settings = await db.adminSettings.create({
        data: {
          adminEmail: data.adminEmail,
          dailyDigestEnabled: data.dailyDigestEnabled ?? false,
          dailyDigestTime: data.dailyDigestTime ?? "09:00",
          weeklyReportEnabled: data.weeklyReportEnabled ?? false,
          weeklyReportDay: data.weeklyReportDay ?? 1,
          weeklyReportTime: data.weeklyReportTime ?? "09:00",
          inProgressReportEnabled: data.inProgressReportEnabled ?? false,
          inProgressReportFrequency: data.inProgressReportFrequency ?? "daily",
          taskReminderEnabled: data.taskReminderEnabled ?? true,
          overdueReminderEnabled: data.overdueReminderEnabled ?? true,
          customReminderDates: data.customReminderDates || null,
          reminderDaysBefore: data.reminderDaysBefore ?? 3,
        },
      });
    }
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
