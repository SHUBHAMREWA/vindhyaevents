import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { WhatsAppLog } from "@/lib/models/WhatsAppLog";
import { getAdminFromRequest } from "@/lib/auth";
import {
  sendMetaWhatsAppMessage,
  generateDirectWhatsAppUrl,
  normalizePhoneNumber,
} from "@/lib/whatsapp";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status");
    const channel = searchParams.get("channel");
    const messageType = searchParams.get("messageType");

    const query: any = {};

    if (search) {
      query.$or = [
        { recipientName: { $regex: search, $options: "i" } },
        { recipientPhone: { $regex: search, $options: "i" } },
        { messageText: { $regex: search, $options: "i" } },
        { sentByAdminName: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") query.status = status;
    if (channel && channel !== "all") query.channel = channel;
    if (messageType && messageType !== "all") query.messageType = messageType;

    const logs = await WhatsAppLog.find(query).sort({ sentAt: -1 }).limit(200).lean();
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    const {
      recipients, // Array of { phone: string, name?: string, customerId?: string, bookingId?: string }
      messageText,
      channel = "Meta-Cloud-API", // "Meta-Cloud-API" | "WhatsApp-Web-Direct"
      messageType = "Custom",
      templateName,
    } = body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one recipient is required." },
        { status: 400 }
      );
    }

    if (!messageText?.trim() && !templateName) {
      return NextResponse.json(
        { success: false, message: "Message content or template is required." },
        { status: 400 }
      );
    }

    const adminName = admin.name || admin.email || "Admin";
    const results: any[] = [];

    for (const r of recipients) {
      const cleanPhone = normalizePhoneNumber(r.phone);
      const recipientName = r.name || "Customer";

      // Personalize message with dynamic placeholders if any
      const personalizedText = (messageText || "")
        .replace(/\{\{name\}\}/gi, recipientName)
        .replace(/\{\{phone\}\}/gi, cleanPhone);

      if (channel === "WhatsApp-Web-Direct") {
        // Direct Web sender - generate wa.me link and log
        const waUrl = generateDirectWhatsAppUrl(cleanPhone, personalizedText);
        const logEntry = await WhatsAppLog.create({
          recipientPhone: cleanPhone,
          recipientName,
          customerId: r.customerId,
          bookingId: r.bookingId,
          messageType,
          channel: "WhatsApp-Web-Direct",
          messageText: personalizedText,
          status: "Sent",
          sentByAdminName: adminName,
          sentAt: new Date(),
        });

        results.push({
          phone: cleanPhone,
          name: recipientName,
          success: true,
          channel: "WhatsApp-Web-Direct",
          directUrl: waUrl,
          logId: logEntry._id,
        });
      } else {
        // Official Meta WhatsApp Cloud API
        const apiRes = await sendMetaWhatsAppMessage({
          to: cleanPhone,
          messageText: personalizedText,
          templateName,
        });

        const logEntry = await WhatsAppLog.create({
          recipientPhone: cleanPhone,
          recipientName,
          customerId: r.customerId,
          bookingId: r.bookingId,
          messageType,
          channel: "Meta-Cloud-API",
          messageText: personalizedText,
          status: apiRes.success ? "Sent" : "Failed",
          metaMessageId: apiRes.messageId || "",
          errorReason: apiRes.error || "",
          sentByAdminName: adminName,
          sentAt: new Date(),
        });

        results.push({
          phone: cleanPhone,
          name: recipientName,
          success: apiRes.success,
          channel: "Meta-Cloud-API",
          messageId: apiRes.messageId,
          error: apiRes.error,
          logId: logEntry._id,
        });
      }
    }

    const totalSent = results.filter((r) => r.success).length;
    const totalFailed = results.length - totalSent;

    return NextResponse.json({
      success: true,
      totalSent,
      totalFailed,
      results,
      message: `Processed ${recipients.length} messages (${totalSent} successful, ${totalFailed} failed).`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
