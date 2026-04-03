import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "edge";

// GET /api/reminders - List all scheduled reminders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includePast = searchParams.get("includePast") === "true";
    
    const where = includePast ? {} : {
      OR: [
        { isSent: false },
        { reminderDate: { gte: new Date() } }
      ]
    };
    
    const reminders = await db.scheduledReminder.findMany({
      where,
      orderBy: { reminderDate: "asc" },
    });
    
    return NextResponse.json({ reminders });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return NextResponse.json(
      { error: "Failed to fetch reminders" },
      { status: 500 }
    );
  }
}

// POST /api/reminders - Create a new scheduled reminder
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const reminder = await db.scheduledReminder.create({
      data: {
        title: data.title,
        description: data.description || null,
        reminderDate: new Date(data.reminderDate),
        reminderTime: data.reminderTime || "09:00",
        sendToAdmin: data.sendToAdmin ?? true,
        sendToOwners: data.sendToOwners ?? true,
        taskIds: data.taskIds || null,
        isActive: true,
        isSent: false,
      },
    });
    
    return NextResponse.json({ reminder });
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json(
      { error: "Failed to create reminder" },
      { status: 500 }
    );
  }
}

// PUT /api/reminders - Update a scheduled reminder
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ error: "Reminder ID required" }, { status: 400 });
    }
    
    const reminder = await db.scheduledReminder.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        reminderDate: data.reminderDate ? new Date(data.reminderDate) : undefined,
        reminderTime: data.reminderTime,
        sendToAdmin: data.sendToAdmin,
        sendToOwners: data.sendToOwners,
        taskIds: data.taskIds,
        isActive: data.isActive,
      },
    });
    
    return NextResponse.json({ reminder });
  } catch (error) {
    console.error("Error updating reminder:", error);
    return NextResponse.json(
      { error: "Failed to update reminder" },
      { status: 500 }
    );
  }
}

// DELETE /api/reminders - Delete a scheduled reminder
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Reminder ID required" }, { status: 400 });
    }
    
    await db.scheduledReminder.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json(
      { error: "Failed to delete reminder" },
      { status: 500 }
    );
  }
}
