"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Sparkles } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import LocationMapBox from "./LocationMapBox";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const weddingLinks = [
  { label: "Ring Ceremony (सगाई)", href: "/ring-ceremony" },
  { label: "Haldi Function", href: "/haldi-function" },
  { label: "Mehendi Function", href: "/mehendi-function" },
  { label: "Sangeet Ceremony", href: "/sangeet-ceremony" },
  { label: "Grand Reception", href: "/reception" },
  { label: "Luxury Wedding", href: "/luxury-wedding-planner" },
  { label: "Destination Wedding", href: "/destination-wedding" },
  { label: "All Wedding Packages", href: "/wedding-package" },
];

const corporateLinks = [
  { label: "Corporate Events", href: "/corporate-events" },
  { label: "Banquet Hall Setup", href: "/banquet-hall" },
  { label: "Conference Events", href: "/conference-events" },
  { label: "Annual Meet (AGM)", href: "/annual-meet" },
  { label: "Award Ceremony", href: "/award-ceremony" },
  { label: "Seminar & Workshop", href: "/seminar-hall" },
  { label: "Target Bash", href: "/target-achievement-events" },
];

export default function Footer() {
  const { siteName, phone, telLink, email, address, socialLinks, googleMapUrl } = useSettings();

  return (
    <footer
      suppressHydrationWarning
      className="text-white"
      style={{ background: "linear-gradient(to bottom, var(--c-footer-from), var(--c-footer-to))" }}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* 1. Logo & Tagline */}
          <div className="lg:col-span-1 sm:col-span-2">
            <Link href="/" className="flex items-center gap-3.5 mb-4 w-fit group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/70 shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300 bg-amber-950/40">
                <Image
                  src="/riwaj-logo.jpg"
                  alt="RIWAJ Events"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="relative h-8 sm:h-9 w-24 sm:w-28 group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src="/riwaj-text-logo.png"
                    alt="RIWAJ Events"
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <span className="text-[10px] text-amber-300/90 tracking-widest uppercase font-semibold block -mt-0.5">
                  Weddings & Celebrations
                </span>
              </div>
            </Link>
            <p className="text-white/70 text-xs leading-relaxed mb-4">
              Creating timeless memories and celebrating love stories since 2021.
              Rewa aur pure Madhya Pradesh me aapke sapno ki shaadi aur events.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>300+ Events Planned</span>
            </div>
          </div>

          {/* 2. Wedding Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest opacity-80 border-b border-white/10 pb-2">
              Wedding Events
            </h4>
            <ul className="space-y-2.5">
              {weddingLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-xs flex items-center gap-1.5 group"
                  >
                    <span
                      className="w-0 h-px transition-all duration-300 group-hover:w-2"
                      style={{ background: "var(--c-accent, #fb7185)" }}
                    />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Corporate Events */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest opacity-80 border-b border-white/10 pb-2">
              Corporate Events
            </h4>
            <ul className="space-y-2.5">
              {corporateLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-xs flex items-center gap-1.5 group"
                  >
                    <span
                      className="w-0 h-px transition-all duration-300 group-hover:w-2"
                      style={{ background: "var(--c-accent, #fb7185)" }}
                    />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest opacity-80 border-b border-white/10 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-xs flex items-center gap-1.5 group"
                  >
                    <span
                      className="w-0 h-px transition-all duration-300 group-hover:w-2"
                      style={{ background: "var(--c-accent, #fb7185)" }}
                    />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest opacity-80 border-b border-white/10 pb-2">
              Connect With Us
            </h4>
            <div className="space-y-3 text-xs">
              <a href={telLink} className="flex items-start gap-2.5 text-white/70 hover:text-white transition-colors">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--c-accent, #fb7185)" }} />
                <span suppressHydrationWarning>{phone}</span>
              </a>
              <a href={`mailto:${email}`} className="flex items-start gap-2.5 text-white/70 hover:text-white transition-colors">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--c-accent, #fb7185)" }} />
                <span suppressHydrationWarning>{email}</span>
              </a>
              <a
                href={googleMapUrl || "https://maps.google.com/?q=Rewa+Madhya+Pradesh"}
                target="_blank"
                rel="noopener noreferrer"
                title="Click to view on Google Maps"
                className="flex items-start gap-2.5 text-white/70 hover:text-white transition-colors group"
              >
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" style={{ color: "var(--c-accent, #fb7185)" }} />
                <span suppressHydrationWarning className="group-hover:underline">{address}</span>
              </a>
            </div>

            {/* OLX-Style Square Location Box in Footer */}
            <div className="mt-4">
              <LocationMapBox variant="footer" />
            </div>

            {/* Social Icons */}
            <div className="flex gap-2.5 mt-5">
              {[
                { href: socialLinks?.instagram || "https://instagram.com/vindhyaevents", icon: Instagram, label: "Instagram", hoverClass: "hover:bg-gradient-to-tr hover:from-amber-500 hover:to-rose-600" },
                { href: socialLinks?.facebook || "https://facebook.com/vindhyaevents",   icon: Facebook,  label: "Facebook",  hoverClass: "hover:bg-[#1877F2]" },
                { href: socialLinks?.twitter || "https://twitter.com",                    icon: Twitter,   label: "Twitter",   hoverClass: "hover:bg-[#1DA1F2]" },
                { href: socialLinks?.youtube || "",                                      icon: Youtube,   label: "YouTube",   hoverClass: "hover:bg-[#FF0000]" },
              ].filter(item => item.href).map(({ href, icon: Icon, label, hoverClass }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 text-white/80 hover:text-white ${hoverClass}`}
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>

            {/* YouTube Channel Button */}
            {socialLinks?.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-xl bg-[#FF0000] hover:bg-[#d90000] text-white text-xs font-bold shadow-md shadow-red-900/30 hover:scale-105 transition-all group"
              >
                <Youtube className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span>Watch on YouTube</span>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-6" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/40">
            <p suppressHydrationWarning>© 2026 {siteName || "RIWAJ Events"} Weddings & Events, Rewa. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
