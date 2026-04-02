import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isPast, isWithinInterval, addDays, startOfDay } from "date-fns";

// GET /api/tasks/stats - Get dashboard statistics
export async function GET() {
  try {
    // Get all tasks
    const tasks = await db.task.findMany({
      select: {
        id: true,
        status: true,
        priority: true,
        department: true,
        dueDate: true,
        completion: true,
      },
    });
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
    const delayedTasks = tasks.filter(t => t.status === "delayed").length;
    const notStartedTasks = tasks.filter(t => t.status === "not_started").length;
    
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Calculate overdue and due soon
    const today = startOfDay(new Date());
    const sevenDaysFromNow = addDays(today, 7);
    
    let overdueTasks = 0;
    let dueSoonTasks = 0;
    
    for (const task of tasks) {
      if (task.dueDate && task.status !== "completed") {
        const dueDate = new Date(task.dueDate);
        if (isPast(dueDate)) {
          overdueTasks++;
        } else if (isWithinInterval(dueDate, { start: today, end: sevenDaysFromNow })) {
          dueSoonTasks++;
        }
      }
    }
    
    // Group by department
    const departmentMap = new Map<string, number>();
    tasks.forEach(task => {
      if (task.department) {
        departmentMap.set(task.department, (departmentMap.get(task.department) || 0) + 1);
      }
    });
    const tasksByDepartment = Array.from(departmentMap.entries())
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count);
    
    // Group by priority
    const priorityMap = new Map<string, number>();
    tasks.forEach(task => {
      priorityMap.set(task.priority, (priorityMap.get(task.priority) || 0) + 1);
    });
    const priorityOrder = ["critical", "high", "medium", "low"];
    const tasksByPriority = priorityOrder
      .filter(p => priorityMap.has(p))
      .map(priority => ({ priority, count: priorityMap.get(priority) || 0 }));
    
    // Group by status
    const statusMap = new Map<string, number>();
    tasks.forEach(task => {
      statusMap.set(task.status, (statusMap.get(task.status) || 0) + 1);
    });
    const statusOrder = ["not_started", "in_progress", "delayed", "completed"];
    const tasksByStatus = statusOrder
      .filter(s => statusMap.has(s))
      .map(status => ({ status, count: statusMap.get(status) || 0 }));
    
    return NextResponse.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      delayedTasks,
      notStartedTasks,
      completionRate,
      overdueTasks,
      dueSoonTasks,
      tasksByDepartment,
      tasksByPriority,
      tasksByStatus,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
