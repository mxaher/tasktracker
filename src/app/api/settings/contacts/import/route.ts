import { parseContactCreateInput } from "@/lib/contact-validation";
import { createId, d1All, d1First, d1Run, nowIso } from "@/lib/cloudflare-d1";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

type ImportRow = Record<string, unknown>;

type ExistingContactRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  userId: string | null;
};

const COLUMN_ALIASES: Record<string, string> = {
  name: "name",
  full_name: "name",
  contact_name: "name",
  الاسم: "name",
  phone: "phone",
  mobile: "phone",
  whatsapp: "phone",
  phone_number: "phone",
  رقم_الهاتف: "phone",
  الجوال: "phone",
  email: "email",
  البريد_الإلكتروني: "email",
  البريد: "email",
  user_id: "userId",
  userid: "userId",
  linked_user_id: "userId",
  user_email: "userEmail",
  linked_user_email: "userEmail",
  linked_email: "userEmail",
  user: "userEmail",
};

function normalizeHeader(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function getMappedField(header: unknown) {
  return COLUMN_ALIASES[normalizeHeader(header)] ?? null;
}

function getCellValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function buildColumnMap(headers: unknown[]) {
  return headers.reduce<Record<number, string>>((map, header, index) => {
    const field = getMappedField(header);

    if (field) {
      map[index] = field;
    }

    return map;
  }, {});
}

function mapRow(row: unknown[], columnMap: Record<number, string>) {
  return Object.entries(columnMap).reduce<ImportRow>((record, [index, field]) => {
    record[field] = getCellValue(row[Number(index)]);
    return record;
  }, {});
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return NextResponse.json({ error: "The file has no worksheets" }, { status: 400 });
    }

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as unknown[][];

    if (rows.length < 2) {
      return NextResponse.json({ error: "The file must include a header row and at least one contact" }, { status: 400 });
    }

    const headerRow = rows[0] ?? [];
    const columnMap = buildColumnMap(headerRow);

    if (!Object.values(columnMap).includes("name")) {
      return NextResponse.json({ error: "The file must include a name column" }, { status: 400 });
    }

    const existingContacts = await d1All<ExistingContactRow>(
      'SELECT "id", "name", "phone", "email", "userId" FROM "Contact"',
    );

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const rawRow of rows.slice(1)) {
      if (!rawRow || rawRow.every((cell) => getCellValue(cell) === "")) {
        continue;
      }

      const record = mapRow(rawRow, columnMap);
      const userEmail = getCellValue(record.userEmail);
      let linkedUserId = getCellValue(record.userId) || null;

      if (!linkedUserId && userEmail) {
        const linkedUser = await d1First<{ id: string }>(
          'SELECT "id" FROM "User" WHERE lower("email") = lower(?) LIMIT 1',
          userEmail,
        );

        linkedUserId = linkedUser?.id ?? null;
      }

      const parsed = parseContactCreateInput({
        name: record.name,
        phone: record.phone || null,
        email: record.email || null,
        userId: linkedUserId,
      });

      if (!parsed.success) {
        skipped += 1;
        continue;
      }

      const conflictByUser =
        parsed.data.userId
          ? existingContacts.find((contact) => contact.userId === parsed.data.userId) ?? null
          : null;
      const conflictByEmail =
        parsed.data.email
          ? existingContacts.find(
              (contact) => contact.email?.toLowerCase() === parsed.data.email?.toLowerCase(),
            ) ?? null
          : null;
      const conflictByPhone =
        parsed.data.phone
          ? existingContacts.find((contact) => contact.phone === parsed.data.phone) ?? null
          : null;
      const existingContact = conflictByUser || conflictByEmail || conflictByPhone;

      if (existingContact) {
        await d1Run(
          `
            UPDATE "Contact"
            SET "name" = ?, "phone" = ?, "email" = ?, "userId" = ?, "updatedAt" = ?
            WHERE "id" = ?
          `,
          parsed.data.name,
          parsed.data.phone,
          parsed.data.email,
          parsed.data.userId,
          nowIso(),
          existingContact.id,
        );

        existingContact.name = parsed.data.name;
        existingContact.phone = parsed.data.phone;
        existingContact.email = parsed.data.email;
        existingContact.userId = parsed.data.userId;
        updated += 1;
        continue;
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

      existingContacts.push({
        id,
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        userId: parsed.data.userId,
      });
      imported += 1;
    }

    return NextResponse.json({ imported, updated, skipped });
  } catch (error) {
    console.error("Error importing contacts:", error);
    return NextResponse.json({ error: "Failed to import contacts" }, { status: 500 });
  }
}
