"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useSettings } from "@/context/SettingsContext";
import type { CatalogItemData } from "@/lib/catalog";

export default function CatalogDetailView({ item }: { item: CatalogItemData }) {
  const { getWhatsAppLink } = useSettings();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const photos = item.images.length > 0 ? item.images : item.coverUrl ? [{ url: item.coverUrl }] : [];

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((index) => (index === null ? null : (index + delta + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, close, step]);

  const enquiry = `Hi RIWAJ, I'm interested in ${item.title} from your catalog. Please share details.`;
  const current = openIndex === null ? null : photos[openIndex];

  return (
    <PageLayout
      title={item.title}
      subtitle={item.description || "Photos from celebrations we've designed and managed."}
      badge={item.type === "entertainment" ? "Entertainment" : "Catalog"}
    >
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Link
          href="/catalog"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: "var(--c-primary)" }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Link>

        {photos.length > 0 ? (
          <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
            {photos.map((photo, index) => (
              <button
                key={`${photo.url}-${index}`}
                type="button"
                onClick={() => setOpenIndex(index)}
                className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-lg sm:mb-4"
              >
                <span className="block overflow-hidden">
                  <Image
                    src={photo.url}
                    alt={photo.title || photo.alt || `${item.title} by RIWAJ — photo ${index + 1}`}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="h-auto w-full transition-transform duration-500 hover:scale-105"
                  />
                </span>
                {photo.title && (
                  <span className="block px-3 py-2 text-left text-xs font-semibold leading-snug text-gray-800 sm:text-sm">
                    {photo.title}
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-gray-500">Photos for {item.title} are coming soon.</p>
        )}

        <div className="mt-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
          <a
            href={getWhatsAppLink(enquiry)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90"
            style={{ background: "linear-gradient(to right, var(--c-primary), var(--c-primary-dark))" }}
          >
            Enquire on WhatsApp
          </a>
          <Link
            href="/contact"
            className="rounded-full border px-6 py-2.5 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
            style={{ borderColor: "var(--c-border)" }}
          >
            Book a Consultation
          </Link>
        </div>
      </div>

      {current && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title} photo viewer`}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="absolute left-2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-4"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="absolute right-2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-4"
                aria-label="Next photo"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.title || current.alt || item.title}
            className="max-h-[78vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute inset-x-4 bottom-3 text-center text-sm text-white/70">
            {current.title && (
              <span className="block truncate text-base font-semibold text-white">{current.title}</span>
            )}
            {openIndex! + 1} / {photos.length}
          </p>
        </div>
      )}
    </PageLayout>
  );
}
