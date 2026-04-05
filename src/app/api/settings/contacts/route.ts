import { parseContactCreateInput } from "@/lib/contacts";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

type D1Value = string | number | null;

type ContactRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  u_id: string | null;
  u_name: string | null;
  u_email: string | null;
  u_username: string | null;
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

function mapContactRow(row: ContactRow) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    userId: row.userId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    user: row.u_id
      ? {
          id: row.u_id,
          name: row.u_name,
          email: row.u_email ?? "",
          username: row.u_username,
        }
      : null,
  };
}

/** Returns all contacts ordered by name. */
export async function GET() {
  try {
    const rows = await d1All<ContactRow>(
      `
        SELECT
          c."id", c."name", c."phone", c."email", c."userId", c."createdAt", c."updatedAt",
          u."id" AS "u_id", u."name" AS "u_name", u."email" AS "u_email", u."username" AS "u_username"
        FROM "Contact" c
        LEFT JOIN "User" u ON c."userId" = u."id"
        ORDER BY c."name" ASC
      `,
    );

    return NextResponse.json({ contacts: rows.map(mapContactRow) });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

/** Creates a new contact record. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseContactCreateInput(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    // Enforce userId uniqueness
    if (parsed.data.userId) {
      const existing = await d1First<{ id: string }>(
        'SELECT "id" FROM "Contact" WHERE "userId" = ? LIMIT 1',
        parsed.data.userId,
      );
      if (existing) {
        return NextResponse.json(
          { error: "That user is already linked to another contact." },
          { status: 400 },
        );
      }
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await d1Run(
      `
        INSERT INTO "Contact" ("id", "name", "phone", "email", "userId", "createdAt", "updatedAt")
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      id,
      parsed.data.name,
      parsed.data.phone,
      parsed.data.email,
      parsed.data.userId,
      now,
      now,
    );

    const row = await d1First<ContactRow>(
      `
        SELECT
          c."id", c."name", c."phone", c."email", c."userId", c."createdAt", c."updatedAt",
          u."id" AS "u_id", u."name" AS "u_name", u."email" AS "u_email", u."username" AS "u_username"
        FROM "Contact" c
        LEFT JOIN "User" u ON c."userId" = u."id"
        WHERE c."id" = ?
      `,
      id,
    );

    return NextResponse.json(
      { contact: row ? mapContactRow(row) : null },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
