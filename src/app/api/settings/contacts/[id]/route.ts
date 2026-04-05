import { parseContactUpdateInput } from "@/lib/contacts";
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

async function d1First<T>(sql: string, ...params: D1Value[]) {
  return getDb().prepare(sql).bind(...params).first<T>();
}

async function d1Run(sql: string, ...params: D1Value[]) {
  return getDb().prepare(sql).bind(...params).run();
}

const CONTACT_WITH_USER_SQL = `
  SELECT
    c."id", c."name", c."phone", c."email", c."userId", c."createdAt", c."updatedAt",
    u."id" AS "u_id", u."name" AS "u_name", u."email" AS "u_email", u."username" AS "u_username"
  FROM "Contact" c
  LEFT JOIN "User" u ON c."userId" = u."id"
  WHERE c."id" = ?
`;

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

/** Returns a single contact by ID. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const row = await d1First<ContactRow>(CONTACT_WITH_USER_SQL, id);

    if (!row) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ contact: mapContactRow(row) });
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 });
  }
}

/** Updates a contact by ID. */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existing = await d1First<{ id: string; userId: string | null }>(
      'SELECT "id", "userId" FROM "Contact" WHERE "id" = ? LIMIT 1',
      id,
    );

    if (!existing) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = parseContactUpdateInput(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    // Enforce userId uniqueness when changing userId
    if (parsed.data.userId !== undefined && parsed.data.userId !== existing.userId) {
      if (parsed.data.userId !== null) {
        const conflict = await d1First<{ id: string }>(
          'SELECT "id" FROM "Contact" WHERE "userId" = ? AND "id" != ? LIMIT 1',
          parsed.data.userId,
          id,
        );
        if (conflict) {
          return NextResponse.json(
            { error: "That user is already linked to another contact." },
            { status: 400 },
          );
        }
      }
    }

    const setClauses: string[] = ['"updatedAt" = ?'];
    const values: D1Value[] = [new Date().toISOString()];

    if (parsed.data.name !== undefined) {
      setClauses.push('"name" = ?');
      values.push(parsed.data.name);
    }
    if (parsed.data.phone !== undefined) {
      setClauses.push('"phone" = ?');
      values.push(parsed.data.phone);
    }
    if (parsed.data.email !== undefined) {
      setClauses.push('"email" = ?');
      values.push(parsed.data.email);
    }
    if (parsed.data.userId !== undefined) {
      setClauses.push('"userId" = ?');
      values.push(parsed.data.userId);
    }

    await d1Run(
      `UPDATE "Contact" SET ${setClauses.join(", ")} WHERE "id" = ?`,
      ...values,
      id,
    );

    const row = await d1First<ContactRow>(CONTACT_WITH_USER_SQL, id);

    return NextResponse.json({ contact: row ? mapContactRow(row) : null });
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

/** Deletes a contact by ID. */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const existing = await d1First<{ id: string }>(
      'SELECT "id" FROM "Contact" WHERE "id" = ? LIMIT 1',
      id,
    );

    if (!existing) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    await d1Run('DELETE FROM "Contact" WHERE "id" = ?', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
