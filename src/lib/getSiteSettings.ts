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

    const rawPhone = doc.primaryPhone?.trim();
    const primaryPhone =
      rawPhone &&
      !rawPhone.includes("7898522932") &&
      !rawPhone.includes("98270")
        ? rawPhone
        : DEFAULT_SITE_SETTINGS.primaryPhone;

    const rawWA = doc.whatsAppNumber?.trim();
    const whatsAppNumber =
      rawWA &&
      !rawWA.includes("7898522932") &&
      !rawWA.includes("98270")
        ? rawWA
        : DEFAULT_SITE_SETTINGS.whatsAppNumber;

    const rawEmail = doc.primaryEmail?.trim();
    const primaryEmail =
      rawEmail && !rawEmail.includes("vindhya")
        ? rawEmail
        : DEFAULT_SITE_SETTINGS.primaryEmail;

    const rawMap = doc.googleMapUrl?.trim();
    const googleMapUrl =
      rawMap && !rawMap.includes("maps.google.com/?q=")
        ? rawMap
        : DEFAULT_SITE_SETTINGS.googleMapUrl;

    const data: ISiteSettingsData = {
      siteName: doc.siteName || DEFAULT_SITE_SETTINGS.siteName,
      tagline: doc.tagline || DEFAULT_SITE_SETTINGS.tagline,
      taglineHindi: doc.taglineHindi || DEFAULT_SITE_SETTINGS.taglineHindi,
      bannerText: doc.bannerText || DEFAULT_SITE_SETTINGS.bannerText,
      showTopBanner: doc.showTopBanner !== undefined ? doc.showTopBanner : DEFAULT_SITE_SETTINGS.showTopBanner,
      primaryPhone,
      secondaryPhone: doc.secondaryPhone || DEFAULT_SITE_SETTINGS.secondaryPhone,
      whatsAppNumber,
      primaryEmail,
      address: doc.address || DEFAULT_SITE_SETTINGS.address,
      googleMapUrl,
      socialLinks: {
        instagram: doc.socialLinks?.instagram || DEFAULT_SITE_SETTINGS.socialLinks.instagram,
        facebook: doc.socialLinks?.facebook || DEFAULT_SITE_SETTINGS.socialLinks.facebook,
        youtube: doc.socialLinks?.youtube || DEFAULT_SITE_SETTINGS.socialLinks.youtube || "",
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
