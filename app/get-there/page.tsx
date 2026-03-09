import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Get There — Japanese Jesus",
  description: "Legacy route for journey guidance to the Shingo conduit.",
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

export default function GetThere() {
  permanentRedirect("/journey");
}
