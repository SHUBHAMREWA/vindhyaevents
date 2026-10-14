import connectToDatabase from "@/lib/db";
import { SiteSetting } from "@/lib/models/SiteSetting";
import { DEFAULT_SITE_SETTINGS, ISiteSettingsData } from "@/lib/settingsDefaults";

export { DEFAULT_SITE_SETTINGS };
export type { ISiteSettingsData };

export async function getSiteSettings(): Promise<ISiteSettingsData> {
  try {
    await connectToDatabase();
    const doc = await SiteSetting.findOne().lean();
    if (!doc) return JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS));

    const sanitizedSlides =
      doc.heroSlides && doc.heroSlides.length > 0
        ? doc.heroSlides.map((slide: any) => ({
            title: String(slide.title || ""),
            subtitle: String(slide.subtitle || ""),
            image: {
              url: String(slide.image?.url || ""),
              public_id: String(slide.image?.public_id || ""),
            },
            ctaText: String(slide.ctaText || "Book Consultation"),
            ctaLink: String(slide.ctaLink || "/contact"),
            order: Number(slide.order || 1),
          }))
        : DEFAULT_SITE_SETTINGS.heroSlides;

    const data: ISiteSettingsData = {
      siteName: doc.siteName || DEFAULT_SITE_SETTINGS.siteName,
      tagline: doc.tagline || DEFAULT_SITE_SETTINGS.tagline,
      taglineHindi: doc.taglineHindi || DEFAULT_SITE_SETTINGS.taglineHindi,
      bannerText: doc.bannerText || DEFAULT_SITE_SETTINGS.bannerText,
      showTopBanner: doc.showTopBanner !== undefined ? doc.showTopBanner : DEFAULT_SITE_SETTINGS.showTopBanner,
      primaryPhone: doc.primaryPhone || DEFAULT_SITE_SETTINGS.primaryPhone,
      secondaryPhone: doc.secondaryPhone || DEFAULT_SITE_SETTINGS.secondaryPhone,
      whatsAppNumber: doc.whatsAppNumber || DEFAULT_SITE_SETTINGS.whatsAppNumber,
      primaryEmail: doc.primaryEmail || DEFAULT_SITE_SETTINGS.primaryEmail,
      address: doc.address || DEFAULT_SITE_SETTINGS.address,
      googleMapUrl: doc.googleMapUrl || DEFAULT_SITE_SETTINGS.googleMapUrl,
      socialLinks: {
        instagram: doc.socialLinks?.instagram || DEFAULT_SITE_SETTINGS.socialLinks.instagram,
        facebook: doc.socialLinks?.facebook || DEFAULT_SITE_SETTINGS.socialLinks.facebook,
        youtube: doc.socialLinks?.youtube || "",
        twitter: doc.socialLinks?.twitter || "",
      },
      heroSlides: sanitizedSlides,
    };

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error fetching site settings from DB:", error);
    return JSON.parse(JSON.stringify(DEFAULT_SITE_SETTINGS));
  }
}
