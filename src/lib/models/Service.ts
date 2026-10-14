import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  detailedDescription?: string;
  iconName: string;
  coverImage?: {
    url: string;
    public_id?: string;
    alt?: string;
  };
  features: string[];
  category: string;
  startingPrice?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
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
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    detailedDescription: {
      type: String,
      default: "",
    },
    iconName: {
      type: String,
      default: "Sparkles",
    },
    coverImage: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
      alt: { type: String, default: "" },
    },
    features: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: "Planning",
    },
    startingPrice: {
      type: String,
      default: "",
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

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
