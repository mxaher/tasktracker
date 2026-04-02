import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { EmailService } from "@/lib/email";

// GET /api/tasks - List all tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const department = searchParams.get("department");
    const search = searchParams.get("search");
    
    const where: Prisma.TaskWhereInput = {};
    
    if (status && status !== "all") {
      where.status = status;
    }
    if (priority && priority !== "all") {
      where.priority = priority;
    }
    if (department && department !== "all") {
      where.department = department;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { taskId: { contains: search } },
      ];
    }
    
    const tasks = await db.task.findMany({
      where,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const task = await db.task.create({
      data: {
        taskId: data.taskId || null,
        title: data.title,
        description: data.description || null,
        ownerId: data.ownerId || null,
        assigneeId: data.assigneeId || null,
        department: data.department || null,
        priority: data.priority || "medium",
        status: data.status || "not_started",
        strategicPillar: data.strategicPillar || null,
        completion: data.completion || 0,
        riskIndicator: data.riskIndicator || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        notes: data.notes || null,
        nextStep: data.nextStep || null,
        ceoNotes: data.ceoNotes || null,
        sourceMonth: data.sourceMonth || null,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    
    // Create audit log
    await db.taskAuditLog.create({
      data: {
        taskId: task.id,
        action: "create",
        field: null,
        oldValue: null,
        newValue: JSON.stringify(task),
      },
    });
    
    // Send email notification if task has owner or assignee
    if (data.ownerId || data.assigneeId) {
      // Don't await - send email in background
      EmailService.sendTaskAssignmentNotification(task.id).catch(err => {
        console.error("Failed to send task assignment notification:", err);
      });
    }
    
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
