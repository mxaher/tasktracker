import { db } from "@/lib/db";
import { z } from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTERNATIONAL_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;
const OPEN_TASK_STATUSES = ["pending", "not_started", "in_progress", "delayed"] as const;
const COMPLETION_KEYWORDS = ["done", "completed", "finished", "تم", "انتهيت", "اكتمل"];

const optionalStringSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

const baseContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  phone: optionalStringSchema.refine(
    (value) => value === null || INTERNATIONAL_PHONE_REGEX.test(normalizePhoneNumber(value)),
    "Phone must be in valid international format like +966xxxxxxxxx",
  ),
  email: optionalStringSchema.refine(
    (value) => value === null || EMAIL_REGEX.test(value),
    "Email must be a valid email address",
  ),
  userId: optionalStringSchema,
});

const updateContactSchema = baseContactSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

type ParsedContactInput = {
  name: string;
  phone: string | null;
  email: string | null;
  userId: string | null;
};

type ParsedContactUpdateInput = Partial<ParsedContactInput>;

/**
 * Normalizes a phone number for storage and lookup.
 */
export function normalizePhoneNumber(value: string): string {
  return value.replace(/[\s()-]/g, "");
}

/**
 * Validates a phone number against the expected international format.
 */
export function isValidInternationalPhone(value: string): boolean {
  return INTERNATIONAL_PHONE_REGEX.test(normalizePhoneNumber(value));
}

/**
 * Parses and validates a contact payload for create requests.
 */
export function parseContactCreateInput(input: unknown):
  | { success: true; data: ParsedContactInput }
  | { success: false; error: string } {
  const result = baseContactSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Invalid contact payload",
    };
  }

  return {
    success: true,
    data: {
      name: result.data.name.trim(),
      phone: result.data.phone ? normalizePhoneNumber(result.data.phone) : null,
      email: result.data.email ? result.data.email.toLowerCase() : null,
      userId: result.data.userId,
    },
  };
}

/**
 * Parses and validates a contact payload for update requests.
 */
export function parseContactUpdateInput(input: unknown):
  | { success: true; data: ParsedContactUpdateInput }
  | { success: false; error: string } {
  const result = updateContactSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "Invalid contact payload",
    };
  }

  return {
    success: true,
    data: {
      ...(result.data.name !== undefined ? { name: result.data.name.trim() } : {}),
      ...(result.data.phone !== undefined
        ? { phone: result.data.phone ? normalizePhoneNumber(result.data.phone) : null }
        : {}),
      ...(result.data.email !== undefined
        ? { email: result.data.email ? result.data.email.toLowerCase() : null }
        : {}),
      ...(result.data.userId !== undefined ? { userId: result.data.userId } : {}),
    },
  };
}

/**
 * Resolves the preferred contact channels for a user, prioritizing linked contacts.
 */
export async function resolveUserMessagingContact(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      contact: true,
    },
  });

  if (!user) {
    return null;
  }

  const name = user.contact?.name || user.name || user.username || user.email;

  return {
    userId: user.id,
    name,
    phone: user.contact?.phone || user.phone || null,
    email: user.contact?.email || user.email || null,
    user,
    contact: user.contact,
  };
}

/**
 * Looks up a linked contact by phone number using normalized matching.
 */
export async function findContactByPhone(phone: string) {
  const normalizedPhone = normalizePhoneNumber(phone);
  const contacts = await db.contact.findMany({
    where: {
      phone: {
        not: null,
      },
    },
    include: {
      user: true,
    },
  });

  return (
    contacts.find((contact) => contact.phone && normalizePhoneNumber(contact.phone) === normalizedPhone) ??
    null
  );
}

/**
 * Looks up a user by phone number using normalized matching.
 */
export async function findUserByPhone(phone: string) {
  const normalizedPhone = normalizePhoneNumber(phone);
  const users = await db.user.findMany({
    where: {
      phone: {
        not: null,
      },
    },
  });

  return users.find((user) => user.phone && normalizePhoneNumber(user.phone) === normalizedPhone) ?? null;
}

/**
 * Finds the most recently updated open task assigned to a given user.
 */
export async function findMostRecentOpenTaskForUser(userId: string) {
  return db.task.findFirst({
    where: {
      assigneeId: userId,
      status: {
        in: [...OPEN_TASK_STATUSES],
      },
    },
    include: {
      assignee: true,
    },
    orderBy: [
      { updatedAt: "desc" },
      { dueDate: "asc" },
    ],
  });
}

/**
 * Returns the list of statuses treated as open by messaging workflows.
 */
export function getOpenTaskStatuses(): string[] {
  return [...OPEN_TASK_STATUSES];
}

/**
 * Determines whether an inbound update message should mark a task complete.
 */
export function isCompletionUpdateMessage(message: string): boolean {
  const normalizedMessage = message.toLowerCase();
  return COMPLETION_KEYWORDS.some((keyword) => normalizedMessage.includes(keyword));
}
