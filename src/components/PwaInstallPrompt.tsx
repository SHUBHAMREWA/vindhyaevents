"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, X, Share, PlusSquare, Sparkles } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already running as installed standalone PWA
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(isStandaloneMode);
    if (isStandaloneMode) return;

    // Check if dismissed recently (past 3 days)
    const dismissedTime = localStorage.getItem("riwaj_pwa_dismissed");
    if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 3 * 24 * 60 * 60 * 1000) {
      return;
    }

    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|firefox|fxios/.test(userAgent);
    if (isIosDevice && isSafari && !isStandaloneMode) {
      setIsIOS(true);
      const timer = setTimeout(() => setShowPrompt(true), 2500);
      return () => clearTimeout(timer);
    }

    // Android / Desktop Chromium beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Wait 2 seconds before presenting to avoid initial render clutter
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // When successfully installed
    window.addEventListener("appinstalled", () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem("riwaj_pwa_installed", "true");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn("Installation prompt error:", err);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("riwaj_pwa_dismissed", Date.now().toString());
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 backdrop-blur-xl border border-rose-200/80 rounded-2xl shadow-2xl p-4 text-gray-800 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2.5 right-2.5 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0 border border-amber-300/60 bg-gradient-to-br from-rose-700 to-rose-900 flex items-center justify-center">
            <Image
              src="/icons/icon-192x192.png"
              alt="RIWAJ Events"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-bold text-base text-gray-900 leading-tight">
                RIWAJ Events App
              </h3>
              <span className="text-[10px] bg-rose-100 text-rose-700 font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> PWA
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Instant offline access & fast booking
            </p>
          </div>
        </div>

        {isIOS ? (
          <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-2.5 text-xs text-gray-700 space-y-1">
            <p className="font-semibold text-rose-900 flex items-center gap-1">
              Install on your iPhone / iPad:
            </p>
            <p className="flex items-center gap-1.5">
              1. Tap Share <Share className="w-3.5 h-3.5 text-rose-600 inline" /> at browser bottom
            </p>
            <p className="flex items-center gap-1.5">
              2. Scroll down &amp; tap{" "}
              <span className="font-semibold inline-flex items-center gap-1 text-rose-800">
                <PlusSquare className="w-3.5 h-3.5 text-rose-600 inline" /> Add to Home Screen
              </span>
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              Install Free App
            </button>
            <button
              onClick={handleDismiss}
              className="py-2.5 px-3 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Not now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
