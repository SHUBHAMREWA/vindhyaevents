"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Slider from "react-slick";
import { Quote, Heart } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useInstantContent } from "@/lib/cache/useInstantContent";

export interface TestimonialItem {
  _id?: string;
  name: string;
  image?: string;
  review: string;
  rating: number;
  weddingType?: string;
  location?: string;
}

interface TestimonialsProps {
  testimonials?: TestimonialItem[];
}

export default function Testimonials({ testimonials = [] }: TestimonialsProps) {
  const { content } = useInstantContent();
  const [items, setItems] = useState<TestimonialItem[]>(testimonials || []);

  useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      setItems(testimonials);
      return;
    }

    if (content.testimonials && content.testimonials.length > 0) {
      const mapped: TestimonialItem[] = content.testimonials.map((t: any) => ({
        _id: t._id,
        name: t.coupleName || t.name,
        image: t.image?.url || t.image || "",
        review: t.reviewText || t.review,
        rating: t.rating || 5,
        weddingType: t.weddingType || "Royal Wedding Celebration",
        location: t.location || "Rewa, MP",
      }));
      setItems(mapped);
      return;
    }

    let isMounted = true;
    fetch("/api/public/testimonials", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && data.success && Array.isArray(data.testimonials)) {
          const mapped: TestimonialItem[] = data.testimonials.map((t: any) => ({
            _id: t._id,
            name: t.coupleName || t.name,
            image: t.image?.url || t.image || "",
            review: t.reviewText || t.review,
            rating: t.rating || 5,
            weddingType: t.weddingType || "Royal Wedding Celebration",
            location: t.location || "Rewa, MP",
          }));
          setItems(mapped);
        }
      })
      .catch((err) => {
        console.error("Failed to load testimonials:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [testimonials, content.testimonials]);

  if (!items || items.length === 0) {
    return null;
  }

  const count = items.length;
  const slidesToShow = Math.min(3, Math.max(1, count));

  const settings = {
    dots: count > 1,
    infinite: count > 3,
    speed: 600,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: count > 3,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, Math.max(1, count)),
          slidesToScroll: 1,
          infinite: count > 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: count > 1,
        },
      },
    ],
    appendDots: (dots: React.ReactNode) => (
      <div className="mt-10">
        <ul className="flex justify-center gap-2"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2.5 h-2.5 rounded-full bg-rose-200 hover:bg-rose-500 transition-all duration-300" />
    ),
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-rose-50/20 to-white" id="testimonials">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div
            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}
          >
            Real Love Stories
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-rose-900 mb-4 font-bold tracking-tight">
            What Our User Says
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base">
            Real celebrations, royal experiences, and cherished memories from families across Madhya Pradesh
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto testimonial-slider">
          <Slider {...settings}>
            {items.map((testimonial, index) => (
              <div key={testimonial._id || index} className="outline-none px-3 py-2 h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="h-full flex flex-col justify-between bg-white p-7 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl border border-rose-100/70 relative group"
                >
                  {/* Top Quote & Rating */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      {/* Star Rating */}
                      <div className="flex gap-1">
                        {[...Array(Math.min(5, Math.max(1, testimonial.rating || 5)))].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-amber-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <Quote className="w-8 h-8 text-rose-300/40 group-hover:text-rose-400/70 transition-colors" />
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 italic line-clamp-4">
                      &ldquo;{testimonial.review}&rdquo;
                    </p>
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-3.5 pt-4 border-t border-rose-100/70">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-gradient-to-tr from-rose-400 to-amber-300 flex items-center justify-center">
                      {testimonial.image ? (
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-serif font-bold text-lg">
                          <Heart className="w-5 h-5 text-white fill-white/50" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-serif text-base font-bold text-gray-900 truncate">
                        {testimonial.name}
                      </h4>
                      {testimonial.weddingType && (
                        <p className="text-xs text-rose-600 font-medium truncate">
                          {testimonial.weddingType}
                          {testimonial.location ? ` • ${testimonial.location}` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
