import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { GalleryItem } from "@/lib/models/GalleryItem";
import { getAdminFromRequest } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const items = await GalleryItem.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, items });
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

    if (!data.title || !data.image?.url) {
      return NextResponse.json({ success: false, message: "Title and image URL are required" }, { status: 400 });
    }

    const newItem = await GalleryItem.create(data);
    return NextResponse.json({ success: true, item: newItem });
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
      return NextResponse.json({ success: false, message: "Item ID required" }, { status: 400 });
    }

    const updated = await GalleryItem.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, item: updated });
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
      return NextResponse.json({ success: false, message: "Item ID required" }, { status: 400 });
    }

    const item = await GalleryItem.findById(id);
    if (item && item.image?.public_id) {
      // Clean up Cloudinary storage
      await deleteFromCloudinary(item.image.public_id).catch(() => {});
    }

    await GalleryItem.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Gallery photo deleted from website and Cloudinary" });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
