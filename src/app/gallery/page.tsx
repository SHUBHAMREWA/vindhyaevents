"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { galleryImages } from "@/data/staticData";

const categories = ["All", "Ceremony", "Reception", "Outdoor", "Decor", "Details", "Bride"];

export default function GalleryPage() {
  const [selected, setSelected]   = useState("All");
  const [lightbox, setLightbox]   = useState<typeof galleryImages[0] | null>(null);

  const filtered = selected === "All"
    ? galleryImages
    : galleryImages.filter(img => img.category === selected);

  return (
    <PageLayout
      badge="Portfolio"
      title="Our Wedding Gallery"
      subtitle="A glimpse into the beautiful weddings and events we've had the privilege to create"
    >
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelected(cat)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={selected === cat
                  ? { background: `linear-gradient(to right, var(--c-primary), var(--c-primary-dark))`, color: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }
                  : { background: "#fff", color: "#6b7280", border: "1px solid var(--c-border)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {filtered.map((img, i) => (
                <motion.div key={img.url}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl"
                  onClick={() => setLightbox(img)}
                >
                  <Image src={img.url} alt={img.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" loading="lazy" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)" }}>
                    <ZoomIn className="w-8 h-8 text-white mb-2" />
                    <p className="text-white font-semibold text-sm">{img.title}</p>
                    <span className="text-white/70 text-xs mt-1">{img.category}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.92)" }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full h-[70vh]">
                <Image src={lightbox.url} alt={lightbox.title} fill className="object-contain" sizes="100vw" priority />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                <h3 className="text-white text-lg font-serif">{lightbox.title}</h3>
                <span className="text-white/60 text-sm">{lightbox.category}</span>
              </div>
              <button onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
