"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { DEFAULT_SITE_SETTINGS, ISiteSettingsData } from "@/lib/settingsDefaults";

interface SettingsContextValue {
  settings: ISiteSettingsData;
  phone: string;
  rawPhone: string;
  telLink: string;
  whatsAppNumber: string;
  email: string;
  address: string;
  googleMapUrl: string;
  siteName: string;
  taglineHindi: string;
  bannerText: string;
  showTopBanner: boolean;
  heroSlides: ISiteSettingsData["heroSlides"];
  socialLinks: ISiteSettingsData["socialLinks"];
  getWhatsAppLink: (customMsg?: string) => string;
  refreshSettings: () => Promise<void>;
  mounted: boolean;
}

const formatWhatsAppNumber = (wa: string): string => {
  const digits = (wa || "").replace(/[^0-9]/g, "");
  if (!digits) return "917898522932";
  // If Indian 10-digit number without country code, prepend 91
  if (digits.length === 10) return `91${digits}`;
  return digits;
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SITE_SETTINGS,
  phone: DEFAULT_SITE_SETTINGS.primaryPhone,
  rawPhone: DEFAULT_SITE_SETTINGS.primaryPhone.replace(/[^0-9+]/g, ""),
  telLink: `tel:${DEFAULT_SITE_SETTINGS.primaryPhone.replace(/[^0-9+]/g, "")}`,
  whatsAppNumber: DEFAULT_SITE_SETTINGS.whatsAppNumber,
  email: DEFAULT_SITE_SETTINGS.primaryEmail,
  address: DEFAULT_SITE_SETTINGS.address,
  googleMapUrl: DEFAULT_SITE_SETTINGS.googleMapUrl || "https://maps.google.com/?q=Rewa+Madhya+Pradesh",
  siteName: DEFAULT_SITE_SETTINGS.siteName,
  taglineHindi: DEFAULT_SITE_SETTINGS.taglineHindi || "✨ आपके रीति रिवाज सजावट के साथ ✨",
  bannerText: DEFAULT_SITE_SETTINGS.bannerText || "🎉 Welcome to RIWAJ Events — Weddings & Celebrations",
  showTopBanner: DEFAULT_SITE_SETTINGS.showTopBanner ?? true,
  heroSlides: DEFAULT_SITE_SETTINGS.heroSlides,
  socialLinks: DEFAULT_SITE_SETTINGS.socialLinks,
  getWhatsAppLink: (msg?: string) =>
    `https://wa.me/917898522932?text=${encodeURIComponent(msg || "Hi RIWAJ Events, I want to book a consultation!")}`,
  refreshSettings: async () => {},
  mounted: false,
});

export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: ISiteSettingsData;
}) {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<ISiteSettingsData>(
    initialSettings || DEFAULT_SITE_SETTINGS
  );

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/public/settings", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings({
          ...DEFAULT_SITE_SETTINGS,
          ...data.settings,
          socialLinks: {
            ...DEFAULT_SITE_SETTINGS.socialLinks,
            ...(data.settings.socialLinks || {}),
          },
        });
      }
    } catch (err) {
      console.error("Failed to fetch public site settings:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchSettings();

    const handleSettingsUpdate = () => {
      fetchSettings();
    };

    window.addEventListener("riwaj-settings-updated", handleSettingsUpdate);
    return () => {
      window.removeEventListener("riwaj-settings-updated", handleSettingsUpdate);
    };
  }, []);

  const value = useMemo(() => {
    // Before mounting (during SSR and hydration), use initialSettings / DEFAULT_SITE_SETTINGS
    // Once mounted, use live settings from database
    const active = mounted ? settings : (initialSettings || DEFAULT_SITE_SETTINGS);

    const phone = active.primaryPhone || DEFAULT_SITE_SETTINGS.primaryPhone;
    const rawDigits = phone.replace(/[^0-9+]/g, "");
    const cleanDigits = rawDigits.startsWith("+") ? rawDigits : `+91${rawDigits.replace(/^0+/, "")}`;
    const telLink = `tel:${rawDigits || "7898522932"}`;

    const formattedWA = formatWhatsAppNumber(
      active.whatsAppNumber || DEFAULT_SITE_SETTINGS.whatsAppNumber
    );

    const getWhatsAppLink = (customMsg?: string) => {
      const msg =
        customMsg ||
        `Hi ${active.siteName || "RIWAJ Events"}, I want to book a consultation!`;
      return `https://wa.me/${formattedWA}?text=${encodeURIComponent(msg)}`;
    };

    return {
      settings: active,
      phone,
      rawPhone: cleanDigits,
      telLink,
      whatsAppNumber: active.whatsAppNumber || DEFAULT_SITE_SETTINGS.whatsAppNumber,
      email: active.primaryEmail || DEFAULT_SITE_SETTINGS.primaryEmail,
      address: active.address || DEFAULT_SITE_SETTINGS.address,
      googleMapUrl: active.googleMapUrl || DEFAULT_SITE_SETTINGS.googleMapUrl || "https://maps.google.com/?q=Rewa+Madhya+Pradesh",
      siteName: active.siteName || DEFAULT_SITE_SETTINGS.siteName,
      taglineHindi: active.taglineHindi || DEFAULT_SITE_SETTINGS.taglineHindi || "",
      bannerText: active.bannerText || DEFAULT_SITE_SETTINGS.bannerText || "",
      showTopBanner: active.showTopBanner ?? true,
      heroSlides: active.heroSlides || DEFAULT_SITE_SETTINGS.heroSlides,
      socialLinks: active.socialLinks || DEFAULT_SITE_SETTINGS.socialLinks,
      getWhatsAppLink,
      refreshSettings: fetchSettings,
      mounted,
    };
  }, [settings, mounted, initialSettings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
