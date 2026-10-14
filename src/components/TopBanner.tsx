"use client";

import { Phone, MapPin } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

// Inline WhatsApp SVG — no extra package
const WAIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L.057 23.492a.75.75 0 0 0 .904.964l5.805-1.524A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.962-1.358l-.355-.211-3.683.966.983-3.595-.232-.369A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

export default function TopBanner() {
  const { phone, telLink, getWhatsAppLink, siteName, taglineHindi, bannerText, showTopBanner, address } = useSettings();

  if (showTopBanner === false) {
    return null;
  }

  const shortCity = address?.includes("Rewa")
    ? "Rewa, MP"
    : address?.split(",")[0] || "Rewa, MP";

  const displayBannerText = bannerText?.trim() || `🎉 Welcome to ${siteName || "Vindhya Events"} — Weddings & Events`;

  return (
    <div
      suppressHydrationWarning
      className="fixed top-0 left-0 right-0 z-50 text-white h-[40px] flex items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(to right, var(--c-banner-from), var(--c-primary), var(--c-banner-to))",
      }}
    >
      <div className="container mx-auto px-4 md:px-6 h-full flex items-center">
        <div className="flex items-center justify-between w-full text-sm">

          {/* ── Desktop ──────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-4">
            <span suppressHydrationWarning className="flex items-center gap-2">
              <span suppressHydrationWarning className="font-medium">{displayBannerText}</span>
            </span>
            {taglineHindi && (
              <>
                <span className="opacity-40">|</span>
                <span suppressHydrationWarning className="text-xs">{taglineHindi}</span>
              </>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-5 text-xs">
            <a
              href={telLink}
              className="flex items-center gap-1.5 hover:text-amber-200 transition-colors font-medium"
            >
              <Phone className="w-3.5 h-3.5" />
              <span suppressHydrationWarning>{phone}</span>
            </a>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-green-300 transition-colors font-medium group"
            >
              <span className="text-[#25D366] group-hover:scale-110 transition-transform inline-flex">
                <WAIcon />
              </span>
              <span>WhatsApp</span>
            </a>
            <span className="flex items-center gap-1.5 opacity-80">
              <MapPin className="w-3.5 h-3.5" />
              <span suppressHydrationWarning>{shortCity}</span>
            </span>
          </div>

          {/* ── Mobile — Only Call Now and WhatsApp ─────────── */}
          <div className="lg:hidden flex items-center justify-center gap-3 w-full">
            <a
              href={telLink}
              className="flex-1 max-w-[170px] flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 active:bg-white/30 px-3.5 py-1 rounded-full transition-colors font-semibold text-xs shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Call Now</span>
            </a>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 max-w-[170px] flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#128C7E] text-white px-3.5 py-1 rounded-full transition-colors font-semibold text-xs shadow-sm"
            >
              <WAIcon />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}