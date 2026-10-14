import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Service } from "@/lib/models/Service";
import { getAdminFromRequest } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, services });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();

    if (!data.title) {
      return NextResponse.json({ success: false, message: "Service title is required" }, { status: 400 });
    }

    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const newService = await Service.create({
      ...data,
      slug,
    });

    return NextResponse.json({ success: true, service: newService });
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
    const { id, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Service ID required" }, { status: 400 });
    }

    const updated = await Service.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, service: updated });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Service ID required" }, { status: 400 });
    }

    const service = await Service.findById(id);
    if (service && service.coverImage?.public_id) {
      await deleteFromCloudinary(service.coverImage.public_id).catch(() => {});
    }

    await Service.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Service and associated image deleted" });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
