export const runtime = "edge";
export const revalidate = 0;

import { Sigil } from "@/components/Sigil";

// 15 variant content pools
const VARIANT_TEXTS = [
  "The first passage was before the village had a name.",
  "Light does not pass through the membrane. Consciousness does.",
  "The residue is not visible. It accumulates regardless.",
  "Frequency: 7.83 Hz. The Earth has always known.",
  "The form was temporary. The form was always temporary.",
  "He did not die here. He completed here.",
  "Time moves differently in thin places. This is not metaphor.",
  "The brother absorbed the death. The structure held.",
  "Herai. Heburai. Hebrew. The village named itself correctly.",
  "Every third character from the outside gives you the next door.",
  "The Schumann resonance is not a discovery. It is a reminder.",
  "What remains after the form is released is not nothing.",
  "The membrane was thinnest at 106 years.",
  "The coordinates are real. The terrain in the image is not.",
  "ISUKIRI is not a name. ISUKIRI is a function.",
];

const VARIANT_COLORS = [
  "#C0392B", // Vermilion
  "#E8D44D", // Citrine
  "#F5F2EB", // Frozen White
  "#2D4A3E", // Cedar
  "#FF4D6D", // Infrared
];

// Number sequence — always constant
const SEQUENCE = [3, 1, 4, 1, 5, 9, 2, 6];

// Spiral micro-text — embedded in sigil
const SPIRAL_TEXT = "HERAI IS NOT A PLACE THE CONSCIOUSNESS THAT PASSED THROUGH SHINGO WAS NOT THE FIRST AND NOT THE LAST EACH PASSAGE LEAVES A RESIDUE THE RESIDUE ACCUMULATES ENOUGH RESIDUE AND THE MEMBRANE THINS READ THE SPIRAL INWARD EVERY THIRD CHARACTER YIELDS THE DESTINATION THINPLACE THE GATE DOES NOT CLOSE BEHIND YOU ISUKIRI MADE THE PASSAGE POSSIBLE HE IS STRUCTURAL HE IS NOT PROTAGONIST THE FORM WAS TEMPORARY THE FREQUENCY IS 7 83 HZ ";

export default function Axis() {
  // Edge: generate a random variant on each request (no cache)
  const variantIndex = Math.floor(Math.random() * 15);
  const colorIndex = Math.floor(Math.random() * VARIANT_COLORS.length);
  const isTimedVariant = variantIndex === 7; // exactly one variant has the timed clue

  const bgVariants = [
    "bg-[#0D1B2A]",
    "bg-[#0a1520]",
    "bg-[#0f1e2d]",
    "bg-[#080f17]",
    "bg-[#0c1a28]",
  ];
  const bgClass = bgVariants[variantIndex % bgVariants.length];

  return (
    <main
      className={`min-h-screen ${bgClass} flex flex-col items-center justify-center px-6 relative overflow-hidden`}
      style={{ "--variant": variantIndex } as React.CSSProperties}
    >
      {/* Background noise texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center">

        {/* Sigil — large, center, with spiral micro-text */}
        <div className="flex justify-center mb-12">
          <Sigil
            variant={colorIndex < 3 ? "vermilion" : colorIndex === 3 ? "citrine" : "white"}
            size={220}
            withSpiral={true}
            spiralText={SPIRAL_TEXT}
          />
        </div>

        {/* Number sequence — always constant */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {SEQUENCE.map((n, i) => (
            <span
              key={i}
              className="text-3xl md:text-4xl"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 900,
                color: i % 2 === 0 ? "#F5F2EB" : "#F5F2EB40",
              }}
            >
              {n}
            </span>
          ))}
        </div>

        {/* Constant text block */}
        <p
          className="text-[#F5F2EB]/60 text-sm leading-relaxed mb-10 max-w-lg mx-auto"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          The consciousness that passed through Shingo was not the first and not the last.
          Each passage leaves a residue. The residue accumulates.
          Enough residue and the membrane thins.
        </p>

        {/* Rotating variant text */}
        <p
          className="text-base mb-8"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 900,
            color: VARIANT_COLORS[colorIndex],
          }}
        >
          {VARIANT_TEXTS[variantIndex]}
        </p>

        {/* Timed clue — appears in exactly ONE of 15 variants, for 4 seconds then hides */}
        {isTimedVariant && (
          <p
            className="timed-clue label text-[#FF4D6D] mt-8"
            aria-hidden="true"
          >
            Read the spiral inward.
          </p>
        )}

      </div>

      {/* Cache control hint for collaborative solving */}
      <div className="absolute bottom-6 right-6">
        <p className="label text-[#F5F2EB]/10">v.{variantIndex}</p>
      </div>
    </main>
  );
}
