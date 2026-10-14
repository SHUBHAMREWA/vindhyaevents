import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { TeamMember } from "@/lib/models/TeamMember";
import { getAdminFromRequest } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { seedDefaultTeamIfEmpty } from "@/lib/seed";

// Helper to extract Cloudinary public_id from URL if not explicitly provided
function extractPublicId(url?: string): string | null {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const pathAfterUpload = parts[1].replace(/^v\d+\//, ""); // strip version
    const withoutExtension = pathAfterUpload.replace(/\.[^/.]+$/, "");
    return withoutExtension || null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    await seedDefaultTeamIfEmpty();
    const team = await TeamMember.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, team });
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

    if (!data.name || !data.role) {
      return NextResponse.json(
        { success: false, message: "Member Name and Role are required" },
        { status: 400 }
      );
    }

    const publicId = data.image?.public_id || extractPublicId(data.image?.url) || "";

    const newMember = await TeamMember.create({
      name: data.name.trim(),
      role: data.role.trim(),
      experience: data.experience?.trim() || "Since 2021",
      image: {
        url: data.image?.url || "",
        public_id: publicId,
        alt: data.image?.alt || data.name,
      },
      bio: data.bio?.trim() || "",
      order: Number(data.order) || 0,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    });

    return NextResponse.json({ success: true, member: newMember });
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
      return NextResponse.json({ success: false, message: "Team Member ID is required" }, { status: 400 });
    }

    const existing = await TeamMember.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: "Team Member not found" }, { status: 404 });
    }

    const existingPublicId = existing.image?.public_id || extractPublicId(existing.image?.url);

    // 1. If photo is explicitly removed
    if (removePhoto) {
      if (existingPublicId) {
        await deleteFromCloudinary(existingPublicId).catch(() => {});
      }
      existing.image = { url: "", public_id: "", alt: "" };
    }

    // 2. If photo is being replaced with a new one
    if (updates.image && updates.image.url && updates.image.url !== existing.image?.url) {
      const newPublicId = updates.image.public_id || extractPublicId(updates.image.url) || "";
      if (existingPublicId && existingPublicId !== newPublicId) {
        await deleteFromCloudinary(existingPublicId).catch(() => {});
      }
      updates.image.public_id = newPublicId;
    }

    Object.assign(existing, updates);
    await existing.save();

    return NextResponse.json({ success: true, member: existing });
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
      return NextResponse.json({ success: false, message: "Team Member ID required" }, { status: 400 });
    }

    const existing = await TeamMember.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: "Team Member not found" }, { status: 404 });
    }

    const existingPublicId = existing.image?.public_id || extractPublicId(existing.image?.url);

    // If delete photo only
    if (deletePhotoOnly) {
      if (existingPublicId) {
        await deleteFromCloudinary(existingPublicId).catch(() => {});
      }
      existing.image = { url: "", public_id: "", alt: "" };
      await existing.save();
      return NextResponse.json({
        success: true,
        message: "Photo deleted from Cloudinary and member updated",
        member: existing,
      });
    }

    // Full delete: remove photo from Cloudinary first, then delete document
    if (existingPublicId) {
      await deleteFromCloudinary(existingPublicId).catch(() => {});
    }

    await TeamMember.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Team member and associated image deleted successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
