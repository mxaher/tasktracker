import { parseContactCreateInput } from "@/lib/contact-validation";
import { createId, d1All, d1First, d1Run, nowIso } from "@/lib/cloudflare-d1";
import { NextRequest, NextResponse } from "next/server";



export const dynamic = 'force-dynamic'
type ContactRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_username: string | null;
};

function mapContactRow(contact: ContactRow) {
  return {
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    userId: contact.userId,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
    user:
      contact.user_id && contact.user_email
        ? {
            id: contact.user_id,
            name: contact.user_name,
            email: contact.user_email,
            username: contact.user_username,
          }
        : null,
  };
}

const CONTACT_SELECT_SQL = `
  SELECT
    c.id,
    c.name,
    c.phone,
    c.email,
    c.userId,
    c.createdAt,
    c.updatedAt,
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email,
    u.username AS user_username
  FROM "Contact" c
  LEFT JOIN "User" u ON u.id = c.userId
`;

/** Returns all contacts ordered by name. */
export async function GET() {
  try {
    const contacts = await d1All<ContactRow>(
      `${CONTACT_SELECT_SQL}
       ORDER BY COALESCE(c.name, '') ASC, c.createdAt ASC`,
    );

    return NextResponse.json({
      contacts: contacts.map(mapContactRow),
    });
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

    if (parsed.data.userId) {
      const linkedUser = await d1First<{ id: string }>(
        'SELECT "id" FROM "User" WHERE "id" = ? LIMIT 1',
        parsed.data.userId,
      );

      if (!linkedUser) {
        return NextResponse.json({ error: "Linked user was not found." }, { status: 400 });
      }

      const existingContactForUser = await d1First<{ id: string }>(
        'SELECT "id" FROM "Contact" WHERE "userId" = ? LIMIT 1',
        parsed.data.userId,
      );

      if (existingContactForUser) {
        return NextResponse.json(
          { error: "That user is already linked to another contact." },
          { status: 400 },
        );
      }
    }

    const id = createId();
    const timestamp = nowIso();

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
      timestamp,
      timestamp,
    );

    const contact = await d1First<ContactRow>(
      `${CONTACT_SELECT_SQL}
       WHERE c.id = ?
       LIMIT 1`,
      id,
    );

    return NextResponse.json({ contact: contact ? mapContactRow(contact) : null }, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    const message = error instanceof Error ? error.message : "";

    if (message.includes("UNIQUE constraint failed: Contact.userId")) {
      return NextResponse.json(
        { error: "That user is already linked to another contact." },
        { status: 400 },
      );
    }

    if (message.includes("FOREIGN KEY constraint failed")) {
      return NextResponse.json({ error: "Linked user was not found." }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
