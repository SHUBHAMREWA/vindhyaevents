"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Sparkles,
  Phone,
  ArrowLeft,
  Calendar,
  Heart,
  MessageSquare,
  Flower2,
  Utensils,
  Camera,
  Compass,
} from "lucide-react";
import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSettings } from "@/context/SettingsContext";

export default function NotFound() {
  const { siteName, phone, telLink, getWhatsAppLink } = useSettings();
  const brandName = siteName || "RIWAJ Events";

  const popularPages = [
    {
      title: "Wedding Décor & Mandap",
      desc: "Royal palace themes, stage & floral setups",
      href: "/services",
      icon: Flower2,
    },
    {
      title: "Royal Catering",
      desc: "Shahi dawat, multi-cuisine banquets & live chaat",
      href: "/services",
      icon: Utensils,
    },
    {
      title: "Photo & Video Gallery",
      desc: "Real weddings, drone shots & bridal portraits",
      href: "/gallery",
      icon: Camera,
    },
    {
      title: "All Wedding Packages",
      desc: "Transparent packages from Roka to Vidai",
      href: "/services",
      icon: Calendar,
    },
  ];

  const waHelpUrl = getWhatsAppLink(
    `Namaste ${brandName}! Mujhe website par ek page dhoondhne me problem ho rahi hai, please assist karein.`
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/40 via-white to-rose-50/30 overflow-x-hidden">
      {/* ── Top Header ── */}
      <TopBanner />
      <Navbar />

      {/* ── 404 Main Section ── */}
      <main className="flex-1 flex flex-col items-center justify-center pt-28 sm:pt-36 md:pt-40 pb-16 md:pb-24 px-4 sm:px-6 relative">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-16 right-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl w-full text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-widest shadow-xs">
            <Compass className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: "8s" }} />
            <span>Page Not Found</span>
          </div>

          {/* Large Stylized 404 Heading */}
          <div className="relative select-none">
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 drop-shadow-sm">
              404
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-serif font-bold text-gray-800 mt-2">
              Aap jis page ko dhoondh rahe hain wo exist nahi karta ya shift ho gaya hai.
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. 
            Don&apos;t worry — we are here to help you plan your dream celebration.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-200 hover:shadow-xl transition-all duration-200 active:scale-95 group"
            >
              <Home className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-gray-200 hover:border-rose-300 text-gray-800 hover:text-rose-600 font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Explore Services</span>
            </Link>

            <a
              href={waHelpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Help</span>
            </a>
          </div>

          {/* Popular Destinations Quick Grid */}
          <div className="pt-10 border-t border-gray-200/80 mt-10">
            <h2 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">
              Popular Destinations to Explore:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              {popularPages.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className="p-3.5 rounded-2xl bg-white border border-gray-200/70 hover:border-rose-300 shadow-xs hover:shadow-md transition-all duration-200 group block"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="font-serif font-bold text-xs text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
