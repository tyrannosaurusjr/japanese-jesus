import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Sigil } from "@/components/Sigil";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shingo Today — Japanese Jesus",
  description: "The tomb. The festival. The coordinates. 40.6542° N, 141.1389° E.",
};

const FIELD_NOTES = [
  {
    id: "tomb",
    label: "Field Note 01",
    title: "The Tomb Mounds",
    body: "Two mounds side by side. The larger belongs to the farmer. The smaller to the brother. Cross-shaped markers, wooden, replaced periodically by the village. They face east. The hill is quiet. There is no entrance fee. There are almost no visitors.",
    coord: "40.6542° N, 141.1389° E",
  },
  {
    id: "museum",
    label: "Field Note 02",
    title: "The Kirisuto no Sato Museum",
    body: "Adjacent to the tomb. Small. Mostly laminated documents. A scroll believed to document the genealogy. A display case. A photograph of the scroll. The scroll itself is kept elsewhere. The museum closes at 4pm. There is a parking lot large enough for a tour bus. No tour buses come.",
    coord: "Shingo-mura, Sannohe-gun",
  },
  {
    id: "festival",
    label: "Field Note 03",
    title: "The Christ Festival",
    body: "Every June. Villagers perform the Nanyadouyara ceremony at the tomb. The music is unlike anything in the Japanese repertoire. The words mean nothing in Japanese. The phonemes have been mapped, tentatively, to ancient Hebrew phrases. The ceremony predates the 1930s documentation. By how much — no record.",
    coord: "June · Annual",
  },
  {
    id: "village",
    label: "Field Note 04",
    title: "Herai · Shingo",
    body: "The original name: Herai. Population under 2,000. Rice paddies. Apple orchards. Garlic. Mountain roads that close in winter. Mt. Iwaki visible on clear days to the southwest, snow-capped eight months of the year. A single convenience store. Silence that feels deliberate.",
    coord: "Aomori Prefecture · 新郷村",
  },
];

export default function ShingoToday() {
  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />

      {/* Header */}
      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <p className="label text-[#E8D44D] mb-6">Shingo Today</p>
        <h1
          className="text-5xl md:text-7xl text-[#F5F2EB] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          The tomb is still there.<br />The village remembers.
        </h1>
        <div className="w-16 h-px bg-[#C0392B]" />
      </section>

      {/* Hero landscape image */}
      <section className="px-6 md:px-10 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src="/images/shingo-village.svg"
              alt="Rice paddies in Shingo Village, Aomori — late autumn, mountain in background"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0D1B2A] to-transparent" />
          </div>
          <p className="label text-[#F5F2EB]/30 mt-3">
            Shingo Village · Sannohe District · Aomori Prefecture
          </p>
        </div>
      </section>

      {/* Coordinates — ARG clue layer 2 */}
      <section className="px-6 md:px-10 mb-24">
        <div className="max-w-4xl mx-auto border border-[#C0392B]/30 p-8">
          <div className="flex items-center gap-4">
            <Sigil variant="vermilion" size={36} className="opacity-50 shrink-0" />
            <div>
              <p className="label text-[#F5F2EB]/40 mb-1">Christ Tomb · Verified Coordinates</p>
              <p
                className="text-2xl md:text-3xl text-[#C0392B] font-mono"
                style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
              >
                40.6542° N, 141.1389° E
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Field notes grid */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-4xl mx-auto">
          <p className="label text-[#F5F2EB]/40 mb-8">Field Notes</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D4A3E]/20">
            {FIELD_NOTES.map((note) => (
              <article
                key={note.id}
                className="bg-[#0D1B2A] p-8 border border-[#2D4A3E]/30"
              >
                <p className="label text-[#E8D44D] mb-3">{note.label}</p>
                <h2
                  className="text-xl md:text-2xl text-[#F5F2EB] mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  {note.title}
                </h2>
                <p
                  className="text-[#F5F2EB]/65 text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {note.body}
                </p>
                <p className="label text-[#F5F2EB]/30">{note.coord}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Second image */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[3/2] overflow-hidden">
            <Image
              src="/images/tomb.svg"
              alt="The Christ Tomb mound at Shingo Village — wooden cross marker, morning light"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              loading="lazy"
            />
          </div>
          <p className="label text-[#F5F2EB]/30 mt-3">
            Kirisuto no Haka · Christ&apos;s Grave · Shingo-mura
          </p>
        </div>
      </section>

      {/* Pull statement */}
      <section className="px-6 md:px-10 pb-32 max-w-3xl mx-auto">
        <blockquote className="border-l-2 border-[#C0392B] pl-6">
          <p
            className="text-xl md:text-3xl text-[#F5F2EB] leading-relaxed"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
          >
            The village is small. The silence is specific.
            You will know when you arrive that this is not a coincidence of geography.
          </p>
        </blockquote>
      </section>

      <Footer />
    </main>
  );
}
