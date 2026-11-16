"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useSettings } from "@/context/SettingsContext";
import type { CatalogItemData } from "@/lib/catalog";

function CoverFallback({ title }: { title: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-4 text-center"
      style={{ background: "linear-gradient(135deg, var(--c-footer-from), var(--c-primary))" }}
    >
      <span className="font-serif text-lg font-bold text-white/90">{title}</span>
    </div>
  );
}

function OccasionCard({ item }: { item: CatalogItemData }) {
  return (
    <Link
      href={`/catalog/${item.slug}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl"
    >
      {item.coverUrl ? (
        <Image
          src={item.coverUrl}
          alt={`${item.title} décor by RIWAJ`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <CoverFallback title={item.title} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <h3 className="font-serif text-lg font-bold leading-tight text-white sm:text-2xl">{item.title}</h3>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-900 transition-colors group-hover:bg-white">
          View All <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

function EntertainmentTile({ item }: { item: CatalogItemData }) {
  return (
    <Link href={`/catalog/${item.slug}`} className="group block text-center">
      <div className="relative aspect-square overflow-hidden rounded-2xl shadow-sm transition-shadow group-hover:shadow-lg">
        {item.coverUrl ? (
          <Image
            src={item.coverUrl}
            alt={`${item.title} for events by RIWAJ`}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <CoverFallback title={item.title} />
        )}
      </div>
      <h3 className="mt-2 text-sm font-semibold leading-snug text-gray-800 sm:text-base">{item.title}</h3>
    </Link>
  );
}

export default function CatalogView({ items }: { items: CatalogItemData[] }) {
  const { getWhatsAppLink } = useSettings();
  const occasions = items.filter((item) => item.type === "occasion");
  const entertainment = items.filter((item) => item.type === "entertainment");

  return (
    <PageLayout
      title="Our Catalog"
      subtitle="Décor themes, celebration ideas and entertainment to plan your perfect event."
      badge="Catalog"
    >
      <div className="container mx-auto space-y-14 px-4 py-10 md:px-6 md:py-16">
        {occasions.length > 0 && (
          <section>
            <div className="mb-5 md:mb-7">
              <h2 className="font-serif text-2xl font-bold text-gray-900 md:text-4xl">Occasions</h2>
              <p className="mt-1 text-sm text-gray-500 md:text-base">Tap an occasion to see all its photos.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {occasions.map((item) => (
                <OccasionCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {entertainment.length > 0 && (
          <section>
            <div className="mb-5 md:mb-7">
              <h2 className="font-serif text-2xl font-bold text-gray-900 md:text-4xl">Entertainment</h2>
              <p className="mt-1 text-sm text-gray-500 md:text-base">Tap a picture for photos and details.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-5 lg:grid-cols-6">
              {entertainment.map((item) => (
                <EntertainmentTile key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {items.length === 0 && (
          <div className="mx-auto max-w-md py-12 text-center">
            <Sparkles className="mx-auto mb-3 h-10 w-10" style={{ color: "var(--c-primary)" }} />
            <h2 className="font-serif text-2xl font-bold text-gray-900">Our catalog is being updated</h2>
            <p className="mt-2 text-sm text-gray-500">
              New décor themes and entertainment options are coming soon. Message us on WhatsApp to see the latest designs.
            </p>
          </div>
        )}

        <div
          className="rounded-3xl px-6 py-8 text-center text-white md:py-10"
          style={{ background: "linear-gradient(135deg, var(--c-footer-from), var(--c-primary))" }}
        >
          <h2 className="font-serif text-xl font-bold md:text-3xl">Liked something? Let&apos;s plan it together.</h2>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={getWhatsAppLink("Hi RIWAJ, I saw your catalog and want to know more.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-gray-900 transition hover:bg-white/90"
            >
              Ask on WhatsApp
            </a>
            <Link
              href="/contact"
              className="rounded-full border border-white/60 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
