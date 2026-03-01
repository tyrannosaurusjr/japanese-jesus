import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Sigil } from "@/components/Sigil";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Legend — Japanese Jesus",
  description: "He did not die on the cross. His brother Isukiri died in his place. Jesus escaped to northern Japan.",
};

export default function TheLegend() {
  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />

      {/* Page header */}
      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <p className="label text-[#E8D44D] mb-6">The Legend</p>
        <h1
          className="text-5xl md:text-7xl text-[#F5F2EB] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          He came here.<br />He stayed.<br />The gate did not close behind him.
        </h1>
        <div className="w-16 h-px bg-[#C0392B]" />
      </section>

      {/* Long-form narrative */}
      <article className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <div
          className="prose-content space-y-12 text-[#F5F2EB]/80 text-base leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >

          {/* Section 1 — The Substitution */}
          <section>
            <h2
              className="text-2xl md:text-3xl text-[#F5F2EB] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              The Substitution
            </h2>
            <p className="mb-4">
              He did not die on the cross.
            </p>
            <p className="mb-4">
              His brother Isukiri died in his place. Isukiri ascended to the cross carrying a lock of his brother&apos;s hair.
              He absorbed the martyr narrative. He made the transformation possible.
              Isukiri is structural support, not protagonist.
            </p>
            <p className="mb-4">
              The brother who lived walked north. He walked for years.
              He crossed Siberia. He did not stop walking until he reached the sea,
              and then he crossed that too — arriving on the coast of Aomori Prefecture,
              the northernmost reach of Honshu, Japan.
            </p>
            <p>
              He carried with him one lock of his brother&apos;s hair. One ear of the Virgin Mary.
              Both are buried in Shingo. Both graves still stand.
            </p>
          </section>

          <div className="flex items-center gap-4">
            <Sigil variant="citrine" size={32} className="opacity-40 shrink-0" />
            <div className="flex-1 h-px bg-[#2D4A3E]/60" />
          </div>

          {/* Section 2 — The Farmer */}
          <section>
            <h2
              className="text-2xl md:text-3xl text-[#F5F2EB] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              The Farmer
            </h2>
            <p className="mb-4">
              He arrived in a village that would come to be called Herai.
              The name is a phonetic echo: <em>Heburai</em>. Hebrew.
            </p>
            <p className="mb-4">
              He took a name: Daitenku Taro Jurai. Heavenly Messenger Taro Jurai.
              He married a woman named Miyuko. He farmed garlic. He had three children.
              He integrated. He did not announce himself.
            </p>
            <p className="mb-4">
              He lived to 106. He is buried on a hill outside the village,
              beneath a cross-shaped mound. His grave faces east.
            </p>
            <p>
              The village remembered. They kept the memory in oral tradition
              across centuries, passing it house to house,
              until the records surfaced in the 1930s and the tomb was formalized.
            </p>
          </section>

          <div className="flex items-center gap-4">
            <Sigil variant="citrine" size={32} className="opacity-40 shrink-0" />
            <div className="flex-1 h-px bg-[#2D4A3E]/60" />
          </div>

          {/* Section 3 — The Metaphysics */}
          <section>
            <h2
              className="text-2xl md:text-3xl text-[#F5F2EB] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              The Passage
            </h2>
            <p className="mb-4">
              There is a second layer beneath the history.
            </p>
            <p className="mb-4">
              He moved from Pure Spirit into Human Form.
              The descent was complete at birth. The return began at the cross —
              not the moment of crucifixion, but the moment it was refused.
              Isukiri absorbed the death. The descent was halted. The return could begin.
            </p>
            <p className="mb-4">
              Shingo was where he completed the return journey.
              The mountain air. The silence. The distance from everything that had named him.
              One hundred and six years of walking back.
            </p>
            <p className="mb-4">
              The village is not just a place. It is a portal.
              A gateway to what exists when consciousness is no longer contained by a body.
              The exit point. The membrane between form and its absence.
            </p>
            <p>
              The gate did not close after he passed through.
            </p>
          </section>

          <div className="flex items-center gap-4">
            <Sigil variant="citrine" size={32} className="opacity-40 shrink-0" />
            <div className="flex-1 h-px bg-[#2D4A3E]/60" />
          </div>

          {/* Section 4 — Isukiri */}
          <section>
            <h2
              className="text-2xl md:text-3xl text-[#F5F2EB] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              Isukiri
            </h2>
            <p className="mb-4">
              Do not forget the brother.
            </p>
            <p className="mb-4">
              Isukiri is buried in Shingo too — a smaller mound, adjacent to the main tomb.
              His grave holds a lock of his brother&apos;s hair, carried across the world
              as the only physical record of the one who walked away.
            </p>
            <p className="mb-4">
              Isukiri made the transformation possible. He chose the cross knowingly.
              He gave the return its conditions. Without Isukiri, the portal does not open.
              Without Isukiri, the membrane does not thin.
            </p>
            <p>
              He is not the protagonist. He is the structure that the story hangs on.
            </p>
          </section>

          <div className="flex items-center gap-4">
            <Sigil variant="citrine" size={32} className="opacity-40 shrink-0" />
            <div className="flex-1 h-px bg-[#2D4A3E]/60" />
          </div>

          {/* Section 5 — Operating mythology */}
          <section>
            <h2
              className="text-2xl md:text-3xl text-[#F5F2EB] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              The Operating Mythology
            </h2>
            <p className="mb-4">
              This is what Shingo holds. Not belief. Not legend. Not folklore.
              Operating mythology — the story the place runs on, the framework through which
              everything in the village is understood.
            </p>
            <p className="mb-4">
              The Christ Festival happens every June. The villagers perform the Nanyadouyara dance,
              a ceremony whose words translate to nothing in Japanese,
              whose phonemes suggest ancient Hebrew,
              whose origin is not documented anywhere before the 1930s.
            </p>
            <p>
              The gate is still open. It has been open for almost two thousand years.
              Shingo is where the membrane is thinnest.
            </p>
          </section>

          {/* Pull quote */}
          <blockquote
            className="border-l-2 border-[#C0392B] pl-6 my-12"
          >
            <p
              className="text-xl md:text-2xl text-[#F5F2EB] italic leading-relaxed"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              &ldquo;He came here. He stayed.<br />The gate did not close behind him.&rdquo;
            </p>
          </blockquote>

        </div>
      </article>

      <Footer />
    </main>
  );
}
