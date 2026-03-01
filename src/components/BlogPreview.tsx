"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { blogPosts } from "@/data/staticData";

export default function BlogPreview() {
  const preview = blogPosts.slice(0, 3);
  return (
    <section className="py-20 bg-white" id="blog">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <div className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}>
            Inspiration & Ideas
          </div>
          <h2 className="text-3xl font-serif mb-3" style={{ color: "var(--c-footer-from)" }}>Wedding Blog</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Expert advice and insights to help you plan the wedding of your dreams</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {preview.map((post, i) => (
            <motion.article key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer">
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-gray-100">
                <div className="relative h-52 overflow-hidden">
                  <ImageWithFallback src={post.image} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 rounded-full text-xs font-medium" style={{ color: "var(--c-primary)" }}>{post.category}</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <h3 className="font-serif text-base mb-2 line-clamp-2 group-hover:opacity-75 transition-opacity" style={{ color: "var(--c-footer-from)" }}>{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: "var(--c-border)" }}>
                    <span className="text-xs text-gray-500">By {post.author}</span>
                    <span className="text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "var(--c-primary)" }}>
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/blog">
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium border-2 hover:text-white transition-all duration-300"
              style={{ borderColor: "var(--c-primary)", color: "var(--c-primary)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--c-primary)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = ""; (e.currentTarget as HTMLButtonElement).style.color = "var(--c-primary)"; }}
            >
              Read All Articles <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
