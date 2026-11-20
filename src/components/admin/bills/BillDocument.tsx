"use client";

import {
  amountInWords,
  calculateTotals,
  formatDate,
  formatINR,
  paymentStatus,
  STATUS_LABELS,
  type BillData,
} from "@/lib/billing";

// The printed bill. Fixed RIWAJ colours (not the site theme) so every bill
// looks the same. Sized to A4 at 96 dpi: 794 × 1123 px.

export const BILL_COLORS = {
  wine: "#7a2e35",
  wineDark: "#4a1a20",
  gold: "#b8925a",
  goldSoft: "#ead9bd",
  cream: "#fbf7f1",
  ink: "#2a2224",
  muted: "#7b6f70",
  line: "#eadfd6",
};

export interface BusinessInfo {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
}

const c = BILL_COLORS;
const serif = "'Playfair Display', Georgia, serif";
const sans = "'Outfit', 'Segoe UI', Arial, sans-serif";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 9.5, letterSpacing: "0.16em", textTransform: "uppercase", color: c.gold, fontWeight: 700, marginBottom: 6 }}>
      {children}
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value?: React.ReactNode; strong?: boolean }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", gap: 8, fontSize: 11.5, lineHeight: 1.65 }}>
      <span style={{ color: c.muted, minWidth: 64 }}>{label}</span>
      <span style={{ color: c.ink, fontWeight: strong ? 600 : 500 }}>{value}</span>
    </div>
  );
}

export default function BillDocument({
  bill,
  business,
  draft,
}: {
  bill: BillData;
  business: BusinessInfo;
  /** Hides the bill number for bills that aren't saved yet. */
  draft?: boolean;
}) {
  const totals = calculateTotals(bill);
  const status = paymentStatus(totals, bill.isCancelled);
  const items = bill.items.filter((item) => item.title.trim());
  const payments = bill.payments.filter((p) => Number(p.amount) > 0);
  const eventDates = [formatDate(bill.event.date), formatDate(bill.event.endDate)].filter(Boolean).join(" – ");
  const statusColor =
    status === "paid" ? "#2f7a4f" : status === "partial" ? "#a26a12" : status === "cancelled" ? "#8a8a8a" : c.wine;

  return (
    <div
      style={{
        width: 794,
        // Just under A4's 297 mm so a one-page bill never spills onto a blank second page.
        minHeight: 1118,
        background: "#fff",
        color: c.ink,
        fontFamily: sans,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        boxSizing: "border-box",
      }}
    >
      {/* Top accent */}
      <div style={{ height: 6, background: `linear-gradient(90deg, ${c.wineDark}, ${c.wine} 60%, ${c.gold})` }} />

      {/* Stamp for paid / cancelled bills */}
      {(status === "paid" || status === "cancelled") && (
        <div
          style={{
            position: "absolute",
            top: 330,
            right: 70,
            transform: "rotate(-14deg)",
            border: `3px solid ${statusColor}`,
            color: statusColor,
            opacity: 0.18,
            fontFamily: serif,
            fontWeight: 700,
            fontSize: 54,
            letterSpacing: "0.12em",
            padding: "4px 22px",
            borderRadius: 10,
            pointerEvents: "none",
          }}
        >
          {status === "paid" ? "PAID" : "CANCELLED"}
        </div>
      )}

      <div style={{ padding: "34px 48px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/riwaj-logo.png" alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />
            <div>
              <div style={{ fontFamily: serif, fontSize: 26, fontWeight: 700, color: c.wineDark, letterSpacing: "0.04em", lineHeight: 1.1 }}>
                RIWAJ
              </div>
              <div style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: c.gold, fontWeight: 600, marginTop: 3 }}>
                Weddings &amp; Events
              </div>
              <div style={{ fontSize: 10.5, color: c.muted, marginTop: 8, lineHeight: 1.55, maxWidth: 300 }}>
                {business.address && <div>{business.address}</div>}
                <div>{[business.phone, business.email].filter(Boolean).join("  ·  ")}</div>
                {bill.businessGstin && <div>GSTIN: {bill.businessGstin}</div>}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: serif, fontSize: 30, fontWeight: 600, color: c.wine, letterSpacing: "0.06em" }}>
              {bill.taxPercent > 0 ? "Tax Invoice" : "Invoice"}
            </div>
            <div style={{ marginTop: 10, fontSize: 11.5, lineHeight: 1.75 }}>
              {/* Unsaved bills have no number yet, so the line is left out. */}
              {!draft && bill.billNumber && (
                <div>
                  <span style={{ color: c.muted }}>Bill No. </span>
                  <strong>{bill.billNumber}</strong>
                </div>
              )}
              <div>
                <span style={{ color: c.muted }}>Date </span>
                <strong>{formatDate(bill.billDate)}</strong>
              </div>
              {bill.dueDate && (
                <div>
                  <span style={{ color: c.muted }}>Due by </span>
                  <strong>{formatDate(bill.dueDate)}</strong>
                </div>
              )}
            </div>
            <div
              style={{
                display: "inline-block",
                marginTop: 8,
                padding: "3px 12px",
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: statusColor,
                background: `${statusColor}14`,
                border: `1px solid ${statusColor}40`,
              }}
            >
              {STATUS_LABELS[status]}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: `linear-gradient(90deg, ${c.gold}, ${c.goldSoft} 70%, transparent)`, margin: "24px 0 22px" }} />

        {/* Customer and event */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          <div>
            <Label>Billed to</Label>
            <div style={{ fontFamily: serif, fontSize: 17, fontWeight: 600, color: c.wineDark, marginBottom: 4 }}>
              {bill.customer.name || "Customer name"}
            </div>
            <div style={{ fontSize: 11.5, color: c.ink, lineHeight: 1.6 }}>
              {bill.customer.phone && <div>{bill.customer.phone}</div>}
              {bill.customer.email && <div>{bill.customer.email}</div>}
              {bill.customer.address && <div style={{ color: c.muted }}>{bill.customer.address}</div>}
            </div>
          </div>
          <div style={{ background: c.cream, border: `1px solid ${c.line}`, borderRadius: 10, padding: "12px 16px" }}>
            <Label>Event details</Label>
            <Row label="Occasion" value={bill.event.type} strong />
            <Row label="Date" value={eventDates} />
            <Row label="Venue" value={bill.event.venue} />
            <Row label="Guests" value={bill.event.guests ? String(bill.event.guests) : ""} />
            {!bill.event.type && !eventDates && !bill.event.venue && (
              <div style={{ fontSize: 11.5, color: c.muted }}>—</div>
            )}
          </div>
        </div>

        {bill.subject && (
          <div style={{ marginTop: 20, fontSize: 12.5 }}>
            <span style={{ color: c.muted }}>Regarding: </span>
            <strong style={{ color: c.wineDark }}>{bill.subject}</strong>
          </div>
        )}

        {/* Items */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: bill.subject ? 12 : 22, fontSize: 11.5 }}>
          <thead>
            <tr style={{ background: c.wineDark, color: "#fff" }}>
              {["#", "Service", "Qty", "Rate", "Amount"].map((h, i) => (
                <th
                  key={h}
                  style={{
                    padding: "9px 12px",
                    textAlign: i < 2 ? "left" : "right",
                    fontWeight: 600,
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    width: i === 0 ? 34 : i === 1 ? undefined : i === 2 ? 50 : 100,
                    borderTopLeftRadius: i === 0 ? 6 : 0,
                    borderTopRightRadius: i === 4 ? 6 : 0,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 18, textAlign: "center", color: c.muted, borderBottom: `1px solid ${c.line}` }}>
                  Services you add will appear here
                </td>
              </tr>
            ) : (
              items.map((item, i) => (
                <tr key={i} style={{ background: i % 2 ? c.cream : "#fff", breakInside: "avoid" }}>
                  <td style={{ padding: "10px 12px", color: c.muted, borderBottom: `1px solid ${c.line}`, verticalAlign: "top" }}>{i + 1}</td>
                  <td style={{ padding: "10px 12px", borderBottom: `1px solid ${c.line}`, verticalAlign: "top" }}>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    {item.description && (
                      <div style={{ color: c.muted, fontSize: 10.5, marginTop: 2, whiteSpace: "pre-line" }}>{item.description}</div>
                    )}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", borderBottom: `1px solid ${c.line}`, verticalAlign: "top" }}>
                    {item.quantity || 0}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", borderBottom: `1px solid ${c.line}`, verticalAlign: "top" }}>
                    {formatINR(item.rate)}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, borderBottom: `1px solid ${c.line}`, verticalAlign: "top" }}>
                    {formatINR(totals.lines[bill.items.indexOf(item)] || 0)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Payments and totals */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 28, marginTop: 22, breakInside: "avoid" }}>
          <div>
            <Label>Amount in words</Label>
            <div style={{ fontSize: 11.5, fontStyle: "italic", color: c.ink, lineHeight: 1.5 }}>{amountInWords(totals.total)}</div>

            {payments.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <Label>Payments received</Label>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={i}>
                        <td style={{ padding: "5px 0", borderBottom: `1px dashed ${c.line}`, color: c.muted, width: 86 }}>{formatDate(p.date)}</td>
                        <td style={{ padding: "5px 6px", borderBottom: `1px dashed ${c.line}` }}>
                          {i === 0 ? "Advance" : "Payment"}
                          <span style={{ color: c.muted }}> · {p.mode}{p.note ? ` · ${p.note}` : ""}</span>
                        </td>
                        <td style={{ padding: "5px 0", borderBottom: `1px dashed ${c.line}`, textAlign: "right", fontWeight: 600 }}>
                          {formatINR(p.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={{ border: `1px solid ${c.line}`, borderRadius: 10, overflow: "hidden", alignSelf: "start" }}>
            <div style={{ padding: "12px 16px", fontSize: 11.5, lineHeight: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: c.muted }}>Subtotal</span>
                <span>{formatINR(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: c.muted }}>Discount</span>
                  <span>− {formatINR(totals.discount)}</span>
                </div>
              )}
              {bill.taxPercent > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: c.muted }}>GST ({bill.taxPercent}%)</span>
                  <span>{formatINR(totals.taxAmount)}</span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: c.wine, color: "#fff" }}>
              <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: serif, fontSize: 19, fontWeight: 700 }}>{formatINR(totals.total)}</span>
            </div>
            <div style={{ padding: "10px 16px", fontSize: 11.5, lineHeight: 2, background: c.cream }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: c.muted }}>{payments.length === 1 ? "Advance paid" : "Amount paid"}</span>
                <span>{formatINR(totals.paid)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: totals.balance > 0 ? c.wine : "#2f7a4f" }}>
                <span>Balance due</span>
                <span>{formatINR(Math.max(totals.balance, 0))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes and terms */}
        {(bill.notes || bill.terms) && (
          <div style={{ display: "grid", gridTemplateColumns: bill.notes && bill.terms ? "1fr 1fr" : "1fr", gap: 28, marginTop: 26, breakInside: "avoid" }}>
            {bill.notes && (
              <div>
                <Label>Notes</Label>
                <div style={{ fontSize: 10.5, color: c.ink, lineHeight: 1.6, whiteSpace: "pre-line" }}>{bill.notes}</div>
              </div>
            )}
            {bill.terms && (
              <div>
                <Label>Terms &amp; conditions</Label>
                <ol style={{ margin: 0, paddingLeft: 16, listStyle: "decimal", fontSize: 10, color: c.muted, lineHeight: 1.6 }}>
                  {bill.terms.split("\n").filter((t) => t.trim()).map((t, i) => (
                    <li key={i}>{t.trim()}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Sign-off */}
        <div style={{ marginTop: "auto", paddingTop: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-end", breakInside: "avoid" }}>
          <div>
            <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 16, color: c.wine }}>Thank you for choosing RIWAJ</div>
            <div style={{ fontSize: 10.5, color: c.muted, marginTop: 3 }}>We look forward to making your celebration memorable.</div>
          </div>
          <div style={{ textAlign: "center", minWidth: 180 }}>
            <div style={{ borderTop: `1px solid ${c.ink}`, paddingTop: 6, fontSize: 10.5, color: c.muted }}>Authorised signatory</div>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: c.wineDark }}>For {business.name}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 26,
          padding: "10px 48px",
          background: c.cream,
          borderTop: `1px solid ${c.line}`,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 9.5,
          color: c.muted,
          letterSpacing: "0.04em",
        }}
      >
        <span>{business.website || "riwajweddings.com"}</span>
      </div>
    </div>
  );
}
