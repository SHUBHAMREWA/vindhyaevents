import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, Tag, Phone } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import connectToDatabase from "@/lib/db";
import { Blog } from "@/lib/models/Blog";
import { getSiteSettings } from "@/lib/getSiteSettings";

export const revalidate = 60; // 60s cache revalidation

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
  try {
    await connectToDatabase();
    const blog = await Blog.findOne({ slug, isPublished: true }).lean();
    return blog;
  } catch (err) {
    console.error("DB blog fetch error:", err);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const blogs = await Blog.find({ isPublished: true }).select("slug").lean();
    return blogs.map((b: any) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Blog Post Not Found | RIWAJ" };

  return {
    title: `${post.title} | RIWAJ Rewa`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage?.url || "/girlsimg.webp"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([
    getBlogPost(slug),
    getSiteSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const phone = settings.primaryPhone || "7898522932";
  const rawDigits = phone.replace(/[^0-9+]/g, "");
  const telLink = `tel:${rawDigits || "7898522932"}`;
  const siteName = settings.siteName || "Vindhya Events";

  const publishedDate = post.publishedAt || post.createdAt || new Date();
  const formattedDate = new Date(publishedDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <PageLayout
      badge={post.category || "Wedding Guide"}
      title={post.title}
      subtitle={`By ${post.author?.name || `${siteName} Team`} • ${post.readTime || "5 min read"}`}
    >
      <article className="py-16 bg-white min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold text-sm mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Articles</span>
          </Link>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-6 pb-6 border-b border-gray-100">
            <span className="flex items-center gap-1.5 font-medium text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              <Tag className="w-3.5 h-3.5" />
              {post.category || "Wedding Guide"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime || "5 min read"}
            </span>
            <span>By {post.author?.name || "RIWAJ Team"}</span>
          </div>

          {/* Featured Cover Image */}
          {post.coverImage?.url && (
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-xl mb-12">
              <Image
                src={post.coverImage.url}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-rose max-w-none text-gray-700 leading-relaxed text-base space-y-6">
            {(post.content || "").split("\n\n").map((para: string, idx: number) => {
              if (para.startsWith("### ")) {
                return (
                  <h3 key={idx} className="font-serif text-2xl font-bold text-gray-900 mt-8 mb-4">
                    {para.replace("### ", "")}
                  </h3>
                );
              }
              if (para.startsWith("- ")) {
                const listItems = para.split("\n");
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-2 my-4">
                    {listItems.map((li, lIdx) => (
                      <li key={lIdx}>{li.replace(/^- /, "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-gray-700 leading-relaxed">
                  {para}
                </p>
              );
            })}
          </div>

          {/* Consultation CTA Card */}
          <div className="mt-16 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-rose-500 via-rose-600 to-amber-500 text-white shadow-xl text-center">
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3">
              Planning Your Dream Wedding in Rewa, MP?
            </h3>
            <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto mb-6">
              Let {siteName} bring your vision to life with custom stage decor, royal floral arrangements, and seamless guest hospitality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="px-8 py-3.5 bg-white text-rose-600 font-bold rounded-full shadow-lg hover:bg-rose-50 transition-colors text-sm">
                  Book Free Consultation
                </button>
              </Link>
              <a
                suppressHydrationWarning
                href={telLink}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-rose-700/60 hover:bg-rose-700/80 text-white font-bold rounded-full transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                <span suppressHydrationWarning>Call {phone}</span>
              </a>
            </div>
          </div>
        </div>
      </article>
    </PageLayout>
  );
}
