import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { uploadToCloudinary, safeDeleteCloudinaryImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin login required to upload." },
        { status: 401 }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "vindhya_events";

      if (!file) {
        return NextResponse.json(
          { success: false, message: "No file provided" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await uploadToCloudinary(buffer, folder);

      return NextResponse.json({
        success: true,
        data: {
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        },
      });
    } else {
      // JSON with base64
      const { image, folder = "vindhya_events" } = await req.json();
      if (!image) {
        return NextResponse.json(
          { success: false, message: "No image base64 provided" },
          { status: 400 }
        );
      }

      const result = await uploadToCloudinary(image, folder);
      return NextResponse.json({
        success: true,
        data: {
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        },
      });
    }
  } catch (error: unknown) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message || "Failed to upload image" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin login required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    let public_id = searchParams.get("public_id");
    let url = searchParams.get("url");

    if (!public_id && !url) {
      try {
        const body = await req.json();
        public_id = body.public_id;
        url = body.url;
      } catch {
        // no body
      }
    }

    const target = public_id || url;
    if (!target) {
      return NextResponse.json(
        { success: false, message: "public_id or url is required." },
        { status: 400 }
      );
    }

    const deleted = await safeDeleteCloudinaryImage(target);
    return NextResponse.json({ success: true, deleted, message: "Image deletion processed" });
  } catch (error: unknown) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message || "Failed to delete image" },
      { status: 500 }
    );
  }
}
