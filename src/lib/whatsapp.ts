import connectToDatabase from "./db";
import { SiteSetting } from "./models/SiteSetting";

export interface SendWhatsAppParams {
  to: string; // Recipient phone number
  messageText: string;
  templateName?: string;
  templateLanguage?: string;
}

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  channel: "Meta-Cloud-API" | "WhatsApp-Web-Direct";
}

/**
 * Normalizes phone numbers for India / international format
 * E.g., '9893518332' -> '919893518332'
 */
export function normalizePhoneNumber(rawPhone: string): string {
  const digitsOnly = (rawPhone || "").replace(/[^0-9]/g, "");
  if (digitsOnly.length === 10) {
    return `91${digitsOnly}`;
  }
  return digitsOnly;
}

/**
 * Generates direct one-click WhatsApp link (Free, zero API tokens)
 */
export function generateDirectWhatsAppUrl(phone: string, message: string): string {
  const clean = normalizePhoneNumber(phone);
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

/**
 * Sends a message via Meta Official WhatsApp Business Cloud API.
 * If credentials are not configured, gracefully returns success: false with instructions.
 */
export async function sendMetaWhatsAppMessage({
  to,
  messageText,
  templateName,
  templateLanguage = "en_US",
}: SendWhatsAppParams): Promise<WhatsAppSendResult> {
  const cleanTo = normalizePhoneNumber(to);
  if (!cleanTo || cleanTo.length < 10) {
    return {
      success: false,
      channel: "Meta-Cloud-API",
      error: "Invalid phone number provided.",
    };
  }

  // 1. Fetch DB SiteSetting credentials FIRST (so admin dashboard overrides env variables)
  let phoneNumberId = "";
  let accessToken = "";

  try {
    await connectToDatabase();
    const settings: any = await SiteSetting.findOne().lean();
    if (settings?.whatsAppPhoneNumberId?.trim()) {
      phoneNumberId = settings.whatsAppPhoneNumberId.trim();
    }
    if (settings?.whatsAppAccessToken?.trim()) {
      accessToken = settings.whatsAppAccessToken.trim();
    }
  } catch (err) {
    console.error("Failed to fetch WhatsApp credentials from database:", err);
  }

  // 2. Fallback to env vars only if not set in DB
  if (!phoneNumberId) phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
  if (!accessToken) accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";

  if (!phoneNumberId || !accessToken) {
    return {
      success: false,
      channel: "Meta-Cloud-API",
      error:
        "Meta WhatsApp Cloud API credentials (Phone Number ID / Access Token) are not configured. Please add them in the 'WhatsApp API Config' tab in your Admin Dashboard, or use 'Direct WhatsApp Web' instead.",
    };
  }

  try {
    const endpoint = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    let payload: any = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanTo,
    };

    if (templateName) {
      payload.type = "template";
      payload.template = {
        name: templateName,
        language: { code: templateLanguage },
      };
    } else {
      payload.type = "text";
      payload.text = { preview_url: false, body: messageText };
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      const errMsg = data.error?.message || `WhatsApp API error (status ${res.status})`;
      return {
        success: false,
        channel: "Meta-Cloud-API",
        error: errMsg,
      };
    }

    const messageId = data.messages?.[0]?.id || "";
    return {
      success: true,
      channel: "Meta-Cloud-API",
      messageId,
    };
  } catch (error: any) {
    return {
      success: false,
      channel: "Meta-Cloud-API",
      error: error.message || "Failed to contact Meta WhatsApp API",
    };
  }
}
