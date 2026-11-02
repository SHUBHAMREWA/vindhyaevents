import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { SiteSetting } from "@/lib/models/SiteSetting";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settingsDefaults";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SiteSetting.findOne().lean();

    if (!settings) {
      // Return defaults if none created yet
      return NextResponse.json({
        success: true,
        settings: DEFAULT_SITE_SETTINGS,
      });
    }

    // Sanitize any legacy / placeholder numbers or emails
    const rawPhone = settings.primaryPhone?.trim();
    const primaryPhone =
      rawPhone && !rawPhone.includes("7898522932") && !rawPhone.includes("98270")
        ? rawPhone
        : DEFAULT_SITE_SETTINGS.primaryPhone;

    const rawWA = settings.whatsAppNumber?.trim();
    const whatsAppNumber =
      rawWA && !rawWA.includes("7898522932") && !rawWA.includes("98270")
        ? rawWA
        : DEFAULT_SITE_SETTINGS.whatsAppNumber;

    const rawEmail = settings.primaryEmail?.trim();
    const primaryEmail =
      rawEmail && !rawEmail.includes("vindhya")
        ? rawEmail
        : DEFAULT_SITE_SETTINGS.primaryEmail;

    const rawMap = settings.googleMapUrl?.trim();
    const googleMapUrl =
      rawMap && !rawMap.includes("maps.google.com/?q=")
        ? rawMap
        : DEFAULT_SITE_SETTINGS.googleMapUrl;

    return NextResponse.json({
      success: true,
      settings: {
        ...DEFAULT_SITE_SETTINGS,
        ...settings,
        primaryPhone,
        whatsAppNumber,
        primaryEmail,
        googleMapUrl,
      },
    });
  } catch (error: unknown) {
    console.error("Public settings fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message,
        settings: DEFAULT_SITE_SETTINGS,
      },
      { status: 200 }
    );
  }
}
