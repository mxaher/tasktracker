import { db } from "../src/lib/db";
import * as xlsx from "xlsx";

// Column mapping
const statusMap: Record<string, string> = {
  "مكتملة": "completed",
  "جاري العمل": "in_progress",
  "متوقفة": "delayed",
  "لم تبدأ": "not_started",
};

const priorityMap: Record<string, string> = {
  "P1 - عاجل": "critical",
  "P2 - مهم": "high",
  "P3 - عادي": "medium",
  "P4 - منخفض": "low",
};

// Convert Excel serial date to JS Date
function excelDateToJSDate(serial: number): Date | null {
  if (!serial || isNaN(serial)) return null;
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  return new Date(utcValue * 1000);
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  if (typeof value === "number") return excelDateToJSDate(value);
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

async function importTasks() {
  const workbook = xlsx.readFile("/home/z/my-project/upload/Tasks_Tracker.xlsx");
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1, raw: true }) as unknown[][];
  const dataRows = rawData.slice(2) as unknown[][];
  
  console.log(`Found ${dataRows.length} rows to import`);
  
  const dataSource = await db.dataSource.create({
    data: {
      fileName: "Tasks_Tracker.xlsx",
      originalName: "Tasks_Tracker.xlsx",
      fileSize: 0,
      rowCount: dataRows.length,
    },
  });
  
  const userCache = new Map<string, string>();
  
  async function getOrCreateUser(name: string): Promise<string | null> {
    if (!name || String(name).trim() === "") return null;
    const trimmedName = String(name).trim();
    if (userCache.has(trimmedName)) return userCache.get(trimmedName)!;
    
    const existingUser = await db.user.findFirst({
      where: { OR: [{ name: trimmedName }, { email: trimmedName }] },
    });
    
    if (existingUser) {
      userCache.set(trimmedName, existingUser.id);
      return existingUser.id;
    }
    
    const newUser = await db.user.create({
      data: {
        email: `${trimmedName.toLowerCase().replace(/\s+/g, ".")}@tasktracker.local`,
        name: trimmedName,
        role: "viewer",
      },
    });
    
    userCache.set(trimmedName, newUser.id);
    return newUser.id;
  }
  
  let imported = 0;
  let errors = 0;
  
  for (const row of dataRows) {
    if (!row || !Array.isArray(row) || row.length < 2) continue;
    
    const taskId = row[0] ? String(row[0]) : null;
    const title = row[1] ? String(row[1]) : null;
    if (!title) continue;
    
    const department = row[2] ? String(row[2]) : null;
    const employee = row[3] ? String(row[3]) : null;
    const priority = row[4] ? priorityMap[String(row[4])] || "medium" : "medium";
    const strategicPillar = row[5] ? String(row[5]) : null;
    let status = row[6] ? statusMap[String(row[6])] || "not_started" : "not_started";
    const completion = row[7] ? Math.min(1, Math.max(0, Number(row[7]))) : 0;
    const startDate = parseDate(row[8]);
    const dueDate = parseDate(row[9]);
    const riskIndicator = row[11] ? String(row[11]) : null;
    const notes = row[12] ? String(row[12]) : null;
    const nextStep = row[13] ? String(row[13]) : null;
    const ceoNotes = row[14] ? String(row[14]) : null;
    const sourceMonth = row[15] ? String(row[15]) : null;
    
    if (dueDate && status !== "completed") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today && completion < 1) status = "delayed";
    }
    
    let ownerId: string | null = null;
    if (employee) ownerId = await getOrCreateUser(employee);
    
    try {
      await db.task.create({
        data: {
          taskId,
          title,
          description: null,
          ownerId,
          department,
          priority,
          status,
          strategicPillar,
          completion,
          riskIndicator,
          startDate,
          dueDate,
          notes,
          nextStep,
          ceoNotes,
          sourceMonth,
          dataSourceId: dataSource.id,
          completedAt: status === "completed" ? new Date() : null,
        },
      });
      imported++;
      if (imported % 50 === 0) console.log(`Imported ${imported} tasks...`);
    } catch (e) {
      errors++;
      if (errors < 5) console.error(`Error importing task ${taskId}:`, e);
    }
  }
  
  console.log(`\nImport complete! Imported: ${imported}, Errors: ${errors}`);
}

importTasks()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  });
