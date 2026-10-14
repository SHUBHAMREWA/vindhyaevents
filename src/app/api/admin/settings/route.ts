import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { SiteSetting } from "@/lib/models/SiteSetting";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
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
