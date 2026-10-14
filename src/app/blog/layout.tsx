import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Blog — Planning Tips & Inspiration | RIWAJ",
  description:
    "Expert wedding planning tips, decoration trends, venue guides, and bridal inspiration from RIWAJ. Your complete guide to planning a perfect Indian wedding in Madhya Pradesh.",
  keywords: [
    "RIWAJ wedding blog",
    "Indian wedding planning tips",
    "wedding decoration ideas",
    "shaadi planning guide",
    "wedding blog MP",
    "wedding trends 2026 India",
    "wedding venue guide",
    "bridal fashion ideas",
  ],
  openGraph: {
    title: "Wedding Blog | RIWAJ — Tips & Inspiration",
    description:
      "Read expert articles on Indian wedding planning, decoration trends, venue selection, and bridal fashion by RIWAJ, Rewa's top wedding planners.",
    url: "https://vindhyaevents.in/blog",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://vindhyaevents.in/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
