"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// ─── Critical (Above-the-fold) ────────────────────────────────
import Navbar from "@/components/Navbar";

// ─── SSR OFF + Lazy loaded components ─────────────────────────
const TopBanner = dynamic(() => import("@/components/TopBanner"), {
  ssr: false,
});

const HeroCarousel = dynamic(() => import("@/components/HeroCarousel"), {
  ssr: false,
  loading: () => (
    <div className="h-[80vh] mt-[88px] bg-gradient-to-br from-rose-100 to-amber-50 animate-pulse flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-rose-300 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

// ─── Below-the-fold: Lazy loaded with skeleton ────────────────
const SectionSkeleton = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
  </div>
);

const BookConsultation = dynamic(
  () => import("@/components/BookConsultation"),
  {
    ssr: false,
    loading: () => <SectionSkeleton />,
  }
);

const Services = dynamic(() => import("@/components/Services"), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const Gallery = dynamic(() => import("@/components/Gallery"), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const AboutSection = dynamic(() => import("@/components/AboutSection"), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const VisionSection = dynamic(() => import("@/components/VisionSection"), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const BlogSection = dynamic(() => import("@/components/BlogSection"), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const ChatbotWidget = dynamic(() => import("@/components/ChatbotWidget"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent overflow-x-hidden">
      <TopBanner />
      <Navbar />
      <HeroCarousel />
      <Suspense fallback={<SectionSkeleton />}>
        <BookConsultation />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Services />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Gallery />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <AboutSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <VisionSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <BlogSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Footer />
      </Suspense>
      <ChatbotWidget />
    </main>
  );
}
