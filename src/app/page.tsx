"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";

// ─── Critical (Above-the-fold) ────────────────────────────────
import Navbar from "@/components/Navbar";

// ─── SSR OFF + Lazy loaded components ─────────────────────────
const TopBanner = dynamic(() => import("@/components/TopBanner"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

const HeroCarousel = dynamic(() => import("@/components/HeroCarousel"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "80vh", marginTop: "88px", background: "linear-gradient(135deg, #fff1f2, #fffbeb)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", border: "4px solid #fda4af", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
    </div>
  ),
});

const SectionSkeleton = () => (
  <div style={{ padding: "5rem 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{
      width: 48,
      height: 48,
      borderRadius: "50%",
      border: "4px solid var(--c-border, #fecdd3)",
      borderTopColor: "var(--c-primary, #f43f5e)",
      animation: "spin 0.8s linear infinite",
    }} />
  </div>
);

const BookConsultation = dynamic(() => import("@/components/BookConsultation"), { ssr: false, loading: () => <SectionSkeleton /> });
const Services         = dynamic(() => import("@/components/Services"),         { ssr: false, loading: () => <SectionSkeleton /> });
const Testimonials     = dynamic(() => import("@/components/Testimonials"),     { ssr: false, loading: () => <SectionSkeleton /> });
const Footer           = dynamic(() => import("@/components/Footer"),           { ssr: false, loading: () => <SectionSkeleton /> });
const ChatbotWidget    = dynamic(() => import("@/components/ChatbotWidget"),    { ssr: false });

// ─── Preview Cards for removed sections ───────────────────────
const GalleryPreview   = dynamic(() => import("@/components/GalleryPreview"),  { ssr: false, loading: () => <SectionSkeleton /> });
const BlogPreview      = dynamic(() => import("@/components/BlogPreview"),     { ssr: false, loading: () => <SectionSkeleton /> });

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent overflow-x-hidden">
      <TopBanner />
      <Navbar />
      <HeroCarousel />
      <Suspense fallback={<SectionSkeleton />}><BookConsultation /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><Services /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><GalleryPreview /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><Testimonials /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><BlogPreview /></Suspense>
      <Suspense fallback={<SectionSkeleton />}><Footer /></Suspense>
      <ChatbotWidget />
      <CustomCursor />
    </main>
  );
}
