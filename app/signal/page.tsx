import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Sigil } from "@/components/Sigil";
import { TransmissionForm } from "@/components/TransmissionForm";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Subscribe to Japanese Jesus: Shingo Updates & Canon Signals",
  description:
    "Subscribe for Japanese Jesus updates: new canon releases, Shingo field notes, relic drops, and journey dispatches from Aomori.",
  path: "/signal",
  keywords: [
    "Japanese Jesus updates",
    "Shingo field notes",
    "Aomori legend newsletter",
    "Japanese Jesus canon updates",
  ],
  image: "/images/og/signal.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "Rural fields in northern Japan under a spectral sky",
});

export default function SignalPage() {
  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />

      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <p className="label text-[#E8D44D] mb-6">Signal</p>
        <h1
          className="text-5xl md:text-7xl text-[#F5F2EB] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          Stay Connected to Japanese Jesus.
        </h1>
        <p className="label text-[#E8D44D]/85 mb-8">
          Japanese Jesus Updates, Canon Releases &amp; Shingo Field Notes
        </p>
        <div className="w-16 h-px bg-[#C0392B]" />
      </section>

      <section className="px-6 md:px-10 pb-16 max-w-3xl mx-auto">
        <p
          className="text-[#F5F2EB]/65 text-base leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          Signals do not arrive on schedule. When the conduit stirs — new canon, field notes from
          Shingo, journey updates, relic drops — the transmission goes here first.
        </p>
      </section>

      <section className="px-6 md:px-10 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2D4A3E]/20">
          {[
            "Canon updates and new long-form lore",
            "Conduit field notes and Shingo-related additions",
            "Relic release notices and occasional journey intel",
          ].map((item) => (
            <div key={item} className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6">
              <p
                className="text-[#F5F2EB]/65 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-32">
        <div className="max-w-2xl mx-auto border border-[#2D4A3E]/30 bg-[#09131F]/80 p-8 md:p-10">
          <div className="flex items-center gap-4 mb-6">
            <Sigil variant="citrine" size={36} className="opacity-70" />
            <p className="label text-[#E8D44D]">Newsletter &amp; Updates</p>
          </div>
          <p
            className="text-[#F5F2EB]/55 text-sm leading-relaxed mb-6"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            This is the primary newsletter and notification channel for the site. There is no
            separate public list right now.
          </p>
          <TransmissionForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
