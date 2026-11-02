import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { WorkVideo } from "@/lib/models/WorkVideo";
import { detectVideoType, DEFAULT_WORK_VIDEOS } from "@/lib/videoUtils";

export async function GET() {
  try {
    await connectToDatabase();
    let works = await WorkVideo.find().sort({ order: 1, createdAt: -1 }).lean();

    // Seed default works if table is empty
    if (!works || works.length === 0) {
      if (DEFAULT_WORK_VIDEOS && DEFAULT_WORK_VIDEOS.length > 0) {
        await WorkVideo.insertMany(DEFAULT_WORK_VIDEOS);
        works = await WorkVideo.find().sort({ order: 1, createdAt: -1 }).lean();
      }
    }

    return NextResponse.json({ success: true, works: works || [] });
  } catch (error: any) {
    console.error("GET /api/admin/works error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch work videos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { title, category, videoUrl, thumbnailUrl, description, order, isActive } = body;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { success: false, error: "Title and Video URL are required." },
        { status: 400 }
      );
    }

    const videoType = detectVideoType(videoUrl);

    const newWork = await WorkVideo.create({
      title,
      category: category || "Videography",
      videoUrl,
      videoType,
      thumbnailUrl: thumbnailUrl || "",
      description: description || "",
      order: typeof order === "number" ? order : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return NextResponse.json({ success: true, work: newWork });
  } catch (error: any) {
    console.error("POST /api/admin/works error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create work video" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, _id, ...updateData } = body;
    const workId = id || _id;

    if (!workId) {
      return NextResponse.json(
        { success: false, error: "Work ID is required." },
        { status: 400 }
      );
    }

    if (updateData.videoUrl) {
      updateData.videoType = detectVideoType(updateData.videoUrl);
    }

    const updated = await WorkVideo.findByIdAndUpdate(workId, updateData, { new: true });
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Work video not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, work: updated });
  } catch (error: any) {
    console.error("PATCH /api/admin/works error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update work video" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Work ID is required." },
        { status: 400 }
      );
    }

    await WorkVideo.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Work video deleted." });
  } catch (error: any) {
    console.error("DELETE /api/admin/works error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete work video" },
      { status: 500 }
    );
  }
}
