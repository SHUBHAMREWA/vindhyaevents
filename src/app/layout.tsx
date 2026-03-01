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

export const metadata: Metadata = {
  title: "Vindhya Events | Wedding & Event Management Rewa MP",
  description:
    "Professional wedding and event management services in Rewa, Madhya Pradesh. Creating unforgettable celebrations with traditional elegance.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${playfair.variable} ${outfit.variable}`}
    >
      <head>
        {/* ── Preconnect to external origins ── */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ── Preload LCP hero image (first carousel slide - local PNG) ── */}
        <link
          rel="preload"
          as="image"
          href="/girlsimg.png"
          fetchPriority="high"
        />

        {/* ── Prefetch Unsplash images used in hero carousel ── */}
        <link rel="prefetch" href="https://images.unsplash.com/photo-1724847664960-5060a1ae8259?w=1200&q=75" as="image" />
        <link rel="prefetch" href="https://images.unsplash.com/photo-1732382643619-872165f61891?w=1200&q=75" as="image" />

        {/* ── Viewport ── */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />  
        <meta name="google-site-verification" content="4nonbC24VepRpUfhhrnMtmWSevxuth55PkAi4Ken6uM" />
         {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-0SH969NJTJ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-0SH969NJTJ');
        `}
      </Script>

      </head>
      <body className="antialiased font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
