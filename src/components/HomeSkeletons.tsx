import React from "react";

/**
 * Shimmer placeholder for the Hero section
 */
export function HeroShimmerSkeleton() {
  return (
    <div className="relative h-[80vh] mt-[88px] flex items-center justify-center text-center bg-gradient-to-br from-[#1c080d] via-[#300810] to-[#140508] text-white px-6 overflow-hidden">
      {/* Background shimmer wave */}
      <div className="absolute inset-0 shimmer-dark opacity-40 pointer-events-none" />

      {/* Decorative ambient lights */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Badge skeleton */}
        <div className="h-6 w-48 rounded-full shimmer-dark mb-6" />

        {/* Title skeleton */}
        <div className="h-10 md:h-16 w-3/4 max-w-2xl rounded-2xl shimmer-dark mb-4" />
        <div className="h-8 md:h-12 w-1/2 max-w-md rounded-2xl shimmer-dark mb-6" />

        {/* Subtitle skeleton */}
        <div className="h-5 md:h-7 w-4/5 max-w-xl rounded-xl shimmer-dark mb-8 opacity-80" />

        {/* CTA Button skeleton */}
        <div className="h-12 md:h-14 w-44 md:w-52 rounded-full shimmer-dark shadow-xl" />

        {/* Carousel Dots skeleton */}
        <div className="absolute -bottom-20 md:-bottom-24 flex gap-3">
          <div className="w-2.5 h-2.5 rounded-full shimmer-dark" />
          <div className="w-2.5 h-2.5 rounded-full shimmer-dark" />
          <div className="w-2.5 h-2.5 rounded-full shimmer-dark" />
          <div className="w-2.5 h-2.5 rounded-full shimmer-dark" />
        </div>
      </div>
    </div>
  );
}

/**
 * Shimmer placeholder for the Services section
 */
export function ServicesShimmerSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden relative"
        >
          {/* Image header placeholder */}
          <div className="h-56 relative shimmer-effect">
            <div className="absolute top-4 left-4 w-14 h-14 rounded-full shimmer-effect-rose border-2 border-white shadow-sm" />
          </div>

          {/* Content placeholder */}
          <div className="p-6 space-y-4">
            <div className="h-6 w-2/3 rounded-lg shimmer-effect" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded shimmer-effect" />
              <div className="h-4 w-4/5 rounded shimmer-effect" />
            </div>

            {/* Feature tags placeholder */}
            <div className="pt-2 flex flex-wrap gap-2">
              <div className="h-6 w-20 rounded-full shimmer-effect-rose" />
              <div className="h-6 w-24 rounded-full shimmer-effect-rose" />
            </div>

            {/* Read more footer */}
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <div className="h-4 w-24 rounded shimmer-effect" />
              <div className="h-5 w-5 rounded-full shimmer-effect" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Shimmer placeholder for Gallery Preview section
 */
export function GalleryShimmerSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="aspect-[4/3] rounded-2xl overflow-hidden shimmer-effect relative shadow-sm border border-gray-100"
        >
          <div className="absolute inset-x-4 bottom-4 h-6 w-1/2 rounded-md bg-white/40 backdrop-blur-sm" />
        </div>
      ))}
    </div>
  );
}

/**
 * Shimmer placeholder for Testimonials section
 */
export function TestimonialsShimmerSkeleton() {
  return (
    <div className="py-20 bg-gradient-to-b from-white via-rose-50/20 to-white">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <div className="inline-block h-6 w-36 rounded-full shimmer-effect-rose mb-4 mx-auto" />
        <div className="h-8 md:h-12 w-72 rounded-xl shimmer-effect mb-4 mx-auto" />
        <div className="h-4 w-96 rounded shimmer-effect mb-12 mx-auto" />

        {/* 3 Testimonial Cards Shimmer */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className="bg-white rounded-3xl p-7 border border-rose-100/70 shadow-md space-y-4 text-left"
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-4 h-4 rounded-full shimmer-effect-rose" />
                  ))}
                </div>
                <div className="w-7 h-7 rounded-md shimmer-effect-rose opacity-40" />
              </div>

              <div className="space-y-2 py-3">
                <div className="h-4 w-full rounded shimmer-effect" />
                <div className="h-4 w-5/6 rounded shimmer-effect" />
                <div className="h-4 w-4/6 rounded shimmer-effect" />
              </div>

              <div className="pt-4 border-t border-rose-100/60 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full shimmer-effect shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-28 rounded shimmer-effect" />
                  <div className="h-3 w-20 rounded shimmer-effect" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Shimmer placeholder for Blog Preview section
 */
export function BlogShimmerSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md"
        >
          {/* Image placeholder */}
          <div className="aspect-[16/10] shimmer-effect relative">
            <div className="absolute top-4 left-4 h-6 w-20 rounded-full shimmer-effect-rose" />
          </div>

          {/* Details placeholder */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-3 w-20 rounded shimmer-effect" />
              <div className="h-3 w-16 rounded shimmer-effect" />
            </div>
            <div className="h-6 w-full rounded-lg shimmer-effect" />
            <div className="h-6 w-3/4 rounded-lg shimmer-effect" />
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-full rounded shimmer-effect" />
              <div className="h-3.5 w-4/5 rounded shimmer-effect" />
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="h-4 w-28 rounded shimmer-effect" />
              <div className="h-4 w-4 rounded-full shimmer-effect" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
