import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { sendMetaWhatsAppMessage, normalizePhoneNumber } from "@/lib/whatsapp";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { testPhone } = await req.json();

    if (!testPhone || normalizePhoneNumber(testPhone).length < 10) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid 10-digit WhatsApp number to test." },
        { status: 400 }
      );
    }

    const testMessage = `Hello from RIWAJ Weddings & Events! 🎉\n\nYour Meta WhatsApp Cloud API credentials have been verified and connected successfully.\nTimestamp: ${new Date().toLocaleString("en-IN")}`;

    const result = await sendMetaWhatsAppMessage({
      to: testPhone,
      messageText: testMessage,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test message sent successfully to ${normalizePhoneNumber(testPhone)}! Meta Message ID: ${result.messageId}`,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.error || "Failed to send test message via Meta API.",
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
