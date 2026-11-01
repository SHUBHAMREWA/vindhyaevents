"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Sparkles,
  ExternalLink,
  Film,
  Instagram,
  Youtube,
} from "lucide-react";
import { getYouTubeId, getInstagramId, detectVideoType, DEFAULT_WORK_VIDEOS } from "@/lib/videoUtils";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";

export interface WorkVideoItem {
  _id?: string;
  title: string;
  category: string;
  videoUrl: string;
  videoType?: "youtube" | "instagram" | "custom";
  thumbnailUrl?: string;
  description?: string;
}

interface WorksVideoShowcaseProps {
  initialWorks?: WorkVideoItem[];
}

export default function WorksVideoShowcase({ initialWorks }: WorksVideoShowcaseProps) {
  const { siteName, getWhatsAppLink } = useSettings();
  const { theme } = useTheme(); // Reactively re-renders when user changes theme (Rose, Royal, Sunset, Nature)
  const [works, setWorks] = useState<WorkVideoItem[]>(
    initialWorks && initialWorks.length > 0 ? initialWorks : DEFAULT_WORK_VIDEOS
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInView, setIsInView] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Touch swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // If no initialWorks provided or empty, attempt client-side fetch as fallback
  useEffect(() => {
    if (!initialWorks || initialWorks.length === 0) {
      fetch("/api/admin/works")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.works?.length > 0) {
            setWorks(data.works);
          }
        })
        .catch(() => {});
    }
  }, [initialWorks]);

  // Autoplay Trigger Function: send playVideo command to YouTube iframe or video element
  const triggerAutoplay = () => {
    setIsInView(true);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: "" }),
          "*"
        );
      } catch (_) {}
    }
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Scroll & Touch Event Listeners: Jaise hi user scroll ya touch kare, turant video autoplay ho jaye
  useEffect(() => {
    const handleScrollEvent = () => {
      triggerAutoplay();
    };

    window.addEventListener("scroll", handleScrollEvent, { passive: true });
    window.addEventListener("touchmove", handleScrollEvent, { passive: true });
    window.addEventListener("wheel", handleScrollEvent, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollEvent);
      window.removeEventListener("touchmove", handleScrollEvent);
      window.removeEventListener("wheel", handleScrollEvent);
    };
  }, [currentIndex]);

  // IntersectionObserver: jab user scroll karke showcase section par aaye
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          triggerAutoplay();
        }
      },
      { threshold: 0.05, rootMargin: "150px" }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [currentIndex]);

  const total = works.length;
  const currentWork = works[currentIndex] || works[0] || DEFAULT_WORK_VIDEOS[0];

  const handlePrev = () => {
    setHasInteracted(true);
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setHasInteracted(true);
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const handleSelect = (idx: number) => {
    setHasInteracted(true);
    setCurrentIndex(idx);
  };

  // Sliding window pagination dots: Maximum 5 dots visible at any time
  const visibleDotIndices = useMemo(() => {
    const MAX_DOTS = 5;
    if (total <= MAX_DOTS) {
      return Array.from({ length: total }, (_, i) => i);
    }
    const half = Math.floor(MAX_DOTS / 2);
    const start = Math.max(0, Math.min(currentIndex - half, total - MAX_DOTS));
    return Array.from({ length: MAX_DOTS }, (_, i) => start + i);
  }, [total, currentIndex]);

  // Derive unique categories dynamically from database works
  const uniqueCategories = useMemo(() => {
    const cats: string[] = [];
    works.forEach((w) => {
      if (w.category && !cats.includes(w.category)) {
        cats.push(w.category);
      }
    });
    return cats;
  }, [works]);

  const handleCategorySelect = (categoryName: string) => {
    setHasInteracted(true);
    const foundIdx = works.findIndex(
      (w) => w.category?.toLowerCase() === categoryName.toLowerCase()
    );
    if (foundIdx !== -1) {
      setCurrentIndex(foundIdx);
    }
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 40;
    const isRightSwipe = distance < -40;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Extract video details
  const videoType = currentWork.videoType || detectVideoType(currentWork.videoUrl);
  const youtubeId = getYouTubeId(currentWork.videoUrl);
  const instagramId = getInstagramId(currentWork.videoUrl);

  // Check if current video is a vertical video (YouTube Shorts, Instagram Reels, etc.)
  const isVerticalVideo =
    currentWork.videoUrl.includes("/shorts/") ||
    currentWork.videoUrl.includes("/reel/") ||
    currentWork.category?.toLowerCase().includes("reel") ||
    currentWork.category?.toLowerCase().includes("short");

  // Fullscreen orientation handler:
  // When a 16:9 video enters fullscreen on mobile, rotate to landscape so it preserves its true ratio
  // When exiting fullscreen, restore original orientation.
  useEffect(() => {
    const handleFullscreen = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      );

      if (isFullscreen) {
        if (screen.orientation && typeof (screen.orientation as unknown as { lock?: (o: string) => Promise<void> }).lock === "function") {
          if (isVerticalVideo) {
            (screen.orientation as unknown as { lock: (o: string) => Promise<void> }).lock("portrait").catch(() => {});
          } else {
            (screen.orientation as unknown as { lock: (o: string) => Promise<void> }).lock("landscape").catch(() => {});
          }
        }
      } else {
        if (screen.orientation && typeof screen.orientation.unlock === "function") {
          try {
            screen.orientation.unlock();
          } catch (_) {}
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreen);
    document.addEventListener("webkitfullscreenchange", handleFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
      document.removeEventListener("webkitfullscreenchange", handleFullscreen);
    };
  }, [isVerticalVideo]);

  // Fallback thumbnail if none provided
  const thumbnail =
    currentWork.thumbnailUrl ||
    (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : "/girlsimg.webp");

  // YouTube embed URL with autoplay parameters (mute=1 ensures modern browsers allow autoplay without blocking)
  const ytEmbedUrl = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`
    : "";

  const instaEmbedUrl = instagramId
    ? `https://www.instagram.com/p/${instagramId}/embed/captioned/`
    : "";

  const waMessage = `Namaste ${siteName || "RIWAJ Events"}! 🙏 I saw your work on "${currentWork.title}" (${currentWork.category}). Can you please share pricing and availability for our event?`;
  const waUrl = getWhatsAppLink(waMessage);

  return (
    <section
      ref={sectionRef}
      id="works-showcase"
      className="py-12 sm:py-20 relative overflow-hidden text-white transition-colors duration-500"
      style={{
        background: "linear-gradient(180deg, var(--c-footer-from) 0%, var(--c-footer-to) 100%)",
      }}
    >
      {/* Dynamic Royal Background Glows (Driven by theme variables) */}
      <div
        className="absolute top-0 left-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{ background: "var(--c-primary)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-3xl pointer-events-none opacity-25 transition-all duration-700"
        style={{ background: "var(--c-secondary)" }}
      />

      <div className="w-full sm:container mx-auto px-0 sm:px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 font-mono flex items-center justify-center gap-1.5"
            style={{ color: "var(--c-secondary)" }}
          >
            <span>✦</span>
            <span>REAL PROJECTS • REAL CELEBRATIONS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight"
          >
            See Our Work &amp; Services Video
          </motion.h2>
        </div>

        {/* ── Main Video Player Container (Edge-to-edge on mobile, centered 55-60%+ on large screens) ── */}
        <div className={`w-full ${isVerticalVideo ? "max-w-md" : "max-w-4xl lg:max-w-5xl xl:max-w-6xl"} mx-auto px-0 sm:px-4`}>
          {/* Video Player Box with Touch Event Listeners */}
          <div
            className={`relative w-full ${isVerticalVideo ? "aspect-[9/16]" : "aspect-video"} rounded-none sm:rounded-3xl overflow-hidden shadow-2xl bg-black border-y sm:border border-white/20 group`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWork.videoUrl + currentIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full relative"
              >
                {/* 1. YouTube Player */}
                {videoType === "youtube" && youtubeId && isInView ? (
                  <iframe
                    ref={iframeRef}
                    key={youtubeId + currentIndex}
                    src={ytEmbedUrl}
                    title={currentWork.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : videoType === "instagram" && instaEmbedUrl ? (
                  /* 2. Instagram Player */
                  <div className="w-full h-full flex items-center justify-center bg-zinc-950 overflow-hidden relative">
                    <iframe
                      src={instaEmbedUrl}
                      title={currentWork.title}
                      allowFullScreen
                      className="w-full h-full max-w-[480px] border-0 mx-auto"
                    />
                  </div>
                ) : videoType === "custom" && currentWork.videoUrl.endsWith(".mp4") ? (
                  /* 3. Direct MP4 video */
                  <video
                    ref={videoRef}
                    src={currentWork.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  /* 4. Preload Thumbnail / Waiting for In-View */
                  <div className="w-full h-full relative cursor-pointer" onClick={() => setIsInView(true)}>
                    <Image
                      src={thumbnail}
                      alt={currentWork.title}
                      fill
                      className={isVerticalVideo ? "object-contain" : "object-cover"}
                      priority={currentIndex === 0}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transform group-hover:scale-110 transition-transform"
                        style={{ background: "var(--c-primary)" }}
                      >
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Desktop & Laptop Video Navigation Arrows (Left & Right) ── */}
            <button
              type="button"
              onClick={handlePrev}
              className="hidden md:flex absolute left-3 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-14 lg:h-14 rounded-full items-center justify-center text-white shadow-2xl backdrop-blur-md border-2 border-white/30 hover:border-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer opacity-90 hover:opacity-100 group/nav"
              style={{
                background: "linear-gradient(135deg, var(--c-primary), color-mix(in srgb, var(--c-primary-dark, var(--c-primary)) 85%, black))",
              }}
              aria-label="Previous Video"
            >
              <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 transition-transform group-hover/nav:-translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="hidden md:flex absolute right-3 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-14 lg:h-14 rounded-full items-center justify-center text-white shadow-2xl backdrop-blur-md border-2 border-white/30 hover:border-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer opacity-90 hover:opacity-100 group/nav"
              style={{
                background: "linear-gradient(135deg, var(--c-primary), color-mix(in srgb, var(--c-primary-dark, var(--c-primary)) 85%, black))",
              }}
              aria-label="Next Video"
            >
              <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7 transition-transform group-hover/nav:translate-x-0.5" />
            </button>
          </div>

          {/* ── Horizontal Navigation Row: < | Bullet Nav (Center) | > ── */}
          <div className="mt-5 sm:mt-6 flex items-center justify-center gap-4 sm:gap-6 px-4">
            {/* Left Button (Mobile only) */}
            <button
              type="button"
              onClick={handlePrev}
              className="md:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer border border-white/20 hover:scale-105"
              style={{ background: "var(--c-primary)" }}
              aria-label="Previous Video"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Navigation Bullets (Center) - Exactly at most 5 dots visible at any time */}
            <div className="flex items-center justify-center gap-2">
              {visibleDotIndices.map((idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    aria-label={`Jump to video ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive
                        ? "w-7 sm:w-9 h-2.5 sm:h-3 shadow-md"
                        : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white/30 hover:bg-white/60"
                    }`}
                    style={isActive ? { background: "var(--c-primary)" } : {}}
                  />
                );
              })}
            </div>

            {/* Right Button (Mobile only) */}
            <button
              type="button"
              onClick={handleNext}
              className="md:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer border border-white/20 hover:scale-105"
              style={{ background: "var(--c-primary)" }}
              aria-label="Next Video"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* ── Category Name (Centered below bullet navigation) ── */}
          <div className="mt-4 sm:mt-5 text-center px-4">
            <motion.div
              key={currentWork.category}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="inline-block"
            >
              <span
                className="text-xl sm:text-3xl md:text-4xl font-serif font-black tracking-wide uppercase drop-shadow-md block"
                style={{ color: "var(--c-secondary)" }}
              >
                {currentWork.category}
              </span>
            </motion.div>
          </div>

          {/* Work Title & Description */}
          <div className="text-center mt-2.5 sm:mt-3 px-4">
            <h3 className="text-sm sm:text-lg font-medium text-white/95 max-w-2xl mx-auto">
              {currentWork.title}
            </h3>

            {currentWork.description && (
              <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-xl mx-auto line-clamp-2">
                {currentWork.description}
              </p>
            )}

            {/* WhatsApp CTA */}
            <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-lg transition-transform active:scale-95"
              >
                <span>Book This Setup / Inquire on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* ── Dynamic Category Switcher Pills (Deduplicated from Database) ── */}
          {uniqueCategories.length > 0 && (
            <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-4">
              {uniqueCategories.map((cat) => {
                const active = currentWork.category?.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                      active
                        ? "text-white shadow-lg scale-105 border"
                        : "bg-white/10 hover:bg-white/20 text-white/75 border border-white/15"
                    }`}
                    style={
                      active
                        ? {
                            background: "var(--c-primary)",
                            borderColor: "var(--c-primary-light)",
                          }
                        : {}
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
