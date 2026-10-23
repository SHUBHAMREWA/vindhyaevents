import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Free Wedding Consultation | RIWAJ Events Rewa",
  description:
    "Reserve your free consultation with RIWAJ Events wedding planners in Rewa, Madhya Pradesh. Share your date, guest count, and decor vision.",
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
