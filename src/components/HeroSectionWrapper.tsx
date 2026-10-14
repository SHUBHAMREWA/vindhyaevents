"use client";

import dynamic from "next/dynamic";
import { HeroShimmerSkeleton } from "@/components/HomeSkeletons";

const HeroCarousel = dynamic(() => import("@/components/HeroCarousel"), {
  ssr: false,
  loading: () => <HeroShimmerSkeleton />,
});

export default function HeroSectionWrapper({ slides }: { slides?: any[] }) {
  return <HeroCarousel slides={slides} />;
}
