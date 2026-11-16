import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogDetailView from "@/components/catalog/CatalogDetailView";
import { getActiveCatalogItem } from "@/lib/catalog";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getActiveCatalogItem(slug);
  if (!item) return { title: "Catalog item not found" };

  const description =
    item.description ||
    `${item.title} by RIWAJ Weddings & Events — photos and ideas for celebrations in Rewa and Madhya Pradesh.`;

  return {
    title: `${item.title} — Catalog`,
    description,
    openGraph: {
      title: `${item.title} | RIWAJ Catalog`,
      description,
      url: `https://vindhyaevents.in/catalog/${item.slug}`,
      images: item.coverUrl ? [{ url: item.coverUrl }] : undefined,
    },
    alternates: {
      canonical: `https://vindhyaevents.in/catalog/${item.slug}`,
    },
  };
}

export default async function CatalogItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getActiveCatalogItem(slug);
  if (!item) notFound();
  return <CatalogDetailView item={item} />;
}
