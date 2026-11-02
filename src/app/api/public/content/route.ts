import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Blog, GalleryItem, Service, SiteSetting, Testimonial, WorkVideo } from "@/lib/models";
import { galleryImages, stats } from "@/data/staticData";
import { seedDatabaseIfEmpty } from "@/lib/seed";
import { DEFAULT_WORK_VIDEOS } from "@/lib/videoUtils";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settingsDefaults";

export const revalidate = 60; // 60s cache revalidation

export async function GET() {
  try {
    await connectToDatabase();
    await seedDatabaseIfEmpty();

    const [services, blogs, gallery, rawSettings, testimonials, works] = await Promise.all([
      Service.find({ isActive: true }).sort({ order: 1 }),
      Blog.find({ isPublished: true }).sort({ publishedAt: -1, createdAt: -1 }),
      GalleryItem.find({ isActive: true }).sort({ order: 1 }),
      SiteSetting.findOne().lean(),
      Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 }),
      WorkVideo.find({ isActive: true }).sort({ order: 1, createdAt: -1 }),
    ]);

    const settingsDoc: any = rawSettings || {};
    const rawPhone = settingsDoc.primaryPhone?.trim();
    const primaryPhone =
      rawPhone && !rawPhone.includes("7898522932") && !rawPhone.includes("98270")
        ? rawPhone
        : DEFAULT_SITE_SETTINGS.primaryPhone;

    const rawWA = settingsDoc.whatsAppNumber?.trim();
    const whatsAppNumber =
      rawWA && !rawWA.includes("7898522932") && !rawWA.includes("98270")
        ? rawWA
        : DEFAULT_SITE_SETTINGS.whatsAppNumber;

    const rawEmail = settingsDoc.primaryEmail?.trim();
    const primaryEmail =
      rawEmail && !rawEmail.includes("vindhya")
        ? rawEmail
        : DEFAULT_SITE_SETTINGS.primaryEmail;

    const rawMap = settingsDoc.googleMapUrl?.trim();
    const googleMapUrl =
      rawMap && !rawMap.includes("maps.google.com/?q=")
        ? rawMap
        : DEFAULT_SITE_SETTINGS.googleMapUrl;

    const sanitizedSettings = {
      ...DEFAULT_SITE_SETTINGS,
      ...settingsDoc,
      primaryPhone,
      whatsAppNumber,
      primaryEmail,
      googleMapUrl,
    };

    return NextResponse.json({
      success: true,
      services: services.length ? services : [],
      blogs: blogs || [],
      gallery: gallery || [],
      settings: sanitizedSettings,
      testimonials: testimonials || [],
      works: works && works.length > 0 ? works : DEFAULT_WORK_VIDEOS,
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
      works: DEFAULT_WORK_VIDEOS,
      settings: DEFAULT_SITE_SETTINGS,
    });
  }
}
