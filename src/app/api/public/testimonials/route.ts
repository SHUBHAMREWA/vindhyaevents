import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Testimonial } from "@/lib/models/Testimonial";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDatabase();
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      testimonials: JSON.parse(JSON.stringify(testimonials)),
    });
  } catch (error: unknown) {
    console.error("Error fetching public testimonials:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message, testimonials: [] },
      { status: 500 }
    );
  }
}
