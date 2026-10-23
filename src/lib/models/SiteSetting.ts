import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHeroSlide {
  title: string;
  subtitle: string;
  image: {
    url: string;
    public_id?: string;
  };
  ctaText?: string;
  ctaLink?: string;
  order: number;
}

export interface IStatItem {
  label: string;
  value: string;
  order: number;
}

export interface ITestimonialItem {
  coupleName: string;
  weddingType: string;
  reviewText: string;
  rating: number;
  image?: string;
  isApproved: boolean;
}

export interface ISiteSetting extends Document {
  siteName: string;
  tagline: string;
  taglineHindi?: string;
  bannerText?: string;
  showTopBanner?: boolean;
  logo: {
    url: string;
    public_id?: string;
  };
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
  heroSlides: IHeroSlide[];
  stats: IStatItem[];
  testimonials: ITestimonialItem[];
  defaultTheme: "rose" | "royal" | "nature" | "sunset";
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    siteName: {
      type: String,
      default: "Vindhya Events",
    },
    tagline: {
      type: String,
      default: "Wedding & Luxury Event Specialists",
    },
    taglineHindi: {
      type: String,
      default: "✨ आपके रीति रिवाज सजावट के साथ ✨",
    },
    bannerText: {
      type: String,
      default: "🎉 Welcome to Vindhya Events — Weddings & Events",
    },
    showTopBanner: {
      type: Boolean,
      default: true,
    },
    logo: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    primaryPhone: {
      type: String,
      default: "7898522932",
    },
    secondaryPhone: {
      type: String,
      default: "",
    },
    whatsAppNumber: {
      type: String,
      default: "7898522932",
    },
    primaryEmail: {
      type: String,
      default: "vindhyaevent@gmail.com",
    },
    address: {
      type: String,
      default: "Rewa, Madhya Pradesh — 486001, India",
    },
    googleMapUrl: {
      type: String,
      default: "https://maps.google.com/?q=Rewa+Madhya+Pradesh",
    },
    socialLinks: {
      instagram: { type: String, default: "https://instagram.com/vindhyaevents" },
      facebook: { type: String, default: "https://facebook.com/vindhyaevents" },
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    heroSlides: [
      {
        title: { type: String, required: true },
        subtitle: { type: String, default: "" },
        image: {
          url: { type: String, required: true },
          public_id: { type: String, default: "" },
        },
        ctaText: { type: String, default: "Book Consultation" },
        ctaLink: { type: String, default: "#consultation" },
        order: { type: Number, default: 0 },
      },
    ],
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
        order: { type: Number, default: 0 },
      },
    ],
    testimonials: [
      {
        coupleName: { type: String, required: true },
        weddingType: { type: String, default: "Rewa Wedding" },
        reviewText: { type: String, required: true },
        rating: { type: Number, default: 5 },
        image: { type: String, default: "" },
        isApproved: { type: Boolean, default: true },
      },
    ],
    defaultTheme: {
      type: String,
      enum: ["rose", "royal", "nature", "sunset"],
      default: "rose",
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSetting: Model<ISiteSetting> =
  mongoose.models.SiteSetting ||
  mongoose.model<ISiteSetting>("SiteSetting", SiteSettingSchema);

export default SiteSetting;
