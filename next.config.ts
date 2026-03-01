import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 5184000, // 60 days
  },
  compress: true,
  reactStrictMode: true,

  // ─── Aggressive caching headers ──────────────────────────────
  async headers() {
    return [
      {
        // Static assets: 1 year immutable cache
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Optimized images: 60 days
        source: "/_next/image/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=5184000, stale-while-revalidate=86400" },
        ],
      },
      {
        // Pages: revalidate every 60s, stale ok for 24h
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
