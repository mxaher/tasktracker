import { z } from "zod";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTERNATIONAL_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

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
