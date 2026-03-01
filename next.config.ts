import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Lazy loading is enabled by default in Next.js Image
    // Only hero image uses priority/eager loading
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },
  // Ensure ARG routes are never statically cached
  async headers() {
    return [
      {
        source: "/the-gate",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, no-cache" },
        ],
      },
      {
        source: "/axis",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, no-cache" },
          { key: "Vary", value: "*" },
        ],
      },
      {
        source: "/thin-place",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, no-cache" },
        ],
      },
    ];
  },
};

export default nextConfig;
