import { normalizePhoneNumber } from "@/lib/contacts";

type SentDmResponse = {
  id?: string;
  messageId?: string;
  error?: string;
  message?: string;
  data?: {
    id?: string;
    messageId?: string;
  };
};

/**
 * Sends a WhatsApp message through sent.dm and returns the outbound message ID when available.
 */
export async function sendWhatsAppMessage(
  phone: string,
  message: string,
): Promise<string | null> {
  const apiKey = process.env.SENTDM_API_KEY;

  if (!apiKey) {
    console.error("[sent.dm] SENTDM_API_KEY is not configured.");
    return null;
  }

  try {
    const response = await fetch("https://api.sent.dm/v1/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: normalizePhoneNumber(phone),
        channel: "whatsapp",
        message,
      }),
    });

    const payload = (await response.json().catch(() => null)) as SentDmResponse | null;

    if (!response.ok) {
      console.error("[sent.dm] Failed to send WhatsApp message", {
        status: response.status,
        error: payload?.error || payload?.message || "Unknown sent.dm error",
      });
      return null;
    }

    return payload?.data?.id || payload?.data?.messageId || payload?.id || payload?.messageId || null;
  } catch (error) {
    console.error("[sent.dm] Unexpected error while sending WhatsApp message", error);
    return null;
  }
}
