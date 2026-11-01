export interface IHeroSlideItem {
  title: string;
  subtitle: string;
  image: {
    url: string;
    public_id?: string;
  };
  ctaText?: string;
  ctaLink?: string;
  order?: number;
}

export interface ISiteSettingsData {
  siteName: string;
  tagline: string;
  taglineHindi?: string;
  bannerText?: string;
  showTopBanner?: boolean;
  primaryPhone: string;
  secondaryPhone?: string;
  whatsAppNumber: string;
  primaryEmail: string;
  address: string;
  googleMapUrl?: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube?: string;
    twitter?: string;
  };
  heroSlides?: IHeroSlideItem[];
}

export const DEFAULT_SITE_SETTINGS: ISiteSettingsData = {
  siteName: "RIWAJ Weddings & Events",
  tagline: "Wedding & Luxury Event Specialists",
  taglineHindi: "✨ आपके रीति रिवाज सजावट के साथ ✨",
  bannerText: "🎉 Welcome to RIWAJ Weddings & Events — Rewa, MP",
  showTopBanner: true,
  primaryPhone: "+91 98935 18332",
  secondaryPhone: "",
  whatsAppNumber: "+91 98935 18332",
  primaryEmail: "riwajweddingplanner@gmail.com",
  address: "Rewa, Madhya Pradesh — 486001, India",
  googleMapUrl: "https://maps.app.goo.gl/oxD7riczpGY7z4LJ7",
  socialLinks: {
    instagram: "https://www.instagram.com/riwaj.wedding/",
    facebook: "https://www.facebook.com/riwajweddingandevents/",
    youtube: "https://www.youtube.com/@riwajweddings",
    twitter: "",
  },
  heroSlides: [
    {
      title: "Wedding Planner in Rewa, Madhya Pradesh",
      subtitle: "300+ Love Stories Crafted Since 2021 — Your Dream Wedding Awaits",
      image: { url: "/girlsimg.webp" },
      ctaText: "Book Consultation",
      ctaLink: "/contact",
      order: 1,
    },
    {
      title: "Celebrating Every Tradition",
      subtitle: "आपके रीति-रिवाज़ को खूबसूरत सजावट के साथ मनाएं",
      image: { url: "/dercoration1.webp" },
      ctaText: "Book Consultation",
      ctaLink: "/contact",
      order: 2,
    },
  ],
};
