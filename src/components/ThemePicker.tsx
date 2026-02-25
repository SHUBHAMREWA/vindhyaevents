"use client";

import { useState, useRef, useEffect } from "react";
import { Palette } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { THEMES, useTheme, type ThemeId } from "@/context/ThemeContext";

export default function ThemePicker({ mobileInline = false }: { mobileInline?: boolean }) {
  const { theme, setThemeById } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Inline version for mobile menu
  if (mobileInline) {
    return (
      <div className="px-4 pt-2 pb-3 border-t border-gray-100 mt-1">
        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Select Theme</p>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setThemeById(t.id as ThemeId)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all text-sm font-medium border-2 ${
                theme.id === t.id
                  ? "border-current shadow-sm"
                  : "border-transparent bg-gray-50 text-gray-700"
              }`}
              style={theme.id === t.id ? {
                backgroundColor: t.vars["--c-bg-soft"],
                color: t.vars["--c-primary"],
                borderColor: t.vars["--c-primary"],
              } : {}}
            >
              <span
                className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-white shadow-sm"
                style={{ backgroundColor: t.dot }}
              />
              <span className="truncate">{t.name}</span>
              {theme.id === t.id && (
                <svg className="w-3 h-3 ml-auto flex-shrink-0" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M1 6l4 4 6-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop dropdown version
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="Change Theme"
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border-2 ${
          open ? "shadow-md" : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
        }`}
        style={open ? {
          backgroundColor: theme.vars["--c-bg-soft"],
          borderColor: theme.vars["--c-primary"],
          color: theme.vars["--c-primary"],
        } : {}}
        aria-label="Change theme"
      >
        <Palette className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[999]"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Select Theme</p>
            </div>

            {/* Theme Options */}
            <div className="p-2 space-y-1">
              {THEMES.map((t) => {
                const isActive = theme.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setThemeById(t.id as ThemeId); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                      isActive ? "shadow-sm" : "hover:bg-gray-50"
                    }`}
                    style={isActive ? {
                      backgroundColor: t.vars["--c-bg-soft"],
                      color: t.vars["--c-primary"],
                    } : {}}
                  >
                    {/* Color dot */}
                    <span
                      className="w-5 h-5 rounded-full flex-shrink-0 border-2 border-white shadow"
                      style={{ backgroundColor: t.dot }}
                    />
                    <span className="flex-1">
                      <span className={`block text-sm font-semibold ${isActive ? "" : "text-gray-800"}`}>
                        {t.name}
                      </span>
                      <span className="block text-[10px] text-gray-400">{t.description}</span>
                    </span>
                    {isActive && (
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 8l4.5 4.5 8-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
