import type { Metadata } from "next";
import CatalogView from "@/components/catalog/CatalogView";
import { getActiveCatalogItems } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Event Catalog — Wedding Décor & Entertainment in Rewa MP",
  description:
    "Browse RIWAJ's catalog of wedding, Haldi, Mehendi, Sangeet and party décor themes, plus entertainment like DJ, Dhol, anchors and dance groups for events across Rewa and Madhya Pradesh.",
  openGraph: {
    title: "Event Catalog | RIWAJ Weddings & Events",
    description:
      "Décor themes and entertainment options for weddings and celebrations in Rewa and across Madhya Pradesh.",
    url: "https://vindhyaevents.in/catalog",
  },
  alternates: {
    canonical: "https://vindhyaevents.in/catalog",
  },
};

export default async function CatalogPage() {
  const items = await getActiveCatalogItems();
  return <CatalogView items={items} />;
}
