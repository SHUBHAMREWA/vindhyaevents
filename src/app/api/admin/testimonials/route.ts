import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Testimonial } from "@/lib/models/Testimonial";
import { getAdminFromRequest } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, testimonials });
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

    if (!data.coupleName || !data.reviewText) {
      return NextResponse.json(
        { success: false, message: "Couple Name and Review Text are required" },
        { status: 400 }
      );
    }

    const newTestimonial = await Testimonial.create({
      coupleName: data.coupleName,
      weddingType: data.weddingType || "Royal Wedding Celebration",
      reviewText: data.reviewText,
      rating: Number(data.rating) || 5,
      image: {
        url: data.image?.url || "",
        public_id: data.image?.public_id || "",
        alt: data.image?.alt || data.coupleName,
      },
      location: data.location || "Rewa, MP",
      weddingDate: data.weddingDate || "",
      order: Number(data.order) || 0,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    });

    return NextResponse.json({ success: true, testimonial: newTestimonial });
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
    const { id, removePhoto, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Testimonial ID required" }, { status: 400 });
    }

    const existing = await Testimonial.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 });
    }

    // 1. If admin explicitly requests to remove photo only
    if (removePhoto) {
      if (existing.image?.public_id) {
        await deleteFromCloudinary(existing.image.public_id).catch(() => {});
      }
      existing.image = { url: "", public_id: "", alt: "" };
    }

    // 2. If photo is being replaced with a new one
    if (updates.image && updates.image.public_id && existing.image?.public_id && updates.image.public_id !== existing.image.public_id) {
      await deleteFromCloudinary(existing.image.public_id).catch(() => {});
    }

    Object.assign(existing, updates);
    await existing.save();

    return NextResponse.json({ success: true, testimonial: existing });
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
    const deletePhotoOnly = searchParams.get("deletePhotoOnly") === "true";

    if (!id) {
      return NextResponse.json({ success: false, message: "Testimonial ID required" }, { status: 400 });
    }

    const existing = await Testimonial.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 });
    }

    // A) If action is delete photo only
    if (deletePhotoOnly) {
      if (existing.image?.public_id) {
        await deleteFromCloudinary(existing.image.public_id).catch(() => {});
      }
      existing.image = { url: "", public_id: "", alt: "" };
      await existing.save();
      return NextResponse.json({
        success: true,
        message: "Photo deleted from Cloudinary and testimonial updated",
        testimonial: existing,
      });
    }

    // B) Full delete: delete photo from Cloudinary then delete testimonial document
    if (existing.image?.public_id) {
      await deleteFromCloudinary(existing.image.public_id).catch(() => {});
    }

    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Testimonial and associated Cloudinary image deleted successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
