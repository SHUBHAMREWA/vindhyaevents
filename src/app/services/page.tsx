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

const allServices = [
  {
    icon: Calendar,
    title: "Full Wedding Planning & Coordination",
    subtitle: "End-to-End Stress-Free Management",
    description:
      "Comprehensive wedding management from initial concept and budget formulation to vendor coordination, guest logistics, and day-of execution.",
    image:
      "https://images.unsplash.com/photo-1519225429980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Custom 12-month wedding timeline & checklist",
      "Venue selection & contract negotiations across Rewa & MP",
      "Dedicated lead wedding coordinator on event day",
      "Guest RSVP, room allocations & welcome hamper setup",
    ],
  },
  {
    icon: Flower2,
    title: "Floral & Mandap Stage Décor",
    subtitle: "Custom Themes & Royal Floral Artistry",
    description:
      "Mesmerizing mandap installations, floral entrance pathways, royal seating stages, and enchanting tablescapes designed to reflect your family traditions.",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1080&q=80",
    features: [
      "Traditional & modern theme mandap setups",
      "Fresh exotic and local flower arrangements",
      "Intelligent LED & fairy light ambiences",
      "Thematic photobooths & selfie zones",
    ],
  },
  {
    icon: Camera,
    title: "Photography & Cinematic Videography",
    subtitle: "Preserving Every Precious Moment",
    description:
      "Top-tier wedding photography team capturing raw candid emotions, drone aerial shots, teaser trailers, and timeless cinematic wedding films.",
    image:
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1080&q=80",
    features: [
      "Candid & traditional high-resolution coverage",
      "4K cinematic wedding trailer & full documentary",
      "Pre-wedding shoot with custom locations",
      "Designer luxury hardbound photo albums",
    ],
  },
  {
    icon: Music,
    title: "Sangeet, DJ & Live Entertainment",
    subtitle: "Electrifying Nights of Music & Dance",
    description:
      "State-of-the-art concert sound systems, dynamic truss lighting, professional DJs, celebrity choreographers, and live folk artists.",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1080&q=80",
    features: [
      "Celebrity & wedding choreographers for family sangeet",
      "Bass-pumping club sound & intelligent beam lighting",
      "Cold pyros, dry ice fog & paper blast effects",
      "Traditional Shehnai & Dhol tasha troupes",
    ],
  },
  {
    icon: Utensils,
    title: "Royal Catering & Gourmet Banquets",
    subtitle: "Unforgettable Multi-Cuisine Feasts",
    description:
      "Mouthwatering gastronomic experiences crafted by certified culinary masters, offering traditional regional delicacies alongside international cuisines.",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1080&q=80",
    features: [
      "Pure vegetarian & customized gourmet options",
      "Authentic Bundelkhandi & North Indian royal feasts",
      "Live chaat counters, mocktail bars & dessert stations",
      "High-grade food safety & trained white-glove staff",
    ],
  },
  {
    icon: Sparkles,
    title: "Royal Baraat & Vintage Hospitality",
    subtitle: "Grand Processions & Warm Welcome",
    description:
      "Make your groom entrance legendary with vintage cars, decorated royal chariots, horse/elephant processions, and traditional welcome tilak ceremonies.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1080&q=80",
    features: [
      "Vintage open convertibles & luxury chariot setups",
      "Synchronized brass band & percussion musicians",
      "Aarti & flower shower guest welcome teams",
      "Custom safa / pagdi tying experts for baratis",
    ],
  },
];

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

export default function ServicesPage() {
  const { phone, telLink } = useSettings();

  return (
    <PageLayout
      badge="What We Offer"
      title="Our Wedding Services"
      subtitle="From royal stage decorations and majestic baraat entries to bespoke catering and photography — every detail of your special day crafted to perfection."
    >
      {/* ── All Services Grid ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-3"
              style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}
            >
              Tailored For Your Traditions
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Comprehensive Wedding Services
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Explore our wide array of bespoke wedding solutions designed to create timeless memories for you and your guests across Madhya Pradesh.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allServices.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                        style={{ background: "var(--c-primary)" }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold tracking-wide uppercase text-white/80">
                          {svc.subtitle}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-gray-900 mb-2.5">
                        {svc.title}
                      </h3>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-5">
                        {svc.description}
                      </p>

                      <div className="space-y-2 mb-6 pt-4 border-t border-gray-100">
                        {svc.features.map((feat, fidx) => (
                          <div key={fidx} className="flex items-start gap-2 text-xs text-gray-700">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold transition-all duration-200 border hover:text-white"
                      style={{
                        borderColor: "var(--c-primary)",
                        color: "var(--c-primary)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "var(--c-primary)";
                        (e.currentTarget as HTMLElement).style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "";
                        (e.currentTarget as HTMLElement).style.color = "var(--c-primary)";
                      }}
                    >
                      <span>Inquire About This Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
