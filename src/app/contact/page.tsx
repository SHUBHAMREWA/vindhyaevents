"use client";

import PageLayout from "@/components/PageLayout";
import BookConsultation from "@/components/BookConsultation";
import { Phone, Mail, MapPin, Clock, MessageSquare, ChevronRight } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function ContactPage() {
  const { phone, telLink, getWhatsAppLink, email, address, siteName, googleMapUrl } = useSettings();
  const brand = siteName && !siteName.toLowerCase().includes("vindhya") ? siteName : "RIWAJ Wedding & Events";

  const contactMethods = [
    {
      key: "phone",
      title: "Call Directly",
      description: "Immediate discussion with our wedding team.",
      mobileValue: phone,
      cardValue: phone,
      href: telLink,
      external: false,
      Icon: Phone,
      iconBg: "bg-rose-500",
      cardTone: "bg-rose-50/50 border-rose-100",
      linkTone: "text-rose-600",
    },
    {
      key: "whatsapp",
      title: "WhatsApp Chat",
      description: "Share decor photos, dates & get quick quotes.",
      mobileValue: "Share photos & dates, get quick quotes",
      cardValue: "Chat on WhatsApp →",
      href: getWhatsAppLink(`Hi ${brand}, I want to book a consultation!`),
      external: true,
      Icon: MessageSquare,
      iconBg: "bg-emerald-500",
      cardTone: "bg-emerald-50/50 border-emerald-100",
      linkTone: "text-emerald-600",
    },
    {
      key: "email",
      title: "Email Us",
      description: "Send official inquiries & event briefs.",
      mobileValue: email,
      cardValue: email,
      href: `mailto:${email}`,
      external: false,
      Icon: Mail,
      iconBg: "bg-purple-600",
      cardTone: "bg-purple-50/50 border-purple-100",
      linkTone: "text-purple-600",
    },
    {
      key: "address",
      title: "Studio & Office",
      description: "Visit our design gallery for a personal meeting.",
      mobileValue: address,
      cardValue: "Open on Map →",
      href: googleMapUrl || "https://maps.app.goo.gl/oxD7riczpGY7z4LJ7",
      external: true,
      Icon: MapPin,
      iconBg: "bg-amber-500",
      cardTone: "bg-amber-50/50 border-amber-100",
      linkTone: "text-amber-700",
    },
    {
      key: "hours",
      title: "Working Hours",
      description: "Available 7 days a week for booked couples.",
      mobileValue: "Mon – Sun: 9 AM – 9 PM",
      cardValue: "Mon – Sun: 9 AM – 9 PM",
      href: "",
      external: false,
      Icon: Clock,
      iconBg: "bg-blue-500",
      cardTone: "bg-blue-50/50 border-blue-100",
      linkTone: "text-gray-800",
    },
  ];

  return (
    <PageLayout
      badge="Let's Connect"
      title={`Contact ${brand}`}
      subtitle="Have questions or ready to plan your fairytale wedding? Reach out to our expert team for a complimentary personalized consultation."
    >
      {/* ── Contact Info: stacked list on phones, card grid from sm up ───────────── */}
      <section className="py-4 md:py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Phones: one compact tappable row per contact method */}
          <ul className="sm:hidden divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            {contactMethods.map(({ key, title, mobileValue, href, external, Icon, iconBg }) => {
              const content = (
                <>
                  <span className={`w-9 h-9 shrink-0 rounded-xl ${iconBg} text-white flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-gray-900">{title}</span>
                    <span suppressHydrationWarning className="block text-xs text-gray-500 truncate">{mobileValue}</span>
                  </span>
                  {href && <ChevronRight className="w-4 h-4 shrink-0 text-gray-300" />}
                </>
              );
              return (
                <li key={key}>
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex items-center gap-3 px-3.5 py-3 active:bg-gray-50"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 px-3.5 py-3">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Tablet and desktop: card grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {contactMethods.map(({ key, title, description, cardValue, href, external, Icon, iconBg, cardTone, linkTone }) => {
              const className = `p-5 rounded-3xl border ${cardTone} flex flex-col justify-between hover:shadow-lg transition-all group`;
              const body = (
                <>
                  <div>
                    <div className={`w-11 h-11 rounded-2xl ${iconBg} text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-base text-gray-900 mb-1">{title}</h3>
                    <p className="text-xs text-gray-500 mb-3">{description}</p>
                  </div>
                  <span suppressHydrationWarning className={`mt-auto text-xs font-bold truncate ${linkTone}`}>
                    {cardValue}
                  </span>
                </>
              );
              return href ? (
                <a key={key} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={className}>
                  {body}
                </a>
              ) : (
                <div key={key} className={className}>
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Consultation Form Section ─────────────────────────── */}
      <div id="book" className="w-full">
        <BookConsultation />
      </div>

      {/* ── FAQ Section ───────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-3"
            style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}
          >
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-8">
            Planning Your Consultation
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <h4 className="font-bold text-sm text-gray-900 mb-2">Is the initial wedding consultation free?</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Yes, absolutely! Our initial consultation is 100% complimentary with no obligations. We will review your dates, guest count, and design vision to draft a personalized plan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <h4 className="font-bold text-sm text-gray-900 mb-2">How early should we book our wedding planner?</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                We recommend booking 3 to 9 months in advance, especially for auspicious wedding dates in Rewa and MP. However, we also accommodate rush timelines based on crew availability.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <h4 className="font-bold text-sm text-gray-900 mb-2">Do you travel outside Rewa for destination weddings?</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Yes! We manage destination weddings and events across Madhya Pradesh, including Khajuraho, Bandhavgarh, Satna, Jabalpur, Bhopal, and Indore.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <h4 className="font-bold text-sm text-gray-900 mb-2">Can we customize our decoration themes?</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every wedding we curate is unique. From royal palace motifs to minimalist modern pastel florals, our designers tailor every single element to your taste.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
