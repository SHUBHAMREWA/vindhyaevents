"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, ArrowRight, Search, Tag, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  dateFormatted: string;
  coverImage: string;
  featured: boolean;
  publishedAt?: string;
}

interface BlogListClientProps {
  initialBlogs: BlogItem[];
  categories: string[];
}

import { useInstantContent } from "@/lib/cache/useInstantContent";

export default function BlogListClient({
  initialBlogs,
  categories,
}: BlogListClientProps) {
  const { content } = useInstantContent();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const activeBlogs: BlogItem[] =
    initialBlogs && initialBlogs.length > 0
      ? initialBlogs
      : content.blogs && content.blogs.length > 0
      ? content.blogs.map((b: any) => ({
          _id: b._id?.toString() || b.slug || b.id?.toString(),
          title: b.title,
          slug: b.slug || b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
          excerpt: b.excerpt,
          category: b.category || "Planning",
          readTime: b.readTime || "5 min read",
          author: b.author?.name || b.author || "RIWAJ Team",
          dateFormatted: new Date(b.publishedAt || b.createdAt || b.date || Date.now()).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          coverImage: b.coverImage?.url || b.image || "/girlsimg.webp",
          featured: !!b.featured,
        }))
      : [];

  const filteredPosts = activeBlogs.filter((post) => {
    const matchCat =
      selectedCategory === "All" ||
      post.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredPost = activeBlogs.find((p) => p.featured);
  const regularPosts =
    featuredPost && selectedCategory === "All" && !searchQuery
      ? filteredPosts.filter((p) => p._id !== featuredPost._id)
      : filteredPosts;

  if (initialBlogs.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-white min-h-[50vh] flex items-center">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif text-gray-900 mb-3">No Blog Posts Published Yet</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We are working on bringing you the most inspiring wedding decor trends, traditional planning advice, and venue ideas from Rewa, MP. Check back soon!
          </p>
          <Link href="/contact">
            <button
              className="px-8 py-3.5 rounded-full text-white font-medium shadow-lg hover:opacity-95 transition-opacity text-sm"
              style={{ background: `linear-gradient(to right, var(--c-primary), var(--c-primary-dark))` }}
            >
              Book Wedding Consultation
            </button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 transition-all text-sm bg-white"
              style={{ borderColor: "var(--c-border)" }}
            />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize"
                style={
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? {
                        background: `linear-gradient(to right, var(--c-primary), var(--c-primary-dark))`,
                        color: "#fff",
                        boxShadow: "0 4px 12px rgba(225, 29, 72, 0.2)",
                      }
                    : {
                        background: "#fff",
                        color: "#6b7280",
                        border: "1px solid var(--c-border)",
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post (only when viewing All and no search) */}
        {featuredPost && selectedCategory === "All" && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <Link href={`/blog/${featuredPost.slug}`} className="block group">
              <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white border border-gray-100">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-full min-h-[320px] overflow-hidden bg-gray-100">
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-amber-500 text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow">
                        Featured Article
                      </span>
                    </div>
                  </div>
                  <div
                    className="p-8 md:p-12 flex flex-col justify-center"
                    style={{ background: "linear-gradient(135deg, var(--c-bg-soft), #fff)" }}
                  >
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      <span
                        className="flex items-center gap-1.5 text-sm font-medium"
                        style={{ color: "var(--c-primary)" }}
                      >
                        <Tag className="w-4 h-4" />
                        {featuredPost.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.dateFormatted}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <h2
                      className="font-serif text-2xl md:text-3xl mb-4 group-hover:opacity-85 transition-opacity"
                      style={{ color: "var(--c-footer-from)" }}
                    >
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/60">
                      <span className="text-gray-700 font-medium text-sm">
                        By {featuredPost.author}
                      </span>
                      <span
                        className="flex items-center gap-2 font-medium group-hover:gap-4 transition-all duration-300 text-sm"
                        style={{ color: "var(--c-primary)" }}
                      >
                        Read Article <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Regular Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {regularPosts.map((post, i) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link href={`/blog/${post.slug}`} className="block group h-full">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-gray-100">
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold shadow-sm"
                          style={{ color: "var(--c-primary)" }}
                        >
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.dateFormatted}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3
                        className="font-serif text-lg mb-3 line-clamp-2 group-hover:opacity-80 transition-opacity"
                        style={{ color: "var(--c-footer-from)" }}
                      >
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div
                        className="flex items-center justify-between pt-4 border-t"
                        style={{ borderColor: "var(--c-border)" }}
                      >
                        <span className="text-xs text-gray-600">By {post.author}</span>
                        <span
                          className="flex items-center gap-1.5 text-xs font-semibold group-hover:gap-3 transition-all duration-300"
                          style={{ color: "var(--c-primary)" }}
                        >
                          Read More <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty search results state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200 p-8 my-8">
            <p className="text-lg font-medium text-gray-700 mb-2">No articles found</p>
            <p className="text-sm text-gray-500">
              No articles match &ldquo;{searchQuery}&rdquo; in category &ldquo;{selectedCategory}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-5 py-2 text-xs font-semibold rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Consultation CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-3xl p-8 md:p-14 text-center shadow-2xl text-white"
          style={{ background: `linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))` }}
        >
          <h3 className="font-serif text-3xl text-white mb-3">Planning Your Wedding in Rewa?</h3>
          <p className="text-white/85 mb-8 max-w-xl mx-auto">
            Get in touch with our RIWAJ wedding specialists for bespoke mandap decor, royal entry themes, venue selections, and budget planning.
          </p>
          <Link href="/contact">
            <button
              className="px-8 py-3.5 bg-white rounded-full font-semibold hover:bg-gray-50 transition-colors text-sm"
              style={{ color: "var(--c-primary)" }}
            >
              Book Free Consultation
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
