"use client";

import { createRoot } from "react-dom/client";
import BillDocument, { type BusinessInfo } from "./BillDocument";
import type { BillData } from "@/lib/billing";

const ROOT_CLASS = "riwaj-bill-print-root";

// While printing, only the bill is shown; everything else on the page is hidden.
const PRINT_CSS = `
.${ROOT_CLASS} { display: none; }
@media print {
  @page { size: A4; margin: 0; }
  html, body { background: #fff !important; }
  body > *:not(.${ROOT_CLASS}) { display: none !important; }
  .${ROOT_CLASS} { display: block !important; }
}`;

/**
 * Opens the browser's print dialog with just the bill. "Save as PDF" in that
 * dialog downloads it. Works for saved bills and unsaved quick bills alike.
 */
export async function printBill(bill: BillData, business: BusinessInfo, draft = false) {
  document.querySelectorAll(`.${ROOT_CLASS}`).forEach((el) => el.remove());

  const container = document.createElement("div");
  container.className = ROOT_CLASS;
  const style = document.createElement("style");
  style.textContent = PRINT_CSS;
  container.appendChild(style);
  const mount = document.createElement("div");
  container.appendChild(mount);
  document.body.appendChild(container);

  const root = createRoot(mount);
  root.render(<BillDocument bill={bill} business={business} draft={draft} />);

  // Let React render, then wait for the logo and fonts so they appear in the print.
  await new Promise((resolve) => setTimeout(resolve, 60));
  await Promise.all(
    Array.from(container.querySelectorAll("img")).map((img) =>
      img.complete ? null : new Promise((resolve) => ((img.onload = resolve), (img.onerror = resolve)))
    )
  );
  await document.fonts?.ready;

  // The PDF file name comes from the page title.
  const previousTitle = document.title;
  const name = bill.customer.name.trim() || "Customer";
  document.title = `${draft || !bill.billNumber ? "RIWAJ Bill" : bill.billNumber} - ${name}`;

  const cleanup = () => {
    document.title = previousTitle;
    root.unmount();
    container.remove();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  window.print();
}
