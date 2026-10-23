"use client";

import {
  Menu,
  X,
  Home,
  Sparkles,
  Images,
  CalendarHeart,
  ChevronDown,
  ArrowRight,
  Briefcase,
  Heart,
  UtensilsCrossed,
  ChefHat,
  Flower2,
  Palette,
  Phone,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemePicker from "./ThemePicker";
import { useTheme } from "@/context/ThemeContext";
import {
  CATERING_EVENTS,
  DECORATION_EVENTS,
  WEDDING_EVENTS,
  CORPORATE_EVENTS,
} from "@/data/eventRoutes";
import "./cssFile/Navbar.css";

const cateringCol1 = CATERING_EVENTS.slice(0, 6);
const cateringCol2 = CATERING_EVENTS.slice(6);
const decorationCol1 = DECORATION_EVENTS.slice(0, 6);
const decorationCol2 = DECORATION_EVENTS.slice(6);
const weddingCol1 = WEDDING_EVENTS.slice(0, 6);
const weddingCol2 = WEDDING_EVENTS.slice(6);
const corporateCol1 = CORPORATE_EVENTS.slice(0, 5);
const corporateCol2 = CORPORATE_EVENTS.slice(5);

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMegaMenu, setOpenMegaMenu] = useState<"catering" | "decoration" | "wedding" | "corporate" | null>(null);
  const [mobileCateringOpen, setMobileCateringOpen] = useState(false);
  const [mobileDecorationOpen, setMobileDecorationOpen] = useState(false);
  const [mobileWeddingOpen, setMobileWeddingOpen] = useState(false);
  const [mobileCorporateOpen, setMobileCorporateOpen] = useState(false);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const desktopNavRef = useRef<HTMLDivElement | null>(null);

  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // Redirect legacy /#services or /#contact hash URLs to their dedicated routes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#services" || hash === "#service") {
        router.replace("/services");
      } else if (
        hash === "#contact" ||
        hash === "#consultation"
      ) {
        router.replace("/contact");
      } else if (hash === "#book") {
        router.replace("/book");
      } else if (hash === "#about") {
        router.replace("/about");
      } else if (hash === "#gallery") {
        router.replace("/gallery");
      } else if (hash === "#blog") {
        router.replace("/blog");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [router]);

  // Live date/year for mobile navbar
  const [dateStr, setDateStr] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    const initialTimer = setTimeout(() => setDateStr(fmt()), 0);

    const ms = new Date();
    ms.setHours(24, 0, 0, 0);
    const midnightTimer = setTimeout(() => setDateStr(fmt()), ms.getTime() - Date.now());

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(midnightTimer);
    };
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        desktopNavRef.current &&
        !desktopNavRef.current.contains(e.target as Node)
      ) {
        setOpenMegaMenu(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Dropdown hover helpers with safe debounce to prevent accidental disappearance
  const handleMouseEnterMenu = (type: "catering" | "decoration" | "wedding" | "corporate") => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOpenMegaMenu(type);
  };

  const handleMouseLeaveMenu = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenMegaMenu(null);
    }, 320);
  };

  const handleToggleMenu = (type: "catering" | "decoration" | "wedding" | "corporate") => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOpenMegaMenu((prev) => (prev === type ? null : type));
  };

  return (
    <>
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Top Navbar */}
      <nav
        suppressHydrationWarning
        className="navbar-slide fixed top-[39px] left-0 right-0 z-50 border-b shadow-sm bg-white"
        style={{ borderColor: theme.vars["--c-border"] }}
      >
        <div className="container mx-auto px-4 lg:px-6 py-1">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 select-none shrink-0 group py-0.5">
              <div className="relative w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] lg:w-[52px] lg:h-[52px] rounded-full overflow-hidden border-2 border-amber-400/70 shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-200 bg-amber-950/20">
                <Image
                  src="/riwaj-logo.jpg"
                  alt="RIWAJ Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="relative h-9 sm:h-10 lg:h-12 w-28 sm:w-32 lg:w-40 group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src="/riwaj-text-logo.png"
                    alt="RIWAJ"
                    fill
                    priority
                    className="object-contain object-left"
                  />
                </div>
                <span
                  className="text-[9px] sm:text-[10px] lg:text-[11px] tracking-widest font-semibold uppercase block -mt-1 sm:-mt-0.5"
                  style={{ color: theme.vars["--c-primary-light"] }}
                >
                  Weddings & Celebrations
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div ref={desktopNavRef} className="hidden md:flex items-center gap-1 xl:gap-2">
              {/* Catering ▾ Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnterMenu("catering")}
                onMouseLeave={handleMouseLeaveMenu}
              >
                <button
                  type="button"
                  onClick={() => handleToggleMenu("catering")}
                  className={`nav-menu-item flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-gray-800 hover:text-emerald-700 hover:bg-emerald-50/70 transition-all ${
                    openMegaMenu === "catering" || pathname.includes("-catering") || pathname.includes("buffet-live-counters") || pathname.includes("regional-cuisines")
                      ? "text-emerald-700 bg-emerald-50/80 font-bold"
                      : ""
                  }`}
                  style={
                    openMegaMenu === "catering"
                      ? { color: theme.vars["--c-primary"] }
                      : {}
                  }
                >
                  <span>Catering</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMegaMenu === "catering" ? "rotate-180 text-emerald-600" : "text-gray-400"
                    }`}
                  />
                </button>

                {/* Catering Mega Menu Dropdown */}
                {openMegaMenu === "catering" && (
                  <div
                    className="absolute top-full z-50 pt-2 animate-in fade-in duration-200 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-4"
                    style={{
                      width: "920px",
                      maxWidth: "calc(100vw - 32px)",
                      left: "0",
                    }}
                    onMouseEnter={() => handleMouseEnterMenu("catering")}
                    onMouseLeave={handleMouseLeaveMenu}
                  >
                    <div
                      className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 text-xs"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.05fr 1.05fr 1.25fr",
                        gap: "24px",
                      }}
                    >
                      {/* Column 1: CATERING SERVICES */}
                      <div>
                        <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-emerald-100">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <UtensilsCrossed className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-[11px] tracking-wider uppercase block">
                              Catering Services
                            </span>
                            <span className="text-[10px] text-gray-400 font-normal">स्वादिष्ट कैटरिंग सेवाएं</span>
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {cateringCol1.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/${item.slug}`}
                                onClick={() => setOpenMegaMenu(null)}
                                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/70 font-semibold text-xs transition-all group"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 group-hover:bg-emerald-600 transition-all shrink-0" />
                                  <span>{item.menuTitle}</span>
                                </span>
                                <ArrowRight className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 2: FOOD & PACKAGES */}
                      <div>
                        <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-amber-100">
                          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <ChefHat className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-[11px] tracking-wider uppercase block">
                              Food & Packages
                            </span>
                            <span className="text-[10px] text-gray-400 font-normal">लाइव काउंटर्स व पैकेज</span>
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {cateringCol2.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/${item.slug}`}
                                onClick={() => setOpenMegaMenu(null)}
                                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-gray-700 hover:text-amber-700 hover:bg-amber-50/70 font-semibold text-xs transition-all group"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 group-hover:bg-amber-600 transition-all shrink-0" />
                                  <span>{item.menuTitle}</span>
                                </span>
                                <ArrowRight className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 3: Featured Catering Preview */}
                      <div className="bg-gradient-to-br from-emerald-50/60 via-amber-50/40 to-white p-4 rounded-2xl border border-emerald-100/90 flex flex-col justify-between shadow-xs">
                        <div>
                          <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-200/80">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
                                <UtensilsCrossed className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="font-bold text-gray-900 text-[11px] tracking-wider uppercase block">
                                  Royal Catering
                                </span>
                                <span className="text-[10px] text-gray-500">शाही दावत व लज़ीज़ स्वाद</span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                              50+ Menus
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                            {/* Card 1 */}
                            <Link
                              href="/wedding-catering"
                              onClick={() => setOpenMegaMenu(null)}
                              className="group block rounded-xl overflow-hidden shadow-sm border border-white hover:shadow-md transition-all"
                            >
                              <div className="relative h-24 w-full">
                                <SafeImage
                                  src="https://images.unsplash.com/photo-1732259495388-af40b972c311?auto=format&fit=crop&w=400&q=80"
                                  alt="Grand Indian Wedding Feast"
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                                <div className="absolute bottom-1.5 left-2 right-2 text-white">
                                  <p className="text-[10px] font-bold drop-shadow leading-tight truncate">
                                    Grand Wedding Feast
                                  </p>
                                  <p className="text-[8px] text-white/80">Multi-Cuisine Spread</p>
                                </div>
                              </div>
                            </Link>

                            {/* Card 2 */}
                            <Link
                              href="/buffet-live-counters"
                              onClick={() => setOpenMegaMenu(null)}
                              className="group block rounded-xl overflow-hidden shadow-sm border border-white hover:shadow-md transition-all"
                            >
                              <div className="relative h-24 w-full">
                                <SafeImage
                                  src="https://images.unsplash.com/photo-1732519970445-8f2d6998961f?auto=format&fit=crop&w=400&q=80"
                                  alt="Live Chaat & Tandoori Counters"
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                                <div className="absolute bottom-1.5 left-2 right-2 text-white">
                                  <p className="text-[10px] font-bold drop-shadow leading-tight truncate">
                                    Live Chaat & Tandoor
                                  </p>
                                  <p className="text-[8px] text-white/80">Interactive Chef Stalls</p>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>

                        <Link
                          href="/contact"
                          onClick={() => setOpenMegaMenu(null)}
                          className="mt-3.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all group"
                        >
                          <span>Catering Menu & Pricing Dekhein</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Decoration ▾ Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnterMenu("decoration")}
                onMouseLeave={handleMouseLeaveMenu}
              >
                <button
                  type="button"
                  onClick={() => handleToggleMenu("decoration")}
                  className={`nav-menu-item flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-gray-800 hover:text-rose-600 hover:bg-rose-50/70 transition-all ${
                    openMegaMenu === "decoration" || pathname.includes("-decor") || pathname.includes("-decoration") || pathname.includes("stage-backdrop")
                      ? "text-rose-600 bg-rose-50/80 font-bold"
                      : ""
                  }`}
                  style={
                    openMegaMenu === "decoration"
                      ? { color: theme.vars["--c-primary"] }
                      : {}
                  }
                >
                  <span>Decoration</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMegaMenu === "decoration" ? "rotate-180 text-rose-500" : "text-gray-400"
                    }`}
                  />
                </button>

                {/* Decoration Mega Menu Dropdown */}
                {openMegaMenu === "decoration" && (
                  <div
                    className="absolute top-full z-50 pt-2 animate-in fade-in duration-200 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-4"
                    style={{
                      width: "920px",
                      maxWidth: "calc(100vw - 32px)",
                      left: "-100px",
                    }}
                    onMouseEnter={() => handleMouseEnterMenu("decoration")}
                    onMouseLeave={handleMouseLeaveMenu}
                  >
                    <div
                      className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 text-xs"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.05fr 1.05fr 1.25fr",
                        gap: "24px",
                      }}
                    >
                      {/* Column 1: DECORATION TYPES */}
                      <div>
                        <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-rose-100">
                          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                            <Flower2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-[11px] tracking-wider uppercase block">
                              Decoration Types
                            </span>
                            <span className="text-[10px] text-gray-400 font-normal">भव्य स्टेज व मंडप सज्जा</span>
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {decorationCol1.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/${item.slug}`}
                                onClick={() => setOpenMegaMenu(null)}
                                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-gray-700 hover:text-rose-600 hover:bg-rose-50/70 font-semibold text-xs transition-all group"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 group-hover:scale-125 group-hover:bg-rose-600 transition-all shrink-0" />
                                  <span>{item.menuTitle}</span>
                                </span>
                                <ArrowRight className="w-3 h-3 text-rose-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 2: THEMES & STYLING */}
                      <div>
                        <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-purple-100">
                          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-[11px] tracking-wider uppercase block">
                              Themes & Styling
                            </span>
                            <span className="text-[10px] text-gray-400 font-normal">रॉयल थीम्स व फ्लोरल आर्ट</span>
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {decorationCol2.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/${item.slug}`}
                                onClick={() => setOpenMegaMenu(null)}
                                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50/70 font-semibold text-xs transition-all group"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:scale-125 group-hover:bg-purple-600 transition-all shrink-0" />
                                  <span>{item.menuTitle}</span>
                                </span>
                                <ArrowRight className="w-3 h-3 text-purple-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 3: Featured Decoration Preview */}
                      <div className="bg-gradient-to-br from-rose-50/60 via-purple-50/30 to-white p-4 rounded-2xl border border-rose-100/90 flex flex-col justify-between shadow-xs">
                        <div>
                          <div className="flex items-center justify-between pb-2 mb-3 border-b border-rose-200/80">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
                                <Palette className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="font-bold text-gray-900 text-[11px] tracking-wider uppercase block">
                                  Theme Setups
                                </span>
                                <span className="text-[10px] text-gray-500">रीवा व MP के भव्य मंडप</span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                              Artistic 3D
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                            {/* Card 1 */}
                            <Link
                              href="/mandap-decoration"
                              onClick={() => setOpenMegaMenu(null)}
                              className="group block rounded-xl overflow-hidden shadow-sm border border-white hover:shadow-md transition-all"
                            >
                              <div className="relative h-24 w-full">
                                <SafeImage
                                  src="https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=400&q=80"
                                  alt="Royal Indian Mandap Decor"
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                                <div className="absolute bottom-1.5 left-2 right-2 text-white">
                                  <p className="text-[10px] font-bold drop-shadow leading-tight truncate">
                                    Royal Mandap
                                  </p>
                                  <p className="text-[8px] text-white/80">Heritage Palace Style</p>
                                </div>
                              </div>
                            </Link>

                            {/* Card 2 */}
                            <Link
                              href="/stage-decoration"
                              onClick={() => setOpenMegaMenu(null)}
                              className="group block rounded-xl overflow-hidden shadow-sm border border-white hover:shadow-md transition-all"
                            >
                              <div className="relative h-24 w-full">
                                <SafeImage
                                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80"
                                  alt="Floral Stage Decor"
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                                <div className="absolute bottom-1.5 left-2 right-2 text-white">
                                  <p className="text-[10px] font-bold drop-shadow leading-tight truncate">
                                    Floral Stage
                                  </p>
                                  <p className="text-[8px] text-white/80">Fresh Bloom Canopy</p>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>

                        <Link
                          href="/gallery"
                          onClick={() => setOpenMegaMenu(null)}
                          className="mt-3.5 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all group"
                        >
                          <span>Sabhi Decor Setups Gallery Me Dekhein</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wedding ▾ Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnterMenu("wedding")}
                onMouseLeave={handleMouseLeaveMenu}
              >
                <button
                  type="button"
                  onClick={() => handleToggleMenu("wedding")}
                  className={`nav-menu-item flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-gray-800 hover:text-rose-600 hover:bg-rose-50/60 transition-all ${
                    openMegaMenu === "wedding" || pathname.includes("-wedding") || pathname.includes("-ceremony") || pathname.includes("-function") || pathname.includes("-party")
                      ? "text-rose-600 bg-rose-50/70"
                      : ""
                  }`}
                  style={
                    openMegaMenu === "wedding"
                      ? { color: theme.vars["--c-primary"] }
                      : {}
                  }
                >
                  <span>Wedding</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMegaMenu === "wedding" ? "rotate-180 text-rose-500" : "text-gray-400"
                    }`}
                  />
                </button>

                {/* Wedding Mega Menu Dropdown */}
                {openMegaMenu === "wedding" && (
                  <div
                    className="absolute top-full z-50 pt-2 animate-in fade-in duration-200 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-4"
                    style={{
                      width: "920px",
                      maxWidth: "calc(100vw - 32px)",
                      left: "-260px",
                    }}
                    onMouseEnter={() => handleMouseEnterMenu("wedding")}
                    onMouseLeave={handleMouseLeaveMenu}
                  >
                    <div
                      className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 text-xs"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.05fr 1.05fr 1.25fr",
                        gap: "24px",
                      }}
                    >
                      {/* Column 1: Ceremonies & Rituals */}
                      <div>
                        <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-rose-100">
                          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                            <Heart className="w-3.5 h-3.5 fill-current" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-[11px] tracking-wider uppercase block">
                              Ceremonies & Rituals
                            </span>
                            <span className="text-[10px] text-gray-400 font-normal">शुभ लग्न व रिति-रिवाज</span>
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {weddingCol1.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/${item.slug}`}
                                onClick={() => setOpenMegaMenu(null)}
                                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-gray-700 hover:text-rose-600 hover:bg-rose-50/70 font-semibold text-xs transition-all group"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-300 group-hover:scale-125 group-hover:bg-rose-600 transition-all shrink-0" />
                                  <span>{item.menuTitle}</span>
                                </span>
                                <ArrowRight className="w-3 h-3 text-rose-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 2: Luxury & Planning Packages */}
                      <div>
                        <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-rose-100">
                          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-[11px] tracking-wider uppercase block">
                              Luxury & Packages
                            </span>
                            <span className="text-[10px] text-gray-400 font-normal">कम्पलीट शाही शादी</span>
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {weddingCol2.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/${item.slug}`}
                                onClick={() => setOpenMegaMenu(null)}
                                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-gray-700 hover:text-rose-600 hover:bg-rose-50/70 font-semibold text-xs transition-all group"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 group-hover:bg-rose-600 transition-all shrink-0" />
                                  <span>{item.menuTitle}</span>
                                </span>
                                <ArrowRight className="w-3 h-3 text-rose-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 3: Featured Real Weddings */}
                      <div className="bg-gradient-to-br from-rose-50/60 via-amber-50/30 to-white p-4 rounded-2xl border border-rose-100/90 flex flex-col justify-between shadow-xs">
                        <div>
                          <div className="flex items-center justify-between pb-2 mb-3 border-b border-rose-200/80">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                                <Heart className="w-3.5 h-3.5 fill-current" />
                              </div>
                              <div>
                                <span className="font-bold text-gray-900 text-[11px] tracking-wider uppercase block">
                                  Real Weddings
                                </span>
                                <span className="text-[10px] text-gray-500">रीवा व MP के आयोजन</span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                              500+ Done
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                            {/* Card 1 */}
                            <Link
                              href="/gallery"
                              onClick={() => setOpenMegaMenu(null)}
                              className="group block rounded-xl overflow-hidden shadow-sm border border-white hover:shadow-md transition-all"
                            >
                              <div className="relative h-24 w-full">
                                <SafeImage
                                  src="https://images.unsplash.com/photo-1682802142549-b72576d31d5e?auto=format&fit=crop&w=400&q=80"
                                  alt="Indian Wedding Varmala"
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                                <div className="absolute bottom-1.5 left-2 right-2 text-white">
                                  <p className="text-[10px] font-bold drop-shadow leading-tight truncate">
                                    Dr Shubham & Navnik
                                  </p>
                                  <p className="text-[8px] text-white/80">Rewa Royal Palace</p>
                                </div>
                              </div>
                            </Link>

                            {/* Card 2 */}
                            <Link
                              href="/gallery"
                              onClick={() => setOpenMegaMenu(null)}
                              className="group block rounded-xl overflow-hidden shadow-sm border border-white hover:shadow-md transition-all"
                            >
                              <div className="relative h-24 w-full">
                                <SafeImage
                                  src="https://images.unsplash.com/photo-1754782921197-ba8514594184?auto=format&fit=crop&w=400&q=80"
                                  alt="Indian Wedding Couple"
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                                <div className="absolute bottom-1.5 left-2 right-2 text-white">
                                  <p className="text-[10px] font-bold drop-shadow leading-tight truncate">
                                    Prerna & Aditya
                                  </p>
                                  <p className="text-[8px] text-white/80">Jabalpur Lawn</p>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>

                        <Link
                          href="/gallery"
                          onClick={() => setOpenMegaMenu(null)}
                          className="mt-3.5 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all group"
                        >
                          <span>Sabhi Photos Gallery Me Dekhein</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Corporate Event ▾ Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnterMenu("corporate")}
                onMouseLeave={handleMouseLeaveMenu}
              >
                <button
                  type="button"
                  onClick={() => handleToggleMenu("corporate")}
                  className={`nav-menu-item flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-xl text-gray-800 hover:text-rose-600 hover:bg-rose-50/60 transition-all ${
                    openMegaMenu === "corporate" || pathname.includes("-hall") || pathname.includes("-events") || pathname.includes("-meet")
                      ? "text-rose-600 bg-rose-50/70"
                      : ""
                  }`}
                  style={
                    openMegaMenu === "corporate"
                      ? { color: theme.vars["--c-primary"] }
                      : {}
                  }
                >
                  <span>Corporate Event</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openMegaMenu === "corporate" ? "rotate-180 text-rose-500" : "text-gray-400"
                    }`}
                  />
                </button>

                {/* Corporate Mega Menu Dropdown */}
                {openMegaMenu === "corporate" && (
                  <div
                    className="absolute top-full z-50 pt-2 animate-in fade-in duration-200 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-4"
                    style={{
                      width: "920px",
                      maxWidth: "calc(100vw - 32px)",
                      left: "-380px",
                    }}
                    onMouseEnter={() => handleMouseEnterMenu("corporate")}
                    onMouseLeave={handleMouseLeaveMenu}
                  >
                    <div
                      className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 text-xs"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.05fr 1.05fr 1.25fr",
                        gap: "24px",
                      }}
                    >
                      {/* Column 1: Conferences & Meets */}
                      <div>
                        <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-blue-100">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Briefcase className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-[11px] tracking-wider uppercase block">
                              Conferences & Meets
                            </span>
                            <span className="text-[10px] text-gray-400 font-normal">मीटिंग्स व एनुअल इवेंट्स</span>
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {corporateCol1.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/${item.slug}`}
                                onClick={() => setOpenMegaMenu(null)}
                                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50/70 font-semibold text-xs transition-all group"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:scale-125 group-hover:bg-blue-600 transition-all shrink-0" />
                                  <span>{item.menuTitle}</span>
                                </span>
                                <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 2: Venue & Hall Setups */}
                      <div>
                        <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-rose-100">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-[11px] tracking-wider uppercase block">
                              Venues & Halls
                            </span>
                            <span className="text-[10px] text-gray-400 font-normal">बैंक्वेट व पार्टी हॉल</span>
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {corporateCol2.map((item) => (
                            <li key={item.slug}>
                              <Link
                                href={`/${item.slug}`}
                                onClick={() => setOpenMegaMenu(null)}
                                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-gray-700 hover:text-rose-600 hover:bg-rose-50/70 font-semibold text-xs transition-all group"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 group-hover:bg-rose-600 transition-all shrink-0" />
                                  <span>{item.menuTitle}</span>
                                </span>
                                <ArrowRight className="w-3 h-3 text-rose-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 3: Recent Corporate Summits */}
                      <div className="bg-gradient-to-br from-blue-50/60 via-slate-50/50 to-white p-4 rounded-2xl border border-blue-100/90 flex flex-col justify-between shadow-xs">
                        <div>
                          <div className="flex items-center justify-between pb-2 mb-3 border-b border-blue-200/80">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                                <Briefcase className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="font-bold text-gray-900 text-[11px] tracking-wider uppercase block">
                                  Corporate Summits
                                </span>
                                <span className="text-[10px] text-gray-500">हालिया सेमिनार व बैठक</span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                              Verified
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                            {/* Card 1 */}
                            <Link
                              href="/gallery"
                              onClick={() => setOpenMegaMenu(null)}
                              className="group block rounded-xl overflow-hidden shadow-sm border border-white hover:shadow-md transition-all"
                            >
                              <div className="relative h-24 w-full">
                                <SafeImage
                                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80"
                                  alt="Corporate Seminar Summit"
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                                <div className="absolute bottom-1.5 left-2 right-2 text-white">
                                  <p className="text-[10px] font-bold drop-shadow leading-tight truncate">
                                    Corbett Elite Summit
                                  </p>
                                  <p className="text-[8px] text-white/80">Rewa Convention</p>
                                </div>
                              </div>
                            </Link>

                            {/* Card 2 */}
                            <Link
                              href="/gallery"
                              onClick={() => setOpenMegaMenu(null)}
                              className="group block rounded-xl overflow-hidden shadow-sm border border-white hover:shadow-md transition-all"
                            >
                              <div className="relative h-24 w-full">
                                <SafeImage
                                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80"
                                  alt="Corporate Gala & Convention"
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                                <div className="absolute bottom-1.5 left-2 right-2 text-white">
                                  <p className="text-[10px] font-bold drop-shadow leading-tight truncate">
                                    Annual Gala
                                  </p>
                                  <p className="text-[8px] text-white/80">Rewa Club</p>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>

                        <Link
                          href="/gallery"
                          onClick={() => setOpenMegaMenu(null)}
                          className="mt-3.5 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all group"
                        >
                          <span>Sabhi Corporate Events Dekhein</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Services */}
              <Link
                href="/services"
                className={`nav-menu-item relative px-2.5 lg:px-3 py-1.5 rounded-xl text-gray-800 hover:text-rose-600 hover:bg-rose-50/60 transition-all ${
                  pathname === "/services" ? "text-rose-600 bg-rose-50/70" : ""
                }`}
                style={pathname === "/services" ? { color: theme.vars["--c-primary"] } : {}}
              >
                <span>Services</span>
              </Link>

              {/* Gallery */}
              <Link
                href="/gallery"
                className={`nav-menu-item relative px-2.5 lg:px-3 py-1.5 rounded-xl text-gray-800 hover:text-rose-600 hover:bg-rose-50/60 transition-all ${
                  pathname === "/gallery" ? "text-rose-600 bg-rose-50/70" : ""
                }`}
                style={pathname === "/gallery" ? { color: theme.vars["--c-primary"] } : {}}
              >
                <span>Gallery</span>
              </Link>

              {/* Blog */}
              <Link
                href="/blog"
                className={`nav-menu-item relative px-2.5 lg:px-3 py-1.5 rounded-xl text-gray-800 hover:text-rose-600 hover:bg-rose-50/60 transition-all ${
                  pathname === "/blog" ? "text-rose-600 bg-rose-50/70" : ""
                }`}
                style={pathname === "/blog" ? { color: theme.vars["--c-primary"] } : {}}
              >
                <span>Blog</span>
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className={`nav-menu-item relative px-2.5 lg:px-3 py-1.5 rounded-xl text-gray-800 hover:text-rose-600 hover:bg-rose-50/60 transition-all ${
                  pathname === "/contact" ? "text-rose-600 bg-rose-50/70" : ""
                }`}
                style={pathname === "/contact" ? { color: theme.vars["--c-primary"] } : {}}
              >
                <span>Contact</span>
              </Link>

              {/* Theme Picker */}
              <div className="ml-1">
                <ThemePicker />
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => router.push("/book")}
                className="ml-2 px-5 lg:px-6 py-2.5 text-white rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 font-bold text-sm lg:text-[15px] whitespace-nowrap cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${theme.vars["--c-primary"]}, ${theme.vars["--c-primary-dark"]})`,
                }}
              >
                Book Now
              </button>
            </div>

            {/* Mobile Right Bar */}
            <div className="md:hidden flex items-center gap-2">
              <div className="flex flex-col items-end leading-none">
                <span
                  className="text-[9px] font-semibold tracking-widest uppercase"
                  style={{ color: theme.vars["--c-primary-light"] }}
                >
                  Today
                </span>
                <span
                  suppressHydrationWarning
                  className="text-[10px] font-bold"
                  style={{ color: theme.vars["--c-footer-from"] }}
                >
                  {dateStr}
                </span>
              </div>

              {/* Mobile Menu Toggle Button (Shifted from Footer Nav) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                className="w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200 active:scale-95 shadow-sm"
                style={{
                  borderColor: mobileMenuOpen ? theme.vars["--c-primary"] : "#e5e7eb",
                  backgroundColor: mobileMenuOpen ? `${theme.vars["--c-primary"]}15` : "#ffffff",
                  color: mobileMenuOpen ? theme.vars["--c-primary"] : theme.vars["--c-footer-from"] || "#374151",
                }}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 transition-transform duration-200" />
                ) : (
                  <Menu className="w-5 h-5 transition-transform duration-200" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Navigation (Expandable Accordions) */}
          <div
            className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: mobileMenuOpen ? "80vh" : "0px" }}
          >
            <div
              className="mt-2 pb-6 border-t pt-2 space-y-1 overflow-y-auto max-h-[75vh]"
              style={{ borderColor: theme.vars["--c-border"] }}
            >
              {/* Mobile Catering Accordion */}
              <div className="border-b border-gray-100 py-1">
                <button
                  type="button"
                  onClick={() => setMobileCateringOpen(!mobileCateringOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-800 font-bold text-sm rounded-xl hover:bg-emerald-50"
                >
                  <span className="flex items-center gap-2 text-emerald-700">
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Catering Services ({CATERING_EVENTS.length})</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileCateringOpen ? "rotate-180 text-emerald-600" : "text-gray-400"
                    }`}
                  />
                </button>
                {mobileCateringOpen && (
                  <div className="px-3 py-2 grid grid-cols-2 gap-2 bg-emerald-50/40 rounded-xl m-1">
                    {CATERING_EVENTS.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${item.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2.5 text-xs font-semibold text-gray-700 bg-white rounded-lg shadow-sm hover:text-emerald-700 truncate"
                      >
                        {item.menuTitle}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Decoration Accordion */}
              <div className="border-b border-gray-100 py-1">
                <button
                  type="button"
                  onClick={() => setMobileDecorationOpen(!mobileDecorationOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-800 font-bold text-sm rounded-xl hover:bg-rose-50"
                >
                  <span className="flex items-center gap-2 text-rose-600">
                    <Flower2 className="w-4 h-4" />
                    <span>Decoration & Themes ({DECORATION_EVENTS.length})</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileDecorationOpen ? "rotate-180 text-rose-500" : "text-gray-400"
                    }`}
                  />
                </button>
                {mobileDecorationOpen && (
                  <div className="px-3 py-2 grid grid-cols-2 gap-2 bg-rose-50/40 rounded-xl m-1">
                    {DECORATION_EVENTS.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${item.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2.5 text-xs font-semibold text-gray-700 bg-white rounded-lg shadow-sm hover:text-rose-600 truncate"
                      >
                        {item.menuTitle}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Wedding Accordion */}
              <div className="border-y border-gray-100 py-1">
                <button
                  type="button"
                  onClick={() => setMobileWeddingOpen(!mobileWeddingOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-800 font-bold text-sm rounded-xl hover:bg-rose-50"
                >
                  <span className="flex items-center gap-2 text-rose-600">
                    <Heart className="w-4 h-4 fill-current" />
                    <span>Wedding Services ({WEDDING_EVENTS.length})</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileWeddingOpen ? "rotate-180 text-rose-500" : "text-gray-400"
                    }`}
                  />
                </button>
                {mobileWeddingOpen && (
                  <div className="px-3 py-2 grid grid-cols-2 gap-2 bg-rose-50/40 rounded-xl m-1">
                    {WEDDING_EVENTS.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${item.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2.5 text-xs font-semibold text-gray-700 bg-white rounded-lg shadow-sm hover:text-rose-600 truncate"
                      >
                        {item.menuTitle}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Corporate Accordion */}
              <div className="border-b border-gray-100 py-1">
                <button
                  type="button"
                  onClick={() => setMobileCorporateOpen(!mobileCorporateOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-800 font-bold text-sm rounded-xl hover:bg-rose-50"
                >
                  <span className="flex items-center gap-2 text-amber-700">
                    <Briefcase className="w-4 h-4" />
                    <span>Corporate Events ({CORPORATE_EVENTS.length})</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileCorporateOpen ? "rotate-180 text-amber-600" : "text-gray-400"
                    }`}
                  />
                </button>
                {mobileCorporateOpen && (
                  <div className="px-3 py-2 grid grid-cols-2 gap-2 bg-amber-50/40 rounded-xl m-1">
                    {CORPORATE_EVENTS.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${item.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2.5 text-xs font-semibold text-gray-700 bg-white rounded-lg shadow-sm hover:text-amber-700 truncate"
                      >
                        {item.menuTitle}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-800 font-bold text-sm rounded-xl hover:bg-rose-50"
              >
                Services
              </Link>
              <Link
                href="/gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-800 font-bold text-sm rounded-xl hover:bg-rose-50"
              >
                Gallery
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-800 font-bold text-sm rounded-xl hover:bg-rose-50"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-800 font-bold text-sm rounded-xl hover:bg-rose-50"
              >
                Contact
              </Link>



              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/contact");
                }}
                className="w-full mt-3 px-6 py-3.5 text-white transition-opacity duration-200 shadow-lg rounded-xl font-bold text-sm hover:opacity-90 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${theme.vars["--c-primary"]}, ${theme.vars["--c-primary-dark"]})`,
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-1">
        <div className="relative flex justify-between items-end px-4 h-16 w-full">
          {/* Home */}
          <button
            onClick={() => router.push("/")}
            className="flex flex-col items-center justify-center w-14 h-full pb-1 space-y-1 transition-colors duration-150 active:scale-95 cursor-pointer"
            style={{ color: pathname === "/" ? theme.vars["--c-primary"] : "#6b7280" }}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          {/* Services */}
          <button
            onClick={() => router.push("/services")}
            className="flex flex-col items-center justify-center w-14 h-full pb-1 space-y-1 transition-colors duration-150 active:scale-95 cursor-pointer"
            style={{ color: pathname === "/services" ? theme.vars["--c-primary"] : "#6b7280" }}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-medium">Services</span>
          </button>

          {/* Center FAB */}
          <div className="relative -top-5 flex flex-col items-center w-16">
            <button
              onClick={() => router.push("/book")}
              className={`w-12 h-12 text-white rounded-full shadow-lg border-4 border-white active:scale-90 transition-all duration-150 cursor-pointer ${
                pathname === "/book" ? "ring-2 ring-rose-500 scale-105" : ""
              }`}
              style={{
                background: `linear-gradient(to right, ${theme.vars["--c-primary"]}, ${theme.vars["--c-primary-dark"]})`,
              }}
            >
              <CalendarHeart className="w-5 h-5 mx-auto" />
            </button>
            <span className="text-[10px] font-bold mt-1" style={{ color: theme.vars["--c-primary"] }}>
              Book
            </span>
          </div>

          {/* Gallery */}
          <button
            onClick={() => router.push("/gallery")}
            className="flex flex-col items-center justify-center w-14 h-full pb-1 space-y-1 transition-colors duration-150 active:scale-95 cursor-pointer"
            style={{ color: pathname === "/gallery" ? theme.vars["--c-primary"] : "#6b7280" }}
          >
            <Images className="w-5 h-5" />
            <span className="text-[10px] font-medium">Gallery</span>
          </button>

          {/* Contact */}
          <button
            onClick={() => router.push("/contact")}
            className="flex flex-col items-center justify-center w-14 h-full pb-1 space-y-1 transition-colors duration-150 active:scale-95 cursor-pointer"
            style={{ color: pathname === "/contact" ? theme.vars["--c-primary"] : "#6b7280" }}
          >
            <Phone className="w-5 h-5" />
            <span className="text-[10px] font-medium">Contact</span>
          </button>
        </div>
      </div>
    </>
  );
}