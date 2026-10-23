"use client";

import { MapPin, ExternalLink, Navigation } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

interface LocationMapBoxProps {
  className?: string;
  variant?: "card" | "footer" | "banner";
  showAddressText?: boolean;
}

export default function LocationMapBox({
  className = "",
  variant = "card",
  showAddressText = true,
}: LocationMapBoxProps) {
  const { address, googleMapUrl, siteName } = useSettings();
  const mapUrl = googleMapUrl || "https://maps.google.com/?q=Rewa+Madhya+Pradesh";

  if (variant === "footer") {
    return (
      <div
        className={`relative block w-full max-w-[280px] h-[155px] rounded-2xl overflow-hidden border border-white/20 bg-stone-900 shadow-lg group ${className}`}
      >
        {/* Real Interactive Google Map iframe */}
        <iframe
          title="RIWAJ Events Location Map"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(address || "Rewa, Madhya Pradesh")}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          className="w-full h-full border-0 pointer-events-auto"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Top-Right Google Maps Tag */}
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in Google Maps"
          className="absolute top-2 right-2 z-10 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-black/85 text-amber-300 border border-amber-400/40 backdrop-blur-md flex items-center gap-1 shadow-sm hover:bg-amber-500 hover:text-black transition-colors"
        >
          <span>Maps</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>

        {/* Bottom Location Label */}
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Click to open directions on Google Maps"
          className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-center justify-between gap-1 group/bar hover:bg-black/95 transition-colors"
        >
          <div className="min-w-0">
            <p className="text-white text-[11px] font-bold truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
              <span className="truncate">Rewa, Madhya Pradesh</span>
            </p>
            <p className="text-white/60 text-[9px] truncate ml-4">Click to open directions</p>
          </div>
          <div className="w-6 h-6 rounded-lg bg-white/10 group-hover/bar:bg-amber-500 group-hover/bar:text-black flex items-center justify-center text-white/80 shrink-0 transition-colors">
            <Navigation className="w-3 h-3" />
          </div>
        </a>
      </div>
    );
  }

  // Default "card" variant (Real Google Map card for About / General usage)
  return (
    <div
      className={`group relative block w-full aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md hover:shadow-2xl hover:border-rose-400 transition-all duration-300 ${className}`}
    >
      {/* Real Interactive Google Map iframe */}
      <iframe
        title="RIWAJ Events Location Map"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(address || "Rewa, Madhya Pradesh")}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
        className="w-full h-full border-0 pointer-events-auto"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Top Left: Live Location Badge */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-gray-800 shadow-md border border-gray-200/80 backdrop-blur-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Office & Studio</span>
        </span>
      </div>

      {/* Top Right: "Open in Maps" Pill */}
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Open in Google Maps"
        className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-md flex items-center gap-1.5 hover:bg-rose-700 transition-colors"
      >
        <span>Google Maps</span>
        <ExternalLink className="w-3 h-3" />
      </a>

      {/* Bottom Info Bar */}
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-0 inset-x-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-gray-200/80 transition-colors hover:bg-white"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <h4 className="font-serif font-bold text-gray-900 text-sm truncate">
                {siteName || "RIWAJ Weddings & Events"}
              </h4>
            </div>
            {showAddressText && (
              <p className="text-gray-600 text-xs truncate">
                {address || "Rewa, Madhya Pradesh — 486001, India"}
              </p>
            )}
          </div>

          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-sm group-hover:shadow-md transition-all">
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Directions</span>
          </div>
        </div>
      </a>
    </div>
  );
}
