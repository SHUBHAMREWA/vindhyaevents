import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { SiteSetting } from "@/lib/models/SiteSetting";
import { getAdminFromRequest } from "@/lib/auth";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settingsDefaults";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({
        siteName: DEFAULT_SITE_SETTINGS.siteName,
        tagline: DEFAULT_SITE_SETTINGS.tagline,
        taglineHindi: DEFAULT_SITE_SETTINGS.taglineHindi,
        bannerText: DEFAULT_SITE_SETTINGS.bannerText,
        primaryPhone: DEFAULT_SITE_SETTINGS.primaryPhone,
        whatsAppNumber: DEFAULT_SITE_SETTINGS.whatsAppNumber,
        primaryEmail: DEFAULT_SITE_SETTINGS.primaryEmail,
        address: DEFAULT_SITE_SETTINGS.address,
        googleMapUrl: DEFAULT_SITE_SETTINGS.googleMapUrl,
      });
    } else {
      let updated = false;
      if (!settings.primaryPhone || settings.primaryPhone.includes("7898522932") || settings.primaryPhone.includes("98270")) {
        settings.primaryPhone = DEFAULT_SITE_SETTINGS.primaryPhone;
        settings.whatsAppNumber = DEFAULT_SITE_SETTINGS.whatsAppNumber;
        updated = true;
      }
      if (!settings.primaryEmail || settings.primaryEmail.includes("vindhya")) {
        settings.primaryEmail = DEFAULT_SITE_SETTINGS.primaryEmail;
        updated = true;
      }
      if (!settings.googleMapUrl || settings.googleMapUrl.includes("maps.google.com/?q=")) {
        settings.googleMapUrl = DEFAULT_SITE_SETTINGS.googleMapUrl;
        updated = true;
      }
      if (updated) {
        await settings.save();
      }
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const updates = await req.json();

    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create(updates);
    } else {
      settings = await SiteSetting.findByIdAndUpdate(settings._id, updates, { new: true });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
