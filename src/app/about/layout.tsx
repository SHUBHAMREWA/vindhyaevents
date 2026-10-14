import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About RIWAJ — Luxury Wedding Planners in Rewa Since 2021",
  description:
    "Started in 2021 with DJ sounds and event production, today RIWAJ (Vindhya Events) crafts magical weddings, royal decor, and celebrations across Rewa, Satna, and the entire Vindhya region.",
  keywords: [
    "about RIWAJ",
    "RIWAJ wedding planner Rewa",
    "wedding planner Rewa team",
    "wedding decor Rewa MP",
    "event management company Rewa",
    "best wedding planner Madhya Pradesh",
  ],
  openGraph: {
    title: "About RIWAJ | Luxury Wedding Planners in Rewa, Madhya Pradesh",
    description:
      "Started in 2021 from DJ sounds and audio production, RIWAJ has grown into a trusted luxury wedding and event decor brand across Rewa and nearby cities.",
    url: "https://vindhyaevents.in/about",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://vindhyaevents.in/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
