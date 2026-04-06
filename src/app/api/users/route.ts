import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type D1Value = string | number | null;

type UserRow = {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  department: string | null;
  role: string;
  isActive: number | boolean;
  createdAt: string;
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

function mapUserRow(row: UserRow) {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    name: row.name,
    department: row.department,
    role: row.role,
    isActive: row.isActive === true || row.isActive === 1,
    createdAt: row.createdAt,
  };
}

export async function GET() {
  try {
    const users = await d1All<UserRow>(
      `
        SELECT "id", "email", "username", "name", "department", "role", "isActive", "createdAt"
        FROM "User"
        ORDER BY COALESCE("name", "email") ASC
      `,
    );

    return NextResponse.json({ users: users.map(mapUserRow) });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const existingUser = await d1First<{ id: string }>(
      'SELECT "id" FROM "User" WHERE "email" = ? LIMIT 1',
      data.email,
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    const id = data.id || createId();
    const timestamp = data.updatedAt || nowIso();
    const createdAt = data.createdAt || timestamp;

    await d1Run(
      `
        INSERT INTO "User" (
          "id", "email", "username", "name", "role", "department", "phone", "avatar", "isActive",
          "receiveTaskReminders", "receiveDailyDigest", "receiveWeeklyReport",
          "reminderDaysBefore", "createdAt", "updatedAt"
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      id,
      data.email,
      data.username || null,
      data.name || null,
      data.role || "viewer",
      data.department || null,
      data.phone || null,
      null,
      data.isActive === false ? 0 : 1,
      data.receiveTaskReminders === false ? 0 : 1,
      data.receiveDailyDigest ? 1 : 0,
      data.receiveWeeklyReport ? 1 : 0,
      Number(data.reminderDaysBefore ?? 3),
      createdAt,
      timestamp,
    );

    const user = await d1First<UserRow>(
      `
        SELECT "id", "email", "username", "name", "department", "role", "isActive", "createdAt"
        FROM "User"
        WHERE "id" = ?
        LIMIT 1
      `,
      id,
    );

    return NextResponse.json({ user: user ? mapUserRow(user) : null }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
