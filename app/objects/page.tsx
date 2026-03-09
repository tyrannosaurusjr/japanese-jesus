import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Objects — Japanese Jesus",
  description: "Legacy route that now points to the Relics catalog.",
  path: "/relics",
  canonical: "/relics",
  image: "/images/og/relics.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "Rift Sigil bucket hat set against dark fabric",
  robots: {
    index: false,
    follow: true,
  },
});

export default function Objects() {
  permanentRedirect("/relics");
}
