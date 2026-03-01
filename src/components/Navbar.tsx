"use client";

import { Menu, X, Home, Sparkles, Images, CalendarHeart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemePicker from "./ThemePicker";
import { useTheme } from "@/context/ThemeContext";
import "./cssFile/Navbar.css";

// Items that are full routes vs scroll-to-section on homepage
const ROUTE_ITEMS: Record<string, string> = {
  About:   "/about",
  Gallery: "/gallery",
  Blog:    "/blog",
};

export default function Navbar() {
  const menuItems = ["Home", "Services", "Gallery", "About", "Blog", "Contact"];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const pathname  = usePathname();
  const router    = useRouter();
  const isHome    = pathname === "/";

  // ── Universal nav handler ──────────────────────────────────
  // Route items  → router.push(route)  (works on mobile touch)
  // Section items → smooth scroll on home, anchor redirect elsewhere
  const handleNav = (item: string) => {
    setMobileMenuOpen(false);
    const route = ROUTE_ITEMS[item];
    if (route) {
      router.push(route);
      return;
    }
    // Section scroll
    const sectionId = item.toLowerCase();
    if (isHome) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/10 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Top Navbar — CSS slide-in (no Framer Motion) */}
      <nav
        className="navbar-slide fixed top-[39px] left-0 right-0 z-50 border-b shadow-sm bg-white"
        style={{ borderColor: theme.vars["--c-border"] }}
      >
        <div className="container mx-auto px-6 py-1">
          <div className="flex items-center justify-between">
            {/* Logo → always navigates to home */}
            <Link
              href="/"
              className="flex items-center gap-3 select-none"
            >
              <div>
                <span
                  style={{ fontFamily: "cursive", color: theme.vars["--c-primary"] }}
                  className="font-bold text-xl md:text-2xl tracking-wide block"
                >
                  Vindhya Events
                </span>
                <span
                  className="text-[10px] md:text-xs tracking-widest font-semibold block -mt-1 md:mt-0"
                  style={{ color: theme.vars["--c-primary-light"] }}
                >
                  Event Management
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => {
                const route = ROUTE_ITEMS[item];
                const isActive = pathname === route;
                const commonStyle = { color: isActive ? theme.vars["--c-primary"] : "" };
                const cls = "nav-link relative px-4 py-2 text-gray-700 transition-colors duration-200";
                const underline = <span className="nav-underline absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300" style={{ backgroundColor: theme.vars["--c-primary"] }} />;
                return route ? (
                  <Link key={item} href={route}
                    className={cls}
                    style={commonStyle}
                    onMouseEnter={e => (e.currentTarget.style.color = theme.vars["--c-primary"])}
                    onMouseLeave={e => (e.currentTarget.style.color = isActive ? theme.vars["--c-primary"] : "")}>
                    {item}{underline}
                  </Link>
                ) : (
                  <button key={item}
                    onClick={() => isHome ? scrollToSection(item) : (window.location.href = `/#${item.toLowerCase()}`)}
                    className={cls}
                    onMouseEnter={e => (e.currentTarget.style.color = theme.vars["--c-primary"])}
                    onMouseLeave={e => (e.currentTarget.style.color = "")}>
                    {item}{underline}
                  </button>
                );
              })}

              <div className="ml-2">
                <ThemePicker />
              </div>

              <button
                onClick={() => scrollToSection("consultation")}
                className="ml-3 px-6 py-2.5 text-white rounded-full transition-opacity duration-200 shadow-lg hover:opacity-90 transform hover:-translate-y-0.5 font-medium"
                style={{
                  background: `linear-gradient(to right, ${theme.vars["--c-primary"]}, ${theme.vars["--c-primary-dark"]})`,
                }}
              >
                Book Now
              </button>
            </div>

            <div className="md:hidden" />
          </div>

          {/* Mobile Dropdown — CSS transition, no Framer Motion */}
          <div
            className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: mobileMenuOpen ? "600px" : "0px" }}
          >
            <div
              className="mt-2 pb-2 border-t pt-2"
              style={{ borderColor: theme.vars["--c-border"] }}
            >
              {menuItems.map((item) => (
                <button
                  key={item}
                  className="block w-full text-left px-4 py-3 text-gray-700 transition-colors duration-200 rounded-lg mb-1 active:opacity-70"
                  onClick={() => handleNav(item)}
                  onTouchStart={(e) => {
                    e.currentTarget.style.backgroundColor = theme.vars["--c-bg-soft"];
                    e.currentTarget.style.color = theme.vars["--c-primary"];
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.color = "";
                  }}
                >
                  {item}
                </button>
              ))}

              <ThemePicker mobileInline />

              <button
                onClick={() => scrollToSection("consultation")}
                className="w-full mt-2 px-6 py-3 text-white transition-opacity duration-200 shadow-lg rounded-xl font-medium hover:opacity-90"
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-1">
        <div className="relative flex justify-between items-end px-4 h-16 w-full">
          {/* Home */}
          <button
            onClick={() => router.push("/")}
            className="flex flex-col items-center justify-center w-14 h-full pb-1 space-y-1 transition-colors duration-150 active:scale-95"
            style={{ color: pathname === "/" ? theme.vars["--c-primary"] : "#6b7280" }}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          {/* Services */}
          <button
            onClick={() => handleNav("Services")}
            className="flex flex-col items-center justify-center w-14 h-full pb-1 space-y-1 transition-colors duration-150 active:scale-95"
            style={{ color: "#6b7280" }}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-medium">Services</span>
          </button>

          {/* Center FAB */}
          <div className="relative -top-5 flex flex-col items-center w-16">
            <button
              onClick={() => handleNav("consultation")}
              className="w-12 h-12 text-white rounded-full shadow-lg border-4 border-white active:scale-90 transition-transform duration-150"
              style={{ background: `linear-gradient(to right, ${theme.vars["--c-primary"]}, ${theme.vars["--c-primary-dark"]})` }}
            >
              <CalendarHeart className="w-5 h-5 mx-auto" />
            </button>
            <span className="text-[10px] font-bold mt-1" style={{ color: theme.vars["--c-primary"] }}>
              Book
            </span>
          </div>

          {/* Gallery → /gallery route */}
          <button
            onClick={() => router.push("/gallery")}
            className="flex flex-col items-center justify-center w-14 h-full pb-1 space-y-1 transition-colors duration-150 active:scale-95"
            style={{ color: pathname === "/gallery" ? theme.vars["--c-primary"] : "#6b7280" }}
          >
            <Images className="w-5 h-5" />
            <span className="text-[10px] font-medium">Gallery</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col items-center justify-center w-14 h-full pb-1 space-y-1 transition-colors duration-150"
            style={{ color: mobileMenuOpen ? theme.vars["--c-primary"] : "" }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-[10px] font-medium text-gray-500">Menu</span>
          </button>
        </div>
      </div>
    </>
  );
}