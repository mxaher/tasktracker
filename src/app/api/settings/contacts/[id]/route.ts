import { parseContactUpdateInput } from "@/lib/contact-validation";
import { d1First, d1Run, nowIso } from "@/lib/cloudflare-d1";
import { NextRequest, NextResponse } from "next/server";

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

/** Returns a single contact by ID. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const contact = await d1First<ContactRow>(
      `${CONTACT_SELECT_SQL}
       WHERE c.id = ?
       LIMIT 1`,
      id,
    );

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ contact: mapContactRow(contact) });
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

    if (parsed.data.userId) {
      const linkedUser = await d1First<{ id: string }>(
        'SELECT "id" FROM "User" WHERE "id" = ? LIMIT 1',
        parsed.data.userId,
      );

      if (!linkedUser) {
        return NextResponse.json({ error: "Linked user was not found." }, { status: 400 });
      }

      const conflictingContact = await d1First<{ id: string }>(
        'SELECT "id" FROM "Contact" WHERE "userId" = ? AND "id" != ? LIMIT 1',
        parsed.data.userId,
        id,
      );

      if (conflictingContact) {
        return NextResponse.json(
          { error: "That user is already linked to another contact." },
          { status: 400 },
        );
      }
    }

    const updates: string[] = [];
    const values: Array<string | null> = [];

    if (parsed.data.name !== undefined) {
      updates.push('"name" = ?');
      values.push(parsed.data.name);
    }

    if (parsed.data.phone !== undefined) {
      updates.push('"phone" = ?');
      values.push(parsed.data.phone);
    }

    if (parsed.data.email !== undefined) {
      updates.push('"email" = ?');
      values.push(parsed.data.email);
    }

    if (parsed.data.userId !== undefined) {
      updates.push('"userId" = ?');
      values.push(parsed.data.userId);
    }

    updates.push('"updatedAt" = ?');
    values.push(nowIso());

    await d1Run(
      `UPDATE "Contact" SET ${updates.join(", ")} WHERE "id" = ?`,
      ...values,
      id,
    );

    const contact = await d1First<ContactRow>(
      `${CONTACT_SELECT_SQL}
       WHERE c.id = ?
       LIMIT 1`,
      id,
    );

    return NextResponse.json({ contact: contact ? mapContactRow(contact) : null });
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
