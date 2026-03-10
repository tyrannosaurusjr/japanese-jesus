import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "门",
  description: "A threshold route outside the indexed public map.",
  path: "/the-gate",
  image: "/images/og/signal.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "Rural mountain fields near Shingo, Aomori under an open sky",
  robots: {
    index: false,
    follow: false,
  },
});

// Pixel color map — each brand palette pixel encodes a letter via A1Z26
// (x,y) coordinates spell letters: I=9, S=19, U=21, K=11, I=9, R=18, I=9
// Combined: ISUKIRI → hidden pixel instructions in embedded image
// But the real message is: AXIS → /axis
// Pixel coords:  A=(1,1), X=(24,1), I=(9,1), S=(19,1)

export default async function TheGate() {
  // Set noindex header
  const headersList = await headers();
  void headersList; // consumed server-side via middleware

  return (
    <main
      className="min-h-screen bg-[#0D1B2A] flex flex-col items-center justify-center relative"
      style={{ overflow: "hidden" }}
    >
      {/* Page content — single aerial photograph */}
      <div className="relative w-full h-screen">
        <Image
          src="/images/gate-field-photo.jpg"
          alt="Rural mountain fields near Shingo, Aomori under an open sky"
          fill
          className="object-cover opacity-80"
          sizes="100vw"
          priority
        />

        {/* Coordinate overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6">
          <div className="font-mono text-[#F5F2EB]/60 text-sm tracking-widest text-center">
            <span>40.46577° N, 141.17350° E</span>
          </div>
        </div>

        {/* Hidden pixel cipher
             Brand palette pixels embedded in this image:
             Pixel at (1,1): #C0392B — Cosmic Vermilion → A (A=1)
             Pixel at (24,1): #0D1B2A — Abyssal Midnight → X (X=24)
             Pixel at (9,1): #E8D44D — Neon Citrine → I (I=9)
             Pixel at (19,1): #FF4D6D — Infrared Pink → S (S=19)
             Reading: A-X-I-S → /axis
        -->
        */}
      </div>
    </main>
  );
}
