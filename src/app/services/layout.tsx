import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Services & Packages | RIWAJ Rewa",
  description:
    "Explore RIWAJ's full wedding planning, stage & floral décor, catering, royal baraat, photography, and entertainment services in Rewa, Madhya Pradesh.",
  alternates: {
    canonical: "https://vindhyaevents.in/services",
  },
  openGraph: {
    title: "Wedding Services & Packages | RIWAJ",
    description:
      "From bespoke stage & mandap decoration to royal baraat management and catering in Rewa, MP. Transform your dream wedding into reality with RIWAJ.",
    url: "https://vindhyaevents.in/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
