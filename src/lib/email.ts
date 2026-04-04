import { db } from "@/lib/db";
import { format, differenceInDays, isPast } from "date-fns";

// Email configuration - using Resend API
// For production, set RESEND_API_KEY environment variable

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

// Send email using Resend API
async function sendEmailWithResend(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
    // Read env vars lazily for Cloudflare Workers compatibility
  const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
  const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@wealix.app";
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tasks@wealix.app";

  if (!RESEND_API_KEY) {
    console.error("[Email] RESEND_API_KEY is not configured. Cannot send email.");
    console.error(`  To: ${Array.isArray(payload.to) ? payload.to.join(", ") : payload.to}`);
    console.error(`  Subject: ${payload.subject}`);
    return { success: false, error: "RESEND_API_KEY is not configured." };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send email");
    }

    return { success: true };
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return { success: false, error: String(error) };
  }
}

// Email templates
function getTaskReminderTemplate(task: {
  title: string;
  taskId: string | null;
  dueDate: Date | null;
  priority: string;
  status: string;
  completion: number;
  department: string | null;
  notes: string | null;
}, ownerName: string, daysRemaining: number): { subject: string; html: string; text: string } {
  const dueDateStr = task.dueDate ? format(new Date(task.dueDate), "MMMM d, yyyy") : "No due date";
  const isOverdue = daysRemaining < 0;
  
  const subject = isOverdue 
    ? `⚠️ OVERDUE: ${task.title}` 
    : `📋 Task Reminder: ${task.title} - Due in ${daysRemaining} days`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${isOverdue ? '#ef4444' : '#3b82f6'}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .task-info { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; }
        .priority-critical { color: #dc2626; }
        .priority-high { color: #ea580c; }
        .priority-medium { color: #ca8a04; }
        .priority-low { color: #16a34a; }
        .progress-bar { background: #e5e7eb; border-radius: 4px; height: 8px; }
        .progress-fill { background: #3b82f6; height: 100%; border-radius: 4px; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">${isOverdue ? '⚠️ Task Overdue!' : '📋 Task Reminder'}</h1>
        </div>
        <div class="content">
          <p>Hello ${ownerName},</p>
          <p>${isOverdue 
            ? `This task is <strong>${Math.abs(daysRemaining)} days overdue</strong>. Please take action.` 
            : `This task is due in <strong>${daysRemaining} days</strong>.`}</p>
          
          <div class="task-info">
            <h3 style="margin-top: 0;">${task.title}</h3>
            ${task.taskId ? `<p><strong>Task ID:</strong> #${task.taskId}</p>` : ''}
            <p><strong>Department:</strong> ${task.department || 'N/A'}</p>
            <p><strong>Due Date:</strong> ${dueDateStr}</p>
            <p><strong>Priority:</strong> <span class="priority-${task.priority}">${task.priority.toUpperCase()}</span></p>
            <p><strong>Status:</strong> ${task.status.replace('_', ' ').toUpperCase()}</p>
            <p><strong>Progress:</strong></p>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${task.completion * 100}%"></div>
            </div>
            <p style="text-align: right; font-size: 12px;">${Math.round(task.completion * 100)}% complete</p>
            ${task.notes ? `<p><strong>Notes:</strong> ${task.notes}</p>` : ''}
          </div>
          
          <p>Please log in to the TaskTracker system to update this task's status.</p>
          
          <p>Best regards,<br>TaskTracker System</p>
        </div>
        <div class="footer">
          <p>This is an automated message from TaskTracker.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    ${isOverdue ? 'TASK OVERDUE!' : 'Task Reminder'}
    
    Hello ${ownerName},
    
    ${isOverdue 
      ? `This task is ${Math.abs(daysRemaining)} days overdue. Please take action.` 
      : `This task is due in ${daysRemaining} days.`}
    
    Task: ${task.title}
    ${task.taskId ? `Task ID: #${task.taskId}` : ''}
    Department: ${task.department || 'N/A'}
    Due Date: ${dueDateStr}
    Priority: ${task.priority.toUpperCase()}
    Status: ${task.status.replace('_', ' ').toUpperCase()}
    Progress: ${Math.round(task.completion * 100)}%
    ${task.notes ? `Notes: ${task.notes}` : ''}
    
    Please log in to the TaskTracker system to update this task's status.
    
    Best regards,
    TaskTracker System
  `;

  return { subject, html, text };
}

function getInProgressReportTemplate(tasks: Array<{
  title: string;
  taskId: string | null;
  dueDate: Date | null;
  priority: string;
  completion: number;
  department: string | null;
  owner: { name: string | null; email: string } | null;
}>, reportType: "daily" | "weekly"): { subject: string; html: string; text: string } {
  const subject = `📊 ${reportType === 'daily' ? 'Daily' : 'Weekly'} In-Progress Tasks Report - ${format(new Date(), "MMM d, yyyy")}`;
  
  const tasksHtml = tasks.map(task => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        ${task.taskId ? `#${task.taskId}` : '-'}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        <strong>${task.title}</strong>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        ${task.department || '-'}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        ${task.owner?.name || task.owner?.email || '-'}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        ${task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : '-'}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        <span style="color: ${task.priority === 'critical' ? '#dc2626' : task.priority === 'high' ? '#ea580c' : task.priority === 'medium' ? '#ca8a04' : '#16a34a'}">
          ${task.priority.toUpperCase()}
        </span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        <div style="background: #e5e7eb; border-radius: 4px; height: 8px; width: 80px;">
          <div style="background: #3b82f6; height: 100%; border-radius: 4px; width: ${task.completion * 100}%;"></div>
        </div>
        <span style="font-size: 11px; color: #6b7280;">${Math.round(task.completion * 100)}%</span>
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
        th { background: #374151; color: white; padding: 12px 10px; text-align: left; }
        .stats { display: flex; gap: 20px; margin-bottom: 20px; }
        .stat-box { background: white; padding: 15px; border-radius: 8px; flex: 1; text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #3b82f6; }
        .stat-label { font-size: 12px; color: #6b7280; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">📊 ${reportType === 'daily' ? 'Daily' : 'Weekly'} In-Progress Tasks Report</h1>
          <p style="margin: 5px 0 0 0;">${format(new Date(), "MMMM d, yyyy")}</p>
        </div>
        <div class="content">
          <div class="stats">
            <div class="stat-box">
              <div class="stat-number">${tasks.length}</div>
              <div class="stat-label">Total In Progress</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">${tasks.filter(t => t.priority === 'critical' || t.priority === 'high').length}</div>
              <div class="stat-label">High Priority</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">${tasks.filter(t => t.dueDate && isPast(new Date(t.dueDate))).length}</div>
              <div class="stat-label">Overdue</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Owner</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              ${tasksHtml}
            </tbody>
          </table>
          
          <p style="margin-top: 20px;">Please log in to the TaskTracker system for more details and to update task statuses.</p>
        </div>
        <div class="footer">
          <p>This is an automated message from TaskTracker.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    ${reportType === 'daily' ? 'Daily' : 'Weekly'} In-Progress Tasks Report
    ${format(new Date(), "MMMM d, yyyy")}
    
    Total In Progress: ${tasks.length}
    High Priority: ${tasks.filter(t => t.priority === 'critical' || t.priority === 'high').length}
    Overdue: ${tasks.filter(t => t.dueDate && isPast(new Date(t.dueDate))).length}
    
    Tasks:
    ${tasks.map(t => `- ${t.title} (${t.department || 'No dept'}) - ${t.owner?.name || 'Unassigned'} - Due: ${t.dueDate ? format(new Date(t.dueDate), "MMM d") : 'N/A'} - ${Math.round(t.completion * 100)}%`).join('\n')}
    
    Please log in to TaskTracker for more details.
  `;

  return { subject, html, text };
}

// Main email service class
export class EmailService {
  // Send task reminder to owner
  static async sendTaskReminder(taskId: string): Promise<{ success: boolean; error?: string }> {
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: { owner: true },
    });

    if (!task || !task.owner) {
      return { success: false, error: "Task or owner not found" };
    }

    if (!task.dueDate) {
      return { success: false, error: "Task has no due date" };
    }

    const daysRemaining = differenceInDays(new Date(task.dueDate), new Date());
    const template = getTaskReminderTemplate(task, task.owner.name || task.owner.email, daysRemaining);

    const result = await sendEmailWithResend({
      to: task.owner.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    // Log notification
    await db.notification.create({
      data: {
        taskId: task.id,
        userId: task.owner.id,
        type: daysRemaining < 0 ? "overdue" : "reminder",
        channel: "email",
        subject: template.subject,
        message: template.text,
        status: result.success ? "sent" : "failed",
        sentAt: result.success ? new Date() : null,
        error: result.error,
      },
    });

    return result;
  }

  // Send in-progress tasks report to admin
  static async sendInProgressReport(adminEmail: string, reportType: "daily" | "weekly"): Promise<{ success: boolean; error?: string }> {
    const tasks = await db.task.findMany({
      where: { status: "in_progress" },
      include: { owner: true },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
    });

    const template = getInProgressReportTemplate(tasks, reportType);

    const result = await sendEmailWithResend({
      to: adminEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    // Log notification
    await db.notification.create({
      data: {
        type: "status_change",
        channel: "email",
        subject: template.subject,
        message: template.text,
        status: result.success ? "sent" : "failed",
        sentAt: result.success ? new Date() : null,
        error: result.error,
      },
    });

    return result;
  }

  // Send task assignment notification
  static async sendTaskAssignmentNotification(taskId: string): Promise<{ success: boolean; error?: string }> {
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: { owner: true, assignee: true },
    });

    if (!task) {
      return { success: false, error: "Task not found" };
    }

    const recipients: string[] = [];
    if (task.owner?.email) recipients.push(task.owner.email);
    if (task.assignee?.email && task.assignee.email !== task.owner?.email) {
      recipients.push(task.assignee.email);
    }

    if (recipients.length === 0) {
      return { success: false, error: "No recipients found" };
    }

    const dueDateStr = task.dueDate ? format(new Date(task.dueDate), "MMMM d, yyyy") : "No due date set";
    
    const subject = `📋 New Task Assigned: ${task.title}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #16a34a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .task-info { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">📋 New Task Assigned</h1>
          </div>
          <div class="content">
            <p>A new task has been assigned to you.</p>
            
            <div class="task-info">
              <h3 style="margin-top: 0;">${task.title}</h3>
              ${task.taskId ? `<p><strong>Task ID:</strong> #${task.taskId}</p>` : ''}
              <p><strong>Department:</strong> ${task.department || 'N/A'}</p>
              <p><strong>Priority:</strong> ${task.priority.toUpperCase()}</p>
              <p><strong>Due Date:</strong> ${dueDateStr}</p>
              ${task.description ? `<p><strong>Description:</strong> ${task.description}</p>` : ''}
            </div>
            
            <p>Please log in to the TaskTracker system to view and update this task.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await sendEmailWithResend({
      to: recipients,
      subject,
      html,
      text: `New Task: ${task.title}\nDepartment: ${task.department || 'N/A'}\nPriority: ${task.priority}\nDue: ${dueDateStr}`,
    });

    // Log notification
    for (const recipient of recipients) {
      await db.notification.create({
        data: {
          taskId: task.id,
          type: "assignment",
          channel: "email",
          subject,
          message: `Task assignment notification sent to ${recipient}`,
          status: result.success ? "sent" : "failed",
          sentAt: result.success ? new Date() : null,
          error: result.error,
        },
      });
    }

    return result;
  }

  // Send overdue task reminders to all owners
  static async sendOverdueReminders(): Promise<{ sent: number; failed: number }> {
    const overdueTasks = await db.task.findMany({
      where: {
        status: { not: "completed" },
        dueDate: { lt: new Date() },
      },
      include: { owner: true },
    });

    let sent = 0;
    let failed = 0;

    for (const task of overdueTasks) {
      if (task.owner && task.owner.receiveTaskReminders) {
        const result = await this.sendTaskReminder(task.id);
        if (result.success) sent++;
        else failed++;
      }
    }

    return { sent, failed };
  }

  // Send upcoming due date reminders
  static async sendUpcomingDueReminders(daysBefore: number = 3): Promise<{ sent: number; failed: number }> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysBefore);
    
    const upcomingTasks = await db.task.findMany({
      where: {
        status: { not: "completed" },
        dueDate: {
          gte: new Date(),
          lte: targetDate,
        },
      },
      include: { owner: true },
    });

    let sent = 0;
    let failed = 0;

    for (const task of upcomingTasks) {
      if (task.owner && task.owner.receiveTaskReminders) {
        const result = await this.sendTaskReminder(task.id);
        if (result.success) sent++;
        else failed++;
      }
    }

    return { sent, failed };
  }

  // Send scheduled reminder based on ScheduledReminder record
  static async sendScheduledReminder(reminderId: string): Promise<{ success: boolean; sent: number; failed: number; error?: string }> {
    const reminder = await db.scheduledReminder.findUnique({
      where: { id: reminderId },
    });

    if (!reminder) {
      return { success: false, sent: 0, failed: 0, error: "Reminder not found" };
    }

    if (reminder.isSent) {
      return { success: false, sent: 0, failed: 0, error: "Reminder already sent" };
    }

    const settings = await db.adminSettings.findFirst();
    const adminEmail = settings?.adminEmail || process.env.ADMIN_EMAIL || "moh_zaher@msn.com";

    let sent = 0;
    let failed = 0;

    // Get tasks to include in reminder
    let tasks;
    if (reminder.taskIds) {
      const taskIds = reminder.taskIds.split(",");
      tasks = await db.task.findMany({
        where: { id: { in: taskIds } },
        include: { owner: true },
      });
    } else {
      // Get all in-progress and overdue tasks
      tasks = await db.task.findMany({
        where: {
          status: { in: ["in_progress", "delayed", "not_started"] },
        },
        include: { owner: true },
        orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
      });
    }

    // Send to admin if enabled
    if (reminder.sendToAdmin) {
      const template = getScheduledReminderTemplate(reminder, tasks);
      const result = await sendEmailWithResend({
        to: adminEmail,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      if (result.success) sent++;
      else failed++;
    }

    // Send to task owners if enabled
    if (reminder.sendToOwners) {
      const ownerEmails = new Map<string, typeof tasks>();
      for (const task of tasks) {
        if (task.owner?.email) {
          if (!ownerEmails.has(task.owner.email)) {
            ownerEmails.set(task.owner.email, []);
          }
          ownerEmails.get(task.owner.email)!.push(task);
        }
      }

      for (const [email, ownerTasks] of ownerEmails) {
        const template = getScheduledReminderTemplate(reminder, ownerTasks);
        const result = await sendEmailWithResend({
          to: email,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });
        if (result.success) sent++;
        else failed++;
      }
    }

    // Mark reminder as sent
    await db.scheduledReminder.update({
      where: { id: reminderId },
      data: {
        isSent: true,
        sentAt: new Date(),
        emailsSent: sent,
        emailsFailed: failed,
      },
    });

    return { success: true, sent, failed };
  }

  // Process all scheduled reminders that are due
  static async processScheduledReminders(): Promise<{ processed: number; totalSent: number; totalFailed: number }> {
    const now = new Date();
    
    const dueReminders = await db.scheduledReminder.findMany({
      where: {
        isActive: true,
        isSent: false,
        reminderDate: {
          lte: now,
        },
      },
    });

    let processed = 0;
    let totalSent = 0;
    let totalFailed = 0;

    for (const reminder of dueReminders) {
      const result = await this.sendScheduledReminder(reminder.id);
      if (result.success) {
        processed++;
        totalSent += result.sent;
        totalFailed += result.failed;
      }
    }

    return { processed, totalSent, totalFailed };
  }

  // Send reminders for custom reminder dates
  static async sendCustomDateReminders(): Promise<{ sent: number; failed: number }> {
    const settings = await db.adminSettings.findFirst();
    
    if (!settings?.customReminderDates) {
      return { sent: 0, failed: 0 };
    }

    const today = format(new Date(), "yyyy-MM-dd");
    const customDates = settings.customReminderDates.split(",").map(d => d.trim());
    
    if (!customDates.includes(today)) {
      return { sent: 0, failed: 0 };
    }

    const adminEmail = settings.adminEmail || process.env.ADMIN_EMAIL || "moh_zaher@msn.com";
    
    // Get all active tasks
    const tasks = await db.task.findMany({
      where: {
        status: { in: ["in_progress", "delayed", "not_started"] },
      },
      include: { owner: true },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
    });

    const subject = `📋 Scheduled Reminder - ${format(new Date(), "MMMM d, yyyy")}`;
    const template = getInProgressReportTemplate(tasks, "daily");

    const result = await sendEmailWithResend({
      to: adminEmail,
      subject,
      html: template.html,
      text: template.text,
    });

    return { sent: result.success ? 1 : 0, failed: result.success ? 0 : 1 };
  }
}

// Template for scheduled reminders
function getScheduledReminderTemplate(reminder: {
  title: string;
  description: string | null;
  reminderDate: Date;
}, tasks: Array<{
  title: string;
  taskId: string | null;
  dueDate: Date | null;
  priority: string;
  completion: number;
  department: string | null;
  owner: { name: string | null; email: string } | null;
}>): { subject: string; html: string; text: string } {
  const subject = `📋 ${reminder.title} - ${format(new Date(reminder.reminderDate), "MMM d, yyyy")}`;
  
  const tasksHtml = tasks.slice(0, 20).map(task => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        ${task.taskId ? `#${task.taskId}` : '-'}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        <strong>${task.title}</strong>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        ${task.department || '-'}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        ${task.owner?.name || task.owner?.email || '-'}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        ${task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : '-'}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        <span style="color: ${task.priority === 'critical' ? '#dc2626' : task.priority === 'high' ? '#ea580c' : task.priority === 'medium' ? '#ca8a04' : '#16a34a'}">
          ${task.priority.toUpperCase()}
        </span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        ${Math.round(task.completion * 100)}%
      </td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #7c3aed; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
        th { background: #374151; color: white; padding: 12px 10px; text-align: left; }
        .description { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">📋 ${reminder.title}</h1>
          <p style="margin: 5px 0 0 0;">${format(new Date(reminder.reminderDate), "MMMM d, yyyy")}</p>
        </div>
        <div class="content">
          ${reminder.description ? `<div class="description"><p>${reminder.description}</p></div>` : ''}
          
          <p><strong>${tasks.length}</strong> active tasks requiring attention:</p>
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Owner</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              ${tasksHtml}
            </tbody>
          </table>
          
          ${tasks.length > 20 ? `<p style="margin-top: 10px; color: #6b7280;">Showing 20 of ${tasks.length} tasks. Log in to see all tasks.</p>` : ''}
          
          <p style="margin-top: 20px;">Please log in to the TaskTracker system to update task statuses.</p>
        </div>
        <div class="footer">
          <p>This is an automated message from TaskTracker.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    ${reminder.title}
    ${format(new Date(reminder.reminderDate), "MMMM d, yyyy")}
    
    ${reminder.description || ''}
    
    ${tasks.length} active tasks:
    ${tasks.slice(0, 10).map(t => `- ${t.title} (${t.priority}) - ${Math.round(t.completion * 100)}%`).join('\n')}
    
    Please log in to TaskTracker for more details.
  `;

  return { subject, html, text };
}
