import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createId, d1All, d1First, d1Run, nowIso } from "@/lib/cloudflare-d1";
import { sendTelegramMessage } from "@/lib/notifications/telegram";
import { revalidatePath } from "next/cache";

type TelegramFrom = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
};

type TelegramWebhookBody = {
  message?: {
    text?: string;
    chat?: { id?: number | string };
    from?: TelegramFrom;
  };
};

type TelegramUserRow = {
  id: string;
  chatId: string;
  userId: string;
  user_name: string | null;
  user_email: string;
  user_role: string;
};

type UserRow = {
  id: string;
  name: string | null;
  email: string;
};

const COMMAND_USAGE = `
الصيغة الصحيحة:
/task
العنوان: عنوان المهمة
المكلف: اسم أو بريد المستخدم
الأولوية: عالية | متوسطة | منخفضة
تاريخ الاستحقاق: يوم/شهر/سنة
الملاحظات: (اختياري)
`.trim();

const PRIORITY_MAP: Record<string, string> = {
  عالية: "high",
  متوسطة: "medium",
  منخفضة: "low",
};

function parseField(text: string, label: string): string | null {
  const lines = text.split("\n");
  const line = lines.find((l) => l.trim().startsWith(`${label}:`));
  if (!line) return null;
  return line.slice(line.indexOf(":") + 1).trim() || null;
}

function parseDDMMYYYY(dateStr: string): Date | null {
  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, d, m, y] = match;
  const parsed = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}T09:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function replyToChat(chatId: string, text: string) {
  try {
    await sendTelegramMessage(chatId, text);
  } catch (err) {
    console.error("[Telegram Webhook] Failed to send reply:", err);
  }
}

async function writeTelegramLog(
  chatId: string,
  rawMessage: string,
  parsed: boolean,
  parseError?: string,
  taskId?: string,
) {
  const now = nowIso();
  await d1Run(
    `INSERT INTO "TelegramLog" ("id","chatId","rawMessage","parsed","parseError","taskId","createdAt")
     VALUES (?,?,?,?,?,?,?)`,
    createId(),
    chatId,
    rawMessage,
    parsed ? 1 : 0,
    parseError ?? null,
    taskId ?? null,
    now,
  ).catch(() => {});
}

export async function POST(request: NextRequest) {
  // 1. Validate secret token
  const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: TelegramWebhookBody;
  try {
    body = (await request.json()) as TelegramWebhookBody;
  } catch {
    return NextResponse.json({ ok: true });
  }

  // 2. Extract fields
  const chatIdValue = body.message?.chat?.id;
  const chatId = chatIdValue !== undefined ? String(chatIdValue) : null;
  const messageText = body.message?.text?.trim() ?? "";

  if (!chatId || !messageText) {
    return NextResponse.json({ ok: true });
  }

  // 3. Check allowed chat IDs
  const allowedIds = (process.env.TELEGRAM_ALLOWED_CHAT_IDS ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  if (allowedIds.length > 0 && !allowedIds.includes(chatId)) {
    await replyToChat(chatId, "غير مصرح بالوصول.");
    return NextResponse.json({ ok: true });
  }

  // 4. Look up linked TelegramUser
  const telegramUser = await d1First<TelegramUserRow>(
    `SELECT tu.id, tu.chatId, tu.userId,
            u.name AS user_name, u.email AS user_email, u.role AS user_role
     FROM "TelegramUser" tu
     JOIN "User" u ON u.id = tu.userId
     WHERE tu.chatId = ?`,
    chatId,
  ).catch(() => null);

  if (!telegramUser) {
    await replyToChat(
      chatId,
      "لم يتم ربط حسابك بعد.\nيرجى الذهاب إلى إعدادات النظام > تيليغرام لربط حسابك.",
    );
    return NextResponse.json({ ok: true });
  }

  // 5. Parse /task command or fallback
  const isTaskCommand = messageText.startsWith("/task");

  if (!isTaskCommand) {
    // Fallback: treat entire message as title, ask to confirm
    const fallbackTitle = messageText.slice(0, 200);
    await replyToChat(
      chatId,
      `تلقّينا رسالتك كعنوان للمهمة:\n"${fallbackTitle}"\n\nللإنشاء بشكل كامل، يرجى استخدام الصيغة:\n${COMMAND_USAGE}`,
    );
    await writeTelegramLog(chatId, messageText, false, "plain text message — no /task command");
    return NextResponse.json({ ok: true });
  }

  // Parse the /task command fields
  const title = parseField(messageText, "العنوان");
  const assigneeInput = parseField(messageText, "المكلف");
  const priorityAr = parseField(messageText, "الأولوية");
  const dueDateStr = parseField(messageText, "تاريخ الاستحقاق");
  const notes = parseField(messageText, "الملاحظات");

  if (!title) {
    const err = "حقل العنوان مفقود أو فارغ.";
    await replyToChat(chatId, `${err}\n\n${COMMAND_USAGE}`);
    await writeTelegramLog(chatId, messageText, false, err);
    return NextResponse.json({ ok: true });
  }

  // Assignee lookup
  let assigneeId: string | null = null;
  if (assigneeInput) {
    const pattern = `%${assigneeInput}%`;
    const matches = await d1All<UserRow>(
      `SELECT id, name, email FROM "User"
       WHERE LOWER(email) LIKE LOWER(?) OR LOWER(name) LIKE LOWER(?)
       LIMIT 5`,
      pattern,
      pattern,
    ).catch(() => [] as UserRow[]);

    if (matches.length === 0) {
      const err = `لم يتم العثور على مستخدم بالاسم/البريد: "${assigneeInput}"`;
      await replyToChat(chatId, `${err}\n\n${COMMAND_USAGE}`);
      await writeTelegramLog(chatId, messageText, false, err);
      return NextResponse.json({ ok: true });
    }

    if (matches.length > 1) {
      const list = matches.map((u) => `• ${u.name ?? ""} <${u.email}>`).join("\n");
      const err = `تم العثور على عدة مستخدمين مطابقين:\n${list}\n\nيرجى تحديد البريد الإلكتروني بدقة.`;
      await replyToChat(chatId, err);
      await writeTelegramLog(chatId, messageText, false, "ambiguous assignee");
      return NextResponse.json({ ok: true });
    }

    assigneeId = matches[0].id;
  }

  // Due date
  let dueDate: Date | null = null;
  if (dueDateStr) {
    dueDate = parseDDMMYYYY(dueDateStr);
    if (!dueDate) {
      const err = `تنسيق تاريخ الاستحقاق غير صحيح: "${dueDateStr}". الصيغة الصحيحة: يوم/شهر/سنة`;
      await replyToChat(chatId, `${err}\n\n${COMMAND_USAGE}`);
      await writeTelegramLog(chatId, messageText, false, err);
      return NextResponse.json({ ok: true });
    }
  }

  // Priority
  const priority = (priorityAr && PRIORITY_MAP[priorityAr]) ?? "medium";

  // 6. Create task via Prisma
  let createdTask: { id: string; title: string } | null = null;
  try {
    createdTask = await db.task.create({
      data: {
        title,
        ownerId: telegramUser.userId,
        assigneeId,
        priority,
        status: "not_started",
        dueDate,
        notes,
        source: "telegram",
      },
      select: { id: true, title: true },
    });
  } catch (err) {
    const errMsg = String(err);
    await replyToChat(chatId, `فشل إنشاء المهمة: ${errMsg}`);
    await writeTelegramLog(chatId, messageText, false, errMsg);
    return NextResponse.json({ ok: true });
  }

  // Write TaskUpdate with source: "telegram"
  const now = nowIso();
  await d1Run(
    `INSERT INTO "TaskUpdate" ("id","taskId","source","content","createdAt") VALUES (?,?,?,?,?)`,
    createId(),
    createdTask.id,
    "telegram",
    `تم إنشاء المهمة عبر تيليغرام`,
    now,
  ).catch(() => {});

  // Write TelegramLog with parsed: true
  await writeTelegramLog(chatId, messageText, true, undefined, createdTask.id);

  // 8. Reply to chat
  await replyToChat(chatId, `✅ تم إنشاء المهمة: ${createdTask.title} | ID: ${createdTask.id}`);

  // 9. Revalidate tasks path
  try {
    revalidatePath("/");
  } catch {}

  return NextResponse.json({ ok: true, taskId: createdTask.id });
}
