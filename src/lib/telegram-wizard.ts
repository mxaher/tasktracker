/**
 * telegram-wizard.ts
 * Multi-step guided wizard for creating tasks via Telegram.
 * Session state is persisted in D1 TelegramSession table.
 * Designed to run inside the Next.js App Router edge/worker runtime.
 */

import { createId, d1All, d1First, d1Run, nowIso } from "@/lib/cloudflare-d1";
import { sendTelegramMessage } from "@/lib/notifications/telegram";

// ─── Types ───────────────────────────────────────────────────────────────────

type WizardSession = {
  step: "await_title" | "await_assignee" | "await_due_date";
  data: Record<string, string>;
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

// ─── Session helpers ──────────────────────────────────────────────────────────

async function getSession(chatId: string): Promise<WizardSession | null> {
  const row = await d1First<{ step: string; data: string }>(
    `SELECT step, data FROM "TelegramSession" WHERE chatId = ?`,
    chatId,
  ).catch(() => null);
  if (!row) return null;
  return {
    step: row.step as WizardSession["step"],
    data: JSON.parse(row.data) as Record<string, string>,
  };
}

async function setSession(
  chatId: string,
  step: WizardSession["step"],
  data: Record<string, string>,
): Promise<void> {
  await d1Run(
    `INSERT INTO "TelegramSession" (chatId, step, data, updatedAt)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(chatId) DO UPDATE SET
       step      = excluded.step,
       data      = excluded.data,
       updatedAt = excluded.updatedAt`,
    chatId,
    step,
    JSON.stringify(data),
  );
}

async function clearSession(chatId: string): Promise<void> {
  await d1Run(`DELETE FROM "TelegramSession" WHERE chatId = ?`, chatId);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function reply(chatId: string, text: string): Promise<void> {
  try {
    await sendTelegramMessage(chatId, text);
  } catch (err) {
    console.error("[TelegramWizard] sendMessage failed:", err);
  }
}

function parseDDMMYYYY(dateStr: string): string | null {
  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, d, m, y] = match;
  const iso = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}T09:00:00.000Z`;
  return isNaN(Date.parse(iso)) ? null : iso;
}

async function writeTelegramLog(
  chatId: string,
  rawMessage: string,
  parsed: boolean,
  parseError?: string,
  taskId?: string,
): Promise<void> {
  await d1Run(
    `INSERT INTO "TelegramLog" ("id","chatId","rawMessage","parsed","parseError","taskId","createdAt")
     VALUES (?,?,?,?,?,?,?)`,
    createId(),
    chatId,
    rawMessage,
    parsed ? 1 : 0,
    parseError ?? null,
    taskId ?? null,
    nowIso(),
  ).catch(() => {});
}

// ─── Main wizard handler ──────────────────────────────────────────────────────

export async function handleTelegramWizard(
  chatId: string,
  messageText: string,
  telegramUser: TelegramUserRow,
): Promise<void> {
  const text = messageText.trim();

  // /cancel at any point
  if (text === "/cancel") {
    await clearSession(chatId);
    await reply(chatId, "✋ تم الإلغاء. يمكنك البدء من جديد بـ /task");
    return;
  }

  const session = await getSession(chatId);

  // ── Step 0: /task — kick off wizard ──────────────────────────────────────
  if (text === "/task" || text.startsWith("/task ")) {
    await setSession(chatId, "await_title", {});
    await reply(chatId, "📝 ما عنوان المهمة؟\n(أرسل /cancel في أي وقت للإلغاء)");
    return;
  }

  // No active session and not a known command
  if (!session) {
    await reply(
      chatId,
      "اكتب /task لإنشاء مهمة جديدة، أو /cancel لإلغاء أي عملية جارية.",
    );
    return;
  }

  // ── Step 1: title ─────────────────────────────────────────────────────────
  if (session.step === "await_title") {
    if (text.length < 2) {
      await reply(chatId, "⚠️ عنوان قصير جداً. أعد الإدخال:");
      return;
    }
    await setSession(chatId, "await_assignee", { title: text });
    await reply(
      chatId,
      `✅ العنوان: <b>${text}</b>\n\n👤 من المكلف بالمهمة؟\n(أرسل الاسم أو البريد الإلكتروني، أو أرسل - لتخطي)`,
    );
    return;
  }

  // ── Step 2: assignee ──────────────────────────────────────────────────────
  if (session.step === "await_assignee") {
    let assigneeId: string | null = null;
    let assigneeDisplay = "غير محدد";

    if (text !== "-") {
      const pattern = `%${text}%`;
      const matches = await d1All<UserRow>(
        `SELECT id, name, email FROM "User"
         WHERE LOWER(email) LIKE LOWER(?) OR LOWER(name) LIKE LOWER(?)
         LIMIT 5`,
        pattern,
        pattern,
      ).catch(() => [] as UserRow[]);

      if (matches.length === 0) {
        await reply(
          chatId,
          `⚠️ لم يتم العثور على مستخدم بـ "${text}".\nأعد الإدخال أو أرسل - لتخطي تحديد المكلف.`,
        );
        return;
      }

      if (matches.length > 1) {
        const list = matches.map((u) => `• ${u.name ?? ""} &lt;${u.email}&gt;`).join("\n");
        await reply(
          chatId,
          `⚠️ تم العثور على عدة مستخدمين:\n${list}\n\nيرجى إدخال البريد الإلكتروني بدقة.`,
        );
        return;
      }

      assigneeId = matches[0].id;
      assigneeDisplay = `${matches[0].name ?? ""} &lt;${matches[0].email}&gt;`;
    }

    const updatedData: Record<string, string> = {
      ...session.data,
      assigneeId: assigneeId ?? "",
      assigneeDisplay,
    };
    await setSession(chatId, "await_due_date", updatedData);
    await reply(
      chatId,
      `✅ المكلف: <b>${assigneeDisplay}</b>\n\n📅 ما تاريخ الاستحقاق؟\n(الصيغة: يوم/شهر/سنة — مثال: 15/05/2026، أو أرسل - لتخطي)`,
    );
    return;
  }

  // ── Step 3: due date → create task ───────────────────────────────────────
  if (session.step === "await_due_date") {
    let dueDateIso: string | null = null;

    if (text !== "-") {
      dueDateIso = parseDDMMYYYY(text);
      if (!dueDateIso) {
        await reply(
          chatId,
          "⚠️ صيغة التاريخ غير صحيحة. استخدم يوم/شهر/سنة مثل: 15/05/2026\nأو أرسل - لتخطي تحديد التاريخ.",
        );
        return;
      }
    }

    const taskId = createId();
    const now = nowIso();
    const title = session.data.title;
    const assigneeId = session.data.assigneeId || null;

    try {
      await d1Run(
        `INSERT INTO "Task" (
           "id","title","ownerId","assigneeId","priority",
           "status","dueDate","source","createdAt","updatedAt"
         ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
        taskId,
        title,
        telegramUser.userId,
        assigneeId,
        "medium",
        "not_started",
        dueDateIso,
        "telegram",
        now,
        now,
      );

      // Audit log
      await d1Run(
        `INSERT INTO "TaskAuditLog" ("id","taskId","userId","action","createdAt")
         VALUES (?,?,?,?,?)`,
        createId(),
        taskId,
        telegramUser.userId,
        "created_via_telegram_wizard",
        now,
      ).catch(() => {});

      await clearSession(chatId);
      await writeTelegramLog(chatId, messageText, true, undefined, taskId);

      const dueDateDisplay = text !== "-" ? text : "غير محدد";
      await reply(
        chatId,
        `✅ <b>تم إنشاء المهمة بنجاح!</b>\n\n` +
          `📌 العنوان: ${title}\n` +
          `👤 المكلف: ${session.data.assigneeDisplay ?? "غير محدد"}\n` +
          `📅 الاستحقاق: ${dueDateDisplay}\n` +
          `🆔 المعرّف: ${taskId}`,
      );
    } catch (err) {
      const errMsg = String(err);
      console.error("[TelegramWizard] Task creation failed:", err);
      await writeTelegramLog(chatId, messageText, false, errMsg);
      await reply(
        chatId,
        "❌ حدث خطأ أثناء إنشاء المهمة. حاول مرة أخرى أو تواصل مع الدعم.",
      );
    }
    return;
  }
}
