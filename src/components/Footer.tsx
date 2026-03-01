"use client";

import Link from "next/link";
import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

// ── Link config: href = route or anchor ──────────────────────
const quickLinks = [
  { label: "Home",         href: "/"             },
  { label: "Services",     href: "/#services"    },
  { label: "Gallery",      href: "/gallery"      },
  { label: "About Us",     href: "/about"        },
];

const moreLinks = [
  { label: "Contact",      href: "/#contact"     },
  { label: "Blog",         href: "/blog"         },
  { label: "Testimonials", href: "/#testimonials"  },
  { label: "Book Now",     href: "/#consultation" },
];

export default function Footer() {
  return (
    <footer
      className="text-white"
      id="contact"
      style={{ background: "linear-gradient(to bottom, var(--c-footer-from), var(--c-footer-to))" }}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">

          {/* Logo & Tagline */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
              <Heart className="w-8 h-8 fill-current" style={{ color: "var(--c-accent, #fb7185)" }} />
              <span className="text-white font-serif text-lg font-semibold">Vindhya Events</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Creating timeless memories and celebrating love stories since 2013.
              Your dream wedding starts here — आपके सपनों की शादी।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest opacity-80">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span
                      className="w-0 h-px transition-all duration-300 group-hover:w-3"
                      style={{ background: "var(--c-accent, #fb7185)" }}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest opacity-80">
              More
            </h4>
            <ul className="space-y-3">
              {moreLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span
                      className="w-0 h-px transition-all duration-300 group-hover:w-3"
                      style={{ background: "var(--c-accent, #fb7185)" }}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest opacity-80">
              Get in Touch
            </h4>
            <div className="space-y-4 text-sm">
              <a href="tel:+919876543210" className="flex items-start gap-3 text-white/60 hover:text-white transition-colors group">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--c-accent, #fb7185)" }} />
                <span>+91 98765 43210</span>
              </a>
              <a href="mailto:info@vindhyaevents.com" className="flex items-start gap-3 text-white/60 hover:text-white transition-colors group">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--c-accent, #fb7185)" }} />
                <span>info@vindhyaevents.com</span>
              </a>
              <div className="flex items-start gap-3 text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--c-accent, #fb7185)" }} />
                <span>Rewa, Madhya Pradesh<br />India — 486001</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {[
                { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
                { href: "https://facebook.com",  icon: Facebook,  label: "Facebook"  },
                { href: "https://twitter.com",   icon: Twitter,   label: "Twitter"   },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:opacity-100"
                  style={{ background: "rgba(255,255,255,0.12)", opacity: 0.7 }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-8" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>© 2025 Vindhya Events, Rewa. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms"   className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
