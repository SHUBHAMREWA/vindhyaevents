import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAssignedVendor {
  _id?: string;
  vendorId?: string;
  vendorName: string;
  vendorPhone?: string;
  serviceName: string;
  agreedCost: number;
  advancePaid: number;
  status: "assigned" | "confirmed" | "completed" | "cancelled";
  reportingTime?: string;
  notes?: string;
}

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
  // Mini CRM & Event Execution Fields
  venueAddress?: string;
  packagePrice?: number;
  advanceReceived?: number;
  followUpDate?: string;
  assignedVendors?: IAssignedVendor[];
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
    venueAddress: {
      type: String,
      default: "",
    },
    packagePrice: {
      type: Number,
      default: 0,
    },
    advanceReceived: {
      type: Number,
      default: 0,
    },
    followUpDate: {
      type: String,
      default: "",
    },
    assignedVendors: [
      {
        vendorId: { type: String, default: "" },
        vendorName: { type: String, required: true },
        vendorPhone: { type: String, default: "" },
        serviceName: { type: String, required: true },
        agreedCost: { type: Number, default: 0 },
        advancePaid: { type: Number, default: 0 },
        status: {
          type: String,
          enum: ["assigned", "confirmed", "completed", "cancelled"],
          default: "assigned",
        },
        reportingTime: { type: String, default: "" },
        notes: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;
