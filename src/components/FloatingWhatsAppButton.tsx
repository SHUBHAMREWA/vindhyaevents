"use client";

import { usePathname } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import { getEventBySlug } from "@/data/eventRoutes";

// Official WhatsApp SVG icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L.057 23.492a.75.75 0 0 0 .904.964l5.805-1.524A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.962-1.358l-.355-.211-3.683.966.983-3.595-.232-.369A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
  </svg>
);

interface Props {
  customMessage?: string;
  customTooltip?: string;
}

export default function FloatingWhatsAppButton({ customMessage, customTooltip }: Props) {
  const { siteName, getWhatsAppLink } = useSettings();
  const pathname = usePathname();

  const brandName = siteName || "RIWAJ Events";

  // Check if current route is an event slug
  const currentSlug = pathname ? pathname.replace(/^\//, "").split("/")[0] : "";
  const matchedEvent = currentSlug ? getEventBySlug(currentSlug) : null;

  // Formulate intelligent pre-filled message based on current route/service
  let finalMessage = customMessage;
  let finalTooltip = customTooltip;

  if (!finalMessage) {
    if (matchedEvent) {
      finalMessage = `Namaste ${brandName}! Mujhe ${matchedEvent.menuTitle} (${matchedEvent.category === "wedding" ? "Wedding" : "Corporate"} Event) ke decor aur packages ke baare mein enquiry karni hai. Kripya pricing aur details share karein.`;
      finalTooltip = `WhatsApp: ${matchedEvent.menuTitle} Enquiry`;
    } else if (pathname === "/services") {
      finalMessage = `Namaste ${brandName}! Mujhe aapki wedding aur corporate event services ke baare mein enquiry karni hai.`;
      finalTooltip = "WhatsApp: Services Enquiry";
    } else if (pathname === "/gallery") {
      finalMessage = `Namaste ${brandName}! Maine aapki real wedding & event gallery dekhi, mujhe quotation chahiye.`;
      finalTooltip = "WhatsApp: Photo Gallery Enquiry";
    } else if (pathname === "/contact") {
      finalMessage = `Namaste ${brandName}! Main event planning ke liye consult karna chahta hoon.`;
      finalTooltip = "WhatsApp: Instant Chat";
    } else {
      finalMessage = `Namaste ${brandName}! Mujhe wedding & event decor ke baare mein enquiry karni hai. Please pricing aur available packages share karein.`;
      finalTooltip = "WhatsApp Chat: Instant Enquiry";
    }
  }

  const whatsappUrl = getWhatsAppLink(finalMessage);

  return (
    <aside
      aria-label="Direct WhatsApp Consultation"
      className="fixed z-40 right-4 md:right-8 bottom-20 md:bottom-8 flex items-center group select-none"
    >
      {/* Tooltip / Label visible on desktop hover or mobile tap */}
      <div className="hidden md:flex items-center mr-3 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 text-emerald-950 text-xs font-semibold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
        <span suppressHydrationWarning>{finalTooltip || "WhatsApp Chat: Instant Enquiry"}</span>
      </div>

      {/* WhatsApp Button with official WhatsApp Green (#25D366) */}
      <a
        suppressHydrationWarning
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${brandName} on WhatsApp`}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: "#25D366",
          boxShadow: "0 8px 24px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* Pulsing ring animation in WhatsApp green */}
        <span
          className="absolute inset-0 rounded-full animate-ping pointer-events-none -z-10"
          style={{ backgroundColor: "rgba(37, 211, 102, 0.35)" }}
        />

        <WhatsAppIcon />
      </a>
    </aside>
  );
}
