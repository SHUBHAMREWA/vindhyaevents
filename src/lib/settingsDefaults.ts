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
  siteName: "RIWAJ Events",
  tagline: "Wedding & Luxury Event Specialists",
  taglineHindi: "✨ आपके रीति रिवाज सजावट के साथ ✨",
  bannerText: "🎉 Welcome to RIWAJ Events — Weddings & Celebrations",
  showTopBanner: true,
  primaryPhone: "7898522932",
  secondaryPhone: "",
  whatsAppNumber: "7898522932",
  primaryEmail: "vindhyaevent@gmail.com",
  address: "Rewa, Madhya Pradesh — 486001, India",
  googleMapUrl: "https://maps.google.com/?q=Rewa+Madhya+Pradesh",
  socialLinks: {
    instagram: "https://instagram.com/vindhyaevents",
    facebook: "https://facebook.com/vindhyaevents",
    youtube: "",
    twitter: "",
  },
  heroSlides: [
    {
      title: "Wedding Planner in Rewa, Madhya Pradesh",
      subtitle: "500+ Love Stories Crafted Since 2013 — Your Dream Wedding Awaits",
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
    {
      title: "Full-Service Wedding Planning",
      subtitle: "From Mehndi to Baraat — Every Detail Perfectly Managed",
      image: { url: "https://images.unsplash.com/photo-1724847664960-5060a1ae8259?w=1200&q=75" },
      ctaText: "Book Consultation",
      ctaLink: "/contact",
      order: 3,
    },
    {
      title: "Luxury Décor & Floral Design",
      subtitle: "Transforming Venues into Breathtaking Celebrations",
      image: { url: "https://images.unsplash.com/photo-1732382643619-872165f61891?w=1200&q=75" },
      ctaText: "Book Consultation",
      ctaLink: "/contact",
      order: 4,
    },
    {
      title: "Elegant Sangeet & Reception",
      subtitle: "Creating Unforgettable Moments for You and Your Guests",
      image: { url: "https://images.unsplash.com/photo-1719468452346-20bbb785de2e?w=1200&q=75" },
      ctaText: "Book Consultation",
      ctaLink: "/contact",
      order: 5,
    },
    {
      title: "Photography & Videography",
      subtitle: "Preserving Your Precious Memories Forever",
      image: { url: "https://images.unsplash.com/photo-1640745685024-af4663065ce3?w=1200&q=75" },
      ctaText: "Book Consultation",
      ctaLink: "/contact",
      order: 6,
    },
  ],
};
