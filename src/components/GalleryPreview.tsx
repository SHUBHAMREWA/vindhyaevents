"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { galleryImages } from "@/data/staticData";

export default function GalleryPreview() {
  const preview = galleryImages.slice(0, 6);
  return (
    <section className="py-20 bg-gray-50" id="gallery">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <div className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ background: "var(--c-bg-soft)", color: "var(--c-primary)" }}>
            Portfolio
          </div>
          <h2 className="text-3xl font-serif mb-3" style={{ color: "var(--c-footer-from)" }}>Our Wedding Gallery</h2>
          <p className="text-gray-600 max-w-xl mx-auto">A glimpse into the beautiful weddings we've had the privilege to create</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {preview.map((img, i) => (
            <motion.div key={img.url} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-md hover:shadow-xl">
              <Image src={img.url} alt={img.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" loading="lazy" />
              <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}>
                <span className="text-white font-medium text-sm">{img.title}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/gallery">
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-medium shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
              style={{ background: `linear-gradient(to right, var(--c-primary), var(--c-primary-dark))` }}>
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
