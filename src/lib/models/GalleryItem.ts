import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryItem extends Document {
  title: string;
  image: {
    url: string;
    public_id?: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  category: string;
  tags: string[];
  eventLocation?: string;
  isFeatured: boolean;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, default: "" },
      alt: { type: String, default: "" },
      width: { type: Number, default: 800 },
      height: { type: Number, default: 600 },
    },
    category: {
      type: String,
      default: "Ceremony",
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    eventLocation: {
      type: String,
      default: "Rewa, MP",
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem ||
  mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);

export default GalleryItem;
