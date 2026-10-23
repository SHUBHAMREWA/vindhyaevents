import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Blog, GalleryItem, Service, SiteSetting, Testimonial } from "@/lib/models";
import { galleryImages, stats } from "@/data/staticData";
import { seedDatabaseIfEmpty } from "@/lib/seed";

import { DEFAULT_SITE_SETTINGS } from "@/lib/settingsDefaults";

export const revalidate = 60; // 60s cache revalidation

export async function GET() {
  try {
    await connectToDatabase();
    await seedDatabaseIfEmpty();

    const [services, blogs, gallery, settings, testimonials] = await Promise.all([
      Service.find({ isActive: true }).sort({ order: 1 }),
      Blog.find({ isPublished: true }).sort({ publishedAt: -1, createdAt: -1 }),
      GalleryItem.find({ isActive: true }).sort({ order: 1 }),
      SiteSetting.findOne(),
      Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 }),
    ]);

    return NextResponse.json({
      success: true,
      services: services.length ? services : [],
      blogs: blogs || [],
      gallery: gallery || [],
      settings: settings || DEFAULT_SITE_SETTINGS,
      testimonials: testimonials || [],
    });
  } catch (error: unknown) {
    console.error("Public content error:", error);
    return NextResponse.json({
      success: true,
      fallback: true,
      services: [],
      blogs: [],
      gallery: [],
      testimonials: [],
      settings: DEFAULT_SITE_SETTINGS,
    });
  }
}
