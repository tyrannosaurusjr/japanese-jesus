import type { Metadata } from "next";
import "./globals.css";
import { TransmissionPopup } from "@/components/TransmissionPopup";

export const metadata: Metadata = {
  title: "Japanese Jesus — Shingo Village, Aomori",
  description: "He did not die here. Shingo Village, Aomori. The other end of the story.",
  openGraph: {
    title: "Japanese Jesus — Shingo Village, Aomori",
    description: "He did not die here. Shingo Village, Aomori. The other end of the story.",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <TransmissionPopup />
      </body>
    </html>
  );
}
