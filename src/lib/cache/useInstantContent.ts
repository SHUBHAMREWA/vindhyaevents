"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getInstantPublicContent,
  PublicContentData,
  syncOfflineInquiries,
} from "./idb";
import { galleryImages, stats } from "@/data/staticData";

import { DEFAULT_SITE_SETTINGS } from "@/lib/settingsDefaults";

const defaultContent: PublicContentData = {
  services: [],
  blogs: [],
  gallery: galleryImages,
  settings: {
    siteName: DEFAULT_SITE_SETTINGS.siteName,
    tagline: DEFAULT_SITE_SETTINGS.tagline,
    taglineHindi: DEFAULT_SITE_SETTINGS.taglineHindi,
    primaryPhone: DEFAULT_SITE_SETTINGS.primaryPhone,
    whatsAppNumber: DEFAULT_SITE_SETTINGS.whatsAppNumber,
    primaryEmail: DEFAULT_SITE_SETTINGS.primaryEmail,
    stats,
  },
  testimonials: [],
};

export function useInstantContent() {
  const [content, setContent] = useState<PublicContentData>(defaultContent);
  const [isFromCache, setIsFromCache] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsRevalidating(true);

    // In development mode, always fetch fresh data directly so edits and DB changes show immediately
    if (process.env.NODE_ENV === "development") {
      try {
        const res = await fetch("/api/public/content", { cache: "no-store" });
        const fresh = await res.json();
        if (fresh && fresh.success) {
          setContent((prev) => ({
            ...prev,
            ...fresh,
            services: fresh.services?.length ? fresh.services : prev.services,
            blogs: fresh.blogs?.length ? fresh.blogs : prev.blogs,
            gallery: fresh.gallery?.length ? fresh.gallery : prev.gallery,
            testimonials: fresh.testimonials?.length ? fresh.testimonials : prev.testimonials,
          }));
        }
      } catch (err) {
        console.warn("[Dev] Content fetch error:", err);
      } finally {
        setIsLoading(false);
        setIsRevalidating(false);
      }
      return;
    }

    // 1. Instant read from IndexedDB in production
    const cached = await getInstantPublicContent((freshData) => {
      // Background revalidation callback
      setContent((prev) => ({
        ...prev,
        ...freshData,
        services: freshData.services.length ? freshData.services : prev.services,
        blogs: freshData.blogs.length ? freshData.blogs : prev.blogs,
        gallery: freshData.gallery.length ? freshData.gallery : prev.gallery,
        testimonials: freshData.testimonials.length ? freshData.testimonials : prev.testimonials,
      }));
      setIsRevalidating(false);
      setIsFromCache(false);
      setIsLoading(false);
    });

    if (cached) {
      setContent((prev) => ({
        ...prev,
        ...cached,
        services: cached.services.length ? cached.services : prev.services,
        blogs: cached.blogs.length ? cached.blogs : prev.blogs,
        gallery: cached.gallery.length ? cached.gallery : prev.gallery,
        testimonials: cached.testimonials.length ? cached.testimonials : prev.testimonials,
      }));
      setIsFromCache(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    // Initial instant load
    loadData();

    // Listen for custom broadcast events when IndexedDB updates
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<PublicContentData>;
      if (customEvent.detail) {
        setContent((prev) => ({ ...prev, ...customEvent.detail }));
      }
    };
    window.addEventListener("riwaj-content-updated", handleUpdate);

    // Handle online/offline network transitions
    const handleOnline = () => {
      setIsOnline(true);
      loadData();
      // Sync any offline inquiries stored in IndexedDB
      syncOfflineInquiries();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check for offline queue if online
    if (navigator.onLine) {
      syncOfflineInquiries();
    }

    return () => {
      window.removeEventListener("riwaj-content-updated", handleUpdate);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [loadData]);

  return {
    content,
    isFromCache,
    isOnline,
    isRevalidating,
    isLoading,
    refresh: loadData,
  };
}
