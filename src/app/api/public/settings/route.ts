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

    return NextResponse.json({
      success: true,
      settings,
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

