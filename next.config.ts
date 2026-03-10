import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.cdn.printful.com",
      },
    ],
  },
  // Force blocking metadata render for preview clients so page-level OG tags are always present.
  htmlLimitedBots:
    /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|TelegramBot|MetaInspector|Embedly|iframely|Line\/|iMessage|CFNetwork/i,
  // Ensure ARG routes are never statically cached
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Vercel serves HTTP/2+ automatically; advertise HTTP/3 support explicitly.
          { key: "Alt-Svc", value: 'h3=":443"; ma=86400' },
        ],
      },
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
