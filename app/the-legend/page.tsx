import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "The Legend — Japanese Jesus",
  description: "Legacy route that now points to the canon hub.",
  path: "/canon",
  canonical: "/canon",
  image: "/images/og/canon.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "A hilltop marker in Shingo under low evening light",
  robots: {
    index: false,
    follow: true,
  },
});

export default function TheLegend() {
  permanentRedirect("/canon");
}
