import mongoose, { Schema, Document, Model } from "mongoose";

export const CATALOG_TYPES = ["occasion", "entertainment"] as const;
export type CatalogType = (typeof CATALOG_TYPES)[number];

export interface ICatalogImage {
  url: string;
  public_id?: string;
  alt?: string;
}

export interface ICatalogItem extends Document {
  type: CatalogType;
  title: string;
  slug: string;
  description?: string;
  coverImage: ICatalogImage;
  images: ICatalogImage[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CatalogImageSchema = new Schema<ICatalogImage>(
  {
    url: { type: String, required: true },
    public_id: { type: String, default: "" },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const CatalogItemSchema = new Schema<ICatalogItem>(
  {
    type: { type: String, enum: CATALOG_TYPES, required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "", trim: true },
    coverImage: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
      alt: { type: String, default: "" },
    },
    images: { type: [CatalogImageSchema], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

CatalogItemSchema.index({ type: 1, order: 1 });

export const CatalogItem: Model<ICatalogItem> =
  mongoose.models.CatalogItem || mongoose.model<ICatalogItem>("CatalogItem", CatalogItemSchema);

export default CatalogItem;
