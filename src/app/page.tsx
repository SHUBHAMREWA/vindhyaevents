"use client";

import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import BookConsultation from "@/components/BookConsultation";
import Services from "@/components/Services";
import ContactSection from "@/components/ContactSection";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import AboutSection from "@/components/AboutSection";
import VisionSection from "@/components/VisionSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";
import TopBanner from "@/components/TopBanner";

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
