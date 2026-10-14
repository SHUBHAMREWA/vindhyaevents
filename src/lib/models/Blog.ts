import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: {
    url: string;
    public_id?: string;
    alt?: string;
  };
  category: string;
  tags: string[];
  author: {
    name: string;
    role?: string;
    avatarUrl?: string;
  };
  readTime: string;
  featured: boolean;
  isPublished: boolean;
  publishedAt: Date;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      url: { type: String, required: true },
      public_id: { type: String, default: "" },
      alt: { type: String, default: "" },
    },
    category: {
      type: String,
      default: "Planning",
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      name: { type: String, default: "RIWAJ Team" },
      role: { type: String, default: "Wedding Planner" },
      avatarUrl: { type: String, default: "" },
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

export const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
