"use client";

import { motion } from "motion/react";
import Script from "next/script";
import { Calendar, User, Phone, Mail, MessageSquare, CircleCheck, PartyPopper, CheckCircle2, Loader2, MapPin, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { queueOfflineInquiry } from "@/lib/cache/idb";
import { useSettings } from "@/context/SettingsContext";

// WhatsApp SVG icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L.057 23.492a.75.75 0 0 0 .904.964l5.805-1.524A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.962-1.358l-.355-.211-3.683.966.983-3.595-.232-.369A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

interface TurnstileInstance {
  render: (container: HTMLElement | string, options: Record<string, unknown>) => string;
}

declare global {
  interface Window {
    turnstile?: TurnstileInstance;
    onTurnstileSuccess?: (token: string) => void;
  }
}

interface BookConsultationProps {
  formOnly?: boolean;
}

export default function BookConsultation({ formOnly = false }: BookConsultationProps = {}) {
  const { phone, telLink, getWhatsAppLink, email, address, googleMapUrl } = useSettings();
  const captchaRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    eventType: "Wedding",
    message: "",
    captchaToken: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isOfflineSubmission, setIsOfflineSubmission] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    window.onTurnstileSuccess = (token: string) => {
      setFormData((prev) => ({ ...prev, captchaToken: token }));
    };

    return () => {
      delete window.onTurnstileSuccess;
    };
  }, []);

  const renderCaptcha = () => {
    if (captchaRef.current && window.turnstile && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      if (captchaRef.current.innerHTML === "") {
        try {
          const isNarrow = typeof window !== "undefined" && window.innerWidth < 350;
          window.turnstile.render(captchaRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
            callback: (token: string) => {
              if (window.onTurnstileSuccess) window.onTurnstileSuccess(token);
            },
            theme: "light",
            size: isNarrow ? "compact" : "flexible",
            appearance: "always",
          });
        } catch (error) {
          console.error("Turnstile render error:", error);
        }
      }
    }
  };

  useEffect(() => {
    if (window.turnstile) {
      renderCaptcha();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!formData.name.trim() || !formData.phone.trim()) {
      setSubmitError("Please fill in your name and phone number.");
      return;
    }

    setSubmitting(true);

    // If client is offline, queue into IndexedDB immediately
    if (typeof window !== "undefined" && !navigator.onLine) {
      try {
        await queueOfflineInquiry({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          date: formData.date,
          eventType: formData.eventType,
          message: formData.message,
        });
        setIsOfflineSubmission(true);
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          eventType: "Wedding",
          message: "",
          captchaToken: "",
        });
      } catch (err) {
        console.error("Error saving offline inquiry:", err);
        setSubmitError("Failed to save offline. Please call us directly.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    try {
      const response = await fetch("/api/bookconsultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsOfflineSubmission(false);
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          eventType: "Wedding",
          message: "",
          captchaToken: "",
        });
      } else {
        setSubmitError(result.message || "Something went wrong. Please call us directly.");
      }
    } catch {
      // Network failed during fetch -> queue in IndexedDB
      try {
        await queueOfflineInquiry({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          date: formData.date,
          eventType: formData.eventType,
          message: formData.message,
        });
        setIsOfflineSubmission(true);
        setSubmitted(true);
      } catch {
        setSubmitError(`Network error. Please call us directly at ${phone}.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    "100% Customized Event Decor & Mandap Planning",
    "Expert Advice from Rewa Ground Team",
    "Transparent Budgeting & Honest Vendor Rates",
  ];

  const formCard = (
    <div className="bg-white p-3.5 sm:p-6 md:p-8 shadow-2xl border border-rose-100 rounded-2xl sm:rounded-3xl relative w-full max-w-full overflow-hidden box-border">
      {submitted ? (
        <div className="text-center py-6 sm:py-8 space-y-3 sm:space-y-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
            {isOfflineSubmission ? "Saved Offline! 📲" : "Thank You! 🎉"}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            {isOfflineSubmission
              ? "You are currently without internet connection. Your consultation request has been saved securely on your device (IndexedDB) and will automatically sync and submit as soon as your internet reconnects!"
              : "We have received your consultation request. One of our wedding specialists from RIWAJ will call you shortly."}
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setIsOfflineSubmission(false);
            }}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(to right, var(--c-primary), var(--c-primary-dark))" }}
          >
            Book Another Query
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3.5 w-full max-w-full">
          <div className="text-center mb-2 sm:mb-4">
            <h3 className="text-lg sm:text-2xl font-serif text-gray-900 mb-0.5">Let&apos;s Plan Your Day</h3>
            <p className="text-gray-500 text-[10px] sm:text-xs">Fill in your details and our team will get in touch</p>
          </div>

          {submitError && (
            <div className="p-2 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {submitError}
            </div>
          )}

          {/* Name & Phone */}
          <div className="w-full">
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-1.5 sm:py-2 border border-gray-200 rounded-xl focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all text-xs sm:text-sm"
              placeholder="Your Name"
            />
          </div>

          <div className="w-full">
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-1.5 sm:py-2 border border-gray-200 rounded-xl focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all text-xs sm:text-sm"
              placeholder="Enter 10-digit phone number"
            />
          </div>

          <div className="w-full">
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-1.5 sm:py-2 border border-gray-200 rounded-xl focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all text-xs sm:text-sm"
              placeholder="hello@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full min-w-0">
            <div className="min-w-0 overflow-hidden">
              <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1 flex items-center gap-1.5 truncate">
                <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                Event Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full min-w-0 max-w-full px-2 py-1.5 border border-gray-200 rounded-xl text-xs bg-white"
              />
            </div>

            <div className="min-w-0 overflow-hidden">
              <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1 flex items-center gap-1.5 truncate">
                <PartyPopper className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                Event Type
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full min-w-0 max-w-full px-2 py-1.5 border border-gray-200 rounded-xl text-xs bg-white truncate"
              >
                <option value="Wedding">Wedding</option>
                <option value="Reception">Reception</option>
                <option value="Engagement">Engagement</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Birthday">Birthday Party</option>
                <option value="Corporate">Corporate Event</option>
                <option value="Pre Wedding">Pre Wedding</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
              Message / Vision
            </label>
            <textarea
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs resize-none"
              placeholder="Tell us about your wedding venue or decor ideas..."
            />
          </div>

          {/* Cloudflare Turnstile placeholder with layout-shift prevention */}
          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <div className="turnstile-wrapper my-1 w-full overflow-hidden flex items-center justify-center">
              <div ref={captchaRef} className="turnstile-container"></div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 sm:py-3.5 rounded-full text-white font-bold tracking-wide shadow-lg hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
            style={{ background: "linear-gradient(to right, var(--c-primary), var(--c-primary-dark))" }}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Consultation...</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>Reserve Free Consultation</span>
              </>
            )}
          </button>

          <p className="text-[9px] sm:text-[10px] text-gray-400 text-center mt-1">
            Strictly confidential • No spam promise
          </p>
        </form>
      )}
    </div>
  );

  if (formOnly) {
    return (
      <>
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            async
            defer
            onLoad={renderCaptcha}
          />
        )}
        {formCard}
      </>
    );
  }

  return (
    <>
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
          onLoad={renderCaptcha}
        />
      )}

      <section
        className="py-8 md:py-20 relative overflow-hidden"
        id="consultation"
        style={{
          background: "linear-gradient(135deg, var(--c-bg-soft) 0%, var(--c-bg) 50%, var(--c-bg-soft) 100%)",
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-7xl mx-auto">
            {/* Left Side - Info & Google Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1 block"
            >
              <div className="flex flex-col gap-3.5">
                <div>
                  <div
                    className="inline-block px-3.5 py-1 mb-2 rounded-full text-xs font-semibold tracking-wide shadow-xs"
                    style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}
                  >
                    ✨ Start Your Wedding Journey
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-2 leading-tight" style={{ color: "var(--c-footer-from)" }}>
                    Book Your <span style={{ color: "var(--c-primary)" }}>Free</span> Consultation
                  </h2>

                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3.5 font-medium">
                    Let&apos;s discuss your dream wedding and how we can make it a reality. Our expert planners in Rewa are ready to bring your vision to life.
                  </p>

                  {/* Benefits */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 mb-3.5">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                          <CircleCheck className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xs text-gray-700 font-medium leading-tight">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compact Contact Info Card */}
                <div className="bg-white/95 backdrop-blur-md p-3 sm:p-3.5 shadow-sm border border-rose-100 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Phone */}
                  <a
                    suppressHydrationWarning
                    href={telLink}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-rose-50/70 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0 text-rose-500 group-hover:scale-105 transition-transform">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Call Us</p>
                      <span suppressHydrationWarning className="text-xs font-bold text-gray-900 truncate block">{phone}</span>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    suppressHydrationWarning
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-emerald-50/70 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600 group-hover:scale-105 transition-transform">
                      <WhatsAppIcon />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">WhatsApp</p>
                      <span className="text-xs font-bold text-emerald-600 truncate block">Chat Directly →</span>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-rose-50/70 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0 text-rose-500 group-hover:scale-105 transition-transform">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">Email</p>
                      <span className="text-xs font-bold text-gray-900 truncate block">{email}</span>
                    </div>
                  </a>
                </div>

                {/* Compact Google Map Card */}
                <div className="relative w-full h-[165px] sm:h-[185px] rounded-2xl overflow-hidden border border-rose-100 shadow-sm bg-gray-100 group">
                  <iframe
                    title="Google Map Location - RIWAJ Events Rewa"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(address || "Rewa, Madhya Pradesh")}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0 pointer-events-auto"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                  {/* Top-Right "Open in Maps" Floating Pill */}
                  <a
                    href={googleMapUrl || "https://maps.google.com/?q=Rewa+Madhya+Pradesh"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2.5 right-2.5 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-rose-600 border border-rose-200/80 shadow-md backdrop-blur-md flex items-center gap-1 hover:bg-rose-600 hover:text-white transition-all group/btn"
                  >
                    <span>Open in Maps</span>
                    <ExternalLink className="w-2.5 h-2.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>

                  {/* Bottom Location Overlay Bar */}
                  <div className="absolute bottom-0 inset-x-0 px-3 py-1.5 bg-gradient-to-t from-black/85 via-black/60 to-transparent flex items-center justify-between pointer-events-none">
                    <span className="text-white text-[10px] font-medium flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                      <span className="truncate">{address || "Rewa, Madhya Pradesh — 486001"}</span>
                    </span>
                    <span className="text-amber-300 text-[10px] font-bold shrink-0 ml-2">Directions ↗</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg mx-auto min-w-0 order-1 lg:order-2"
            >
              {formCard}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}