import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVendorPayoutRecord {
  amount: number;
  paymentDate: Date;
  mode: "Cash" | "UPI" | "Bank Transfer" | "Cheque";
  transactionRef?: string;
  note?: string;
}

export interface IVendorBookingPayout {
  _id?: string;
  vendorId?: mongoose.Types.ObjectId;
  source: "VendorList" | "Manual";
  name: string;
  phone: string;
  serviceCategory: string; // e.g. "Catering", "DJ & Sound", "Stage Decor", "Photography"
  subEventName?: string; // e.g. "Haldi Ceremony" or "Full Wedding"
  agreedCost: number; // Kitna dena hai vendor ko (e.g. ₹40,000)
  commissionEarned?: number; // Planner commission / margin earned
  payoutHistory: IVendorPayoutRecord[]; // Installments paid to vendor over time
  totalPaid: number; // Sum of payout installments
  balanceDue: number; // agreedCost - totalPaid
  payoutStatus: "Pending" | "Partial" | "Settled";
  reportingTime?: string;
  workScope?: string;
  workStatus?: "Assigned" | "Confirmed" | "Working" | "Completed";
  checklist?: string;
  notes?: string;
}

export interface IAssignedPerson {
  source: "VendorList" | "Manual";
  vendorId?: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  roleOrService: string;
  assignedCost?: number;
  commissionEarned?: number;
  reportingTime?: string;
  workScope?: string;
  workStatus?: "Assigned" | "Confirmed" | "Working" | "Completed";
  checklist?: string;
  notes?: string;
  payoutHistory?: IVendorPayoutRecord[];
  totalPaidToVendor?: number;
  balanceDueToVendor?: number;
  payoutStatus?: "Pending" | "Partial" | "Settled";
}

export interface ISubEvent {
  subEventName: string; // e.g. "Haldi Ceremony", "Mehndi", "Sangeet", "Wedding Mandap", "Reception"
  date: Date;
  startTime?: string;
  endTime?: string;
  venueName: string;
  venueAddress: string;
  mapUrl?: string; // Google Maps link or blank
  services: string[]; // e.g. ["Royal Stage Decor", "Catering Buffet", "DJ & Sound", "Drone Shoot"]
  assignedPersons: IAssignedPerson[];
  subEventStatus: "Scheduled" | "Ongoing" | "Completed";
}

export interface IPaymentRecord {
  amount: number;
  paymentDate: Date;
  mode: "Cash" | "UPI" | "Bank Transfer" | "Cheque";
  transactionRef?: string;
  receiptNote?: string;
}

export interface IBookingFinancials {
  totalPackageAmount: number;
  discountAmount: number;
  finalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: "Unpaid" | "Partial" | "Paid";
  paymentHistory: IPaymentRecord[];
}

export interface IBooking extends Document {
  bookingNumber: string;
  customerId: mongoose.Types.ObjectId;
  customerSnapshot: {
    name: string;
    phone: string;
    email?: string;
    city?: string;
  };
  bookingDate: Date;
  primaryEventDate: Date;
  status: "Draft" | "Confirmed" | "In-Progress" | "Completed" | "Cancelled";
  subEvents: ISubEvent[];
  vendorPayouts: IVendorBookingPayout[];
  financials: IBookingFinancials;
  specialNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VendorPayoutRecordSchema = new Schema<IVendorPayoutRecord>(
  {
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    mode: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Cheque"],
      default: "UPI",
    },
    transactionRef: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const VendorBookingPayoutSchema = new Schema<IVendorBookingPayout>(
  {
    _id: { type: Schema.Types.Mixed, default: () => new mongoose.Types.ObjectId().toString() },
    vendorId: { type: Schema.Types.Mixed, default: null },
    source: { type: String, enum: ["VendorList", "Manual"], default: "Manual" },
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    serviceCategory: { type: String, default: "" },
    subEventName: { type: String, default: "" },
    agreedCost: { type: Number, default: 0 },
    commissionEarned: { type: Number, default: 0 },
    payoutHistory: { type: [VendorPayoutRecordSchema], default: [] },
    totalPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    payoutStatus: {
      type: String,
      enum: ["Pending", "Partial", "Settled"],
      default: "Pending",
    },
    reportingTime: { type: String, default: "" },
    workScope: { type: String, default: "" },
    workStatus: {
      type: String,
      enum: ["Assigned", "Confirmed", "Working", "Completed"],
      default: "Assigned",
    },
    checklist: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const AssignedPersonSchema = new Schema<IAssignedPerson>(
  {
    source: { type: String, enum: ["VendorList", "Manual"], default: "Manual" },
    vendorId: { type: Schema.Types.Mixed, default: null },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    roleOrService: { type: String, default: "" },
    assignedCost: { type: Number, default: 0 },
    commissionEarned: { type: Number, default: 0 },
    reportingTime: { type: String, default: "" },
    workScope: { type: String, default: "" },
    workStatus: {
      type: String,
      enum: ["Assigned", "Confirmed", "Working", "Completed"],
      default: "Assigned",
    },
    checklist: { type: String, default: "" },
    notes: { type: String, default: "" },
    payoutHistory: { type: [VendorPayoutRecordSchema], default: [] },
    totalPaidToVendor: { type: Number, default: 0 },
    balanceDueToVendor: { type: Number, default: 0 },
    payoutStatus: {
      type: String,
      enum: ["Pending", "Partial", "Settled"],
      default: "Pending",
    },
  },
  { _id: false }
);

const SubEventSchema = new Schema<ISubEvent>(
  {
    subEventName: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    venueName: { type: String, default: "" },
    venueAddress: { type: String, default: "" },
    mapUrl: { type: String, default: "" },
    services: { type: [String], default: [] },
    assignedPersons: { type: [AssignedPersonSchema], default: [] },
    subEventStatus: {
      type: String,
      enum: ["Scheduled", "Ongoing", "Completed"],
      default: "Scheduled",
    },
  },
  { _id: false }
);

const PaymentRecordSchema = new Schema<IPaymentRecord>(
  {
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    mode: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Cheque"],
      default: "UPI",
    },
    transactionRef: { type: String, default: "" },
    receiptNote: { type: String, default: "" },
  },
  { _id: false }
);

const BookingFinancialsSchema = new Schema<IBookingFinancials>(
  {
    totalPackageAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },
    advancePaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Partial", "Paid"],
      default: "Unpaid",
    },
    paymentHistory: { type: [PaymentRecordSchema], default: [] },
  },
  { _id: false }
);

const BookingSchema = new Schema<IBooking>(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    customerSnapshot: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      city: { type: String, default: "" },
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    primaryEventDate: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Confirmed", "In-Progress", "Completed", "Cancelled"],
      default: "Confirmed",
      index: true,
    },
    subEvents: {
      type: [SubEventSchema],
      default: [],
    },
    vendorPayouts: {
      type: [VendorBookingPayoutSchema],
      default: [],
    },
    financials: {
      type: BookingFinancialsSchema,
      default: () => ({}),
    },
    specialNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

BookingSchema.index({ bookingNumber: 1, primaryEventDate: 1, status: 1 });

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
