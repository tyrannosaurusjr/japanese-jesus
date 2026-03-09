import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Shingo Today — Japanese Jesus",
  description: "Legacy route that now points to the Shingo conduit hub.",
  path: "/conduit",
  canonical: "/conduit",
  image: "/images/og/conduit.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "Open fields in Aomori with distant mountain ridges",
  robots: {
    index: false,
    follow: true,
  },
});

export default function ShingoToday() {
  permanentRedirect("/conduit");
}
