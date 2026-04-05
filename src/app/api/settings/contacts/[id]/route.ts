import { parseContactUpdateInput } from "@/lib/contacts";
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

/** Returns a single contact by ID. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const contact = await db.contact.findUnique({
      where: { id },
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

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ contact: formatContact(contact) });
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
    const existingContact = await db.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = parseContactUpdateInput(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const contact = await db.contact.update({
      where: { id },
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

    return NextResponse.json({ contact: formatContact(contact) });
  } catch (error) {
    console.error("Error updating contact:", error);

    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { error: "That user is already linked to another contact." },
        { status: 400 },
      );
    }

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
    const existingContact = await db.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    await db.contact.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
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
