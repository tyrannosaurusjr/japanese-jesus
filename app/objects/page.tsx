import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Sigil } from "@/components/Sigil";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Objects — Japanese Jesus",
  description: "Artifacts from a parallel timeline. Carried by those who have passed through.",
};

const OBJECTS = [
  {
    id: "carrier-cap",
    name: "Sigil Carrier Cap",
    description: "Worn by those who have passed through. Structured, six-panel. Broken-circle sigil embroidered on the front panel in Cosmic Vermilion thread on black. No text. No URL. Black. One size.",
    material: "100% cotton twill · structured front · unstructured back",
    price: 48,
    variant: "vermilion" as const,
  },
  {
    id: "gate-tee",
    name: "The Gate Tee",
    description: "The gate remains open. Short sleeve. Heavy weight cotton. Sigil screened on chest in Frozen White. On the back hem, coordinates: 40.6542° N, 141.1389° E in 6pt type. Midnight blue.",
    material: "280gsm cotton · oversized cut · preshrunk",
    price: 54,
    variant: "white" as const,
  },
  {
    id: "herai-hoodie",
    name: "Herai Pullover",
    description: "Named for the original village. Heavyweight fleece. Sigil on chest in Neon Citrine. The word HERAI across the back, compressed, in Playfair Black, 4-inch type. Cedar green.",
    material: "400gsm cotton fleece · boxy · unlined hood",
    price: 118,
    variant: "citrine" as const,
  },
  {
    id: "thin-place-print",
    name: "Thin Place Print",
    description: "A cartographic document of the membrane between worlds. Offset printed on heavyweight uncoated stock. Signed with the sigil, not a name. No edition number. 50×70cm. Rolled.",
    material: "300gsm uncoated · offset print · Aomori cedar ink",
    price: 72,
    variant: "vermilion" as const,
  },
  {
    id: "keeper-card",
    name: "Keeper Card",
    description: "Not for sale. Sent only to those who have crossed. Postcard-sized. 350gsm stock. A unique variation of the broken-circle sigil. No URL. No return address. Just the glyph and the name.",
    material: "350gsm duplex board · letterpress · not available",
    price: null,
    variant: "citrine" as const,
  },
  {
    id: "frequency-patch",
    name: "7.83 Hz Patch",
    description: "The Schumann resonance. Earth's electromagnetic base frequency. Woven patch, iron-on backing. 8×8cm. Sigil on field of deep cedar. Citrine border. One number. No explanation.",
    material: "Woven polyester · iron-on · 8×8cm",
    price: 18,
    variant: "citrine" as const,
  },
];

export default function Objects() {
  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />

      {/* Header */}
      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <p className="label text-[#E8D44D] mb-6">Objects</p>
        <h1
          className="text-5xl md:text-7xl text-[#F5F2EB] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          Artifacts from<br />a parallel timeline.
        </h1>
        <div className="w-16 h-px bg-[#C0392B]" />
      </section>

      <section className="px-6 md:px-10 pb-8 max-w-3xl mx-auto">
        <p
          className="text-[#F5F2EB]/60 text-sm leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          No e-commerce copy. No lifestyle photography. These objects carry weight
          because of what they are connected to, not what they look like.
          Fulfilled via Printful. Processed via Stripe.
        </p>
      </section>

      {/* Objects grid */}
      <section className="px-6 md:px-10 pb-32 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D4A3E]/20">
          {OBJECTS.map((obj) => (
            <article
              key={obj.id}
              className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-8 flex flex-col"
            >
              {/* Sigil display */}
              <div className="mb-6 flex items-center justify-between">
                <Sigil variant={obj.variant} size={56} className="opacity-70" />
                {obj.price ? (
                  <span
                    className="text-xl text-[#F5F2EB]/50"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                  >
                    ¥{(obj.price * 145).toLocaleString()} / ${obj.price}
                  </span>
                ) : (
                  <span className="label text-[#FF4D6D]">Not For Sale</span>
                )}
              </div>

              {/* Name */}
              <h2
                className="text-xl md:text-2xl text-[#F5F2EB] mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >
                {obj.name}
              </h2>

              {/* Description */}
              <p
                className="text-[#F5F2EB]/65 text-sm leading-relaxed mb-4 flex-1"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {obj.description}
              </p>

              {/* Material */}
              <p className="label text-[#F5F2EB]/30 mb-6">{obj.material}</p>

              {/* CTA */}
              {obj.price && (
                <button
                  className="label border border-[#C0392B]/60 text-[#C0392B] py-3 px-4 hover:bg-[#C0392B] hover:text-[#F5F2EB] transition-all duration-300 text-left"
                  aria-label={`Order ${obj.name}`}
                >
                  Carry This Object →
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Footnote */}
      <section className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <p
          className="text-[#F5F2EB]/35 text-xs leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          Carrier Card is not available for purchase. Delivery is determined by other means.
          If you know, you know.
        </p>
      </section>

      <Footer />
    </main>
  );
}
