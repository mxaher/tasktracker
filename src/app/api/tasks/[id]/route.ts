import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/tasks/[id] - Get a single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const task = await db.task.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Get the current task to log changes
    const currentTask = await db.task.findUnique({
      where: { id },
    });
    
    if (!currentTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    // Prepare update data
    const updateData: Record<string, unknown> = {};
    const auditLogs: Array<{ field: string; oldValue: string | null; newValue: string | null }> = [];
    
    // Track field changes
    const fieldsToCheck = [
      "taskId", "title", "description", "ownerId", "assigneeId",
      "department", "priority", "status", "strategicPillar", "completion",
      "riskIndicator", "startDate", "dueDate", "notes", "nextStep", "ceoNotes", "sourceMonth"
    ];
    
    for (const field of fieldsToCheck) {
      if (data[field] !== undefined) {
        let oldValue = currentTask[field as keyof typeof currentTask];
        let newValue = data[field];
        
        // Handle date fields
        if (field === "startDate" || field === "dueDate") {
          oldValue = oldValue ? new Date(oldValue as Date).toISOString() : null;
          newValue = newValue ? new Date(newValue).toISOString() : null;
        }
        
        // Handle completion (convert to float)
        if (field === "completion") {
          oldValue = Number(oldValue);
          newValue = Number(newValue);
        }
        
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          updateData[field] = newValue;
          auditLogs.push({
            field,
            oldValue: oldValue ? String(oldValue) : null,
            newValue: newValue ? String(newValue) : null,
          });
        }
      }
    }
    
    // Auto-set completedAt when status changes to completed
    if (updateData.status === "completed" && currentTask.status !== "completed") {
      updateData.completedAt = new Date();
      updateData.completion = 1;
    }
    
    // Update the task
    const task = await db.task.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    
    // Create audit logs
    for (const log of auditLogs) {
      await db.taskAuditLog.create({
        data: {
          taskId: id,
          action: "update",
          field: log.field,
          oldValue: log.oldValue,
          newValue: log.newValue,
        },
      });
    }
    
    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if task exists
    const task = await db.task.findUnique({
      where: { id },
    });
    
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    
    // Create audit log before deletion
    await db.taskAuditLog.create({
      data: {
        taskId: id,
        action: "delete",
        field: null,
        oldValue: JSON.stringify(task),
        newValue: null,
      },
    });
    
    // Delete related records
    await db.notification.deleteMany({
      where: { taskId: id },
    });
    
    await db.taskAuditLog.deleteMany({
      where: { taskId: id },
    });
    
    // Delete the task
    await db.task.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
