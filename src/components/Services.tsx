"use client";

import { motion } from "motion/react";
import { Calendar, Flower2, Camera, Music, Utensils, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useInstantContent } from "@/lib/cache/useInstantContent";
import { ServicesShimmerSkeleton } from "@/components/HomeSkeletons";

const defaultServices = [
  {
    icon: Calendar,
    title: "Full Wedding Planning",
    description:
      "Comprehensive planning from start to finish. We handle every detail so you can enjoy your engagement stress-free.",
    image: "https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1080&q=80",
  },
  {
    icon: Flower2,
    title: "Floral Design",
    description:
      "Custom floral arrangements that bring your vision to life with stunning beauty and elegance.",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1080&q=80",
  },
  {
    icon: Camera,
    title: "Photography & Videography",
    description:
      "Professional photographers and videographers to capture every precious moment of your special day.",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1080&q=80",
  },
  {
    icon: Music,
    title: "Entertainment",
    description:
      "Curated music and entertainment options to create the perfect atmosphere for your celebration.",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1080&q=80",
  },
  {
    icon: Utensils,
    title: "Catering Services",
    description:
      "Exquisite culinary experiences from renowned chefs, tailored to your taste and dietary needs.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1080&q=80",
  },
  {
    icon: Sparkles,
    title: "Venue Decoration",
    description:
      "Transform any space into a magical setting with our expert decoration and styling services.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1080&q=80",
  },
];

const iconMap: Record<string, any> = {
  Calendar,
  Flower2,
  Camera,
  Music,
  Utensils,
  Sparkles,
};

export default function Services() {
  const { content, isLoading } = useInstantContent();

  const displayServices = content.services && content.services.length > 0
    ? content.services.map((s: any) => ({
        icon: iconMap[s.iconName] || Sparkles,
        title: s.title,
        description: s.shortDescription || s.description || "",
        image: s.coverImage?.url || s.image || defaultServices[0].image,
      }))
    : defaultServices;
  return (
    <section className="py-24 bg-gradient-to-b from-white to-rose-50/30" id="services">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-6 py-2.5 bg-gradient-to-r from-rose-100 to-amber-100 text-rose-600 mb-6 shadow-sm rounded-full">
            What We Offer
          </div>
          <h2 className="mb-6" style={{ color: "var(--c-footer-from)" }}>Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Comprehensive wedding services designed to make your special day
            absolutely perfect
          </p>
        </motion.div>

        {isLoading && (!content.services || content.services.length === 0) ? (
          <ServicesShimmerSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {displayServices.map((service: any, index: number) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className="bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group rounded-3xl border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    loading="lazy"
                    quality={70}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Icon on Image */}
                  <div className="absolute top-4 left-4 w-14 h-14 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-rose-500" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-3" style={{ color: "var(--c-footer-from)" }}>
                    {service.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-4 font-medium">
                    {service.description}
                  </p>

                  <Link href="/contact" className="inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-300 font-medium hover:opacity-80" style={{ color: "var(--c-primary)" }}>
                    Inquire for Service
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white shadow-lg transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(to right, var(--c-primary), var(--c-primary-dark))",
            }}
          >
            <span>View All Services & Packages</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}