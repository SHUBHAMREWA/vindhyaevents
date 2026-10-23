"use client";

import PageLayout from "@/components/PageLayout";
import BookConsultation from "@/components/BookConsultation";
import { Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function ContactPage() {
  const { phone, telLink, getWhatsAppLink, address, siteName, googleMapUrl } = useSettings();

  return (
    <PageLayout
      badge="Let's Connect"
      title={`Contact ${siteName && !siteName.toLowerCase().includes("vindhya") ? siteName : "RIWAJ Wedding & Events"}`}
      subtitle="Have questions or ready to plan your fairytale wedding? Reach out to our expert team for a complimentary personalized consultation."
    >
      {/* ── Contact Info Horizontal/Grid ─────────────────────────────────── */}
      <section className="py-4 md:py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-2.5 sm:gap-6 pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {/* Phone */}
            <div className="w-[195px] xs:w-[215px] sm:w-auto shrink-0 snap-start p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-rose-50/50 border border-rose-100 flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-2.5 sm:mb-4 shadow-sm sm:shadow-md">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-lg text-gray-900 mb-0.5 sm:mb-1">Call Directly</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mb-2 sm:mb-4 leading-tight sm:leading-normal">Immediate discussion with our wedding directors.</p>
              </div>
              <a
                href={telLink}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-rose-600 hover:text-rose-700 mt-auto"
              >
                <span suppressHydrationWarning>{phone}</span>
              </a>
            </div>

            {/* WhatsApp */}
            <div className="w-[195px] xs:w-[215px] sm:w-auto shrink-0 snap-start p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-2.5 sm:mb-4 shadow-sm sm:shadow-md">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-lg text-gray-900 mb-0.5 sm:mb-1">WhatsApp Chat</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mb-2 sm:mb-4 leading-tight sm:leading-normal">Share decor photos, dates, and get quick quotes.</p>
              </div>
              <a
                href={getWhatsAppLink(`Hi ${siteName && !siteName.toLowerCase().includes("vindhya") ? siteName : "RIWAJ Wedding & Events"}, I want to book a consultation!`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 hover:text-emerald-700 mt-auto"
              >
                <span>Chat on WhatsApp →</span>
              </a>
            </div>

            {/* Address */}
            <a
              href={googleMapUrl || "https://maps.google.com/?q=Rewa+Madhya+Pradesh"}
              target="_blank"
              rel="noopener noreferrer"
              title="Click to navigate on Google Maps"
              className="w-[195px] xs:w-[215px] sm:w-auto shrink-0 snap-start p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between hover:shadow-lg hover:border-amber-300 transition-all group"
            >
              <div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-2.5 sm:mb-4 shadow-sm sm:shadow-md group-hover:scale-105 transition-transform">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-lg text-gray-900 mb-0.5 sm:mb-1">Studio & Office</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mb-2 sm:mb-4 leading-tight sm:leading-normal">Visit our design gallery for a personal meeting.</p>
              </div>
              <div className="mt-auto">
                <span suppressHydrationWarning className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 sm:line-clamp-none block">{address}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 group-hover:text-amber-800 mt-1">
                  <span>Open on Map →</span>
                </span>
              </div>
            </a>

            {/* Working Hours */}
            <div className="w-[195px] xs:w-[215px] sm:w-auto shrink-0 snap-start p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-500 text-white flex items-center justify-center mb-2.5 sm:mb-4 shadow-sm sm:shadow-md">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-lg text-gray-900 mb-0.5 sm:mb-1">Consultation Hours</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mb-2 sm:mb-4 leading-tight sm:leading-normal">Available 7 days a week for booked couples.</p>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-gray-800 mt-auto">Mon – Sun: 9 AM – 9 PM</span>
            </div>
          </div>

          {/* Mobile Swipe Indicator */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 mt-2 text-[10px] text-gray-400 font-medium">
            <span>← Swipe options horizontally →</span>
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
