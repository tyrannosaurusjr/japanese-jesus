import type { Metadata } from "next";
import "./globals.css";
import { TransmissionPopup } from "@/components/TransmissionPopup";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://japanesejesus.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Japanese Jesus — The Shingo Conduit",
  description: "The legend holds that Jesus survived the crucifixion and died in a Japanese village called Shingo. The tomb still exists. Read the canon, then go north.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Japanese Jesus — The Shingo Conduit",
    description: "The legend holds that Jesus survived the crucifixion and died in a Japanese village called Shingo. The tomb still exists. Read the canon, then go north.",
    url: siteUrl,
    siteName: "Japanese Jesus",
    type: "website",
  },
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
        {children}
        <TransmissionPopup />
        <Analytics />
      </body>
    </html>
  );
}
