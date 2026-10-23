import { Metadata } from "next";
import { notFound } from "next/navigation";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import {
  Sparkles,
  Phone,
  MessageSquare,
  CheckCircle,
  Calendar,
  Star,
  ShieldCheck,
  Heart,
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  Mic,
  Trophy,
  Music,
  Camera,
  Flower2,
  Crown,
  Users,
  Briefcase,
  Layers,
  UtensilsCrossed,
  ChefHat,
  Palette,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import ClientWidgets from "@/components/ClientWidgets";
import BookConsultation from "@/components/BookConsultation";
import EventFaqAccordion from "@/components/EventFaqAccordion";
import { ALL_EVENTS, getEventBySlug } from "@/data/eventRoutes";
import { getSiteSettings } from "@/lib/getSiteSettings";
import connectToDatabase from "@/lib/db";
import { SubCategory } from "@/lib/models/SubCategory";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ eventSlug: string }>;
}

export async function generateStaticParams() {
  return ALL_EVENTS.map((event) => ({
    eventSlug: event.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventSlug } = await params;
  const event = getEventBySlug(eventSlug);

  if (!event) {
    return {
      title: "Event Not Found | RIWAJ Events",
    };
  }

  const settings = await getSiteSettings();
  const phoneStr = settings.primaryPhone || "7898522932";
  const brandName = "RIWAJ Events";

  // Dynamic Image & Alt from MongoDB (Pure Database Source of Truth)
  let heroImageUrl = "";
  let heroImageAlt = `${event.menuTitle} - ${brandName}`;
  try {
    await connectToDatabase();
    const dbSub = await SubCategory.findOne({ slug: eventSlug }).lean();
    if (dbSub) {
      if (dbSub.mainImage?.url) {
        heroImageUrl = dbSub.mainImage.url;
      }
      if (dbSub.mainImage?.alt) {
        heroImageAlt = dbSub.mainImage.alt;
      }
    }
  } catch {
    // Keep fallback
  }

  if (!heroImageUrl) {
    heroImageUrl = event.heroImage || "/og-image.jpg";
  }

  // SEO Optimized: Prioritize RIWAJ brand name and multi-city event excellence
  const title = `${event.title} | ${brandName}`;
  const description = `${event.subtitle} Luxury ${event.category === "wedding" ? "wedding" : event.category === "corporate" ? "corporate" : event.category === "catering" ? "catering" : "decoration"} event planning, premium themes & flawless management by ${brandName}. Call ${phoneStr} for instant quotation.`;

  return {
    title,
    description,
    keywords: [
      brandName,
      "RIWAJ",
      "RIWAJ Wedding Planner",
      "RIWAJ Event Management",
      event.menuTitle,
      `${event.menuTitle} RIWAJ Events`,
      `${event.menuTitle} Decor & Planning`,
      `${event.menuTitle} Packages`,
      "Luxury Wedding Planner",
      "Corporate Event Management",
      "Royal Stage Decor",
      "Event Planner Central India",
    ],
    openGraph: {
      title,
      description,
      images: [
        {
          url: heroImageUrl,
          width: 1200,
          height: 630,
          alt: heroImageAlt,
        },
      ],
      type: "website",
      siteName: brandName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImageUrl],
    },
    alternates: {
      canonical: `/${event.slug}`,
    },
  };
}

// Icon helper for What We Offer cards
const getFeatureIcon = (index: number, title: string, category: string) => {
  const t = title.toLowerCase();
  if (t.includes("catering") || t.includes("food") || t.includes("chaat") || t.includes("buffet") || t.includes("biryani") || t.includes("kebab") || t.includes("curry") || t.includes("tandoor") || t.includes("sweet") || t.includes("dish")) {
    return <UtensilsCrossed className="w-6 h-6" />;
  }
  if (t.includes("chef") || t.includes("kitchen") || t.includes("recipe") || t.includes("swad") || t.includes("cook")) {
    return <ChefHat className="w-6 h-6" />;
  }
  if (t.includes("decor") || t.includes("styling") || t.includes("theme") || t.includes("design") || t.includes("art") || t.includes("arch") || t.includes("balloon")) {
    return <Palette className="w-6 h-6" />;
  }
  if (t.includes("presentation") || t.includes("conference") || t.includes("screen") || t.includes("av") || t.includes("podium")) {
    return <Mic className="w-6 h-6" />;
  }
  if (t.includes("award") || t.includes("recognition") || t.includes("trophy") || t.includes("milestone") || t.includes("pyro")) {
    return <Trophy className="w-6 h-6" />;
  }
  if (t.includes("music") || t.includes("entertainment") || t.includes("dj") || t.includes("dhol") || t.includes("dance")) {
    return <Music className="w-6 h-6" />;
  }
  if (t.includes("photo") || t.includes("video") || t.includes("coverage") || t.includes("drone") || t.includes("shoot")) {
    return <Camera className="w-6 h-6" />;
  }
  if (t.includes("flower") || t.includes("floral") || t.includes("phool") || t.includes("jhula") || t.includes("urli")) {
    return <Flower2 className="w-6 h-6" />;
  }
  if (t.includes("mandap") || t.includes("royal") || t.includes("stage") || t.includes("luxury") || t.includes("palace")) {
    return <Crown className="w-6 h-6" />;
  }
  if (t.includes("guest") || t.includes("team") || t.includes("activity") || t.includes("seating") || t.includes("hospitality")) {
    return <Users className="w-6 h-6" />;
  }

  // Fallbacks by index
  const icons = [
    <UtensilsCrossed className="w-6 h-6" key="utensil" />,
    <Palette className="w-6 h-6" key="pal" />,
    <Crown className="w-6 h-6" key="crown" />,
    <Sparkles className="w-6 h-6" key="spk" />,
    <Mic className="w-6 h-6" key="mic" />,
    <Trophy className="w-6 h-6" key="trophy" />,
  ];
  return icons[index % icons.length];
};

export default async function EventPage({ params }: Props) {
  const { eventSlug } = await params;
  const event = getEventBySlug(eventSlug);

  if (!event) {
    notFound();
  }

  // Fetch only images and alt texts from MongoDB ("hame sirf Image ko database se fetch karke show karana hai")
  let dbSub: any = null;
  try {
    await connectToDatabase();
    dbSub = await SubCategory.findOne({ slug: eventSlug }).lean();
  } catch {
    // Keep fallback to static event data
  }

  // Pure Database Source of Truth:
  // If dbSub document exists in MongoDB, respect its image state strictly.
  // If admin deleted images (empty array or blank mainImage.url), do NOT fall back to static data!
  let heroImageUrl = "";
  let heroImageAlt = `${event.title} - RIWAJ Events`;
  let showcaseImages: { url: string; alt: string }[] = [];

  if (dbSub) {
    // DB record exists: database is the single source of truth
    heroImageUrl = dbSub.mainImage?.url || "";
    heroImageAlt = dbSub.mainImage?.alt || `${event.title} - RIWAJ Events`;
    showcaseImages = (dbSub.relevantImages || [])
      .filter((img: any) => img && typeof img.url === "string" && img.url.trim().length > 0)
      .map((img: any, i: number) => ({
        url: img.url.trim(),
        alt: img.alt || `${event.menuTitle} Real Event Setup ${i + 1} - RIWAJ Events`,
      }));
  } else {
    // Only if DB is unreachable or document not seeded yet
    heroImageUrl = event.heroImage;
    showcaseImages = event.galleryImages.map((url, i) => ({
      url,
      alt: `${event.menuTitle} Real Event Setup ${i + 1} - RIWAJ Events`,
    }));
  }

  const settings = await getSiteSettings();
  const cleanWA = (settings.whatsAppNumber || "7898522932").replace(/[^0-9]/g, "");
  const fullWA = cleanWA.length === 10 ? `91${cleanWA}` : cleanWA || "917898522932";
  const displayPhone = settings.primaryPhone || "7898522932";
  const rawDigits = displayPhone.replace(/[^0-9+]/g, "");
  const telLink = `tel:${rawDigits || "7898522932"}`;

  const categoryText =
    event.category === "wedding"
      ? "Wedding"
      : event.category === "corporate"
      ? "Corporate Event"
      : event.category === "catering"
      ? "Catering"
      : "Decoration";

  // Pre-filled dynamic WhatsApp link specific to this event route
  const waLink = `https://wa.me/${fullWA}?text=Namaste%20RIWAJ%20Events!%20Mujhe%20${encodeURIComponent(
    event.menuTitle
  )}%20(${encodeURIComponent(categoryText)})%20ke%20details%20aur%20packages%20ki%20jaankari%20chahiye.`;

  // Breadcrumbs data
  const categoryLabel =
    event.category === "wedding"
      ? "Wedding"
      : event.category === "corporate"
      ? "Corporate Event"
      : event.category === "catering"
      ? "Catering Services"
      : "Decoration & Themes";

  const categoryHref =
    event.category === "wedding"
      ? "/services#wedding"
      : event.category === "corporate"
      ? "/services#corporate"
      : event.category === "catering"
      ? "/services#catering"
      : "/services#decoration";

  // Schema.org JSON-LD for SEO rich snippets
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vindhyaevents.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryLabel,
        item: `https://vindhyaevents.in${categoryHref}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: event.menuTitle,
        item: `https://vindhyaevents.in/${event.slug}`,
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${event.menuTitle} Planning & Decor`,
    serviceType:
      event.category === "wedding"
        ? "Wedding Event Management"
        : event.category === "corporate"
        ? "Corporate Event Management"
        : event.category === "catering"
        ? "Catering & Banquet Services"
        : "Wedding & Event Decoration",
    description: event.subtitle,
    provider: {
      "@type": "LocalBusiness",
      name: "RIWAJ Events",
      telephone: `+91-${displayPhone}`,
      image: event.heroImage,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Rewa",
        addressRegion: "Madhya Pradesh",
        addressCountry: "IN",
      },
    },
    areaServed: ["Rewa", "Satna", "Jabalpur", "Madhya Pradesh", "Central India"],
  };

  const faqSchema = event.faqs && event.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: event.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  } : null;

  return (
    <main className="min-h-screen bg-[#fcfcfc] overflow-x-hidden">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <TopBanner />
      <Navbar />

      {/* ── 1. Grand Event Hero Section (Proper Clearance + Breadcrumb) ── */}
      <section className="relative pt-[135px] sm:pt-[145px] md:pt-[160px] pb-16 md:pb-24 bg-gradient-to-b from-rose-50/60 via-white to-amber-50/30 overflow-hidden border-b border-gray-100">
        {/* Ambient Glow */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Breadcrumbs Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 font-medium">
            <Link href="/" className="hover:text-rose-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href={categoryHref} className="hover:text-rose-600 transition-colors">
              {categoryLabel}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-bold truncate">{event.menuTitle}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rose-200 text-rose-600 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>{event.badge}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-gray-900 leading-tight">
                {event.title}
              </h1>

              {/* Subtitle in natural Hinglish */}
              <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium">
                {event.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-rose-200 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Par Quote Maangein</span>
                </a>

                <Link
                  href="/gallery"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold text-sm shadow-sm flex items-center gap-2 transition-all hover:border-rose-300"
                >
                  <span>Hamari Photos Dekhein</span>
                  <ArrowRight className="w-4 h-4 text-rose-500" />
                </Link>
              </div>

              {/* Trust Counters / Statistics Bar */}
              <div className="pt-6 border-t border-gray-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {event.stats.map((stat, i) => (
                  <div key={i} className="bg-white/95 p-3.5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="font-serif font-black text-2xl text-rose-600">{stat.number}</div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Image with Overlay */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
                <div className="relative h-72 sm:h-84 md:h-96 w-full bg-gray-100">
                  <SafeImage
                    src={heroImageUrl || (event.category === "wedding" ? "/dercoration1.webp" : "/og-image.jpg")}
                    alt={heroImageAlt}
                    fill
                    priority
                    fallbackSrc={event.category === "wedding" ? "/dercoration1.webp" : "/og-image.jpg"}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="px-2.5 py-1 rounded-md bg-rose-500/95 text-white text-[10px] font-bold tracking-wider uppercase">
                      {event.category === "wedding" ? "Royal Wedding Decor" : "Corporate Excellence"}
                    </span>
                    <h3 className="font-serif font-bold text-xl mt-1.5 drop-shadow-md">
                      RIWAJ Signature Setup
                    </h3>
                    <p className="text-white/85 text-xs mt-0.5">
                      Tailored execution, royal themes aur unmatched hospitality.
                    </p>
                  </div>
                </div>

                {/* Instant Call Banner */}
                <div className="p-4 bg-white flex items-center justify-between gap-3 border-t border-gray-100">
                  <div>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                      Seedha Baat Kijiye Expert Se
                    </p>
                    <p className="font-bold text-gray-900 text-sm">{displayPhone}</p>
                  </div>
                  <a
                    href={telLink}
                    className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. WHAT WE OFFER Section (Exact Image 4 Pattern) ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-10 h-px bg-rose-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                WHAT WE OFFER
              </span>
              <span className="w-10 h-px bg-rose-300" />
            </div>

            <h2 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-2 leading-tight">
              End-to-End {event.menuTitle} Management What We Handle
            </h2>

            {/* Accent Script Line matching reference */}
            <p className="font-serif italic text-2xl sm:text-3xl text-rose-600 mb-4 font-normal">
              {event.menuTitle} Services
            </p>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {event.overview}
            </p>
          </div>

          {/* 4-Card Grid with Soft Yellow Icon Box matching Reference */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {event.features.map((feat, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
              >
                {/* Yellow rounded square icon container matching Reference */}
                <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">
                  {getFeatureIcon(i, feat.title, event.category)}
                </div>

                <h3 className="font-serif font-bold text-lg text-gray-900 mb-2.5 leading-snug">
                  {feat.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Real Event Photo Showcase Grid ── */}
      <section className="py-16 md:py-20 bg-[#fafafa] border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-rose-600 text-xs font-bold uppercase tracking-wider block mb-1">
                Real Event Photos
              </span>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-gray-900">
                Hamare Recent {event.menuTitle} Setups
              </h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
            >
              <span>Saari Photos Gallery me Dekhein</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {showcaseImages.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcaseImages.map((imgObj, i) => (
                <div
                  key={i}
                  className="relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-md group border border-gray-200 bg-gray-100"
                >
                  <SafeImage
                    src={imgObj.url}
                    alt={imgObj.alt || `${event.menuTitle} Real Event Setup ${i + 1} - RIWAJ`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5 z-2">
                    <span className="text-white text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span className="line-clamp-1">{imgObj.alt || "RIWAJ Luxury Artistry"}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-800 mb-1">
                Latest Setups Gallery Updating
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-5">
                Hamari team is specific category ke fresh setup photos upload kar rahi hai. Live portfolio ya real event videos dekhne ke liye seedha call ya WhatsApp karein.
              </p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Portfolio</span>
                </a>
                <Link
                  href="/gallery"
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors"
                >
                  View Gallery
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. Packages & Pricing in Hinglish ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
              Affordable & Transparent Rates
            </span>
            <h2 className="font-serif font-black text-3xl md:text-4xl text-gray-900 mb-3">
              {event.menuTitle} Packages & Estimated Cost
            </h2>
            <p className="text-gray-500 text-xs md:text-sm">
              Koi hidden charge nahi. Sabhi packages me decor, lighting aur team coordination shamil hai.
            </p>
          </div>

          <div className={`grid gap-8 ${event.packages.length > 2 ? "lg:grid-cols-3" : "md:grid-cols-2 max-w-4xl mx-auto"}`}>
            {event.packages.map((pkg, i) => (
              <div
                key={i}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  pkg.popular
                    ? "bg-gradient-to-b from-rose-50/70 to-amber-50/50 border-2 border-rose-400 shadow-xl relative"
                    : "bg-gray-50 border border-gray-200 hover:shadow-lg"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-[11px] shadow-md uppercase tracking-wider">
                    ★ Most Popular Choice
                  </div>
                )}

                <div>
                  <h3 className="font-serif font-black text-xl text-gray-900 mb-1">{pkg.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{pkg.tagline}</p>

                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-gray-200/80">
                    <span className="font-serif font-black text-3xl md:text-4xl text-rose-600">
                      {pkg.price}
                    </span>
                    <span className="text-gray-400 text-xs font-medium">/ starting</span>
                  </div>

                  <ul className="space-y-3 text-xs text-gray-700 mb-8">
                    {pkg.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`https://wa.me/${fullWA}?text=Namaste%20RIWAJ%20Events!%20Mujhe%20${encodeURIComponent(
                    event.menuTitle
                  )}%20ka%20${encodeURIComponent(pkg.name)}%20(${encodeURIComponent(
                    pkg.price
                  )})%20package%20book%20karna%20hai.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-xl font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5 ${
                    pkg.popular
                      ? "bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-md shadow-rose-200"
                      : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Is Package Ke Liye WhatsApp Karein</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Full Embedded Booking Form Section ── */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-1">
              Online Booking & Quotation
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-gray-900">
              Apne {event.menuTitle} Ke Liye Free Quote Prapt Karein
            </h2>
            <p className="text-gray-500 text-xs mt-1">
              Apni details bhariye, hamari team 2 ghante ke andar aapse call/WhatsApp par sampark karegi.
            </p>
          </div>

          <BookConsultation formOnly={true} />
        </div>
      </section>

      {/* ── 6. Interactive Frequently Asked Questions (Image 5 Accordion Pattern) ── */}
      <EventFaqAccordion
        faqs={event.faqs}
        title={`${event.menuTitle} Planning FAQs — Answered by Our ${event.category === "wedding" ? "Wedding" : "Corporate"} Team`}
        categoryName={event.category === "wedding" ? "Wedding Team" : "Corporate Team"}
        waLink={waLink}
      />

      {/* ── 7. Floating CTA Bottom Strip ── */}
      <section className="py-12 bg-gradient-to-r from-[#1c080d] via-[#3b0a12] to-[#1a080c] text-white">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl text-center space-y-4">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-white">
            Kya Aap Apne {event.menuTitle} Ko Grand Banana Chahte Hain?
          </h2>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto">
            Abhi call kijiye aur special discount payiye. Best date availability ke liye advance me book karein.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={telLink}
              className="px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: {displayPhone}</span>
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <ClientWidgets />
    </main>
  );
}
