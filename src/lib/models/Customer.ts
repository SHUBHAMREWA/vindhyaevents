import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomerLocation {
  label: string; // e.g. "Home", "Office", "Farmhouse", "Native Village"
  address: string;
  mapUrl?: string; // Google Maps URL
  state?: string;
  city: string;
  isPrimary: boolean;
}

export interface ICustomerChild {
  name: string;
  relation?: string; // e.g. "Son", "Daughter", "Brother", "Sister", "Nephew", "Niece", "Bahu", "Damad", or custom
  gender?: "Male" | "Female" | "Other";
  age?: number;
  dateOfBirth?: Date;
  maritalStatus?: "Unmarried" | "Married" | "Other";
  notes?: string;
}

export interface ICustomer extends Document {
  name: string;
  phone: string;
  whatsappNumber?: string;
  email?: string;
  photo?: {
    url: string;
    public_id: string;
  };
  professions: string[]; // Multiple professions: e.g. ["Government Employee", "Farmer", "Businessman"]
  locations: ICustomerLocation[];
  dateOfBirth?: Date;
  age?: number;
  anniversaryDate?: Date;
  maritalStatus?: "Single" | "Married" | "Other";
  spouseName?: string;
  children: ICustomerChild[];
  customerTier: "High-Value" | "Mid-Level" | "Budget"; // High-Value = Luxury/HNI, Mid-Level, Budget
  tags: string[];
  notes?: string;
  totalBookingsCount: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerLocationSchema = new Schema<ICustomerLocation>(
  {
    label: { type: String, default: "Home" },
    address: { type: String, default: "" },
    mapUrl: { type: String, default: "" },
    state: { type: String, default: "Madhya Pradesh" },
    city: { type: String, default: "Rewa" },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const CustomerChildSchema = new Schema<ICustomerChild>(
  {
    name: { type: String, required: true },
    relation: { type: String, default: "Son" },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
    age: { type: Number },
    dateOfBirth: { type: Date },
    maritalStatus: {
      type: String,
      enum: ["Unmarried", "Married", "Single", "Other"],
      default: "Unmarried",
    },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const CustomerSchema = new Schema<ICustomer>(
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
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    photo: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    professions: {
      type: [String],
      default: [],
      index: true,
    },
    locations: {
      type: [CustomerLocationSchema],
      default: [],
    },
    dateOfBirth: {
      type: Date,
    },
    age: {
      type: Number,
    },
    anniversaryDate: {
      type: Date,
    },
    maritalStatus: {
      type: String,
      enum: ["Married", "Unmarried", "Single", "Other"],
      default: "Married",
    },
    spouseName: {
      type: String,
      default: "",
    },
    children: {
      type: [CustomerChildSchema],
      default: [],
    },
    customerTier: {
      type: String,
      enum: ["High-Value", "Mid-Level", "Budget"],
      default: "Mid-Level",
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    notes: {
      type: String,
      default: "",
    },
    totalBookingsCount: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

CustomerSchema.index({ name: "text", phone: "text", professions: "text", tags: "text" });

export const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
export default Customer;
