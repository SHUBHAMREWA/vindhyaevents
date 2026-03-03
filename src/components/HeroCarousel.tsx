"use client";

import { useState, useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import girlImg from "../../public/girlsimg.png";
import decoration1img from "../../public/dercoration1.png";
import { useTheme } from "@/context/ThemeContext";

const slides = [
  {
    image: girlImg,
    // H1 slide — contains primary SEO keyword
    title: "Wedding Planner in Rewa, Madhya Pradesh",
    subtitle: "500+ Love Stories Crafted Since 2013 — Your Dream Wedding Awaits",
  },
  {
    image: decoration1img,
    title: "Celebrating Every Tradition",
    subtitle: "आपके रीति-रिवाज़ को खूबसूरत सजावट के साथ मनाएं",
  },
  {
    image: "https://images.unsplash.com/photo-1724847664960-5060a1ae8259?w=1200&q=75",
    title: "Full-Service Wedding Planning",
    subtitle: "From Mehndi to Baraat — Every Detail Perfectly Managed",
  },
  {
    image: "https://images.unsplash.com/photo-1732382643619-872165f61891?w=1200&q=75",
    title: "Luxury Décor & Floral Design",
    subtitle: "Transforming Venues into Breathtaking Celebrations",
  },
  {
    image: "https://images.unsplash.com/photo-1719468452346-20bbb785de2e?w=1200&q=75",
    title: "Elegant Sangeet & Reception",
    subtitle: "Creating Unforgettable Moments for You and Your Guests",
  },
  {
    image: "https://images.unsplash.com/photo-1640745685024-af4663065ce3?w=1200&q=75",
    title: "Photography & Videography",
    subtitle: "Preserving Your Precious Memories Forever",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider | null>(null);
  const { theme } = useTheme();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500, // longer = less forced reflow
    fade: true,
    pauseOnHover: false,
    lazyLoad: "ondemand" as const,
    cssEase: "ease-in-out",
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-8 w-full">
        <ul className="flex justify-center gap-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-all duration-300" />
    ),
  };

  return (
    <div className="relative h-[80vh] overflow-hidden mt-[88px]" id="home">
      {/* Prev */}
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition text-xl font-light"
      >
        ‹
      </button>

      {/* Next */}
      <button
        onClick={() => sliderRef.current?.slickNext()}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition text-xl font-light"
      >
        ›
      </button>

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
                // fetchPriority for the LCP element
                {...(index === 0 ? { fetchPriority: "high" } : {})}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10" />
            </div>

            {/* Text — CSS animation, no Framer Motion */}
            {currentSlide === index && (
              <div className="relative z-30 h-full flex items-center justify-center text-center px-6">
                <div className="hero-text-enter max-w-4xl">
                  {/* H1 for first slide (SEO primary heading), H2 for rest */}
                  {index === 0 ? (
                    <h1 className="text-white text-4xl md:text-6xl mb-4 font-serif drop-shadow-lg">
                      {slide.title}
                    </h1>
                  ) : (
                    <h2 className="text-white text-4xl md:text-6xl mb-4 font-serif drop-shadow-lg">
                      {slide.title}
                    </h2>
                  )}
                  <p className="text-white/90 text-xl md:text-2xl font-medium drop-shadow-md mb-8">
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => scrollToSection("consultation")}
                    className="px-10 py-4 text-white rounded-full transition-all duration-200 hover:opacity-90 hover:scale-105 shadow-xl font-medium"
                    style={{
                      background: `linear-gradient(to right, ${theme.vars["--c-primary"]}, ${theme.vars["--c-primary-dark"]})`,
                    }}
                  >
                    Book Consultation
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
