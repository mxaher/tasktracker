import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as XLSX from "xlsx";

export const runtime = "edge";

// GET /api/tasks/export - Export tasks to Excel
export async function GET() {
  try {
    const tasks = await db.task.findMany({
      include: {
        owner: {
          select: { name: true, email: true },
        },
        assignee: {
          select: { name: true, email: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    
    // Transform tasks for export
    const exportData = tasks.map(task => ({
      "Task ID": task.taskId || "",
      "Title": task.title,
      "Description": task.description || "",
      "Department": task.department || "",
      "Owner": task.owner?.name || "",
      "Owner Email": task.owner?.email || "",
      "Assignee": task.assignee?.name || "",
      "Priority": task.priority,
      "Status": task.status,
      "Strategic Pillar": task.strategicPillar || "",
      "Completion %": Math.round(task.completion * 100),
      "Start Date": task.startDate ? new Date(task.startDate).toISOString().split("T")[0] : "",
      "Due Date": task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      "Completed At": task.completedAt ? new Date(task.completedAt).toISOString().split("T")[0] : "",
      "Notes": task.notes || "",
      "Next Step": task.nextStep || "",
      "CEO Notes": task.ceoNotes || "",
      "Source Month": task.sourceMonth || "",
      "Created At": new Date(task.createdAt).toISOString().split("T")[0],
      "Updated At": new Date(task.updatedAt).toISOString().split("T")[0],
    }));
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    const colWidths = [
      { wch: 10 },  // Task ID
      { wch: 40 },  // Title
      { wch: 30 },  // Description
      { wch: 20 },  // Department
      { wch: 20 },  // Owner
      { wch: 25 },  // Owner Email
      { wch: 20 },  // Assignee
      { wch: 10 },  // Priority
      { wch: 15 },  // Status
      { wch: 20 },  // Strategic Pillar
      { wch: 12 },  // Completion %
      { wch: 12 },  // Start Date
      { wch: 12 },  // Due Date
      { wch: 12 },  // Completed At
      { wch: 30 },  // Notes
      { wch: 30 },  // Next Step
      { wch: 30 },  // CEO Notes
      { wch: 15 },  // Source Month
      { wch: 12 },  // Created At
      { wch: 12 },  // Updated At
    ];
    worksheet["!cols"] = colWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    
    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    
    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="tasks_export_${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Error exporting tasks:", error);
    return NextResponse.json(
      { error: "Failed to export tasks" },
      { status: 500 }
    );
  }
}
