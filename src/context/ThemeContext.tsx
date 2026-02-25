"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeId = "rose" | "royal" | "nature" | "sunset";

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  /** dot color shown in picker */
  dot: string;
  vars: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: "rose",
    name: "Rose",
    description: "Romantic Pink & Gold",
    dot: "#f43f5e",
    vars: {
      "--c-primary":        "#f43f5e",
      "--c-primary-dark":   "#e11d48",
      "--c-primary-light":  "#fda4af",
      "--c-secondary":      "#f59e0b",
      "--c-accent":         "#fb7185",
      "--c-bg":             "#ffffff",
      "--c-bg-soft":        "#fff1f2",
      "--c-surface":        "#ffffff",
      "--c-text":           "#1c1917",
      "--c-text-muted":     "#6b7280",
      "--c-border":         "#fecdd3",
      "--c-banner-from":    "#e11d48",
      "--c-banner-to":      "#f43f5e",
      "--c-footer-from":    "#881337",
      "--c-footer-to":      "#4c0519",
    },
  },
  {
    id: "royal",
    name: "Royal",
    description: "Maroon & Gold",
    dot: "#800000",
    vars: {
      "--c-primary":        "#800000",
      "--c-primary-dark":   "#600000",
      "--c-primary-light":  "#d4a0a0",
      "--c-secondary":      "#D4AF37",
      "--c-accent":         "#c9a227",
      "--c-bg":             "#F8F4E3",
      "--c-bg-soft":        "#f3edcf",
      "--c-surface":        "#fffdf5",
      "--c-text":           "#2c1a0e",
      "--c-text-muted":     "#7a5c40",
      "--c-border":         "#e8d5a3",
      "--c-banner-from":    "#600000",
      "--c-banner-to":      "#9b2226",
      "--c-footer-from":    "#3d0000",
      "--c-footer-to":      "#1a0000",
    },
  },
  {
    id: "nature",
    name: "Nature",
    description: "Dark Green & Cream",
    dot: "#14532d",
    vars: {
      "--c-primary":        "#166534",
      "--c-primary-dark":   "#14532d",
      "--c-primary-light":  "#86efac",
      "--c-secondary":      "#ca8a04",
      "--c-accent":         "#4ade80",
      "--c-bg":             "#f0fdf4",
      "--c-bg-soft":        "#dcfce7",
      "--c-surface":        "#ffffff",
      "--c-text":           "#052e16",
      "--c-text-muted":     "#4b7a5c",
      "--c-border":         "#bbf7d0",
      "--c-banner-from":    "#14532d",
      "--c-banner-to":      "#166534",
      "--c-footer-from":    "#052e16",
      "--c-footer-to":      "#021a0d",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Amber & Warm Tones",
    dot: "#c2410c",
    vars: {
      "--c-primary":        "#c2410c",
      "--c-primary-dark":   "#9a3412",
      "--c-primary-light":  "#fdba74",
      "--c-secondary":      "#eab308",
      "--c-accent":         "#f97316",
      "--c-bg":             "#fff7ed",
      "--c-bg-soft":        "#ffedd5",
      "--c-surface":        "#ffffff",
      "--c-text":           "#1c0a00",
      "--c-text-muted":     "#78350f",
      "--c-border":         "#fed7aa",
      "--c-banner-from":    "#9a3412",
      "--c-banner-to":      "#c2410c",
      "--c-footer-from":    "#431407",
      "--c-footer-to":      "#1c0a00",
    },
  },
];

interface ThemeContextValue {
  theme: Theme;
  setThemeById: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES[0],
  setThemeById: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(THEMES[0]);

  // On mount: read saved theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("site-theme") as ThemeId | null;
    if (saved) {
      const found = THEMES.find((t) => t.id === saved);
      if (found) applyTheme(found);
    }
  }, []);

  const applyTheme = (t: Theme) => {
    setTheme(t);
    const root = document.documentElement;
    Object.entries(t.vars).forEach(([key, val]) => root.style.setProperty(key, val));
    // Also set bg color on body
    document.body.style.backgroundColor = t.vars["--c-bg"];
    localStorage.setItem("site-theme", t.id);
  };

  const setThemeById = (id: ThemeId) => {
    const found = THEMES.find((t) => t.id === id);
    if (found) applyTheme(found);
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeById }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
