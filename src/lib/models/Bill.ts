import mongoose, { Schema, Document, Model } from "mongoose";

export const PAYMENT_MODES = ["Cash", "UPI", "Bank Transfer", "Card", "Cheque", "Other"] as const;

export interface IBillItem {
  title: string;
  description?: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface IBillPayment {
  date: Date;
  amount: number;
  mode: string;
  note?: string;
}

export interface IBill extends Document {
  billNumber: string;
  billDate: Date;
  dueDate?: Date | null;
  subject?: string;
  customer: { name: string; phone?: string; email?: string; address?: string };
  event: { type?: string; date?: Date | null; endDate?: Date | null; venue?: string; guests?: number | null };
  items: IBillItem[];
  discount: number;
  taxPercent: number;
  businessGstin?: string;
  payments: IBillPayment[];
  // Stored totals, recalculated by the API on every save.
  subtotal: number;
  taxAmount: number;
  total: number;
  paid: number;
  balance: number;
  notes?: string;
  terms?: string;
  isCancelled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BillItemSchema = new Schema<IBillItem>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    quantity: { type: Number, default: 1, min: 0 },
    rate: { type: Number, default: 0, min: 0 },
    amount: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const BillPaymentSchema = new Schema<IBillPayment>(
  {
    date: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    mode: { type: String, default: "Cash" },
    note: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const BillSchema = new Schema<IBill>(
  {
    billNumber: { type: String, required: true, unique: true, trim: true },
    billDate: { type: Date, required: true },
    dueDate: { type: Date, default: null },
    subject: { type: String, default: "", trim: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, default: "", trim: true },
      email: { type: String, default: "", trim: true },
      address: { type: String, default: "", trim: true },
    },
    event: {
      type: { type: String, default: "", trim: true },
      date: { type: Date, default: null },
      endDate: { type: Date, default: null },
      venue: { type: String, default: "", trim: true },
      guests: { type: Number, default: null },
    },
    items: { type: [BillItemSchema], default: [] },
    discount: { type: Number, default: 0, min: 0 },
    taxPercent: { type: Number, default: 0, min: 0, max: 100 },
    businessGstin: { type: String, default: "", trim: true },
    payments: { type: [BillPaymentSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    notes: { type: String, default: "", trim: true },
    terms: { type: String, default: "", trim: true },
    isCancelled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BillSchema.index({ billDate: -1 });
BillSchema.index({ "customer.name": 1 });

export const Bill: Model<IBill> = mongoose.models.Bill || mongoose.model<IBill>("Bill", BillSchema);

export default Bill;
