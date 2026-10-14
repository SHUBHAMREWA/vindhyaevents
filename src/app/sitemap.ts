import { MetadataRoute } from "next";
import connectToDatabase from "@/lib/db";
import { Blog } from "@/lib/models/Blog";
import { ALL_EVENTS } from "@/data/eventRoutes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://riwajevents.in";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // All 24 Wedding & Corporate Event Sub-Pages
  const eventRoutes: MetadataRoute.Sitemap = ALL_EVENTS.map((event) => ({
    url: `${baseUrl}/${event.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectToDatabase();
    const blogs = await Blog.find({ isPublished: true })
      .select("slug updatedAt publishedAt")
      .lean();

    blogRoutes = blogs.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Sitemap dynamic blog fetch error:", err);
  }

  return [...staticRoutes, ...eventRoutes, ...blogRoutes];
}
