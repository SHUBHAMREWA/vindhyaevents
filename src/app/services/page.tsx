"use client";

import PageLayout from "@/components/PageLayout";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Flower2,
  Camera,
  Music,
  Utensils,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
  HeartHandshake,
  Star,
  PhoneCall,
  Crown,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useInstantContent } from "@/lib/cache/useInstantContent";

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L.057 23.492a.75.75 0 0 0 .904.964l5.805-1.524A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.962-1.358l-.355-.211-3.683.966.983-3.595-.232-.369A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
  </svg>
);

const allServices = [
  {
    icon: Calendar,
    title: "Full Wedding Planning & Coordination",
    subtitle: "Roka Se Vidai Tak Royal Management",
    description:
      "Comprehensive end-to-end wedding management tailored for traditional Indian rituals — Muhurat timelines, royal venue selection, vendor negotiation, and dedicated day-of event coordination.",
    image:
      "https://images.unsplash.com/photo-1724847664960-5060a1ae8259?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Custom 12-month wedding timeline & rasam checklist",
      "Venue selection & contract negotiations across Rewa & MP",
      "Dedicated lead wedding coordinator on event day",
      "Guest RSVP, hotel room allocations & welcome hampers",
    ],
  },
  {
    icon: Flower2,
    title: "Floral & Mandap Stage Décor",
    subtitle: "Grand Palace Mandaps & Marigold Artistry",
    description:
      "Mesmerizing royal mandap installations, marigold & red rose cascades, illuminated entrance walkways, and majestic VIP stage seating reflecting your family's royal heritage.",
    image:
      "https://images.unsplash.com/photo-1719499809556-070ec0dfda8b?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Traditional Shahi & modern pastel theme mandap setups",
      "Fresh exotic orchids, desi genda & red rose arrangements",
      "Intelligent warm LED chandeliers & fairy light ambience",
      "Thematic photobooths, selfie zones & floral arches",
    ],
  },
  {
    icon: Camera,
    title: "Photography & Cinematic Videography",
    subtitle: "Royal Candid Portraits & 4K Teaser Films",
    description:
      "Top-tier Indian wedding photography capturing raw candid emotions, bridal portraits, drone aerial coverage, and Bollywood-style cinematic trailers.",
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Royal bridal portraits & candid emotional ceremony moments",
      "4K cinematic wedding trailer & full documentary films",
      "Pre-wedding shoot at scenic heritage spots in Rewa & MP",
      "Luxury velvet & leather-bound customized photo albums",
    ],
  },
  {
    icon: Music,
    title: "Sangeet, DJ & Live Entertainment",
    subtitle: "High-Energy Bollywood Nights & Live Dhol",
    description:
      "Concert-grade line array sound systems, dynamic truss lighting, celebrity DJs, family dance choreographers, and traditional energetic Punjabi Dhol troupes.",
    image:
      "https://images.unsplash.com/photo-1766113483422-7c871de23591?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Bollywood choreographers for family sangeet performances",
      "Concert-style LED stage walls & intelligent beam lighting",
      "Cold pyros, dry ice low fog & celebratory paper blast effects",
      "Traditional energetic Shehnai & Dhol Tasha teams",
    ],
  },
  {
    icon: Utensils,
    title: "Royal Catering & Gourmet Banquets",
    subtitle: "Shahi Dawat, Live Chaat & Multi-Cuisine Feasts",
    description:
      "Authentic Indian wedding feasts crafted by master chefs — Bundelkhandi royal delicacies, live chaat stalls, North Indian curries, and gourmet dessert counters.",
    image:
      "https://images.unsplash.com/photo-1732259495388-af40b972c311?auto=format&fit=crop&w=1200&q=80",
    features: [
      "100% pure vegetarian & customized royal gourmet menus",
      "Authentic Bundelkhandi, Awadhi & Mughlai royal delicacies",
      "Live chaat counters, tandoori breads, mocktail bars & mithai",
      "Gleaming copper chafing dishes & trained white-glove staff",
    ],
  },
  {
    icon: Sparkles,
    title: "Royal Baraat & Vintage Hospitality",
    subtitle: "Majestic Groom Processions & Grand Swagat",
    description:
      "Make the groom's entry legendary with vintage convertibles, royal decorated chariots, synchronized brass bands, and royal aarti guest reception.",
    image:
      "https://images.unsplash.com/photo-1754782921197-ba8514594184?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Vintage open cars & decorated royal chariot / horse setups",
      "Synchronized royal brass band & percussion musicians",
      "Traditional aarti, ittar spray & flower shower swagat team",
      "Custom royal safa & pagdi tying masters for all baratis",
    ],
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

const packages = [
  {
    name: "Silver Elegance",
    tagline: "Ideal for Intimate & Sangeet Functions",
    priceRange: "₹2.5L - ₹4.5L",
    popular: false,
    highlights: [
      "Stage & entrance floral décor",
      "Complete ambient lighting & sound",
      "Event day coordination staff",
      "Standard candid photography coverage",
      "Standard welcome backdrop setup",
    ],
  },
  {
    name: "Royal Heritage",
    tagline: "Our Signature Luxury Wedding Experience",
    priceRange: "₹5.0L - ₹9.0L",
    popular: true,
    highlights: [
      "Full grand mandap & palace theme stage",
      "Exotic flower pathways & photobooths",
      "Cinematic 4K video + drone aerial shots",
      "Full Sangeet audio/visual & light truss setup",
      "Royal Baraat chariot or vintage car entry",
      "Dedicated senior event planner 24/7",
    ],
  },
  {
    name: "Empress Bespoke",
    tagline: "All-Inclusive Multi-Day Grand Celebration",
    priceRange: "₹10L+",
    popular: false,
    highlights: [
      "Multi-day coverage (Haldi, Mehendi, Sangeet, Wedding)",
      "Exclusive celebrity decor concepts & 3D renders",
      "Luxury hospitality & airport guest transit",
      "Gourmet catering management & live counters",
      "Designer albums & same-day social media reel edits",
      "Comprehensive end-to-end wedding director",
    ],
  },
];

interface ServiceItem {
  icon: any;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
}

export default function ServicesPage() {
  const { phone, telLink, getWhatsAppLink, siteName } = useSettings();
  const { content } = useInstantContent();

  const displayedServices: ServiceItem[] =
    content.services && content.services.length > 0
      ? content.services.map((svc: any, idx: number): ServiceItem => {
          const fallback = allServices[idx] || allServices[0];
          return {
            icon: iconMap[svc.iconName] || fallback.icon,
            title: svc.title || fallback.title,
            subtitle: svc.category ? `${svc.category} • Royal Service` : fallback.subtitle,
            description: svc.shortDescription || svc.description || fallback.description,
            image: svc.coverImage?.url || svc.image || fallback.image,
            features:
              Array.isArray(svc.features) && svc.features.length > 0
                ? (svc.features as string[])
                : fallback.features,
          };
        })
      : allServices;

  return (
    <PageLayout
      badge="What We Offer"
      title="Our Wedding Services"
      subtitle="From royal stage decorations and majestic baraat entries to bespoke catering and photography — every detail of your special day crafted to perfection."
    >
      {/* ── All Services Grid ─────────────────────────────────── */}
      <section className="py-8 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
            <span
              className="inline-block px-3.5 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase mb-2 md:mb-3"
              style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}
            >
              Tailored For Your Traditions
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-2 md:mb-4">
              Comprehensive Wedding Services
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg">
              Explore our wide array of bespoke wedding solutions designed to create timeless memories for you and your guests across Madhya Pradesh.
            </p>
          </div>

          {/* ── Horizontal Service Cards ────────────────────────────── */}
          <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto">
            {displayedServices.map((svc, idx) => {
              const Icon = svc.icon;
              const waMessage = `Namaste ${siteName || "RIWAJ Events"}! 🙏 I am interested in your "${svc.title}" service. Please share package details, pricing, and availability.`;
              const waUrl = getWhatsAppLink(waMessage);

              return (
                <motion.div
                  key={svc.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row group"
                >
                  {/* Left Column: Landscape Photo */}
                  <div className="relative w-full md:w-5/12 lg:w-[420px] min-h-[240px] sm:min-h-[280px] md:min-h-[340px] overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 420px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/75 via-black/30 to-transparent" />

                    {/* Floating Service Badge & Icon */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg backdrop-blur-md"
                        style={{ background: "var(--c-primary)" }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md border border-white/20 shadow-md">
                        {svc.subtitle}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 text-white/80 text-[11px] font-mono font-semibold hidden md:block">
                      ✦ Royal Service 0{idx + 1}
                    </div>
                  </div>

                  {/* Right Column: Details & Action Buttons */}
                  <div className="p-6 sm:p-7 md:p-8 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}
                        >
                          Signature Experience
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-xl sm:text-2xl md:text-2xl text-gray-900 mb-2.5 group-hover:text-rose-600 transition-colors">
                        {svc.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                        {svc.description}
                      </p>

                      {/* 2-Column Features Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-4 pt-4 border-t border-gray-100">
                        {svc.features.map((feat: string, fidx: number) => (
                          <div key={fidx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 font-medium">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-sm hover:shadow-md active:scale-[0.98]"
                        title={`Send WhatsApp message about ${svc.title}`}
                      >
                        <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                        <span>Send Message for This Service</span>
                      </a>

                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-rose-50 hover:bg-rose-100 text-rose-700"
                      >
                        <span>Book Consultation</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      {telLink && (
                        <a
                          href={telLink}
                          className="hidden lg:inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors ml-auto"
                          title="Call RIWAJ Office"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
                          <span>Call RIWAJ</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Wedding Packages Comparison ──────────────────────── */}
      <section className="py-20 bg-rose-50/40 border-y border-rose-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-3"
              style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}
            >
              Transparent Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
              Popular Celebration Packages
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Every wedding is unique. We provide customizable packages tailored precisely to your guest count, venue, and design aspirations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  pkg.popular
                    ? "bg-white shadow-2xl border-2 border-rose-500 scale-105 z-10"
                    : "bg-white shadow-lg border border-gray-200"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[11px] font-bold rounded-full shadow-md flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div>
                  <h3 className="font-serif font-bold text-2xl text-gray-900 mb-1">{pkg.name}</h3>
                  <p className="text-xs text-gray-500 mb-6">{pkg.tagline}</p>

                  <div className="mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <span className="text-xs text-gray-500 block">Starting From</span>
                    <span className="text-2xl font-serif font-bold text-gray-900">{pkg.priceRange}</span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">*Custom quotes based on requirements</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    {pkg.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/contact"
                  className={`w-full py-3.5 rounded-xl font-bold text-xs text-center transition-all ${
                    pkg.popular
                      ? "bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white shadow-lg shadow-rose-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  Book Free Consultation
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose RIWAJ ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-3"
                style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}
              >
                Why RIWAJ
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-5 leading-tight">
                Rewa's Most Trusted Luxury Wedding Curators
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                With over a decade of dedicated craftsmanship in Madhya Pradesh, we combine timeless cultural rituals with breathtaking modern elegance.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">500+ Celebrations Executed</h4>
                    <p className="text-xs text-gray-500">Unmatched track record of flawless weddings and glowing reviews.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Stress-Free Day-of Coordination</h4>
                    <p className="text-xs text-gray-500">We manage every logistics detail so your family can celebrate freely.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">100% Transparent Estimates</h4>
                    <p className="text-xs text-gray-500">No hidden surprises. Detailed line-by-line decor and service contracts.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#2a0812] to-[#140409] text-white p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 text-amber-300">
                <PhoneCall className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-white mb-3">
                Ready to Plan Your Dream Celebration?
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mb-8 leading-relaxed">
                Connect with our senior wedding specialists for a free personalized decor walkthrough and consultation quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-lg hover:opacity-95 transition-all"
                >
                  Book Free Consultation
                </Link>
                <a
                  suppressHydrationWarning
                  href={telLink}
                  className="px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <span suppressHydrationWarning>Call {phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
