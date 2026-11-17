import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { CatalogItem, CATALOG_TYPES, type ICatalogImage } from "@/lib/models/CatalogItem";
import { getAdminFromRequest } from "@/lib/auth";
import { safeDeleteCloudinaryImage } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const unauthorized = () =>
  NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const cleanImage = (img: any): ICatalogImage | null => {
  const url = typeof img?.url === "string" ? img.url.trim() : "";
  if (!url) return null;
  return {
    url,
    public_id: typeof img.public_id === "string" ? img.public_id : "",
    alt: typeof img.alt === "string" ? img.alt : "",
    title: typeof img.title === "string" ? img.title.trim().slice(0, 120) : "",
  };
};

// Keeps only the fields admins may set, so stray fields from the client never reach the DB.
function parseItem(body: any) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const type = CATALOG_TYPES.includes(body.type) ? body.type : null;
  if (!title) return { error: "Title is required" };
  if (!type) return { error: "Choose Occasion or Entertainment" };

  const slug = slugify(typeof body.slug === "string" && body.slug.trim() ? body.slug : title);
  if (!slug) return { error: "Title must contain letters or numbers" };

  return {
    data: {
      type,
      title,
      slug,
      description: typeof body.description === "string" ? body.description.trim() : "",
      coverImage: cleanImage(body.coverImage) || { url: "", public_id: "", alt: "" },
      images: (Array.isArray(body.images) ? body.images : [])
        .map(cleanImage)
        .filter(Boolean) as ICatalogImage[],
      order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
      isActive: body.isActive !== false,
    },
  };
}

// Cloudinary references for an item's photos. A path without a public_id is a
// site-local file, not something to delete from Cloudinary.
const imageKeys = (item: { coverImage?: ICatalogImage; images?: ICatalogImage[] }) =>
  [item.coverImage, ...(item.images || [])]
    .map((img) => img?.public_id || (img?.url?.startsWith("http") ? img.url : ""))
    .filter((key): key is string => !!key);

const errorResponse = (error: unknown) => {
  if ((error as { code?: number })?.code === 11000) {
    return NextResponse.json(
      { success: false, message: "Another catalog item already uses this URL slug. Change the title or slug." },
      { status: 400 }
    );
  }
  return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
};

export async function GET(req: NextRequest) {
  try {
    if (!(await getAdminFromRequest(req))) return unauthorized();
    await connectToDatabase();
    const items = await CatalogItem.find().sort({ type: 1, order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, items });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await getAdminFromRequest(req))) return unauthorized();
    const parsed = parseItem(await req.json());
    if (!parsed.data) {
      return NextResponse.json({ success: false, message: parsed.error }, { status: 400 });
    }

    await connectToDatabase();
    const item = await CatalogItem.create(parsed.data);
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await getAdminFromRequest(req))) return unauthorized();
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: "Item ID required" }, { status: 400 });
    }
    const parsed = parseItem(body);
    if (!parsed.data) {
      return NextResponse.json({ success: false, message: parsed.error }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await CatalogItem.findById(body.id).lean();
    if (!existing) {
      return NextResponse.json({ success: false, message: "Catalog item not found" }, { status: 404 });
    }

    const item = await CatalogItem.findByIdAndUpdate(body.id, parsed.data, {
      new: true,
      runValidators: true,
    });

    // Remove photos the admin took out of this item from Cloudinary.
    const kept = new Set(imageKeys(parsed.data));
    await Promise.all(
      imageKeys(existing).filter((key) => !kept.has(key)).map((key) => safeDeleteCloudinaryImage(key))
    );

    return NextResponse.json({ success: true, item });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await getAdminFromRequest(req))) return unauthorized();
    const id = new URL(req.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Item ID required" }, { status: 400 });
    }

    await connectToDatabase();
    const item = await CatalogItem.findByIdAndDelete(id).lean();
    if (item) {
      await Promise.all(imageKeys(item).map((key) => safeDeleteCloudinaryImage(key)));
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
