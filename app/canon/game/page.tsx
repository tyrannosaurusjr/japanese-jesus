import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CanonGameCanvas } from "@/components/CanonGameCanvas";

export const metadata: Metadata = {
  title: "Canon Harvest Game — Japanese Jesus",
  description:
    "Play a simple farming game in the Shingo field node: plant, water, harvest, and hit the seasonal coin target before winter lock.",
};

export default function CanonGamePage() {
  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />

      <section className="pt-40 pb-10 px-6 md:px-10 max-w-6xl mx-auto">
        <Link
          href="/canon"
          className="label text-[#F5F2EB]/45 hover:text-[#F5F2EB] transition-colors duration-300"
        >
          Canon
        </Link>
        <p className="label text-[#E8D44D] mt-7 mb-4">Interactive Canon</p>
        <h1
          className="text-5xl md:text-7xl text-[#F5F2EB] leading-[0.95] mb-6"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          Canon Harvest
        </h1>
        <p
          className="max-w-3xl text-[#F5F2EB]/72 text-base md:text-lg leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          Work the field at the Shingo node: plant crops, keep them watered, harvest for coin, and
          use temporary buffs to secure the season before the clock runs out.
        </p>
      </section>

      <section className="px-6 md:px-10 pb-16 max-w-6xl mx-auto">
        <div className="relative p-3 md:p-4 bg-[linear-gradient(145deg,rgba(232,212,77,0.08),rgba(192,57,43,0.08))] border border-[#2D4A3E]/35">
          <CanonGameCanvas />
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2D4A3E]/20">
          {[
            "Use WASD or Arrow Keys.",
            "Press Space or B near a tile to plant, water, or harvest.",
            "Press F to toggle fullscreen. Press R to retry.",
          ].map((note) => (
            <div key={note} className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-5">
              <p
                className="text-[#F5F2EB]/68 text-sm leading-relaxed"
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
