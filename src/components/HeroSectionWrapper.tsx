"use client";

import HeroCarousel from "@/components/HeroCarousel";

// Rendered on the server too, so the first hero photo starts downloading with
// the page instead of waiting for the JavaScript to load.
export default function HeroSectionWrapper({ slides }: { slides?: any[] }) {
  return <HeroCarousel slides={slides} />;
}
