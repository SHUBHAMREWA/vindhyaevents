"use client";

import Link from "next/link";
import { WifiOff, Phone, CalendarHeart, RefreshCw } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function OfflinePage() {
  const { phone, telLink } = useSettings();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff1f2] via-white to-[#fff1f2] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-rose-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
          <WifiOff className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          You are currently offline
        </h1>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Don&apos;t worry! Your cached wedding plans, services, and previously viewed pages remain instantly accessible.
        </p>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-left mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-800">
            Emergency / Direct Contact
          </p>
          <a
            href={telLink}
            className="flex items-center gap-2 text-rose-700 font-bold text-sm hover:underline"
          >
            <Phone className="w-4 h-4" />
            <span suppressHydrationWarning>{phone}</span>
          </a>
          <p className="text-[11px] text-gray-500">
            Rewa, Madhya Pradesh • Available 24/7 for urgent event queries
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 text-white font-medium text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <CalendarHeart className="w-4 h-4" />
            Go to Home
          </Link>
          <button
            onClick={() => {
              if (typeof window !== "undefined") window.location.reload();
            }}
            className="py-3 px-5 rounded-full border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
