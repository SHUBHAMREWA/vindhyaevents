import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";
import { purgePredefinedDemoData } from "@/lib/seed";
import { TeamMember, Testimonial, Blog, GalleryItem, Vendor, SiteSetting } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized. Please log in as admin." }, { status: 401 });
    }

    await connectToDatabase();
    await purgePredefinedDemoData();

    // Fetch new cleaned counts to confirm to admin
    const [teamCount, testCount, blogCount, galleryCount, vendorCount] = await Promise.all([
      TeamMember.countDocuments(),
      Testimonial.countDocuments(),
      Blog.countDocuments(),
      GalleryItem.countDocuments(),
      Vendor.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      message: "All predefined hardcoded/demo data (team, reviews, blogs, gallery, vendors) has been removed completely!",
      currentCounts: {
        team: teamCount,
        testimonials: testCount,
        blogs: blogCount,
        gallery: galleryCount,
        vendors: vendorCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
