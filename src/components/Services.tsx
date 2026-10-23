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
      "End-to-end royal wedding management from Roka to Vidai. Complete budget, muhurat timelines & flawless day-of execution.",
    image: "https://images.unsplash.com/photo-1724847664960-5060a1ae8259?auto=format&fit=crop&w=1080&q=80",
  },
  {
    icon: Flower2,
    title: "Mandap & Floral Décor",
    description:
      "Grand palace mandaps, fresh marigold and red rose cascades, illuminated entrance walkways & royal stage seating.",
    image: "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=1080&q=80",
  },
  {
    icon: Camera,
    title: "Photography & Videography",
    description:
      "Royal bridal portraits, candid ceremony moments, 4K cinematic teasers & drone aerial coverage in Rewa and MP.",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1080&q=80",
  },
  {
    icon: Music,
    title: "Sangeet & Entertainment",
    description:
      "Concert-grade sound & lighting truss, high-energy wedding DJs, family choreographers & live Punjabi Dhol troupes.",
    image: "https://images.unsplash.com/photo-1766113483422-7c871de23591?auto=format&fit=crop&w=1080&q=80",
  },
  {
    icon: Utensils,
    title: "Royal Catering Services",
    description:
      "Shahi Dawat multi-course banquets, authentic Bundelkhandi royal delicacies, live chaat stalls & dessert stations.",
    image: "https://images.unsplash.com/photo-1732259495388-af40b972c311?auto=format&fit=crop&w=1080&q=80",
  },
  {
    icon: Sparkles,
    title: "Royal Baraat & Hospitality",
    description:
      "Vintage open car processions, decorated royal chariots, brass band musicians & royal aarti guest welcome teams.",
    image: "https://images.unsplash.com/photo-1754782921197-ba8514594184?auto=format&fit=crop&w=1080&q=80",
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {displayServices.map((service: any, index: number) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden group rounded-3xl border border-gray-100 flex flex-col sm:flex-row"
              >
                {/* Image (Left Column on tablet/desktop) */}
                <div className="relative sm:w-5/12 min-h-[200px] sm:min-h-full overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    loading="lazy"
                    quality={70}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                  
                  {/* Icon on Image */}
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-rose-500" />
                  </div>
                </div>

                {/* Content (Right Column) */}
                <div className="sm:w-7/12 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-gray-900 mb-2 group-hover:text-rose-600 transition-colors" style={{ color: "var(--c-footer-from)" }}>
                      {service.title}
                    </h3>

                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 font-medium line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <Link href="/services" className="inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300 text-xs font-bold hover:opacity-80" style={{ color: "var(--c-primary)" }}>
                      <span>View Details</span>
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

                    <Link href="/contact" className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors">
                      Book Service →
                    </Link>
                  </div>
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