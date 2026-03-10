import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { TransmissionPopup } from "@/components/TransmissionPopup";
import { Analytics } from "@vercel/analytics/next";
import { ImpactClickCapture } from "@/components/ImpactClickCapture";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { buildPageMetadata } from "@/lib/metadata";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://japanesejesus.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...buildPageMetadata({
    title: "Japanese Jesus: The Jesus Tomb Legend of Shingo Village, Japan",
    description:
      "The legend holds that Jesus survived the crucifixion and died in a Japanese village called Shingo. The tomb still exists. Read the canon, then go north.",
    path: "/",
    image: "/images/og/home-sigil.jpg",
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: "The Japanese Jesus sigil centered in a gray field",
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*
 周波数: 7.83 Hz — すべての門は開いている

      */}
      <body className="antialiased">
        <ImpactClickCapture />
        {children}
        <TransmissionPopup />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
