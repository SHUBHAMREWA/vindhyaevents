"use client";

import { motion, AnimatePresence } from "motion/react";
import { Heart, Menu, X, Home, Sparkles, Images, CalendarHeart } from "lucide-react";
import { useState } from "react";
import ThemePicker from "./ThemePicker";
import { useTheme } from "@/context/ThemeContext";
import "./cssFile/Navbar.css";

export default function Navbar() {
  const menuItems = ["Home", "Services", "Gallery", "About", "Blog", "Contact"];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  const scrollToSection = (item: string) => {
    const sectionId = item.toLowerCase();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const TopScroll = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-[39px] left-0 right-0 z-50 border-b shadow-sm bg-white"
        style={{ borderColor: theme.vars["--c-border"] }}
      >
        <div className="container mx-auto px-6 py-1">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={TopScroll}
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
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="relative px-4 py-2 text-gray-700 transition-all duration-300 group hover:opacity-80"
                  style={{ ["--hover-color" as string]: theme.vars["--c-primary"] }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = theme.vars["--c-primary"])}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                >
                  {item}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: theme.vars["--c-primary"] }}
                  />
                </button>
              ))}

              {/* Theme Picker */}
              <div className="ml-2">
                <ThemePicker />
              </div>

              {/* Book Now CTA */}
              <button
                onClick={() => scrollToSection("consultation")}
                className="ml-3 px-6 py-2.5 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                style={{
                  background: `linear-gradient(to right, ${theme.vars["--c-primary"]}, ${theme.vars["--c-primary-dark"]})`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Book Now
              </button>
            </div>

            {/* Hidden Mobile div placeholder */}
            <div className="md:hidden" />
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden mt-2 pb-2 border-t pt-2"
                style={{ borderColor: theme.vars["--c-border"] }}
              >
                {menuItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="block w-full text-left px-4 py-3 text-gray-700 transition-all duration-200 rounded-lg mb-1 hover:opacity-80"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.vars["--c-bg-soft"];
                      e.currentTarget.style.color = theme.vars["--c-primary"];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                      e.currentTarget.style.color = "";
                    }}
                  >
                    {item}
                  </button>
                ))}

                {/* Theme Picker Inline for Mobile */}
                <ThemePicker mobileInline />

                <button
                  onClick={() => scrollToSection("consultation")}
                  className="w-full mt-2 px-6 py-3 text-white transition-all duration-300 shadow-lg rounded-xl font-medium"
                  style={{
                    background: `linear-gradient(to right, ${theme.vars["--c-primary"]}, ${theme.vars["--c-primary-dark"]})`,
                  }}
                >
                  Book Now
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] pb-1">
        <div className="relative flex justify-between items-end px-4 h-16 w-full">

          {/* Home */}
          <button
            onClick={TopScroll}
            className="flex flex-col items-center justify-center w-14 h-full pb-1 text-gray-500 space-y-1 transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.vars["--c-primary"])}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          {/* Services */}
          <button
            onClick={() => scrollToSection("Services")}
            className="flex flex-col items-center justify-center w-14 h-full pb-1 text-gray-500 space-y-1 transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.vars["--c-primary"])}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-medium">Services</span>
          </button>

          {/* Center Floating Book Button */}
          <div className="relative -top-6 flex flex-col items-center justify-center w-16">
            <button
              onClick={() => scrollToSection("consultation")}
              className="flex flex-col items-center justify-center w-12 h-12 text-white rounded-full shadow-lg border-4 border-white transform transition-transform active:scale-95"
              style={{ background: `linear-gradient(to right, ${theme.vars["--c-primary"]}, ${theme.vars["--c-primary-dark"]})` }}
            >
              <CalendarHeart className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold mt-1" style={{ color: theme.vars["--c-primary"] }}>
              Book
            </span>
          </div>

          {/* Gallery */}
          <button
            onClick={() => scrollToSection("Gallery")}
            className="flex flex-col items-center justify-center w-14 h-full pb-1 text-gray-500 space-y-1 transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.vars["--c-primary"])}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            <Images className="w-5 h-5" />
            <span className="text-[10px] font-medium">Gallery</span>
          </button>

          {/* Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col items-center justify-center w-14 h-full pb-1 space-y-1 transition-colors"
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