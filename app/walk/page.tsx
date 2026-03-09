import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { permanentRedirect } from "next/navigation";

export const metadata: Metadata = buildPageMetadata({
  title: "Walk — Japanese Jesus",
  description: "Legacy route that now points to the journey guide.",
  path: "/journey",
  canonical: "/journey",
  image: "/images/og/journey.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "A winding mountain road through northern terrain",
  robots: {
    index: false,
    follow: true,
  },
});

export default function WalkPage() {
  permanentRedirect("/journey");
}
