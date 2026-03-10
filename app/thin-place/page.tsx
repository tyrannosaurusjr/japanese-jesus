import type { Metadata } from "next";
import { Sigil } from "@/components/Sigil";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Thin Place",
  description: "A private threshold route where the membrane is described as permeable.",
  path: "/thin-place",
  image: "/images/og/thin-place.png",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "Distressed print treatment for the Thin Place mark",
  robots: {
    index: false,
    follow: false,
  },
});

// Thin places — locations where boundary between physical and spirit world is permeable
const THIN_PLACES = [
  { name: "Shingo Village", location: "Aomori Prefecture, Japan", detail: "40.65419° N, 141.13889° E" },
  { name: "Lake Titicaca", location: "Bolivia / Peru border", detail: "16.0° S, 69.2° W" },
  { name: "Tunguska Basin", location: "Siberia, Russia", detail: "60.917° N, 101.950° E" },
  { name: "Room 811", location: "Osaka, Japan", detail: "Hotel Shin-Osaka. No longer exists." },
  { name: "Skellig Michael", location: "County Kerry, Ireland", detail: "51.776° N, 10.539° W" },
  { name: "The Atacama Node", location: "Chile", detail: "23.867° S, 68.219° W" },
];

export default function ThinPlace() {
  return (
    <main
      className="min-h-screen bg-[#F5F2EB] flex flex-col items-center relative"
      style={{ color: "#0D1B2A" }}
    >
      {/* Inverted from rest of site — deliberate */}

      {/* Large faint sigil */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <Sigil variant="dark" size={600} className="opacity-[0.03]" />
      </div>

      {/* Audio file */}
      <div className="sr-only">
        <audio controls preload="none">
          <source src="/audio/transmission_00.wav" type="audio/wav" />
        </audio>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-24 w-full">

        {/* Header */}
        <div className="mb-16">
          <p
            className="text-xs tracking-[0.3em] uppercase text-[#0D1B2A]/40 mb-4"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Thin Place
          </p>
          <h1
            className="text-4xl md:text-5xl leading-tight mb-6"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 900,
              color: "#0D1B2A",
            }}
          >
            Where the membrane<br />is permeable.
          </h1>
          <div className="w-12 h-px bg-[#C0392B]" />
        </div>

        {/* Body text */}
        <div
          className="text-[#0D1B2A]/70 text-sm leading-relaxed mb-12 space-y-4"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          <p>
            A thin place is not a metaphor. It is a structural feature of certain locations.
            The boundary between the physical and what lies beyond it is not uniform.
            In some places it is thick. In others it has been worn down.
            By passage. By accumulated residue. By intention.
          </p>
          <p>
            Shingo is the thinnest place documented. But it is not alone.
          </p>
        </div>

        {/* Thin places list */}
        <div className="space-y-px mb-16">
          {THIN_PLACES.map((place, i) => (
            <div
              key={i}
              className="border border-[#0D1B2A]/10 p-5 flex items-start justify-between gap-4"
            >
              <div>
                <p
                  className="text-base mb-1"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 900,
                    color: "#0D1B2A",
                  }}
                >
                  {place.name}
                </p>
                <p
                  className="text-xs text-[#0D1B2A]/50"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {place.location}
                </p>
              </div>
              <p
                className="text-xs text-[#0D1B2A]/35 text-right shrink-0"
                style={{ fontFamily: "monospace" }}
              >
                {place.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Audio transmission */}
        <div className="border border-[#0D1B2A]/15 p-6 mb-16">
          <p
            className="text-xs tracking-[0.2em] uppercase text-[#0D1B2A]/40 mb-3"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Transmission 00
          </p>
          <p
            className="text-sm text-[#0D1B2A]/60 mb-4"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            A recording from the membrane. Wind. Low static. Something underneath.
          </p>
          <audio
            controls
            className="w-full"
            preload="none"
            style={{ filter: "invert(1) hue-rotate(180deg)" }}
          >
            <source src="/audio/transmission_00.wav" type="audio/wav" />
          </audio>
          <p
            className="text-xs text-[#0D1B2A]/25 mt-3"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            _00 — run through DeepSound for full transmission
          </p>
        </div>

        {/* Invisible email address — infrared on white */}
        {/* aria-label is findable by source inspection */}
        <div className="text-center">
          <p
            className="text-sm text-[#0D1B2A]/60 mb-4"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            If you want to cross:
          </p>
          <span
            aria-label="Write to: keeper@japanesejesus.com — Subject: THE FORM WAS TEMPORARY"
            role="link"
            style={{
              color: "#FF4D6D",
              backgroundColor: "#F5F2EB",
              userSelect: "none",
              cursor: "default",
            }}
          >
            {/* Invisible: #FF4D6D on #F5F2EB — visible under color inversion or image filter */}
            keeper@japanesejesus.com
          </span>
          <p
            className="text-xs text-[#0D1B2A]/30 mt-3"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Subject: THE FORM WAS TEMPORARY
          </p>
        </div>

      </div>
    </main>
  );
}
