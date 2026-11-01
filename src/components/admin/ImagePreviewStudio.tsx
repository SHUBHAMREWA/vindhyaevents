"use client";

import React, { useState, useEffect } from "react";
import {
  Monitor,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  Shield,
  ZoomIn,
  Eye,
  Check,
} from "lucide-react";

export interface ImageSpecs {
  width: number;
  height: number;
  ratioStr: string;
  ratioDecimal: number;
  status: "optimal" | "acceptable" | "warning";
  message: string;
}

export interface ImagePreviewStudioProps {
  type: "hero" | "gallery" | "general";
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  category?: string;
  altText?: string;
}

export default function ImagePreviewStudio({
  type = "hero",
  imageUrl,
  title,
  subtitle,
  ctaText,
  category,
}: ImagePreviewStudioProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [showSafeZone, setShowSafeZone] = useState<boolean>(false);
  const [imgSpecs, setImgSpecs] = useState<ImageSpecs | null>(null);
  const [isLoadingSpecs, setIsLoadingSpecs] = useState<boolean>(false);

  // Detect image natural dimensions and calculate aspect ratio
  useEffect(() => {
    if (!imageUrl || imageUrl.trim() === "") {
      setImgSpecs(null);
      return;
    }

    let isMounted = true;
    setIsLoadingSpecs(true);

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      if (!isMounted) return;
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const decimal = h > 0 ? w / h : 1;

      let ratioStr = `${w}:${h}`;
      let status: "optimal" | "acceptable" | "warning" = "optimal";
      let message = "";

      if (type === "hero") {
        // Ideal is 16:9 ~ 1.778
        if (decimal >= 1.65 && decimal <= 1.9) {
          ratioStr = "16:9 (Widescreen HD)";
          if (w >= 1600) {
            status = "optimal";
            message = "उत्कृष्ट अनुपात (16:9)! यह फ़ोटो डेस्कटॉप और बड़ी स्क्रीन्स पर बिना किसी अनचाहे कटिंग के शानदार दिखेगी।";
          } else {
            status = "acceptable";
            message = "16:9 अनुपात सही है, लेकिन चौड़ाई 1600px से कम है। अधिक स्पष्टता (Crispness) के लिए 1920×1080 अनुशंसित है।";
          }
        } else if (decimal >= 1.45 && decimal < 1.65) {
          ratioStr = "3:2 / 16:10 (Landscape)";
          status = "acceptable";
          message = "लैंडस्केप अनुपात (~3:2)। 16:9 डेस्कटॉप व्यू में ऊपर और नीचे से थोड़ा क्रॉप होगा।";
        } else if (decimal >= 1.25 && decimal < 1.45) {
          ratioStr = "4:3 (Standard Photo)";
          status = "acceptable";
          message = "4:3 फ़ोटो अनुपात। 16:9 स्क्रीन को भरने के लिए ऊपर और नीचे का हिस्सा आंशिक रूप से क्रॉप होगा।";
        } else if (decimal > 1.9) {
          ratioStr = "Ultra-Wide Panorama (>2:1)";
          status = "acceptable";
          message = "अति-चौड़ी पैनोरमा फ़ोटो। डेस्कटॉप पर ठीक दिखेगी लेकिन मोबाइल में किनारों से अधिक क्रॉप होगी।";
        } else if (decimal >= 0.9 && decimal <= 1.1) {
          ratioStr = "1:1 (Square फ़ोटो)";
          status = "warning";
          message = "चौकोर (1:1) फ़ोटो। डेस्कटॉप 16:9 स्क्रीन में ऊपर-नीचे का लगभग 40% हिस्सा कटेगा। मोबाइल व्यू चेक करें।";
        } else {
          ratioStr = "Vertical / Portrait (9:16 or 4:5)";
          status = "warning";
          message = "वर्टिकल (खड़ी) फ़ोटो। यह मोबाइल स्क्रीन पर अच्छी दिखेगी लेकिन डेस्कटॉप 16:9 पर बहुत अधिक क्रॉप होगी।";
        }
      } else if (type === "gallery") {
        // Ideal is 4:3 ~ 1.333 or 1:1 ~ 1.0 or 16:9 ~ 1.778
        if (decimal >= 1.25 && decimal <= 1.42) {
          ratioStr = "4:3 (आदर्श गैलरी अनुपात)";
          status = "optimal";
          message = "गैलरी कार्ड्स के लिए 4:3 बिल्कुल सही अनुपात है। बिना किसी कटिंग के सुंदर दिखेगा।";
        } else if (decimal >= 0.95 && decimal <= 1.05) {
          ratioStr = "1:1 (Square)";
          status = "optimal";
          message = "स्क्वेयर (1:1) फ़ोटो। आधुनिक इंस्टाग्राम-स्टाइल गैलरी कार्ड्स के लिए बहुत सुंदर है।";
        } else if (decimal >= 1.65 && decimal <= 1.85) {
          ratioStr = "16:9 (Landscape HD)";
          status = "acceptable";
          message = "16:9 वाइडस्क्रीन फ़ोटो। गैलरी ग्रिड में अच्छी तरह से फिट होगी।";
        } else if (decimal < 0.95) {
          ratioStr = "Vertical Portrait";
          status = "acceptable";
          message = "वर्टिकल फ़ोटो। कार्ड में सेंटर-क्रॉप होगी, और क्लिक करने पर लाइटबॉक्स में पूरी दिखाई देगी।";
        } else {
          ratioStr = `${decimal.toFixed(2)}:1`;
          status = "acceptable";
          message = "फ़ोटो सफलतापूर्वक लोड हो गई है।";
        }
      } else {
        ratioStr = `${w}×${h} (${decimal.toFixed(2)}:1)`;
        status = "optimal";
        message = "फ़ोटो विनिर्देश लोड हो गए हैं।";
      }

      setImgSpecs({
        width: w,
        height: h,
        ratioStr,
        ratioDecimal: decimal,
        status,
        message,
      });
      setIsLoadingSpecs(false);
    };

    img.onerror = () => {
      if (!isMounted) return;
      setIsLoadingSpecs(false);
      setImgSpecs(null);
    };

    return () => {
      isMounted = false;
    };
  }, [imageUrl, type]);

  const isHero = type === "hero";
  const displayTitle = title?.trim() || (isHero ? "Celebrating Every Tradition" : "Royal Wedding Ceremony");
  const displaySubtitle = subtitle?.trim() || (isHero ? "300+ Love Stories Crafted Since 2021 — Your Dream Wedding Awaits" : "Memorable moments crafted with love");
  const displayCta = ctaText?.trim() || "Book Consultation";
  const displayCategory = category?.trim() || "Ceremony";

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-4">
      {/* 1. RECOMMENDED DIMENSIONS & RATIO GUIDELINES CARD */}
      <div className="bg-white rounded-xl border border-rose-100 p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between gap-2 border-b border-rose-50 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>Recommended Dimensions & Aspect Ratio (अनुशंसित साइज़ व अनुपात)</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
            {isHero ? "Hero Carousel Standard" : "Gallery Standard"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center">
          <div className="p-2 rounded-lg bg-rose-50/60 border border-rose-100/80">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aspect Ratio</div>
            <div className="text-xs sm:text-sm font-black text-rose-600 mt-0.5">
              {isHero ? "16 : 9" : "4 : 3 or 1 : 1"}
            </div>
            <div className="text-[10px] text-gray-500">
              {isHero ? "Landscape Widescreen" : "Standard Photo / Square"}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100/80">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Optimal Dimensions</div>
            <div className="text-xs sm:text-sm font-black text-amber-700 mt-0.5">
              {isHero ? "1920 × 1080 px" : "1200 × 900 px"}
            </div>
            <div className="text-[10px] text-gray-500">
              {isHero ? "Full HD (1080p)" : "Crisp High-Res (WebP)"}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-2 rounded-lg bg-blue-50/60 border border-blue-100/80">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Safe Subject Area</div>
            <div className="text-xs sm:text-sm font-black text-blue-700 mt-0.5">Center 60%</div>
            <div className="text-[10px] text-gray-500">Keep faces/mandap centered</div>
          </div>
        </div>

        {/* Safe Area Guidance Tip */}
        <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 text-[11px] text-gray-600 border border-gray-100 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
          <span>
            {isHero ? (
              <>
                <strong>सजावट व फ़ोटो टिप:</strong> डेस्कटॉप पर फ़ोटो पूरी चौड़ाई (16:9) में दिखती है, जबकि मोबाइल पर दोनों किनारों से कटकर वर्टिकल (9:16) बन जाती है। मुख्य चेहरे व मंडप को फ़ोटो के <strong>मध्य (Center)</strong> में रखें।
              </>
            ) : (
              <>
                <strong>गैलरी टिप:</strong> 4:3 या 1:1 अनुपात की हाई-रिज़ॉल्यूशन फ़ोटो सबसे साफ और सुंदर दिखती हैं। पोर्ट्रेट फ़ोटो पर क्लिक करने पर लाइटबॉक्स ज़ूम में पूरी दिखेगी।
              </>
            )}
          </span>
        </div>
      </div>

      {/* 2. REAL-TIME DETECTED IMAGE SPECS BADGE */}
      {imageUrl && imageUrl.trim() !== "" ? (
        <div className="p-3 rounded-xl border transition-all text-xs space-y-1.5"
          style={{
            backgroundColor:
              imgSpecs?.status === "optimal"
                ? "#f0fdf4"
                : imgSpecs?.status === "warning"
                ? "#fffbeb"
                : "#f8fafc",
            borderColor:
              imgSpecs?.status === "optimal"
                ? "#bbf7d0"
                : imgSpecs?.status === "warning"
                ? "#fde68a"
                : "#e2e8f0",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {isLoadingSpecs ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
              ) : imgSpecs?.status === "optimal" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
              <span className="font-bold text-gray-900">
                {isLoadingSpecs
                  ? "Detecting Image Resolution..."
                  : `Detected: ${imgSpecs?.width || 0} × ${imgSpecs?.height || 0} px`}
              </span>
            </div>

            {imgSpecs && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  imgSpecs.status === "optimal"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}
              >
                {imgSpecs.ratioStr}
              </span>
            )}
          </div>

          {imgSpecs && (
            <p className="text-[11px] text-gray-600 leading-snug">
              {imgSpecs.message}
            </p>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 text-center text-xs text-gray-400">
          Upload an image or paste a URL above to detect exact resolution and aspect ratio.
        </div>
      )}

      {/* 3. DEVICE VIEW SWITCHER (DESKTOP & MOBILE TABS) */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              device === "desktop"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop View (16:9)</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              device === "mobile"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile View (9:16)</span>
          </button>
        </div>

        {isHero && device === "desktop" && (
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showSafeZone}
              onChange={(e) => setShowSafeZone(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-rose-500 focus:ring-rose-400 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-500" />
              <span>Show Safe Zone</span>
            </span>
          </label>
        )}
      </div>

      {/* 4. PREVIEW CANVAS CONTAINER */}
      <div className="relative min-h-[260px] flex items-center justify-center p-2 rounded-xl bg-gray-900/5 border border-gray-200 overflow-hidden">
        {device === "desktop" ? (
          /* ================= DESKTOP VIEW ================= */
          <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
            {/* Desktop Browser Window Header */}
            <div className="h-7 bg-gray-100 border-b border-gray-200 px-3 flex items-center justify-between text-gray-500 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[10px] bg-white px-3 py-0.5 rounded-md border border-gray-200 font-mono text-gray-400">
                riwajevents.com{isHero ? "/#home" : "/gallery"}
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase">16:9 Viewport</span>
            </div>

            {/* Desktop Screen Content */}
            {isHero ? (
              <div className="relative aspect-[16/9] w-full bg-gray-900 overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={displayTitle}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4 text-center bg-gray-800">
                    <Sparkles className="w-8 h-8 text-rose-400 mb-2 opacity-50" />
                    <p className="text-xs font-serif text-gray-300">No Image Uploaded Yet</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Upload a photo to see live desktop banner</p>
                  </div>
                )}

                {/* Dark Gradient Overlay (matches production HeroCarousel) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10" />

                {/* Simulated Content Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6">
                  <h3 className="text-white text-sm sm:text-base md:text-lg font-serif font-bold tracking-tight drop-shadow-md line-clamp-2 max-w-md">
                    {displayTitle}
                  </h3>
                  {displaySubtitle && (
                    <p className="text-white/95 text-[10px] sm:text-xs font-medium mt-1 drop-shadow line-clamp-2 max-w-sm">
                      {displaySubtitle}
                    </p>
                  )}
                  {displayCta && (
                    <div className="mt-2.5 px-3 py-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full text-[10px] font-bold shadow-md">
                      {displayCta}
                    </div>
                  )}
                </div>

                {/* Safe Zone Grid Overlay (if toggled) */}
                {showSafeZone && (
                  <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
                    <div className="w-[48%] h-[85%] border-2 border-dashed border-amber-300/90 bg-amber-400/10 rounded-lg flex flex-col items-center justify-between p-2 shadow-inner">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-amber-300 backdrop-blur-sm">
                        📱 Mobile Safe Center Zone
                      </span>
                      <span className="text-[8px] text-amber-200/90 bg-black/60 px-1 rounded">
                        Subjects in this box stay visible on phones
                      </span>
                    </div>
                  </div>
                )}

                {/* Simulated Slide Navigation Dots */}
                <div className="absolute bottom-2 inset-x-0 z-20 flex justify-center gap-1.5 pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>
              </div>
            ) : (
              /* Desktop Gallery Grid Card Preview */
              <div className="p-4 bg-gray-50 flex justify-center">
                <div className="relative aspect-[4/3] w-64 rounded-2xl overflow-hidden group shadow-md border border-gray-200 bg-gray-900">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={displayTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                      No photo selected
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-rose-300">
                      {displayCategory}
                    </span>
                    <span className="font-serif font-bold text-xs truncate">{displayTitle}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================= MOBILE VIEW (SMARTPHONE MOCKUP) ================= */
          <div className="w-[200px] sm:w-[220px] aspect-[9/18.5] bg-gray-950 rounded-[36px] p-2.5 shadow-2xl border-4 border-gray-800 relative flex flex-col my-1 select-none">
            {/* Phone Top Notch / Dynamic Island */}
            <div className="w-16 h-3 bg-black rounded-full mx-auto mb-1.5 flex items-center justify-center relative z-40">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-800 mr-2" />
              <div className="w-1 h-1 rounded-full bg-blue-950" />
            </div>

            {/* Phone Screen Viewport */}
            <div className="relative flex-1 rounded-[26px] overflow-hidden bg-gray-900">
              {isHero ? (
                <>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={displayTitle}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-3 text-center">
                      <Sparkles className="w-6 h-6 text-rose-400 mb-1 opacity-50" />
                      <p className="text-[11px] font-serif text-gray-300">No Image</p>
                    </div>
                  )}

                  {/* Dark gradient overlay on phone */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60 z-10" />

                  {/* Mobile Typography & CTA Button */}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-3">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-amber-300/90 mb-1">
                      RIWAJ EVENTS
                    </span>
                    <h4 className="text-white text-xs font-serif font-bold tracking-tight drop-shadow-md line-clamp-2 leading-tight">
                      {displayTitle}
                    </h4>
                    {displaySubtitle && (
                      <p className="text-white/90 text-[9px] mt-1 drop-shadow line-clamp-2 leading-snug">
                        {displaySubtitle}
                      </p>
                    )}
                    {displayCta && (
                      <div className="mt-2.5 px-2.5 py-0.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full text-[8px] font-bold shadow">
                        {displayCta}
                      </div>
                    )}
                  </div>

                  {/* Mobile slide dots */}
                  <div className="absolute bottom-2 inset-x-0 z-20 flex justify-center gap-1 pointer-events-none">
                    <div className="w-1 h-1 rounded-full bg-white shadow" />
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                  </div>
                </>
              ) : (
                /* Mobile Gallery Card Screen */
                <div className="h-full flex flex-col p-2 bg-gray-900 justify-center">
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-md bg-gray-800">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={displayTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
                        No Photo
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex flex-col justify-end p-2 text-white">
                      <span className="text-[8px] text-rose-300 font-bold uppercase">
                        {displayCategory}
                      </span>
                      <span className="text-[10px] font-serif font-bold truncate">
                        {displayTitle}
                      </span>
                    </div>
                  </div>
                  <p className="text-[8px] text-gray-400 text-center mt-2">
                    Mobile Gallery Feed Preview
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="w-16 h-1 bg-white/40 rounded-full mx-auto mt-1.5" />
          </div>
        )}
      </div>

      {/* Helpful footnote */}
      <div className="text-[10px] text-gray-400 flex items-center justify-between px-1">
        <span>💡 Switch between Desktop and Mobile tabs to check framing.</span>
        <span className="font-semibold text-gray-500">Object-fit: Cover</span>
      </div>
    </div>
  );
}
