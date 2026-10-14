import PageLayout from "@/components/PageLayout";
import connectToDatabase from "@/lib/db";
import { Blog } from "@/lib/models/Blog";
import BlogListClient, { BlogItem } from "@/components/BlogListClient";

export const revalidate = 60; // 60s cache revalidation

export const metadata = {
  title: "Wedding Blog & Inspiration | RIWAJ Rewa",
  description:
    "Expert advice, wedding decoration trends, and bridal inspiration from RIWAJ wedding planners in Rewa, MP.",
};

async function getPublishedBlogs(): Promise<BlogItem[]> {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({ isPublished: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    return blogs.map((b: any) => ({
      _id: b._id.toString(),
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      category: b.category || "Planning",
      readTime: b.readTime || "5 min read",
      author: b.author?.name || "RIWAJ Team",
      publishedAt: b.publishedAt
        ? new Date(b.publishedAt).toISOString()
        : new Date(b.createdAt).toISOString(),
      dateFormatted: new Date(b.publishedAt || b.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      coverImage: b.coverImage?.url || "/girlsimg.webp",
      featured: !!b.featured,
    }));
  } catch (error) {
    console.error("Failed to fetch blogs from MongoDB:", error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();

  const uniqueCats = Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)));
  const categories = ["All", ...uniqueCats];

  return (
    <PageLayout
      badge="Inspiration & Ideas"
      title="Wedding Blog"
      subtitle="Expert advice, inspiration, and insights to help you plan the wedding of your dreams in Rewa, MP"
    >
      <BlogListClient initialBlogs={blogs} categories={categories} />
    </PageLayout>
  );
}
