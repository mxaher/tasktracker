import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { EmailService } from "@/lib/email";

// POST /api/notifications/send-reminder - Send task reminder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, type } = body;

    if (type === "reminder" && taskId) {
      const result = await EmailService.sendTaskReminder(taskId);
      return NextResponse.json(result);
    }

    if (type === "in-progress-report") {
      const settings = await db.adminSettings.findFirst();
      const adminEmail = settings?.adminEmail || process.env.ADMIN_EMAIL || "admin@example.com";
      const reportType = body.reportType || "daily";
      
      const result = await EmailService.sendInProgressReport(adminEmail, reportType);
      return NextResponse.json(result);
    }

    if (type === "assignment" && taskId) {
      const result = await EmailService.sendTaskAssignmentNotification(taskId);
      return NextResponse.json(result);
    }

    if (type === "overdue-all") {
      const result = await EmailService.sendOverdueReminders();
      return NextResponse.json(result);
    }

    if (type === "upcoming-all") {
      const daysBefore = body.daysBefore || 3;
      const result = await EmailService.sendUpcomingDueReminders(daysBefore);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid notification type" }, { status: 400 });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET /api/notifications - List notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");
    
    const where = status ? { status } : {};
    
    const notifications = await db.notification.findMany({
      where,
      include: {
        task: {
          select: { id: true, title: true, taskId: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
