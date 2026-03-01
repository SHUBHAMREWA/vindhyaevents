"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { blogPosts, blogCategories } from "@/data/staticData";
import Link from "next/link";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery]           = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchCat    = selectedCategory === "All" || post.category === selectedCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredPost  = blogPosts.find(p => p.featured);
  const regularPosts  = filteredPosts.filter(p => !p.featured);

  return (
    <PageLayout
      badge="Inspiration & Ideas"
      title="Wedding Blog"
      subtitle="Expert advice, inspiration, and insights to help you plan the wedding of your dreams"
    >
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
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor: "var(--c-border)" }}
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {blogCategories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  style={selectedCategory === cat
                    ? { background: `linear-gradient(to right, var(--c-primary), var(--c-primary-dark))`, color: "#fff" }
                    : { background: "#fff", color: "#6b7280", border: "1px solid var(--c-border)" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && selectedCategory === "All" && !searchQuery && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-14">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-full min-h-[320px] overflow-hidden">
                    <ImageWithFallback src={featuredPost.image} alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-amber-400 text-white rounded-full text-sm font-medium">Featured</span>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center" style={{ background: "linear-gradient(135deg, var(--c-bg-soft), #fff)" }}>
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--c-primary)" }}>
                        <Tag className="w-4 h-4" />{featuredPost.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4" />{featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />{featuredPost.readTime}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl mb-4 group-hover:opacity-80 transition-opacity" style={{ color: "var(--c-footer-from)" }}>
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">By {featuredPost.author}</span>
                      <button className="flex items-center gap-2 font-medium group-hover:gap-4 transition-all duration-300" style={{ color: "var(--c-primary)" }}>
                        Read More <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {regularPosts.map((post, i) => (
                <motion.article key={post.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-gray-100">
                    <div className="relative h-56 overflow-hidden">
                      <ImageWithFallback src={post.image} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 rounded-full text-xs font-medium" style={{ color: "var(--c-primary)" }}>{post.category}</span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                      </div>
                      <h3 className="font-serif text-lg mb-3 line-clamp-2 group-hover:opacity-80 transition-opacity" style={{ color: "var(--c-footer-from)" }}>
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--c-border)" }}>
                        <span className="text-sm text-gray-600">By {post.author}</span>
                        <button className="flex items-center gap-1.5 text-sm font-medium group-hover:gap-3 transition-all duration-300" style={{ color: "var(--c-primary)" }}>
                          Read More <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty state */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-20 text-gray-500">No articles found. Try adjusting your filters.</div>
          )}

          {/* Newsletter */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-20 rounded-3xl p-8 md:p-14 text-center shadow-2xl text-white"
            style={{ background: `linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))` }}
          >
            <h3 className="font-serif text-3xl text-white mb-3">Stay Inspired</h3>
            <p className="text-white/85 mb-8 max-w-xl mx-auto">Subscribe for the latest wedding trends, planning tips, and exclusive offers from Vindhya Events.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full focus:outline-none text-gray-800" />
              <button className="px-8 py-3 bg-white rounded-full font-semibold hover:bg-gray-50 transition-colors"
                style={{ color: "var(--c-primary)" }}>
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
