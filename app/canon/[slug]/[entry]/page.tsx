import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CANON_EPOCHS, CANON_SERIES_BY_EPOCH } from "@/lib/site-content";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CanonReference {
  label: string;
  href: string;
  note: string;
}

const DEFAULT_CANON_REFERENCES: CanonReference[] = [
  {
    label: "Shingo Village Municipal Site",
    href: "https://www.vill.shingo.aomori.jp/",
    note: "Primary municipal reference for civic context and local baseline data.",
  },
  {
    label: "Christ Park - Amazing AOMORI",
    href: "https://aomori-tourism.com/en/spot/detail_62.html",
    note: "Official tourism framing for the Christ legend site in Shingo.",
  },
];

const CANON_REFERENCES_BY_EPOCH: Record<string, CanonReference[]> = {
  "wandering-spirit": [
    {
      label: "Shingo Village Municipal Site",
      href: "https://www.vill.shingo.aomori.jp/",
      note: "Primary municipal context used as factual grounding for the Shingo node.",
    },
    {
      label: "Christ Park - Amazing AOMORI",
      href: "https://aomori-tourism.com/en/spot/detail_62.html",
      note: "Official Aomori tourism context for Christ Park and the legend's public framing.",
    },
    {
      label: "Shingo, Aomori (Wikipedia)",
      href: "https://en.wikipedia.org/wiki/Shing%C5%8D%2C_Aomori",
      note: "Secondary orientation source for quick geographic and historical context.",
    },
  ],
  "incarnation-and-burden": [
    {
      label: "Shingo Village Municipal Site",
      href: "https://www.vill.shingo.aomori.jp/",
      note: "Primary municipal context for public factual grounding around place and civic framing.",
    },
    {
      label: "Christ Park - Amazing AOMORI",
      href: "https://aomori-tourism.com/en/spot/detail_62.html",
      note: "Official public-facing tourism context for the legend site and local interpretation.",
    },
    {
      label: "Shingo, Aomori (Wikipedia)",
      href: "https://en.wikipedia.org/wiki/Shing%C5%8D%2C_Aomori",
      note: "Secondary orientation source for accessible background context.",
    },
  ],
  "the-long-walk-east": [
    {
      label: "Aomori Airport Official Site",
      href: "https://www.aomori-airport.co.jp/en",
      note: "Official flight and access information for the northern arrival leg.",
    },
    {
      label: "JR East Tohoku Shinkansen Route Map",
      href: "https://www.jreast.co.jp/multi/en/routemaps/tohokushinkansen.html",
      note: "Official rail route structure for northbound journey context.",
    },
    {
      label: "Shingo Village Municipal Site",
      href: "https://www.vill.shingo.aomori.jp/",
      note: "Municipal context for destination-level factual grounding.",
    },
  ],
  "the-conduit-unseals": [
    {
      label: "Shingo Village Municipal Site",
      href: "https://www.vill.shingo.aomori.jp/",
      note: "Primary civic source for local geography and municipal framing.",
    },
    {
      label: "Christ Park - Amazing AOMORI",
      href: "https://aomori-tourism.com/en/spot/detail_62.html",
      note: "Official tourism source for the Shingo legend location and public interpretation.",
    },
    {
      label: "Aomori Airport Official Site",
      href: "https://www.aomori-airport.co.jp/en",
      note: "Official access reference for broader regional journey context.",
    },
  ],
};

export async function generateStaticParams() {
  return Object.entries(CANON_SERIES_BY_EPOCH).flatMap(([slug, entries]) =>
    (entries ?? []).map((entry) => ({ slug, entry: entry.slug })),
  );
}

export default async function CanonEntryPage({
  params,
}: {
  params: Promise<{ slug: string; entry: string }>;
}) {
  const { slug, entry } = await params;
  const epoch = CANON_EPOCHS.find((item) => item.slug === slug);
  const series = CANON_SERIES_BY_EPOCH[slug] ?? [];
  const article = series.find((item) => item.slug === entry);

  if (!epoch || !article) {
    notFound();
  }

  const references = CANON_REFERENCES_BY_EPOCH[epoch.slug] ?? DEFAULT_CANON_REFERENCES;

  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />

      <section className="pt-40 pb-16 px-6 md:px-10 max-w-5xl mx-auto">
        <Link
          href={`/canon/${epoch.slug}`}
          className="label text-[#F5F2EB]/40 hover:text-[#F5F2EB] transition-colors duration-300"
        >
          {epoch.title}
        </Link>
        <p className="label text-[#E8D44D] mt-6 mb-4">{epoch.step}</p>
        <h1
          className="text-5xl md:text-7xl text-[#F5F2EB] leading-none mb-6"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          {article.title}
        </h1>
        <p
          className="text-[#F5F2EB]/70 text-lg leading-relaxed max-w-3xl"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {article.dek}
        </p>
      </section>

      <section className="px-6 md:px-10 pb-16 max-w-5xl mx-auto">
        <div className="relative aspect-[16/9] overflow-hidden border border-[#2D4A3E]/30">
          <Image
            src={epoch.image}
            alt={epoch.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 90vw"
          />
        </div>
      </section>

      <article className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <div
          className="space-y-6 text-[#F5F2EB]/78 text-base leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <p className="label text-[#E8D44D] mb-6">Outbound References</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D4A3E]/20">
          {references.map((reference) => (
            <a
              key={reference.href}
              href={reference.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6 hover:border-[#C0392B]/60 transition-colors duration-300"
            >
              <p className="label text-[#E8D44D] mb-2">{reference.label}</p>
              <p
                className="text-[#F5F2EB]/68 text-sm leading-relaxed mb-4"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {reference.note}
              </p>
              <p className="label text-[#F5F2EB]/40">Open Source</p>
            </a>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-5xl mx-auto">
        <p className="label text-[#E8D44D] mb-6">Series Navigation</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D4A3E]/20">
          {series.map((item) => (
            <Link
              key={item.slug}
              href={`/canon/${epoch.slug}/${item.slug}`}
              className={`bg-[#0D1B2A] border p-6 transition-colors duration-300 ${
                item.slug === article.slug
                  ? "border-[#C0392B]/70"
                  : "border-[#2D4A3E]/30 hover:border-[#C0392B]/60"
              }`}
            >
              <p className="label text-[#F5F2EB]/35 mb-2">
                {item.slug === article.slug ? "Current Article" : "Series Article"}
              </p>
              <h2
                className="text-xl text-[#F5F2EB] mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >
                {item.title}
              </h2>
              <p
                className="text-[#F5F2EB]/62 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {item.dek}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
