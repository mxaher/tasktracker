import { parseContactCreateInput } from "@/lib/contacts";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function formatContact(contact: {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
  } | null;
}) {
  return {
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    userId: contact.userId,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
    user: contact.user,
  };
}

/** Returns all contacts ordered by name. */
export async function GET() {
  try {
    const contacts = await db.contact.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      contacts: contacts.map(formatContact),
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

    const contact = await db.contact.create({
      data: parsed.data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({ contact: formatContact(contact) }, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);

    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { error: "That user is already linked to another contact." },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}
