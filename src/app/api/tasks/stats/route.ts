import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { addDays, isBefore, isWithinInterval, startOfDay } from "date-fns";



export const dynamic = 'force-dynamic'
type D1Value = string | number | null;

type StatsTaskRow = {
  id: string;
  status: string;
  priority: string;
  department: string | null;
  dueDate: string | null;
  completion: number | null;
};

function getDb() {
  const context = getCloudflareContext();
  const env = context.env as {
    DB?: {
      prepare: (sql: string) => {
        bind: (...params: D1Value[]) => {
          all: <T>() => Promise<{ results?: T[] }>;
          first: <T>() => Promise<T | null>;
        };
      };
    };
  };

  const database = env.DB;
  if (!database) {
    throw new Error("Cloudflare D1 binding is not available.");
  }

  return database;
}

async function d1All<T>(sql: string, ...params: D1Value[]) {
  const result = await getDb().prepare(sql).bind(...params).all<T>();
  return result.results ?? [];
}

export async function GET() {
  try {
    const tasks = await d1All<StatsTaskRow>(
      `
        SELECT "id", "status", "priority", "department", "dueDate", "completion"
        FROM "Task"
      `,
    );

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "completed").length;
    const inProgressTasks = tasks.filter((task) => task.status === "in_progress").length;
    const delayedTasks = tasks.filter((task) => task.status === "delayed").length;
    const notStartedTasks = tasks.filter(
      (task) => task.status === "not_started" || task.status === "pending",
    ).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const today = startOfDay(new Date());
    const sevenDaysFromNow = addDays(today, 7);

    let overdueTasks = 0;
    let dueSoonTasks = 0;

    for (const task of tasks) {
      if (!task.dueDate || task.status === "completed") continue;
      const dueDay = startOfDay(new Date(task.dueDate));
      if (isBefore(dueDay, today)) {
        overdueTasks++;
      } else if (isWithinInterval(dueDay, { start: today, end: sevenDaysFromNow })) {
        dueSoonTasks++;
      }
    }

    const departmentMap = new Map<string, number>();
    const priorityMap = new Map<string, number>();
    const statusMap = new Map<string, number>();

    for (const task of tasks) {
      if (task.department) {
        departmentMap.set(task.department, (departmentMap.get(task.department) || 0) + 1);
      }
      priorityMap.set(task.priority, (priorityMap.get(task.priority) || 0) + 1);
      statusMap.set(task.status, (statusMap.get(task.status) || 0) + 1);
    }

    const tasksByDepartment = Array.from(departmentMap.entries())
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count);

    const priorityOrder = ["critical", "high", "medium", "low"];
    const tasksByPriority = priorityOrder
      .filter((priority) => priorityMap.has(priority))
      .map((priority) => ({ priority, count: priorityMap.get(priority) || 0 }));

    const statusOrder = ["pending", "not_started", "in_progress", "delayed", "completed"];
    const tasksByStatus = statusOrder
      .filter((status) => statusMap.has(status))
      .map((status) => ({ status, count: statusMap.get(status) || 0 }));

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
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
  }
}
