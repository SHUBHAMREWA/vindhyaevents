import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact RIWAJ | Book Wedding Consultation in Rewa, MP",
  description:
    "Get in touch with RIWAJ wedding planners in Rewa, Madhya Pradesh. Book a free consultation, request quotes, or chat with our wedding planners via Phone or WhatsApp.",
  alternates: {
    canonical: "https://vindhyaevents.in/contact",
  },
  openGraph: {
    title: "Contact RIWAJ | Best Wedding Planner in Rewa MP",
    description:
      "Ready to start planning? Contact RIWAJ for luxury wedding planning, stage decoration, and royal celebration management in Rewa & MP.",
    url: "https://vindhyaevents.in/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
