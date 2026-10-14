import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  coupleName: string;
  weddingType?: string;
  reviewText: string;
  rating: number;
  image: {
    url: string;
    public_id?: string;
    alt?: string;
  };
  location?: string;
  weddingDate?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    coupleName: {
      type: String,
      required: true,
      trim: true,
    },
    weddingType: {
      type: String,
      default: "Royal Wedding Celebration",
      trim: true,
    },
    reviewText: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
      alt: { type: String, default: "" },
    },
    location: {
      type: String,
      default: "Rewa, MP",
      trim: true,
    },
    weddingDate: {
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

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
