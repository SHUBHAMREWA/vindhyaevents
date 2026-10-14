import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Gallery — Real Weddings & Events in Rewa MP",
  description:
    "Browse RIWAJ's portfolio of 500+ real wedding photos from ceremonies, receptions, Sangeet, Mehndi, and Baraat celebrations across Rewa and Madhya Pradesh. Get inspired for your big day.",
  keywords: [
    "RIWAJ wedding gallery",
    "wedding gallery Rewa",
    "wedding photos Madhya Pradesh",
    "wedding decoration photos Rewa",
    "Indian wedding portfolio",
    "event decoration gallery MP",
  ],
  openGraph: {
    title: "Wedding Gallery | RIWAJ — Real Weddings in Rewa",
    description:
      "Explore beautiful wedding ceremonies, receptions, and décor from 500+ events planned by RIWAJ in Rewa and across Madhya Pradesh.",
    url: "https://vindhyaevents.in/gallery",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://vindhyaevents.in/gallery",
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
