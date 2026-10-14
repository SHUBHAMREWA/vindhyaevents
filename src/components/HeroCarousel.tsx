"use client";

import { useState, useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useSettings } from "@/context/SettingsContext";
import { HeroShimmerSkeleton } from "@/components/HomeSkeletons";

const fallbackSlides = [
  {
    image: "/girlsimg.webp",
    // H1 slide — contains primary SEO keyword
    title: "Wedding Planner in Rewa, Madhya Pradesh",
    subtitle: "300+ Love Stories Crafted Since 2021 — Your Dream Wedding Awaits",
    ctaText: "Book Consultation",
    ctaLink: "/contact",
  },
  {
    image: "/dercoration1.webp",
    title: "Celebrating Every Tradition",
    subtitle: "आपके रीति-रिवाज़ को खूबसूरत सजावट के साथ मनाएं",
    ctaText: "Book Consultation",
    ctaLink: "/contact",
  },
  {
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    title: "Full-Service Wedding Planning",
    subtitle: "From Mehndi to Baraat — Every Detail Perfectly Managed",
    ctaText: "Book Consultation",
    ctaLink: "/contact",
  },
  {
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    title: "Luxury Décor & Floral Design",
    subtitle: "Transforming Venues into Breathtaking Celebrations",
    ctaText: "Book Consultation",
    ctaLink: "/contact",
  },
  {
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    title: "Elegant Sangeet & Reception",
    subtitle: "Creating Unforgettable Moments for You and Your Guests",
    ctaText: "Book Consultation",
    ctaLink: "/contact",
  },
  {
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=80",
    title: "Photography & Videography",
    subtitle: "Preserving Your Precious Memories Forever",
    ctaText: "Book Consultation",
    ctaLink: "/contact",
  },
];

export interface HeroSlideInput {
  title: string;
  subtitle: string;
  image: any;
  ctaText?: string;
  ctaLink?: string;
}

export default function HeroCarousel({ slides: propSlides }: { slides?: HeroSlideInput[] }) {
  const { heroSlides, mounted } = useSettings();
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider | null>(null);
  const { theme } = useTheme();
  const router = useRouter();

  // If client has not mounted and no server slides provided, show luxury shimmer skeleton
  if (!mounted && (!propSlides || propSlides.length === 0)) {
    return <HeroShimmerSkeleton />;
  }

  const rawSlides = propSlides && propSlides.length > 0
    ? propSlides
    : heroSlides && heroSlides.length > 0
    ? heroSlides
    : fallbackSlides;

  const slides = rawSlides.map((s: any, idx: number) => {
    let imgSrc = s.image?.url || s.image || (idx === 0 ? "/girlsimg.webp" : "/dercoration1.webp");
    if (!imgSrc) imgSrc = "/girlsimg.webp";
    return {
      image: imgSrc,
      title: s.title || "Wedding Planner in Rewa, Madhya Pradesh",
      subtitle: s.subtitle || "Celebrating Every Tradition",
      ctaText: s.ctaText || "Book Consultation",
      ctaLink: s.ctaLink || "/contact",
    };
  });

  const settings = {
    dots: true,
    infinite: slides.length > 1,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: slides.length > 1,
    autoplaySpeed: 4500,
    fade: true,
    pauseOnHover: false,
    lazyLoad: "ondemand" as const,
    cssEase: "ease-in-out",
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-6 sm:bottom-8 w-full z-30 pointer-events-auto">
        <ul className="flex justify-center gap-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white transition-all duration-300" />
    ),
  };

  return (
    <div className="relative h-[80vh] overflow-hidden mt-[88px]" id="home">
      {/* Prev */}
      {slides.length > 1 && (
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition text-xl font-light"
        >
          ‹
        </button>
      )}

      {/* Next */}
      {slides.length > 1 && (
        <button
          onClick={() => sliderRef.current?.slickNext()}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition text-xl font-light"
        >
          ›
        </button>
      )}

      <Slider ref={sliderRef} {...settings} className="h-full">
        {slides.map((slide, index) => (
          <div key={index} className="relative h-[80vh] outline-none">
            {/* Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover"
                quality={index === 0 ? 85 : 65}
                sizes="100vw"
                {...(index === 0 ? { fetchPriority: "high" } : {})}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10" />
            </div>

            {/* Text — CSS animation */}
            {currentSlide === index && (
              <div className="relative z-30 h-full flex items-center justify-center text-center px-4 sm:px-6">
                <div className="hero-text-enter max-w-4xl mx-auto">
                  {/* H1 for first slide (SEO primary heading), H2 for rest */}
                  {index === 0 ? (
                    <h1 className="text-white text-3xl sm:text-5xl md:text-6xl mb-4 font-serif font-bold tracking-tight leading-tight hero-text-shadow">
                      {slide.title}
                    </h1>
                  ) : (
                    <h2 className="text-white text-3xl sm:text-5xl md:text-6xl mb-4 font-serif font-bold tracking-tight leading-tight hero-text-shadow">
                      {slide.title}
                    </h2>
                  )}
                  <p className="text-white/95 text-base sm:text-xl md:text-2xl font-medium mb-8 max-w-2xl mx-auto leading-relaxed hero-subtitle-shadow">
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => {
                      if (slide.ctaLink?.startsWith("#")) {
                        document.querySelector(slide.ctaLink)?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        router.push(slide.ctaLink || "/contact");
                      }
                    }}
                    className="px-9 py-3.5 sm:px-11 sm:py-4 text-white text-sm sm:text-base rounded-full transition-all duration-200 hover:opacity-95 hover:scale-105 shadow-[0_4px_25px_rgba(0,0,0,0.5)] font-semibold tracking-wide"
                    style={{
                      background: `linear-gradient(to right, ${theme.vars["--c-primary"]}, ${theme.vars["--c-primary-dark"]})`,
                    }}
                  >
                    {slide.ctaText || "Book Consultation"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
}
