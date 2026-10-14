import type { Metadata } from "next";
import "@/styles/index.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Script from "next/script";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

// ─── Site-wide default metadata (overridden per page) ─────────
export const metadata: Metadata = {
  metadataBase: new URL("https://vindhyaevents.in"),
  title: {
    default: "RIWAJ | Best Wedding Planner in Rewa, Madhya Pradesh",
    template: "%s | RIWAJ",
  },
  description:
    "RIWAJ is Rewa's premier luxury wedding & event planning company. We craft magical, customised celebrations across Madhya Pradesh — Baraat, Sangeet, Mehndi, Reception and beyond. 500+ happy couples since 2013.",
  keywords: [
    "RIWAJ",
    "RIWAJ wedding planner",
    "wedding planner Rewa",
    "shaadi planner Rewa MP",
    "wedding decorator Rewa",
    "event management Rewa",
    "wedding planner Madhya Pradesh",
    "Indian wedding planner",
    "best wedding planner MP",
    "marriage planner Rewa",
    "wedding decoration Rewa",
  ],
  authors: [{ name: "RIWAJ", url: "https://vindhyaevents.in" }],
  creator: "RIWAJ",
  publisher: "RIWAJ",
  category: "Wedding & Event Planning",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vindhyaevents.in",
    siteName: "RIWAJ",
    title: "RIWAJ | Best Wedding Planner in Rewa, Madhya Pradesh",
    description:
      "Transform your dream wedding into reality. RIWAJ offers end-to-end wedding planning, royal stage decoration, photography, and catering in Rewa, MP.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RIWAJ — Luxury Wedding Planners in Rewa, Madhya Pradesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RIWAJ | Luxury Wedding Planner in Rewa MP",
    description:
      "Rewa's premier wedding planning brand. 500+ royal celebrations crafted across Madhya Pradesh.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://vindhyaevents.in",
  },
  manifest: "/manifest.webmanifest",
  applicationName: "RIWAJ Events",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RIWAJ Events",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

import { SettingsProvider } from "@/context/SettingsContext";
import { getSiteSettings } from "@/lib/getSiteSettings";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en-IN"
      className="scroll-smooth"
    >
      <head>
        {/* ── PWA Manifest and Theme ── */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RIWAJ Events" />
        <meta name="application-name" content="RIWAJ Events" />
        <meta name="theme-color" content="#f43f5e" />

        {/* ── Fonts ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
        />

        {/* ── Preconnect to external origins ── */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* ── Preload LCP hero image ── */}
        <link rel="preload" as="image" href="/girlsimg.webp" type="image/webp" fetchPriority="high" />

        {/* ── Prefetch hero carousel images ── */}
        <link rel="prefetch" href="https://images.unsplash.com/photo-1724847664960-5060a1ae8259?w=1200&q=75" as="image" />
        <link rel="prefetch" href="https://images.unsplash.com/photo-1732382643619-872165f61891?w=1200&q=75" as="image" />

        {/* ── Viewport ── */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="google-site-verification" content="4nonbC24VepRpUfhhrnMtmWSevxuth55PkAi4Ken6uM" />

        {/* ── Local Business Schema (JSON-LD) ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: settings.siteName || "Vindhya Events",
              description: settings.tagline || "Luxury wedding and event planning company in Rewa, Madhya Pradesh",
              url: "https://vindhyaevents.in",
              telephone: settings.primaryPhone || "7898522932",
              email: settings.primaryEmail || "vindhyaevent@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: settings.address || "Rewa",
                addressLocality: "Rewa",
                addressRegion: "Madhya Pradesh",
                postalCode: "486001",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "24.5362",
                longitude: "81.2882",
              },
              openingHours: "Mo-Su 09:00-20:00",
              priceRange: "₹₹₹",
              image: "https://vindhyaevents.in/og-image.jpg",
              sameAs: [
                settings.socialLinks?.instagram || "https://instagram.com/vindhyaevents",
                settings.socialLinks?.facebook || "https://facebook.com/vindhyaevents",
              ].filter(Boolean),
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "500",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased font-sans">
        <ThemeProvider>
          <SettingsProvider initialSettings={settings}>
            {children}
            <ServiceWorkerRegister />
          </SettingsProvider>
        </ThemeProvider>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-0SH969NJTJ" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0SH969NJTJ');
          `}
        </Script>
      </body>
    </html>
  );
}
