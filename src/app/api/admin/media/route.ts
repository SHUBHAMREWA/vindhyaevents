import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get("public_id");

    if (!publicId) {
      return NextResponse.json({ success: false, message: "public_id parameter is required" }, { status: 400 });
    }

    const ok = await deleteFromCloudinary(publicId);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: "Cloudinary returned error or image was already removed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: `Image ${publicId} deleted from Cloudinary` });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
