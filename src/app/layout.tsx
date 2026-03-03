import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "@/styles/index.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Script from "next/script";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  preload: true,
});

// ─── Site-wide default metadata (overridden per page) ─────────
export const metadata: Metadata = {
  metadataBase: new URL("https://vindhyaevents.in"),
  title: {
    default: "Vindhya Events | Best Wedding Planner in Rewa, Madhya Pradesh",
    template: "%s | Vindhya Events",
  },
  description:
    "Vindhya Events is Rewa's most trusted wedding & event planning company. We craft magical, customised weddings across Madhya Pradesh — Baraat, Sangeet, Mehndi, Reception and beyond. 500+ happy couples since 2013.",
  keywords: [
    "wedding planner Rewa",
    "shaadi planner Rewa MP",
    "wedding decorator Rewa",
    "event management Rewa",
    "wedding planner Madhya Pradesh",
    "Indian wedding planner",
    "best wedding planner MP",
    "Vindhya Events",
    "marriage planner Rewa",
    "wedding decoration Rewa",
  ],
  authors: [{ name: "Vindhya Events", url: "https://vindhyaevents.in" }],
  creator: "Vindhya Events",
  publisher: "Vindhya Events",
  category: "Wedding & Event Planning",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vindhyaevents.in",
    siteName: "Vindhya Events",
    title: "Vindhya Events | Best Wedding Planner in Rewa, Madhya Pradesh",
    description:
      "Transform your dream wedding into reality. Vindhya Events offers end-to-end wedding planning, decoration, photography, and catering in Rewa, MP.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vindhya Events — Wedding Planners in Rewa, Madhya Pradesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vindhya Events | Wedding Planner in Rewa MP",
    description:
      "Rewa's most trusted wedding planning company. 500+ magical celebrations across Madhya Pradesh.",
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
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`scroll-smooth ${playfair.variable} ${outfit.variable}`}
    >
      <head>
        {/* ── Preconnect to external origins ── */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ── Preload LCP hero image ── */}
        <link rel="preload" as="image" href="/girlsimg.png" fetchPriority="high" />

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
              name: "Vindhya Events",
              description: "Professional wedding and event planning company in Rewa, Madhya Pradesh",
              url: "https://vindhyaevents.in",
              telephone: "+91-98765-43210",
              email: "info@vindhyaevents.in",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Rewa",
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
                "https://instagram.com/vindhyaevents",
                "https://facebook.com/vindhyaevents",
              ],
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
        <ThemeProvider>{children}</ThemeProvider>
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
