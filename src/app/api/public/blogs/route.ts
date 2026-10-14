import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Blog } from "@/lib/models/Blog";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limitParam = searchParams.get("limit");
    const slug = searchParams.get("slug");

    if (slug) {
      const blog = await Blog.findOne({ slug, isPublished: true }).lean();
      if (!blog) {
        return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, blog });
    }

    const filter: Record<string, any> = { isPublished: true };
    if (category && category !== "All") {
      filter.category = new RegExp(`^${category}$`, "i");
    }

    const query = Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 });
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!isNaN(limit) && limit > 0) {
        query.limit(limit);
      }
    }

    const blogs = await query.lean();
    return NextResponse.json({ success: true, blogs });
  } catch (error: unknown) {
    console.error("Public blogs API error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
