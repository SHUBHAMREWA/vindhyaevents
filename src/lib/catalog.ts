import connectToDatabase from "@/lib/db";
import { CatalogItem, type CatalogType } from "@/lib/models/CatalogItem";

export interface CatalogImageData {
  url: string;
  alt?: string;
  title?: string;
}

export interface CatalogItemData {
  id: string;
  type: CatalogType;
  title: string;
  slug: string;
  description: string;
  coverUrl: string;
  images: CatalogImageData[];
}

// Plain, serialisable shape for passing from server pages to client components.
function toData(doc: any): CatalogItemData {
  const images: CatalogImageData[] = (doc.images || [])
    .filter((img: any) => img?.url)
    .map((img: any) => ({ url: img.url, alt: img.alt || "", title: img.title || "" }));
  return {
    id: String(doc._id),
    type: doc.type,
    title: doc.title,
    slug: doc.slug,
    description: doc.description || "",
    coverUrl: doc.coverImage?.url || images[0]?.url || "",
    images,
  };
}

export async function getActiveCatalogItems(): Promise<CatalogItemData[]> {
  try {
    await connectToDatabase();
    const docs = await CatalogItem.find({ isActive: true }).sort({ order: 1, createdAt: 1 }).lean();
    return docs.map(toData);
  } catch (error) {
    console.error("Catalog fetch error:", error);
    return [];
  }
}

export async function getActiveCatalogItem(slug: string): Promise<CatalogItemData | null> {
  try {
    await connectToDatabase();
    const doc = await CatalogItem.findOne({ slug: slug.toLowerCase(), isActive: true }).lean();
    return doc ? toData(doc) : null;
  } catch (error) {
    console.error("Catalog item fetch error:", error);
    return null;
  }
}
