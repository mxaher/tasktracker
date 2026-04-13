const ASCII_EMAIL_REGEX =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

export function normalizeEmailAddress(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/[\u200B-\u200D\uFEFF\u2060]/g, "")
    .replace(/\s+/g, "");
}

export function isDeliverableEmail(value: string) {
  const normalizedValue = normalizeEmailAddress(value);

  if (
    !normalizedValue ||
    !/^[\x00-\x7F]+$/.test(normalizedValue) ||
    !ASCII_EMAIL_REGEX.test(normalizedValue)
  ) {
    return false;
  }

  return !normalizedValue.toLowerCase().endsWith(".local");
}

export function getDeliverableEmails(values: Array<string | null | undefined>) {
  const emails = values
    .map((value) => (value ? normalizeEmailAddress(value) : ""))
    .filter(isDeliverableEmail);

  return Array.from(new Set(emails));
}
