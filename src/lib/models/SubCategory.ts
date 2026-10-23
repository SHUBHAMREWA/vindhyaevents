import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubCategoryImage {
  url: string;
  public_id?: string;
  alt: string;
}

export interface ISubCategory extends Document {
  slug: string;
  category: "catering" | "decoration" | "wedding" | "corporate" | string;
  menuTitle: string;
  title: string;
  badge?: string;
  mainImage: ISubCategoryImage;
  relevantImages: ISubCategoryImage[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubCategoryImageSchema = new Schema<ISubCategoryImage>(
  {
    url: { type: String, required: true, default: "" },
    public_id: { type: String, default: "" },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const SubCategorySchema = new Schema<ISubCategory>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    menuTitle: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    badge: {
      type: String,
      default: "",
    },
    mainImage: {
      type: SubCategoryImageSchema,
      required: true,
      default: () => ({ url: "", public_id: "", alt: "" }),
    },
    relevantImages: {
      type: [SubCategoryImageSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const SubCategory: Model<ISubCategory> =
  mongoose.models.SubCategory || mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);
