import Navbar from "@/components/Navbar";
import TopBanner from "@/components/TopBanner";
import HeroSectionWrapper from "@/components/HeroSectionWrapper";
import BookConsultation from "@/components/BookConsultation";
import Services from "@/components/Services";
import GalleryPreview from "@/components/GalleryPreview";
import TestimonialsWrapper from "@/components/TestimonialsWrapper";
import BlogPreview from "@/components/BlogPreview";
import Footer from "@/components/Footer";
import ClientWidgets from "@/components/ClientWidgets";
import connectToDatabase from "@/lib/db";
import { Blog, Testimonial } from "@/lib/models";
import { getSiteSettings } from "@/lib/getSiteSettings";

export const dynamic = "force-dynamic";

async function getLatestBlogs() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({ isPublished: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3)
      .lean();

    return blogs.map((b: any) => ({
      _id: b._id.toString(),
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      category: b.category || "Planning",
      readTime: b.readTime || "5 min read",
      author: b.author?.name || "RIWAJ Team",
      coverImage: b.coverImage?.url || "/girlsimg.webp",
      dateFormatted: new Date(b.publishedAt || b.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }));
  } catch (e) {
    console.error("Home page getLatestBlogs error:", e);
    return [];
  }
}

async function getTestimonials() {
  try {
    await connectToDatabase();
    const items = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return items.map((t: any) => ({
      _id: t._id.toString(),
      name: t.coupleName,
      image: t.image?.url || "",
      review: t.reviewText,
      rating: t.rating || 5,
      weddingType: t.weddingType || "Royal Wedding Celebration",
      location: t.location || "Rewa, MP",
    }));
  } catch (e) {
    console.error("Home page getTestimonials error:", e);
    return [];
  }
}

export default async function Home() {
  const [latestBlogs, testimonials, siteSettings] = await Promise.all([
    getLatestBlogs(),
    getTestimonials(),
    getSiteSettings(),
  ]);

  return (
    <main className="min-h-screen bg-transparent overflow-x-hidden">
      <TopBanner />
      <Navbar />
      <HeroSectionWrapper slides={siteSettings?.heroSlides} />
      <BookConsultation />
      <Services />
      <GalleryPreview />
      <TestimonialsWrapper testimonials={testimonials} />
      <BlogPreview blogs={latestBlogs} />
      <Footer />
      <ClientWidgets />
    </main>
  );
}
