import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVendor extends Document {
  name: string;
  phone: string;
  whatsappNumber?: string;
  state?: string;
  city: string;
  address?: string;
  services: string[]; // e.g. ["DJ & Sounds", "Catering", "Lighting", "Photography", "Safa", "Baggi", "Decoration"]
  rateEstimate?: string; // e.g. "₹15,000 / event" or "₹400 / plate"
  rating?: number; // 1-5
  experienceYears?: number;
  upiId?: string;
  bankDetails?: string;
  notes?: string;
  isActive: boolean;
  totalEventsDone?: number;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new Schema<IVendor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    whatsappNumber: {
      type: String,
      trim: true,
      default: "",
    },
    state: {
      type: String,
      default: "Madhya Pradesh",
      trim: true,
      index: true,
    },
    city: {
      type: String,
      default: "Rewa",
      index: true,
    },
    address: {
      type: String,
      default: "",
    },
    services: {
      type: [String],
      default: [],
      index: true,
    },
    rateEstimate: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    experienceYears: {
      type: Number,
      default: 3,
    },
    upiId: {
      type: String,
      default: "",
    },
    bankDetails: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    totalEventsDone: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Vendor: Model<IVendor> =
  mongoose.models.Vendor || mongoose.model<IVendor>("Vendor", VendorSchema);

export default Vendor;
