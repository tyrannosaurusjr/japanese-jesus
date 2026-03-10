import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FactPattern } from "@/components/FactPattern";
import { Sigil } from "@/components/Sigil";
import { StructuredData } from "@/components/StructuredData";
import { CONDUIT_NOTES } from "@/lib/site-content";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, buildPageMetadata, toAbsoluteUrl } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Shingo Village, Aomori: The Japanese Jesus Conduit",
  description:
    "Shingo Village in Aomori Prefecture, Japan: the home of the Japanese Jesus legend. Field notes, local readings, and the real place behind the myth.",
  path: "/conduit",
  keywords: [
    "Shingo Village Aomori",
    "Japanese Jesus conduit",
    "Jesus tomb Shingo",
    "Aomori legend",
  ],
  image: "/images/og/conduit.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "Open fields in Aomori with distant mountain ridges",
});

export default function ConduitPage() {
  const conduitStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Place",
        "@id": `${SITE_URL}/conduit#place`,
        name: "Shingo Village, Aomori, Japan",
        description:
          "A village in Aomori Prefecture known for the Christ legend and Japanese Jesus conduit readings.",
        url: "https://www.vill.shingo.aomori.jp/",
        geo: {
          "@type": "GeoCoordinates",
          latitude: 40.654194,
          longitude: 141.138889,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Shingo",
          addressRegion: "Aomori",
          addressCountry: "JP",
        },
      },
      {
        "@type": "TouristAttraction",
        "@id": `${SITE_URL}/conduit#attraction`,
        name: "Shingo Village (Christ's Grave)",
        description:
          "Field notes and local context around Shingo Village, the real-world location behind the Japanese Jesus legend.",
        url: `${SITE_URL}/conduit`,
        image: toAbsoluteUrl("/images/shingo-village-photo.jpg"),
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        containedInPlace: {
          "@id": `${SITE_URL}/conduit#place`,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 40.654194,
          longitude: 141.138889,
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#070B14]">
      <Nav />
      <StructuredData id="conduit-structured-data" data={conduitStructuredData} />

      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <p className="label text-[#D6B56E] mb-6">Conduit</p>
        <h1
          className="text-5xl md:text-7xl text-[#EFE4CF] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          Shingo is small.<br />The seam is not.
        </h1>
        <p className="label text-[#D6B56E]/85 mb-8">Shingo Village, Aomori Prefecture</p>
        <div className="w-16 h-px bg-[#C44A32]" />
      </section>

      <section className="px-6 md:px-10 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src="/images/shingo-village-photo.jpg"
              alt="Open fields in Aomori Prefecture with Mt. Iwaki beyond low farm structures"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#070B14] to-transparent" />
          </div>
          <p className="label text-[#EFE4CF]/30 mt-3">
            Shingo Village · Sannohe District · Aomori Prefecture
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr] gap-px bg-[#EFE4CF]/20">
          <div className="static-panel bg-[#070B14] border border-[#EFE4CF]/30 p-8">
            <p className="label text-[#D6B56E] mb-4">Why Visit</p>
            <h2
              className="text-3xl md:text-4xl text-[#EFE4CF] mb-5 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              The legend is the hook.<br />The landscape is the payoff.
            </h2>
            <p
              className="text-[#EFE4CF]/65 text-base leading-relaxed"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Even if you don&apos;t buy the legend for a second, Shingo offers something useful to
              an actual traveler: a strange local story, a recognizable place tied to that story,
              and a northern rural setting that feels very different from more polished tourist routes.
            </p>
          </div>
          <div className="bg-[#070B14] border border-[#EFE4CF]/30 p-8">
            <p className="label text-[#D6B56E] mb-4">Visitor Value</p>
            <div className="space-y-4">
              {[
                "A local legend unusual enough to make the trip feel narratively distinct.",
                "A real municipal location and tourism footprint, not a purely invented setting.",
                "A route through northern Aomori that already feels atmospheric before you arrive.",
              ].map((item) => (
                <p
                  key={item}
                  className="text-[#EFE4CF]/62 text-sm leading-relaxed"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {item}
                </p>
              ))}
            </div>
            <Link
              href="/journey"
              className="label inline-block mt-6 border border-[#C44A32]/40 text-[#C44A32] px-5 py-3 hover:bg-[#C44A32] hover:text-[#EFE4CF] transition-all duration-300"
            >
              Plan The Journey
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 mb-24">
        <div className="max-w-4xl mx-auto space-y-px">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#EFE4CF]/20">
            <div className="static-panel border border-[#C44A32]/30 p-8 bg-[#070B14]">
              <div className="flex items-center gap-4">
                <Sigil variant="vermilion" size={36} className="opacity-50 shrink-0" />
                <div>
                  <p className="label text-[#EFE4CF]/40 mb-1">Primary Node · The Shingo Conduit</p>
                  <p
                    className="text-2xl md:text-3xl text-[#C44A32] font-mono"
                    style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
                  >
                    40.65419° N, 141.13889° E
                  </p>
                </div>
              </div>
            </div>
            <div className="static-panel border border-[#EFE4CF]/30 p-8 bg-[#070B14]">
              <p className="label text-[#D6B56E] mb-3">Population &amp; Scale</p>
              <p
                className="text-[#EFE4CF] text-lg mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >
                Official public sources place Shingo at just under 2,000 residents.
              </p>
              <p
                className="text-[#EFE4CF]/62 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                In civic terms, that is a small rural population. In canon terms, it reads like a
                boundary condition: the node appears to hold below the threshold where anonymity
                fails. The conduit does not need a crowd. It needs a number dense enough to sustain
                the pattern and small enough to keep the pattern legible.
              </p>
            </div>
          </div>

          <div className="static-panel border border-[#EFE4CF]/30 p-3 md:p-4 bg-[#070B14]">
            <div className="relative aspect-[16/9] overflow-hidden border border-[#EFE4CF]/20">
              <iframe
                title="Google Maps pin for the Shingo conduit coordinates"
                src="https://maps.google.com/maps?q=40.654194,141.138889&z=14&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1">
              <p className="label text-[#EFE4CF]/35">Live map view · 40.65419° N, 141.13889° E</p>
              <a
                href="https://maps.app.goo.gl/o64urkHXE2Rhp7Lu9"
                target="_blank"
                rel="noopener noreferrer"
                className="label inline-block border border-[#C44A32]/50 text-[#C44A32] px-4 py-2 hover:bg-[#C44A32] hover:text-[#EFE4CF] transition-all duration-300"
              >
                Open In Google Maps ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-4xl mx-auto">
          <p className="label text-[#EFE4CF]/40 mb-6">Editorial Method</p>
          <FactPattern
            factLabel="Field Fact"
            factBody="Shingo is a real municipality in Aomori Prefecture. Baseline civic details such as population, access, and municipal facilities should come from public sources."
            readingBody="The public facts remain factual. Canon interpretation sits beside them as in-world reading, not as a disguised civic claim."
            sourceLabel="Primary Source"
            sourceHref="https://www.vill.shingo.aomori.jp/"
            sourceText="Shingo Village Municipal Site"
          />
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-4xl mx-auto">
          <p className="label text-[#EFE4CF]/40 mb-8">Field Notes</p>
          <div className="space-y-px">
            {CONDUIT_NOTES.map((note) => (
              <Link
                key={note.slug}
                href={`/conduit/${note.slug}`}
                className="grid grid-cols-1 md:grid-cols-[0.3fr_0.7fr] bg-[#070B14] border border-[#EFE4CF]/30 hover:border-[#C44A32]/60 transition-colors duration-300"
              >
                <div className="p-6 border-b md:border-b-0 md:border-r border-[#EFE4CF]/30">
                  <p className="label text-[#D6B56E] mb-2">{note.label}</p>
                  <h2
                    className="text-xl md:text-2xl text-[#EFE4CF] mb-3"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                  >
                    {note.title}
                  </h2>
                  <p className="label text-[#EFE4CF]/30">{note.coord}</p>
                </div>
                <div className="p-6">
                  <p
                    className="text-[#EFE4CF]/65 text-sm leading-relaxed mb-4"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                  >
                    {note.body}
                  </p>
                  <p
                    className="text-[#EFE4CF]/50 text-sm leading-relaxed"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                  >
                    {note.sections[0]?.body[0]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[3/2] overflow-hidden">
            <Image
              src="/images/gate-field-photo.jpg"
              alt="A rural field in Aomori beneath a spectral sky, the kind of landscape that hides the conduit in plain sight"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              loading="lazy"
            />
          </div>
          <p className="label text-[#EFE4CF]/30 mt-3">
            Peripheral terrain · Open field geometry · Shingo-mura
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-32 max-w-3xl mx-auto">
        <blockquote className="border-l-2 border-[#C44A32] pl-6">
          <p
            className="text-xl md:text-3xl text-[#EFE4CF] leading-relaxed"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
          >
            The village stays ordinary on purpose. The conduit does not need spectacle to stay
            active.
          </p>
        </blockquote>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-4xl mx-auto">
        <p className="label text-[#EFE4CF]/40 mb-6">References</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#EFE4CF]/20">
          <a
            href="https://www.vill.shingo.aomori.jp"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#070B14] border border-[#EFE4CF]/30 p-6 hover:border-[#C44A32]/60 transition-colors duration-300"
          >
            <p className="label text-[#D6B56E] mb-2">Official Source</p>
            <p className="text-[#EFE4CF]">Shingo Village Municipal Site</p>
          </a>
          <a
            href="https://aomori-tourism.com/en/spot/detail_62.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#070B14] border border-[#EFE4CF]/30 p-6 hover:border-[#C44A32]/60 transition-colors duration-300"
          >
            <p className="label text-[#D6B56E] mb-2">Tourism Source</p>
            <p className="text-[#EFE4CF]">Amazing AOMORI: Christ Park</p>
          </a>
          <Link
            href="/journey"
            className="bg-[#070B14] border border-[#EFE4CF]/30 p-6 hover:border-[#C44A32]/60 transition-colors duration-300"
          >
            <p className="label text-[#D6B56E] mb-2">Practical Route</p>
            <p className="text-[#EFE4CF]">Continue to Journey planning</p>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
