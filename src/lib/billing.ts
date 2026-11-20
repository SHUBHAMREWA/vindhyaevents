// Shared bill maths and formatting, used by the admin UI, the printed bill and
// the API (which recalculates totals so stored numbers can't be tampered with).

export interface BillItemInput {
  title: string;
  description?: string;
  quantity: number;
  rate: number;
}

export interface BillPaymentInput {
  date: string;
  amount: number;
  mode: string;
  note?: string;
}

export interface BillData {
  _id?: string;
  billNumber?: string;
  billDate: string;
  dueDate?: string;
  subject?: string;
  customer: { name: string; phone?: string; email?: string; address?: string };
  event: { type?: string; date?: string; endDate?: string; venue?: string; guests?: number | null };
  items: BillItemInput[];
  discount: number;
  taxPercent: number;
  businessGstin?: string;
  payments: BillPaymentInput[];
  notes?: string;
  terms?: string;
  isCancelled?: boolean;
}

export interface BillTotals {
  lines: number[];
  subtotal: number;
  discount: number;
  taxable: number;
  taxAmount: number;
  total: number;
  paid: number;
  balance: number;
}

export const toNumber = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateTotals(bill: Pick<BillData, "items" | "discount" | "taxPercent" | "payments">): BillTotals {
  const lines = bill.items.map((item) => round2(toNumber(item.quantity) * toNumber(item.rate)));
  const subtotal = round2(lines.reduce((sum, n) => sum + n, 0));
  const discount = Math.min(toNumber(bill.discount), subtotal);
  const taxable = round2(subtotal - discount);
  const taxAmount = round2((taxable * Math.min(toNumber(bill.taxPercent), 100)) / 100);
  const total = round2(taxable + taxAmount);
  const paid = round2(bill.payments.reduce((sum, p) => sum + toNumber(p.amount), 0));
  return { lines, subtotal, discount, taxable, taxAmount, total, paid, balance: round2(total - paid) };
}

export type PaymentStatus = "paid" | "partial" | "unpaid" | "cancelled";

export function paymentStatus(totals: { total: number; paid: number }, isCancelled?: boolean): PaymentStatus {
  if (isCancelled) return "cancelled";
  if (totals.total > 0 && totals.paid >= totals.total) return "paid";
  if (totals.paid > 0) return "partial";
  return "unpaid";
}

export const STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: "Paid",
  partial: "Partially paid",
  unpaid: "Unpaid",
  cancelled: "Cancelled",
};

export const formatINR = (n: number, decimals = false) =>
  "₹" +
  (Number(n) || 0).toLocaleString("en-IN", {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: 2,
  });

export function formatDate(value?: string | Date | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** yyyy-mm-dd for <input type="date">, in local time. */
export function toInputDate(value?: string | Date | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function belowHundred(n: number) {
  return n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? " " + ONES[n % 10] : ""}`;
}

function belowThousand(n: number) {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  return [h ? `${ONES[h]} Hundred` : "", rest ? belowHundred(rest) : ""].filter(Boolean).join(" ");
}

/** Indian-system words, e.g. 125000 → "One Lakh Twenty Five Thousand Rupees Only". */
export function amountInWords(amount: number) {
  const rupees = Math.floor(Math.abs(amount));
  const paise = Math.round((Math.abs(amount) - rupees) * 100);
  if (rupees === 0 && paise === 0) return "Zero Rupees Only";

  const parts: string[] = [];
  let n = rupees;
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  if (crore) parts.push(`${crore >= 1000 ? amountInWords(crore).replace(" Rupees Only", "") : belowThousand(crore)} Crore`);
  if (lakh) parts.push(`${belowHundred(lakh)} Lakh`);
  if (thousand) parts.push(`${belowHundred(thousand)} Thousand`);
  if (n) parts.push(belowThousand(n));

  let words = parts.join(" ");
  words = words ? `${words} Rupees` : "";
  if (paise) words += `${words ? " and " : ""}${belowHundred(paise)} Paise`;
  return `${words} Only`;
}

export const DEFAULT_TERMS = [
  "Advance payment confirms the booking and is non-refundable.",
  "Balance amount is to be paid before the event date.",
  "Any extra service or change requested later will be charged separately.",
  "Prices are valid for the dates and venue mentioned in this bill.",
].join("\n");

export const EVENT_TYPES = [
  "Wedding", "Engagement", "Haldi", "Mehendi", "Sangeet", "Reception",
  "Birthday", "Anniversary", "Corporate Event", "Pre-Wedding Shoot", "Other",
];

// Quick-add suggestions shown with the admin's own services.
export const COMMON_BILL_ITEMS = [
  "Photography", "Videography", "Drone Shoot", "Pre-Wedding Shoot", "Wedding Album",
  "Stage & Mandap Decoration", "Floral Decoration", "Lighting", "Tent & Seating",
  "Catering", "DJ & Sound", "Live Band", "Dhol", "Anchor", "Mehendi Artist",
  "Bridal Makeup", "Baggi / Horse", "Fireworks", "Venue", "Event Management",
];
