import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Wedding Planners in Rewa Since 2013",
  description:
    "Meet the passionate team behind Vindhya Events. With 10+ years of experience and 500+ weddings planned across Madhya Pradesh, we turn your dream wedding into a flawless reality. Based in Rewa, MP.",
  keywords: [
    "about Vindhya Events",
    "wedding planner Rewa team",
    "experienced wedding planner MP",
    "event management company Rewa",
    "best wedding planner Madhya Pradesh",
  ],
  openGraph: {
    title: "About Vindhya Events | Wedding Planners in Rewa, Madhya Pradesh",
    description:
      "Founded in 2013 in Rewa, Vindhya Events has crafted 500+ magical weddings across Madhya Pradesh. Meet our team of passionate wedding planners, decorators, and coordinators.",
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
