import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Blog } from "@/lib/models/Blog";
import { getAdminFromRequest } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const blogs = await Blog.find().sort({ publishedAt: -1, createdAt: -1 });
    return NextResponse.json({ success: true, blogs });
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

    if (!data.title || !data.content) {
      return NextResponse.json({ success: false, message: "Title and content are required" }, { status: 400 });
    }

    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const newBlog = await Blog.create({
      ...data,
      slug,
      author: {
        name: data.author?.name || admin.name || "RIWAJ Team",
        role: data.author?.role || "Wedding Specialist",
        avatarUrl: data.author?.avatarUrl || "",
      },
    });

    return NextResponse.json({ success: true, blog: newBlog });
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
      return NextResponse.json({ success: false, message: "Blog ID required" }, { status: 400 });
    }

    const updated = await Blog.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, blog: updated });
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
      return NextResponse.json({ success: false, message: "Blog ID required" }, { status: 400 });
    }

    const blog = await Blog.findById(id);
    if (blog && blog.coverImage?.public_id) {
      await deleteFromCloudinary(blog.coverImage.public_id).catch(() => {});
    }

    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Blog and associated image deleted" });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
