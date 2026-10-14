import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInquiry extends Document {
  name: string;
  phone: string;
  email?: string;
  date?: string;
  eventType: string;
  guestCount?: string;
  budget?: string;
  message?: string;
  status: "pending" | "contacted" | "in_discussion" | "booked" | "cancelled" | "archived";
  adminNotes?: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
    eventType: {
      type: String,
      default: "Wedding",
      index: true,
    },
    guestCount: {
      type: String,
      default: "",
    },
    budget: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "in_discussion", "booked", "cancelled", "archived"],
      default: "pending",
      index: true,
    },
    adminNotes: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      default: "Website Consultation Form",
    },
  },
  {
    timestamps: true,
  }
);

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;
