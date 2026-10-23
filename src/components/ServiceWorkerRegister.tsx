"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Capture beforeinstallprompt silently without showing any automatic popups
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as unknown as { __riwaj_deferred_pwa_prompt?: Event }).__riwaj_deferred_pwa_prompt = e;
      window.dispatchEvent(new Event("riwaj_pwa_prompt_ready"));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    if (!("serviceWorker" in navigator)) return;

    // In development mode (localhost), NEVER register service workers and clean up any existing ones
    const isDev =
      process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isDev) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
          console.log("[Dev] Unregistered service worker to prevent stale cache.");
        }
      });

      if ("caches" in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key);
          }
        });
      }
      return;
    }

    // Register PWA Service Worker only in production
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener("statechange", () => {
            if (
              installingWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("[PWA] New content is available; please refresh.");
            }
          });
        });

        // Clear notification badge on app launch
        if ("clearAppBadge" in navigator) {
          (navigator as unknown as { clearAppBadge: () => Promise<void> })
            .clearAppBadge()
            .catch(() => {});
        }
      } catch (error) {
        console.warn("[PWA] Service Worker registration failed:", error);
      }
    };

    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW);
    }

    return () => {
      window.removeEventListener("load", registerSW);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  return null;
}
