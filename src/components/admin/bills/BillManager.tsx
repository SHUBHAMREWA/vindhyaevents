"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  FileText,
  IndianRupee,
  Loader2,
  MessageCircle,
  Pencil,
  Plus,
  Printer,
  Receipt,
  Search,
  Trash2,
  Wallet,
  Zap,
} from "lucide-react";
import BillEditor, { type EditorMode } from "./BillEditor";
import { printBill } from "./printBill";
import type { BusinessInfo } from "./BillDocument";
import { useSettings } from "@/context/SettingsContext";
import {
  DEFAULT_TERMS,
  formatDate,
  formatINR,
  paymentStatus,
  STATUS_LABELS,
  toInputDate,
  type BillData,
  type PaymentStatus,
} from "@/lib/billing";

interface SavedBill extends BillData {
  _id: string;
  billNumber: string;
  total: number;
  paid: number;
  balance: number;
  createdAt?: string;
}

const STATUS_STYLES: Record<PaymentStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  partial: "bg-amber-50 text-amber-700 ring-amber-200",
  unpaid: "bg-rose-50 text-rose-700 ring-rose-200",
  cancelled: "bg-gray-100 text-gray-500 ring-gray-200",
};

const emptyBill = (): BillData => ({
  billDate: toInputDate(new Date()),
  dueDate: "",
  subject: "",
  customer: { name: "", phone: "", email: "", address: "" },
  event: { type: "", date: "", endDate: "", venue: "", guests: null },
  items: [{ title: "", description: "", quantity: 1, rate: 0 }],
  discount: 0,
  taxPercent: 0,
  businessGstin: "",
  payments: [],
  notes: "",
  terms: DEFAULT_TERMS,
  isCancelled: false,
});

// Saved bills come back with full ISO dates; the form uses yyyy-mm-dd.
const toEditable = (bill: SavedBill): BillData => ({
  ...emptyBill(),
  ...bill,
  billDate: toInputDate(bill.billDate),
  dueDate: toInputDate(bill.dueDate),
  customer: { ...emptyBill().customer, ...bill.customer },
  event: {
    ...bill.event,
    date: toInputDate(bill.event?.date),
    endDate: toInputDate(bill.event?.endDate),
  },
  items: (bill.items || []).map(({ title, description, quantity, rate }) => ({ title, description, quantity, rate })),
  payments: (bill.payments || []).map((p) => ({ ...p, date: toInputDate(p.date) })),
});

function whatsAppLink(bill: SavedBill) {
  let digits = (bill.customer.phone || "").replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`;
  const lines = [
    `Namaste ${bill.customer.name},`,
    ``,
    `Your bill from RIWAJ Weddings & Events:`,
    `Bill No: ${bill.billNumber}`,
    bill.event?.type ? `Event: ${bill.event.type}${bill.event.date ? `, ${formatDate(bill.event.date)}` : ""}` : "",
    `Total: ${formatINR(bill.total)}`,
    `Received: ${formatINR(bill.paid)}`,
    `Balance: ${formatINR(Math.max(bill.balance, 0))}`,
    ``,
    `Thank you for choosing RIWAJ.`,
  ].filter((line, i, all) => line !== "" || all[i - 1] !== "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function BillManager({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const { phone, email, address } = useSettings();
  const business: BusinessInfo = { name: "RIWAJ Weddings & Events", phone, email, address, website: "riwajweddings.com" };

  const [bills, setBills] = useState<SavedBill[]>([]);
  const [serviceNames, setServiceNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>("all");
  const [editor, setEditor] = useState<{ mode: EditorMode; bill: BillData; key: number } | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/bills");
      const data = await res.json();
      if (data.success) {
        setBills(data.bills || []);
        onCountChange?.((data.bills || []).length);
      }
    } catch (err) {
      console.error("Error fetching bills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    fetch("/api/admin/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setServiceNames((data.services || []).filter((s: any) => s.isActive !== false).map((s: any) => s.title));
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const withStatus = useMemo(
    () => bills.map((bill) => ({ bill, status: paymentStatus({ total: bill.total, paid: bill.paid }, bill.isCancelled) })),
    [bills]
  );

  const stats = useMemo(() => {
    const active = withStatus.filter(({ status }) => status !== "cancelled").map(({ bill }) => bill);
    return {
      count: active.length,
      billed: active.reduce((sum, b) => sum + (b.total || 0), 0),
      received: active.reduce((sum, b) => sum + (b.paid || 0), 0),
      due: active.reduce((sum, b) => sum + Math.max(b.balance || 0, 0), 0),
    };
  }, [withStatus]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return withStatus.filter(({ bill, status }) => {
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (!q) return true;
      return [bill.billNumber, bill.customer.name, bill.customer.phone, bill.event?.type, bill.subject]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [withStatus, search, statusFilter]);

  // Remembers the GSTIN used last so it doesn't have to be typed every time.
  const lastGstin = bills.find((b) => b.businessGstin)?.businessGstin || "";
  const open = (mode: EditorMode, bill?: BillData) =>
    setEditor({ mode, bill: bill || { ...emptyBill(), businessGstin: lastGstin }, key: Date.now() });

  const duplicate = (bill: SavedBill) => {
    const copy = toEditable(bill);
    open("new", {
      ...copy,
      _id: undefined,
      billNumber: undefined,
      billDate: toInputDate(new Date()),
      payments: [],
      isCancelled: false,
    });
  };

  const handleDelete = async (bill: SavedBill) => {
    if (!confirm(`Delete bill ${bill.billNumber} for ${bill.customer.name}? This cannot be undone.\n\nTip: to keep a record, edit it and mark it cancelled instead.`)) return;
    const res = await fetch(`/api/admin/bills?id=${bill._id}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) {
      alert(data.message || "Could not delete the bill.");
      return;
    }
    await load();
  };

  if (editor) {
    return (
      <BillEditor
        key={editor.key}
        initial={editor.bill}
        mode={editor.mode}
        business={business}
        serviceNames={serviceNames}
        onClose={() => setEditor(null)}
        onSaved={async () => {
          setEditor(null);
          await load();
        }}
      />
    );
  }

  const statCards = [
    { label: "Bills", value: String(stats.count), icon: FileText, tone: "text-gray-900", bg: "bg-gray-100 text-gray-600" },
    { label: "Total billed", value: formatINR(stats.billed), icon: Receipt, tone: "text-gray-900", bg: "bg-rose-100 text-rose-700" },
    { label: "Received", value: formatINR(stats.received), icon: Wallet, tone: "text-emerald-700", bg: "bg-emerald-100 text-emerald-700" },
    { label: "Balance due", value: formatINR(stats.due), icon: IndianRupee, tone: "text-amber-700", bg: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900">Bills &amp; History</h2>
          <p className="text-sm text-gray-500">Create bills for a single service or a full package, track advances and balances, and print them.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => open("quick")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            title="Make and print a bill without saving it"
          >
            <Zap className="h-4 w-4 text-amber-500" /> Quick bill
          </button>
          <button
            onClick={() => open("new")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-200 hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> New bill
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, tone, bg }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-xs font-semibold text-gray-500">{label}</span>
            </div>
            <div className={`mt-2 truncate text-xl font-bold ${tone}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, phone, bill no. or event…"
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "unpaid", "partial", "paid", "cancelled"] as const).map((key) => {
            const count = key === "all" ? withStatus.length : withStatus.filter((b) => b.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  statusFilter === key ? "bg-rose-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {key === "all" ? "All" : STATUS_LABELS[key]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
          <Receipt className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="font-semibold text-gray-700">{bills.length === 0 ? "No bills yet" : "No bills match your search"}</p>
          <p className="mt-1 text-sm text-gray-500">
            {bills.length === 0 ? "Create your first bill, or use Quick bill to print one without saving." : "Try another name, number or filter."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Desktop table */}
          <table className="hidden w-full text-sm md:table">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Bill</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map(({ bill, status }) => (
                <tr key={bill._id} className={`hover:bg-rose-50/30 ${status === "cancelled" ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{bill.billNumber}</div>
                    <div className="text-xs text-gray-500">{formatDate(bill.billDate)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{bill.customer.name}</div>
                    <div className="text-xs text-gray-500">{bill.customer.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-800">{bill.subject || bill.event?.type || "—"}</div>
                    <div className="text-xs text-gray-500">{formatDate(bill.event?.date)}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatINR(bill.total)}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${bill.balance > 0 && status !== "cancelled" ? "text-amber-700" : "text-gray-400"}`}>
                    {formatINR(Math.max(bill.balance, 0))}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Actions bill={bill} business={business} onEdit={() => open("edit", toEditable(bill))} onDuplicate={() => duplicate(bill)} onDelete={() => handleDelete(bill)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phone cards */}
          <ul className="divide-y divide-gray-100 md:hidden">
            {visible.map(({ bill, status }) => (
              <li key={bill._id} className={`p-4 ${status === "cancelled" ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-gray-900">{bill.customer.name}</div>
                    <div className="text-xs text-gray-500">
                      {bill.billNumber} · {formatDate(bill.billDate)}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-gray-500">{bill.subject || bill.event?.type}</div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-bold text-gray-900">{formatINR(bill.total)}</span>
                    {bill.balance > 0 && status !== "cancelled" && <span className="ml-2 text-xs font-semibold text-amber-700">Due {formatINR(bill.balance)}</span>}
                  </div>
                  <Actions bill={bill} business={business} onEdit={() => open("edit", toEditable(bill))} onDuplicate={() => duplicate(bill)} onDelete={() => handleDelete(bill)} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Actions({
  bill,
  business,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  bill: SavedBill;
  business: BusinessInfo;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const btn = "rounded-lg p-2 transition-colors";
  return (
    <div className="flex items-center justify-end gap-0.5">
      <button onClick={() => printBill(toEditable(bill), business)} className={`${btn} text-gray-600 hover:bg-gray-100`} title="Print / save PDF" aria-label="Print bill">
        <Printer className="h-4 w-4" />
      </button>
      <button onClick={onEdit} className={`${btn} text-blue-600 hover:bg-blue-50`} title="Edit / add payment" aria-label="Edit bill">
        <Pencil className="h-4 w-4" />
      </button>
      {bill.customer.phone && (
        <a href={whatsAppLink(bill)} target="_blank" rel="noopener noreferrer" className={`${btn} text-emerald-600 hover:bg-emerald-50`} title="Send summary on WhatsApp" aria-label="Send on WhatsApp">
          <MessageCircle className="h-4 w-4" />
        </a>
      )}
      <button onClick={onDuplicate} className={`${btn} text-gray-500 hover:bg-gray-100`} title="Make a new bill from this one" aria-label="Duplicate bill">
        <Copy className="h-4 w-4" />
      </button>
      <button onClick={onDelete} className={`${btn} text-red-500 hover:bg-red-50`} title="Delete" aria-label="Delete bill">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
