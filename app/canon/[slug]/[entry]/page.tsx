import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StructuredData } from "@/components/StructuredData";
import { CANON_EPOCHS, CANON_SERIES_BY_EPOCH } from "@/lib/site-content";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL, buildPageMetadata, toAbsoluteUrl } from "@/lib/metadata";

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
  "herai-years": [
    {
      label: "Shingo Village Municipal Site",
      href: "https://www.vill.shingo.aomori.jp/",
      note: "Primary civic source for local geography and municipal framing during the Herai years.",
    },
    {
      label: "Christ Park - Amazing AOMORI",
      href: "https://aomori-tourism.com/en/spot/detail_62.html",
      note: "Official tourism source for the Shingo legend location and public interpretation.",
    },
    {
      label: "Shingo, Aomori (Wikipedia)",
      href: "https://en.wikipedia.org/wiki/Shing%C5%8D%2C_Aomori",
      note: "Secondary orientation source for timeline and place context.",
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; entry: string }>;
}): Promise<Metadata> {
  const { slug, entry } = await params;
  const epoch = CANON_EPOCHS.find((item) => item.slug === slug);
  const article = (CANON_SERIES_BY_EPOCH[slug] ?? []).find((item) => item.slug === entry);

  if (!epoch || !article) {
    return buildPageMetadata({
      title: "Canon Article — Japanese Jesus",
      description: "Long-form canon writing from the Japanese Jesus myth system.",
      path: "/canon",
      image: "/images/og/canon.jpg",
      imageWidth: 1200,
      imageHeight: 630,
      imageAlt: "A hilltop marker in Shingo under low evening light",
    });
  }

  return buildPageMetadata({
    title: `${article.title} — ${epoch.title} — Japanese Jesus`,
    description: article.dek,
    path: `/canon/${epoch.slug}/${article.slug}`,
    keywords: [
      "Japanese Jesus canon",
      "Shingo legend article",
      epoch.title,
      article.title,
      "Aomori mythology",
    ],
    image: "/images/og/canon.jpg",
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: epoch.imageAlt,
  });
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
  const articleUrl = `${SITE_URL}/canon/${epoch.slug}/${article.slug}`;
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    headline: article.title,
    description: article.dek,
    articleSection: epoch.title,
    mainEntityOfPage: articleUrl,
    image: toAbsoluteUrl(epoch.image),
    author: {
      "@type": "Organization",
      name: "Japanese Jesus Editorial Desk",
    },
    publisher: {
      "@type": "Organization",
      name: "Japanese Jesus",
      url: SITE_URL,
    },
    datePublished: "2026-03-09",
    dateModified: "2026-03-09",
  };
  const articleBreadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Canon",
        item: `${SITE_URL}/canon`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: epoch.title,
        item: `${SITE_URL}/canon/${epoch.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#070B14]">
      <Nav />
      <StructuredData id="canon-article-structured-data" data={articleStructuredData} />
      <StructuredData id="canon-article-breadcrumb-structured-data" data={articleBreadcrumbStructuredData} />

      <section className="pt-40 pb-16 px-6 md:px-10 max-w-5xl mx-auto">
        <Link
          href={`/canon/${epoch.slug}`}
          className="label text-[#EFE4CF]/40 hover:text-[#EFE4CF] transition-colors duration-300"
        >
          {epoch.title}
        </Link>
        <p className="label text-[#D6B56E] mt-6 mb-4">{epoch.step}</p>
        <h1
          className="text-5xl md:text-7xl text-[#EFE4CF] leading-none mb-6"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          {article.title}
        </h1>
        <p
          className="text-[#EFE4CF]/70 text-lg leading-relaxed max-w-3xl"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {article.dek}
        </p>
      </section>

      <section className="px-6 md:px-10 pb-16 max-w-5xl mx-auto">
        <div className="relative aspect-[16/9] overflow-hidden border border-[#EFE4CF]/30">
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
          className="space-y-6 text-[#EFE4CF]/78 text-base leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <p className="label text-[#D6B56E] mb-6">Outbound References</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#EFE4CF]/20">
          {references.map((reference) => (
            <a
              key={reference.href}
              href={reference.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#070B14] border border-[#EFE4CF]/30 p-6 hover:border-[#C44A32]/60 transition-colors duration-300"
            >
              <p className="label text-[#D6B56E] mb-2">{reference.label}</p>
              <p
                className="text-[#EFE4CF]/68 text-sm leading-relaxed mb-4"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {reference.note}
              </p>
              <p className="label text-[#EFE4CF]/40">Open Source</p>
            </a>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-5xl mx-auto">
        <p className="label text-[#D6B56E] mb-6">Series Navigation</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#EFE4CF]/20">
          {series.map((item) => (
            <Link
              key={item.slug}
              href={`/canon/${epoch.slug}/${item.slug}`}
              className={`bg-[#070B14] border p-6 transition-colors duration-300 ${
                item.slug === article.slug
                  ? "border-[#C44A32]/70"
                  : "border-[#EFE4CF]/30 hover:border-[#C44A32]/60"
              }`}
            >
              <p className="label text-[#EFE4CF]/35 mb-2">
                {item.slug === article.slug ? "Current Article" : "Series Article"}
              </p>
              <h2
                className="text-xl text-[#EFE4CF] mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >
                {item.title}
              </h2>
              <p
                className="text-[#EFE4CF]/62 text-sm leading-relaxed"
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
