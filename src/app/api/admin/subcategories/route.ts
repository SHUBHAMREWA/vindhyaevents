import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectToDatabase from "@/lib/db";
import { SubCategory } from "@/lib/models/SubCategory";
import { getAdminFromRequest } from "@/lib/auth";
import { seedSubCategoriesIfEmpty } from "@/lib/seed";
import { safeDeleteCloudinaryImage } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    // Auto-seed all 46 events into DB if not present
    await seedSubCategoriesIfEmpty();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = category && category !== "all" ? { category } : {};

    const subcategories = await SubCategory.find(query).sort({ category: 1, order: 1 });
    return NextResponse.json({ success: true, subcategories });
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
    const data = await req.json();
    const { id, slug, mainImage, relevantImages, menuTitle, title, isActive } = data;

    if (!id && !slug) {
      return NextResponse.json({ success: false, message: "Subcategory id or slug is required" }, { status: 400 });
    }

    const updateFields: any = {};
    if (mainImage) {
      updateFields.mainImage = {
        url: mainImage.url || "",
        public_id: mainImage.public_id || "",
        alt: mainImage.alt || "",
      };
    }
    if (Array.isArray(relevantImages)) {
      updateFields.relevantImages = relevantImages.map((img: any) => ({
        url: img.url || "",
        public_id: img.public_id || "",
        alt: img.alt || "",
      }));
    }
    if (menuTitle) updateFields.menuTitle = menuTitle;
    if (title) updateFields.title = title;
    if (typeof isActive === "boolean") updateFields.isActive = isActive;

    const filter = id ? { _id: id } : { slug };
    const existing = await SubCategory.findOne(filter);

    if (!existing) {
      return NextResponse.json({ success: false, message: "Subcategory not found" }, { status: 404 });
    }

    // 1. Safe Cloudinary cleanup for replaced or deleted hero image
    if (mainImage && existing.mainImage?.url && existing.mainImage.url !== mainImage.url) {
      // Replaced or cleared hero image - attempt Cloudinary deletion silently
      await safeDeleteCloudinaryImage(existing.mainImage.public_id || existing.mainImage.url);
    }

    // 2. Safe Cloudinary cleanup for removed showcase images
    if (Array.isArray(relevantImages) && Array.isArray(existing.relevantImages)) {
      const newUrls = new Set(relevantImages.map((img: any) => img.url).filter(Boolean));
      for (const oldImg of existing.relevantImages) {
        if (oldImg?.url && !newUrls.has(oldImg.url)) {
          // Photo was deleted by admin - safely delete from Cloudinary if hosted there
          await safeDeleteCloudinaryImage(oldImg.public_id || oldImg.url);
        }
      }
    }

    const updated = await SubCategory.findOneAndUpdate(
      filter,
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "Subcategory not found" }, { status: 404 });
    }

    try {
      revalidatePath(`/${updated.slug}`);
      revalidatePath("/");
      revalidatePath("/services");
    } catch {
      // Non-fatal cache revalidation
    }

    return NextResponse.json({ success: true, subcategory: updated });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
