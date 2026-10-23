"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Share, PlusSquare, X, Sparkles, Smartphone, Check } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function FooterPwaDownload() {
  const [isInstalled, setIsInstalled] = useState(true); // Default to true on SSR to avoid hydration flash
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showGenericModal, setShowGenericModal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check if running in standalone display-mode (already installed and opened as app)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes("android-app://");

    // 2. Check localStorage flag
    const hasInstalledFlag = localStorage.getItem("riwaj_pwa_installed") === "true";

    if (isStandalone || hasInstalledFlag) {
      setIsInstalled(true);
      return;
    }

    // 3. Check getInstalledRelatedApps API if supported
    if ("getInstalledRelatedApps" in navigator) {
      (navigator as unknown as { getInstalledRelatedApps: () => Promise<unknown[]> })
        .getInstalledRelatedApps()
        .then((apps) => {
          if (apps && apps.length > 0) {
            localStorage.setItem("riwaj_pwa_installed", "true");
            setIsInstalled(true);
            return;
          }
        })
        .catch(() => {});
    }

    // Not installed! Enable button
    setIsInstalled(false);

    // Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    const isSafari = /safari/.test(ua) && !/chrome|crios|firefox|fxios/.test(ua);
    if (isIosDevice && isSafari) {
      setIsIOS(true);
    }

    // Pick up pre-captured prompt if already on window
    if ((window as unknown as { __riwaj_deferred_pwa_prompt?: BeforeInstallPromptEvent }).__riwaj_deferred_pwa_prompt) {
      setDeferredPrompt((window as unknown as { __riwaj_deferred_pwa_prompt?: BeforeInstallPromptEvent }).__riwaj_deferred_pwa_prompt || null);
    }

    const onPromptReady = () => {
      const winPrompt = (window as unknown as { __riwaj_deferred_pwa_prompt?: BeforeInstallPromptEvent }).__riwaj_deferred_pwa_prompt;
      if (winPrompt) {
        setDeferredPrompt(winPrompt);
      }
    };

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as unknown as { __riwaj_deferred_pwa_prompt?: Event }).__riwaj_deferred_pwa_prompt = e;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem("riwaj_pwa_installed", "true");
      setDeferredPrompt(null);
      setShowIOSModal(false);
      setShowGenericModal(false);
    };

    window.addEventListener("riwaj_pwa_prompt_ready", onPromptReady);
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);
    window.addEventListener("riwaj_pwa_installed_event", onAppInstalled);

    return () => {
      window.removeEventListener("riwaj_pwa_prompt_ready", onPromptReady);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener("riwaj_pwa_installed_event", onAppInstalled);
    };
  }, []);

  const handleDownloadClick = async () => {
    // 1. If native Chromium prompt is available
    const promptEvent = deferredPrompt || (window as unknown as { __riwaj_deferred_pwa_prompt?: BeforeInstallPromptEvent }).__riwaj_deferred_pwa_prompt;
    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === "accepted") {
          localStorage.setItem("riwaj_pwa_installed", "true");
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
        (window as unknown as { __riwaj_deferred_pwa_prompt?: unknown }).__riwaj_deferred_pwa_prompt = null;
        return;
      } catch (err) {
        console.warn("PWA install error:", err);
      }
    }

    // 2. If iOS Safari
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    // 3. Desktop or browsers where prompt event hasn't fired
    setShowGenericModal(true);
  };

  // If application is already downloaded / installed on this device, do not show at all!
  if (isInstalled) return null;

  return (
    <>
      <div className="mt-5 p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md max-w-xs transition-all hover:bg-white/15 hover:border-amber-400/30">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shrink-0 border border-amber-300/60 bg-gradient-to-br from-rose-700 to-rose-900 flex items-center justify-center">
            <Image
              src="/icons/icon-192x192.png"
              alt="RIWAJ Events App"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-xs text-white leading-tight truncate">
                RIWAJ Mobile App
              </span>
              <span className="text-[9px] bg-amber-400/20 text-amber-300 font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Sparkles className="w-2 h-2" /> App
              </span>
            </div>
            <p className="text-[10px] text-white/70 truncate mt-0.5">
              Instant offline booking & gallery
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadClick}
          className="w-full mt-3 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Free App</span>
        </button>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-gray-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-rose-600 flex items-center justify-center shadow-md">
                <Image src="/icons/icon-192x192.png" alt="RIWAJ" width={48} height={48} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-gray-900">Install RIWAJ App</h4>
                <p className="text-xs text-gray-500">For iPhone &amp; iPad</p>
              </div>
            </div>

            <div className="space-y-3 bg-rose-50/70 p-4 rounded-2xl border border-rose-100 text-xs text-gray-700">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </div>
                <p>
                  Safari ke bottom me <strong>Share</strong> button{" "}
                  <Share className="w-3.5 h-3.5 inline text-rose-600" /> tap karein.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </div>
                <p>
                  Menu me neeche scroll karein aur <strong>Add to Home Screen</strong>{" "}
                  <PlusSquare className="w-3.5 h-3.5 inline text-rose-600" /> tap karein.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </div>
                <p>Top-right corner me <strong>Add</strong> par click karein. App install ho jayegi!</p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 transition"
            >
              Samajh Gaya (Close)
            </button>
          </div>
        </div>
      )}

      {/* Desktop / Generic Browser Guide Modal */}
      {showGenericModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowGenericModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-gray-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowGenericModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-rose-600 flex items-center justify-center shadow-md">
                <Image src="/icons/icon-192x192.png" alt="RIWAJ" width={48} height={48} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-gray-900">Download RIWAJ App</h4>
                <p className="text-xs text-gray-500">Fast 1-click access</p>
              </div>
            </div>

            <div className="space-y-2.5 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-600">
              <p className="flex items-center gap-1.5 font-medium text-gray-800">
                <Smartphone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Browser Address Bar me <strong>Install</strong> icon par click karein.</span>
              </p>
              <p className="text-[11px] text-gray-500">
                Chrome ya Edge me top address bar ke right side me ek download/install icon hota hai. Click karte hi RIWAJ application aapke device me install ho jayegi.
              </p>
            </div>

            <button
              onClick={() => setShowGenericModal(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-gray-800 transition"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </>
  );
}
