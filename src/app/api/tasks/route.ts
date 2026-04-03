import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1Value = string | number | null;
type TaskRow = {
  id: string;
  taskId: string | null;
  title: string;
  description: string | null;
  ownerId: string | null;
  assigneeId: string | null;
  department: string | null;
  priority: string;
  status: string;
  strategicPillar: string | null;
  completion: number | null;
  riskIndicator: string | null;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  notes: string | null;
  nextStep: string | null;
  ceoNotes: string | null;
  sourceMonth: string | null;
  createdAt: string;
  updatedAt: string;
  owner_user_id: string | null;
  owner_name: string | null;
  owner_email: string | null;
  assignee_user_id: string | null;
  assignee_name: string | null;
  assignee_email: string | null;
};

function getDb() {
  const context = getCloudflareContext();
  const env = context.env as {
    DB?: {
      prepare: (sql: string) => {
        bind: (...params: D1Value[]) => {
          all: <T>() => Promise<{ results?: T[] }>;
          first: <T>() => Promise<T | null>;
          run: () => Promise<unknown>;
        };
      };
    };
  };

  if (!env.DB) {
    throw new Error("Cloudflare D1 binding is not available.");
  }

  return env.DB;
}

async function d1All<T>(sql: string, ...params: D1Value[]) {
  const result = await getDb().prepare(sql).bind(...params).all<T>();
  return result.results ?? [];
}

async function d1First<T>(sql: string, ...params: D1Value[]) {
  return getDb().prepare(sql).bind(...params).first<T>();
}

async function d1Run(sql: string, ...params: D1Value[]) {
  return getDb().prepare(sql).bind(...params).run();
}

function createId() {
  return crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

function toIsoDate(value: unknown) {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function mapTaskRow(row: TaskRow) {
  return {
    id: row.id,
    taskId: row.taskId,
    title: row.title,
    description: row.description,
    ownerId: row.ownerId,
    assigneeId: row.assigneeId,
    department: row.department,
    priority: row.priority,
    status: row.status,
    strategicPillar: row.strategicPillar,
    completion: row.completion ?? 0,
    riskIndicator: row.riskIndicator,
    startDate: row.startDate,
    dueDate: row.dueDate,
    completedAt: row.completedAt,
    notes: row.notes,
    nextStep: row.nextStep,
    ceoNotes: row.ceoNotes,
    sourceMonth: row.sourceMonth,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    owner:
      row.owner_user_id && row.owner_email
        ? { id: row.owner_user_id, name: row.owner_name, email: row.owner_email }
        : null,
    assignee:
      row.assignee_user_id && row.assignee_email
        ? { id: row.assignee_user_id, name: row.assignee_name, email: row.assignee_email }
        : null,
  };
}

const TASK_SELECT_SQL = `
  SELECT
    t.id,
    t.taskId,
    t.title,
    t.description,
    t.ownerId,
    t.assigneeId,
    t.department,
    t.priority,
    t.status,
    t.strategicPillar,
    t.completion,
    t.riskIndicator,
    t.startDate,
    t.dueDate,
    t.completedAt,
    t.notes,
    t.nextStep,
    t.ceoNotes,
    t.sourceMonth,
    t.createdAt,
    t.updatedAt,
    owner.id AS owner_user_id,
    owner.name AS owner_name,
    owner.email AS owner_email,
    assignee.id AS assignee_user_id,
    assignee.name AS assignee_name,
    assignee.email AS assignee_email
  FROM "Task" t
  LEFT JOIN "User" owner ON owner.id = t.ownerId
  LEFT JOIN "User" assignee ON assignee.id = t.assigneeId
`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const department = searchParams.get("department");
    const search = searchParams.get("search");

    const clauses: string[] = [];
    const params: Array<string | number | null> = [];

    if (status && status !== "all") {
      clauses.push("t.status = ?");
      params.push(status);
    }

    if (priority && priority !== "all") {
      clauses.push("t.priority = ?");
      params.push(priority);
    }

    if (department && department !== "all") {
      clauses.push("t.department = ?");
      params.push(department);
    }

    if (search) {
      clauses.push(
        "(t.title LIKE ? OR t.description LIKE ? OR t.taskId LIKE ? OR t.department LIKE ?)",
      );
      const query = `%${search}%`;
      params.push(query, query, query, query);
    }

    const whereClause = clauses.length > 0 ? ` WHERE ${clauses.join(" AND ")}` : "";
    const rows = await d1All<TaskRow>(
      `${TASK_SELECT_SQL}${whereClause} ORDER BY t.updatedAt DESC`,
      ...params,
    );

    return NextResponse.json({ tasks: rows.map(mapTaskRow) });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = data.id || createId();
    const timestamp = data.updatedAt || nowIso();
    const createdAt = data.createdAt || timestamp;
    const status = data.status || "not_started";
    const completion = Number(data.completion ?? 0);
    const completedAt =
      status === "completed" ? toIsoDate(data.completedAt) ?? timestamp : null;

    await d1Run(
      `
        INSERT INTO "Task" (
          "id", "taskId", "title", "description", "ownerId", "assigneeId", "department",
          "priority", "status", "strategicPillar", "completion", "riskIndicator",
          "startDate", "dueDate", "completedAt", "notes", "nextStep", "ceoNotes",
          "sourceMonth", "dataSourceId", "createdAt", "updatedAt"
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      id,
      data.taskId || null,
      data.title,
      data.description || null,
      data.ownerId || null,
      data.assigneeId || null,
      data.department || null,
      data.priority || "medium",
      status,
      data.strategicPillar || null,
      Number.isFinite(completion) ? completion : 0,
      data.riskIndicator || null,
      toIsoDate(data.startDate),
      toIsoDate(data.dueDate),
      completedAt,
      data.notes || null,
      data.nextStep || null,
      data.ceoNotes || null,
      data.sourceMonth || null,
      null,
      createdAt,
      timestamp,
    );

    await d1Run(
      `
        INSERT INTO "TaskAuditLog" (
          "id", "taskId", "userId", "action", "field", "oldValue", "newValue", "createdAt"
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      createId(),
      id,
      null,
      "create",
      null,
      null,
      JSON.stringify({
        taskId: data.taskId || null,
        title: data.title,
        description: data.description || null,
        ownerId: data.ownerId || null,
        assigneeId: data.assigneeId || null,
        department: data.department || null,
        priority: data.priority || "medium",
        status,
      }),
      timestamp,
    );

    const task = await d1First<TaskRow>(`${TASK_SELECT_SQL} WHERE t.id = ?`, id);

    return NextResponse.json({ task: task ? mapTaskRow(task) : null }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
