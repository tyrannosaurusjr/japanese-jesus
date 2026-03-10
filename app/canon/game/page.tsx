import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CanonGameCanvas } from "@/components/CanonGameCanvas";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Canon Blade Game — Japanese Jesus",
  description:
    "Play a 16-bit mythological side-scrolling action game through the first four Japanese Jesus epochs while canon moves toward Epoch 5, where the portal opens.",
  path: "/canon/game",
  image: "/images/og/canon.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "A winding road through a misty mountain valley",
});

export default function CanonGamePage() {
  return (
    <main className="min-h-screen bg-[#070B14]">
      <Nav />

      <section className="pt-40 pb-10 px-6 md:px-10 max-w-6xl mx-auto">
        <Link
          href="/canon"
          className="label text-[#EFE4CF]/45 hover:text-[#EFE4CF] transition-colors duration-300"
        >
          Canon
        </Link>
        <p className="label text-[#D6B56E] mt-7 mb-4">Interactive Canon</p>
        <h1
          className="text-5xl md:text-7xl text-[#EFE4CF] leading-[0.95] mb-6"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          Canon Blade
        </h1>
        <p
          className="max-w-3xl text-[#EFE4CF]/72 text-base md:text-lg leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          Slash through the first four canon epochs in a 16-bit myth-action run: wandering spirit,
          incarnation and burden, eastward journey, and the Herai years in Shingo. Fight with
          blade combos, conduit shots, phase dashes, and boss encounters across lush parallax
          stages. Each epoch runs through five long sublevels, with XP earned from kills and item
          recovery driving level-ups and enhancement choices before the boss lane. Epoch 5, where
          the portal opens, follows this playable phase.
        </p>
      </section>

      <section className="px-6 md:px-10 pb-16 max-w-6xl mx-auto">
        <div className="relative p-3 md:p-4 bg-[linear-gradient(145deg,rgba(239,228,207,0.08),rgba(196,74,50,0.08))] border border-[#EFE4CF]/35">
          <CanonGameCanvas />
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#EFE4CF]/20">
          {[
            "Move with WASD (W jump, A/D move, S duck).",
            "Use arrows for actions: Left slash (deflect), Up shot, Right dash, Down shield.",
            "Earn XP from kills and item pickups to level up and pick enhancements.",
          ].map((note) => (
            <div key={note} className="bg-[#070B14] border border-[#EFE4CF]/30 p-5">
              <p
                className="text-[#EFE4CF]/68 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
