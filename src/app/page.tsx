"use client";

import dynamic from "next/dynamic";

import Navbar from "@/components/Navbar";
import BookConsultation from "@/components/BookConsultation";
import Services from "@/components/Services";
import ContactSection from "@/components/ContactSection";
import AboutSection from "@/components/AboutSection";
import VisionSection from "@/components/VisionSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

// 🔴 SSR OFF components
const HeroCarousel = dynamic(() => import("@/components/HeroCarousel"), {
  ssr: false,
});

const Gallery = dynamic(() => import("@/components/Gallery"), {
  ssr: false,
});

const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  ssr: false,
});

const ChatbotWidget = dynamic(() => import("@/components/ChatbotWidget"), {
  ssr: false,
});

const TopBanner = dynamic(() => import("@/components/TopBanner"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <TopBanner />
      <Navbar />
      <HeroCarousel />
      <BookConsultation />
      <Services />
      <ContactSection />
      <Gallery />
      <Testimonials />
      <AboutSection />
      <VisionSection />
      <BlogSection />
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
