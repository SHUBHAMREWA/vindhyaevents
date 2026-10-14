"use client";

import PageLayout from "@/components/PageLayout";
import BookConsultation from "@/components/BookConsultation";
import { Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function ContactPage() {
  const { phone, telLink, getWhatsAppLink, address, siteName } = useSettings();

  return (
    <PageLayout
      badge="Let's Connect"
      title={`Contact ${siteName || "Vindhya Events"}`}
      subtitle="Have questions or ready to plan your fairytale wedding? Reach out to our expert team for a complimentary personalized consultation."
    >
      {/* ── Contact Info Grid ─────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-100 flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-4 shadow-md">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">Call Directly</h3>
                <p className="text-xs text-gray-500 mb-4">Immediate discussion with our wedding directors.</p>
              </div>
              <a
                href={telLink}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                <span suppressHydrationWarning>{phone}</span>
              </a>
            </div>

            {/* WhatsApp */}
            <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-md">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">WhatsApp Chat</h3>
                <p className="text-xs text-gray-500 mb-4">Share decor photos, dates, and get quick quotes.</p>
              </div>
              <a
                href={getWhatsAppLink(`Hi ${siteName || "Vindhya Events"}, I want to book a consultation!`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                <span>Chat on WhatsApp →</span>
              </a>
            </div>

            {/* Address */}
            <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-4 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">Studio & Office</h3>
                <p className="text-xs text-gray-500 mb-4">Visit our design gallery for a personal meeting.</p>
              </div>
              <span suppressHydrationWarning className="text-xs font-semibold text-gray-800">{address}</span>
            </div>

            {/* Working Hours */}
            <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center mb-4 shadow-md">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">Consultation Hours</h3>
                <p className="text-xs text-gray-500 mb-4">Available 7 days a week for booked couples.</p>
              </div>
              <span className="text-xs font-semibold text-gray-800">Monday – Sunday: 9 AM – 9 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Consultation Form Section ─────────────────────────── */}
      <section className="py-12 bg-white" id="book">
        <div className="container mx-auto px-6 max-w-6xl">
          <BookConsultation />
        </div>
      </section>

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
