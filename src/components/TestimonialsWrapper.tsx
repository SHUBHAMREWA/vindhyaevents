"use client";

import dynamic from "next/dynamic";
import type { TestimonialItem } from "@/components/Testimonials";
import { TestimonialsShimmerSkeleton } from "@/components/HomeSkeletons";

const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  ssr: false,
  loading: () => <TestimonialsShimmerSkeleton />,
});

interface TestimonialsWrapperProps {
  testimonials?: TestimonialItem[];
}

export default function TestimonialsWrapper({ testimonials }: TestimonialsWrapperProps) {
  return <Testimonials testimonials={testimonials} />;
}
