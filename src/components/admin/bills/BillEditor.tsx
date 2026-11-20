"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Eye, Loader2, Pencil, Plus, Printer, Save, Trash2, X } from "lucide-react";
import BillDocument, { type BusinessInfo } from "./BillDocument";
import { printBill } from "./printBill";
import {
  calculateTotals,
  COMMON_BILL_ITEMS,
  EVENT_TYPES,
  formatINR,
  toInputDate,
  type BillData,
} from "@/lib/billing";

export type EditorMode = "new" | "edit" | "quick";

const PAYMENT_MODES = ["Cash", "UPI", "Bank Transfer", "Card", "Cheque", "Other"];

const input =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-semibold text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function Card({ title, hint, children, action }: { title: string; hint?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-base font-bold text-gray-900">{title}</h3>
          {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

// Fits the 794px-wide A4 bill into whatever width the preview column has.
function ScaledPreview({ bill, business, draft }: { bill: BillData; business: BusinessInfo; draft: boolean }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [height, setHeight] = useState(1123);

  useLayoutEffect(() => {
    const update = () => {
      if (outer.current) setScale(Math.min(outer.current.clientWidth / 794, 1));
      if (inner.current) setHeight(inner.current.offsetHeight);
    };
    update();
    const observer = new ResizeObserver(update);
    if (outer.current) observer.observe(outer.current);
    if (inner.current) observer.observe(inner.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={outer} className="w-full overflow-hidden rounded-xl shadow-[0_8px_30px_rgba(74,26,32,0.12)] ring-1 ring-gray-200" style={{ height: height * scale }}>
      <div ref={inner} style={{ width: 794, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <BillDocument bill={bill} business={business} draft={draft} />
      </div>
    </div>
  );
}

export default function BillEditor({
  initial,
  mode,
  business,
  serviceNames,
  onClose,
  onSaved,
}: {
  initial: BillData;
  mode: EditorMode;
  business: BusinessInfo;
  serviceNames: string[];
  onClose: () => void;
  onSaved: (bill: BillData) => void;
}) {
  const [bill, setBill] = useState<BillData>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");
  const totals = useMemo(() => calculateTotals(bill), [bill]);
  const draft = mode !== "edit";

  // On desktop the admin content area scrolls, not the window; reset both.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.getElementById("admin-content")?.scrollTo({ top: 0 });
  }, []);

  const set = <K extends keyof BillData>(key: K, value: BillData[K]) => setBill((b) => ({ ...b, [key]: value }));
  const setCustomer = (key: keyof BillData["customer"], value: string) =>
    setBill((b) => ({ ...b, customer: { ...b.customer, [key]: value } }));
  const setEvent = (key: keyof BillData["event"], value: string | number | null) =>
    setBill((b) => ({ ...b, event: { ...b.event, [key]: value } }));

  const updateItem = (index: number, patch: Partial<BillData["items"][number]>) =>
    setBill((b) => ({ ...b, items: b.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) }));
  const addItem = (title = "") =>
    setBill((b) => {
      // Fill an empty first row instead of leaving it blank above the new one.
      const blank = b.items.findIndex((item) => !item.title.trim() && !item.rate);
      if (title && blank !== -1) {
        return { ...b, items: b.items.map((item, i) => (i === blank ? { ...item, title } : item)) };
      }
      return { ...b, items: [...b.items, { title, description: "", quantity: 1, rate: 0 }] };
    });
  const removeItem = (index: number) => setBill((b) => ({ ...b, items: b.items.filter((_, i) => i !== index) }));

  const updatePayment = (index: number, patch: Partial<BillData["payments"][number]>) =>
    setBill((b) => ({ ...b, payments: b.payments.map((p, i) => (i === index ? { ...p, ...patch } : p)) }));
  const addPayment = () =>
    setBill((b) => ({
      ...b,
      payments: [...b.payments, { date: toInputDate(new Date()), amount: 0, mode: "UPI", note: "" }],
    }));
  const removePayment = (index: number) => setBill((b) => ({ ...b, payments: b.payments.filter((_, i) => i !== index) }));

  const suggestions = useMemo(() => {
    const seen = new Set<string>();
    return [...serviceNames, ...COMMON_BILL_ITEMS].filter((name) => {
      const key = name.trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [serviceNames]);
  const used = new Set(bill.items.map((item) => item.title.trim().toLowerCase()));

  const validate = () => {
    if (!bill.customer.name.trim()) return "Enter the customer's name.";
    if (!bill.items.some((item) => item.title.trim())) return "Add at least one service.";
    return "";
  };

  const handlePrint = (data: BillData, isDraft: boolean) => {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    printBill(data, business, isDraft);
  };

  const handleSave = async (thenPrint: boolean) => {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/bills", {
        method: bill._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bill._id ? { ...bill, id: bill._id } : bill),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Could not save the bill.");
        return;
      }
      if (thenPrint) await printBill(data.bill, business, false);
      onSaved(data.bill);
    } catch {
      setError("Could not save the bill. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const heading = mode === "edit" ? `Edit bill ${bill.billNumber || ""}` : mode === "quick" ? "Quick bill" : "New bill";
  const subheading =
    mode === "quick"
      ? "Print or save as PDF without keeping a copy in the system."
      : mode === "edit"
      ? "Changes are saved to bill history."
      : "Saved bills get a number and appear in bill history.";

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="rounded-xl border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50" aria-label="Back to bills">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900">{heading}</h2>
            <p className="text-sm text-gray-500">{subheading}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "quick" ? (
            <button
              onClick={() => handlePrint(bill, true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
            >
              <Printer className="h-4 w-4" /> Print / Save PDF
            </button>
          ) : (
            <>
              <button
                onClick={() => handlePrint(bill, draft)}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                title={mode === "edit" ? "Print with the changes shown, without saving them" : "Print a draft without saving"}
              >
                <Printer className="h-4 w-4" /> Print only
              </button>
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
              >
                <Printer className="h-4 w-4" /> Save &amp; print
              </button>
            </>
          )}
        </div>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

      {/* Phones: switch between form and preview */}
      <div className="flex rounded-xl bg-gray-100 p-1 lg:hidden">
        {(["form", "preview"] as const).map((view) => (
          <button
            key={view}
            onClick={() => setMobileView(view)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold ${
              mobileView === view ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            {view === "form" ? <Pencil className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {view === "form" ? "Details" : "Preview"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        {/* Form */}
        <div className={`space-y-5 ${mobileView === "preview" ? "hidden lg:block" : ""}`}>
          <Card title="Customer" hint="Who the bill is for.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name *">
                <input className={input} value={bill.customer.name} onChange={(e) => setCustomer("name", e.target.value)} placeholder="e.g. Pawan Kushwaha" />
              </Field>
              <Field label="Phone">
                <input className={input} value={bill.customer.phone || ""} onChange={(e) => setCustomer("phone", e.target.value)} placeholder="10-digit mobile" inputMode="tel" />
              </Field>
              <Field label="Email">
                <input className={input} value={bill.customer.email || ""} onChange={(e) => setCustomer("email", e.target.value)} type="email" />
              </Field>
              <Field label="Address">
                <input className={input} value={bill.customer.address || ""} onChange={(e) => setCustomer("address", e.target.value)} placeholder="City / full address" />
              </Field>
            </div>
          </Card>

          <Card title="Event">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Occasion">
                <input className={input} list="bill-event-types" value={bill.event.type || ""} onChange={(e) => setEvent("type", e.target.value)} placeholder="Wedding, Haldi…" />
                <datalist id="bill-event-types">
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </Field>
              <Field label="Venue">
                <input className={input} value={bill.event.venue || ""} onChange={(e) => setEvent("venue", e.target.value)} placeholder="Venue name, city" />
              </Field>
              <Field label="Event date">
                <input className={input} type="date" value={bill.event.date || ""} onChange={(e) => setEvent("date", e.target.value)} />
              </Field>
              <Field label="Till (for multi-day events)">
                <input className={input} type="date" value={bill.event.endDate || ""} min={bill.event.date || undefined} onChange={(e) => setEvent("endDate", e.target.value)} />
              </Field>
              <Field label="Guests (approx.)">
                <input className={input} type="number" min={0} value={bill.event.guests ?? ""} onChange={(e) => setEvent("guests", e.target.value ? Number(e.target.value) : null)} />
              </Field>
              <Field label="Bill for (optional)">
                <input className={input} value={bill.subject || ""} onChange={(e) => set("subject", e.target.value)} placeholder="Complete wedding package / Photography only" />
              </Field>
            </div>
          </Card>

          <Card
            title="Services"
            hint="Add one service for a single booking, or several for a full package."
            action={
              <button onClick={() => addItem()} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800">
                <Plus className="h-3.5 w-3.5" /> Row
              </button>
            }
          >
            <div className="mb-4 flex flex-wrap gap-1.5">
              {suggestions
                .filter((name) => !used.has(name.trim().toLowerCase()))
                .slice(0, 24)
                .map((name) => (
                  <button
                    key={name}
                    onClick={() => addItem(name)}
                    className="rounded-full border border-rose-100 bg-rose-50/60 px-2.5 py-1 text-xs font-medium text-rose-800 hover:border-rose-300 hover:bg-rose-100"
                  >
                    + {name}
                  </button>
                ))}
            </div>

            <div className="space-y-3">
              {bill.items.map((item, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-gray-50/50 p-3">
                  <div className="flex gap-2">
                    <input
                      className={`${input} font-semibold`}
                      value={item.title}
                      onChange={(e) => updateItem(i, { title: e.target.value })}
                      placeholder="Service, e.g. Photography"
                      aria-label={`Service ${i + 1}`}
                    />
                    <button onClick={() => removeItem(i)} className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500" aria-label={`Remove service ${i + 1}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    className={`${input} mt-2 text-xs`}
                    rows={1}
                    value={item.description || ""}
                    onChange={(e) => updateItem(i, { description: e.target.value })}
                    placeholder="Details (optional): e.g. 2 photographers, 300 edited photos, 1 album"
                  />
                  <div className="mt-2 grid grid-cols-[70px_1fr_auto] items-end gap-2">
                    <Field label="Qty">
                      <input className={input} type="number" min={0} step="any" value={item.quantity || ""} onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })} />
                    </Field>
                    <Field label="Rate (₹)">
                      <input className={input} type="number" min={0} step="any" value={item.rate || ""} onChange={(e) => updateItem(i, { rate: Number(e.target.value) })} placeholder="0" />
                    </Field>
                    <div className="pb-2 text-right">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Amount</div>
                      <div className="text-sm font-bold text-gray-900">{formatINR(totals.lines[i] || 0)}</div>
                    </div>
                  </div>
                </div>
              ))}
              {bill.items.length === 0 && <p className="text-sm text-gray-500">Tap a service above or add a row.</p>}
            </div>

            <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-3">
              <Field label="Discount (₹)">
                <input className={input} type="number" min={0} step="any" value={bill.discount || ""} onChange={(e) => set("discount", Number(e.target.value))} placeholder="0" />
              </Field>
              <Field label="GST %">
                <select className={input} value={bill.taxPercent} onChange={(e) => set("taxPercent", Number(e.target.value))}>
                  {[0, 5, 12, 18, 28].map((p) => (
                    <option key={p} value={p}>
                      {p === 0 ? "No GST" : `${p}%`}
                    </option>
                  ))}
                </select>
              </Field>
              {bill.taxPercent > 0 && (
                <Field label="Your GSTIN">
                  <input className={`${input} uppercase`} value={bill.businessGstin || ""} onChange={(e) => set("businessGstin", e.target.value)} maxLength={15} />
                </Field>
              )}
            </div>
          </Card>

          <Card
            title="Payments"
            hint="The first payment prints as the advance."
            action={
              <button onClick={addPayment} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">
                <Plus className="h-3.5 w-3.5" /> {bill.payments.length === 0 ? "Advance" : "Payment"}
              </button>
            }
          >
            <div className="space-y-3">
              {bill.payments.map((p, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 bg-gray-50/50 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
                  <Field label={i === 0 ? "Advance (₹)" : "Amount (₹)"}>
                    <input className={input} type="number" min={0} step="any" value={p.amount || ""} onChange={(e) => updatePayment(i, { amount: Number(e.target.value) })} />
                  </Field>
                  <Field label="Date">
                    <input className={input} type="date" value={p.date} onChange={(e) => updatePayment(i, { date: e.target.value })} />
                  </Field>
                  <Field label="Mode">
                    <select className={input} value={p.mode} onChange={(e) => updatePayment(i, { mode: e.target.value })}>
                      {PAYMENT_MODES.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </Field>
                  <div className="flex items-end gap-1">
                    <input className={input} value={p.note || ""} onChange={(e) => updatePayment(i, { note: e.target.value })} placeholder="Ref / note" aria-label="Payment note" />
                    <button onClick={() => removePayment(i)} className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500" aria-label="Remove payment">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {bill.payments.length === 0 && <p className="text-sm text-gray-500">No payment received yet.</p>}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-gray-900 p-3 text-center text-white">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-gray-400">Total</div>
                <div className="font-bold">{formatINR(totals.total)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wide text-gray-400">Received</div>
                <div className="font-bold text-emerald-300">{formatINR(totals.paid)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wide text-gray-400">Balance</div>
                <div className={`font-bold ${totals.balance > 0 ? "text-amber-300" : "text-emerald-300"}`}>{formatINR(totals.balance)}</div>
              </div>
            </div>
            {totals.balance < 0 && <p className="mt-2 text-xs text-amber-700">Payments are more than the total by {formatINR(-totals.balance)}.</p>}
          </Card>

          <Card title="Bill details">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Bill date">
                <input className={input} type="date" value={bill.billDate} onChange={(e) => set("billDate", e.target.value)} />
              </Field>
              <Field label="Balance due by (optional)">
                <input className={input} type="date" value={bill.dueDate || ""} onChange={(e) => set("dueDate", e.target.value)} />
              </Field>
              <Field label="Notes (printed on the bill)" className="sm:col-span-2">
                <textarea className={input} rows={2} value={bill.notes || ""} onChange={(e) => set("notes", e.target.value)} placeholder="e.g. Bank / UPI details, inclusions" />
              </Field>
              <Field label="Terms & conditions (one per line)" className="sm:col-span-2">
                <textarea className={`${input} text-xs`} rows={4} value={bill.terms || ""} onChange={(e) => set("terms", e.target.value)} />
              </Field>
              {mode === "edit" && (
                <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
                  <input type="checkbox" className="h-4 w-4 accent-rose-600" checked={!!bill.isCancelled} onChange={(e) => set("isCancelled", e.target.checked)} />
                  Mark this bill as cancelled
                </label>
              )}
            </div>
          </Card>
        </div>

        {/* Live preview */}
        <div className={mobileView === "form" ? "hidden lg:block" : ""}>
          {/* Stays in view while the form scrolls; scrolls on its own if the bill is taller than the screen. */}
          <div className="lg:sticky lg:top-0 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:overscroll-contain lg:pb-2 lg:pr-1">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live preview</span>
              <span className="text-xs text-gray-400">A4</span>
            </div>
            <ScaledPreview bill={bill} business={business} draft={draft} />
          </div>
        </div>
      </div>
    </div>
  );
}
