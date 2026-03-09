import { Nav } from "@/components/Nav";
import { FactPattern } from "@/components/FactPattern";
import { Footer } from "@/components/Footer";
import { StructuredData } from "@/components/StructuredData";
import { CONDUIT_NOTES } from "@/lib/site-content";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL, buildPageMetadata, toAbsoluteUrl } from "@/lib/metadata";

export async function generateStaticParams() {
  return CONDUIT_NOTES.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = CONDUIT_NOTES.find((item) => item.slug === slug);

  if (!note) {
    return buildPageMetadata({
      title: "Conduit Note — Japanese Jesus",
      description: "Field notes from the Shingo conduit.",
      path: "/conduit",
      image: "/images/og/conduit.jpg",
      imageWidth: 1200,
      imageHeight: 630,
      imageAlt: "Open fields in Aomori with distant mountain ridges",
    });
  }

  return buildPageMetadata({
    title: `${note.title}: Japanese Jesus Field Note from Shingo Village`,
    description: `${note.body} Read this Shingo, Aomori conduit field note in the Japanese Jesus archive.`,
    path: `/conduit/${note.slug}`,
    keywords: [
      "Japanese Jesus",
      "Shingo Village",
      "Aomori field note",
      "Japanese Jesus conduit",
      note.title,
      note.label,
    ],
    image: "/images/og/conduit.jpg",
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: note.imageAlt,
  });
}

export default async function ConduitSpokePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = CONDUIT_NOTES.find((item) => item.slug === slug);

  if (!note) {
    notFound();
  }
  const noteUrl = `${SITE_URL}/conduit/${note.slug}`;
  const conduitArticleStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${noteUrl}#article`,
        headline: `${note.title} - Shingo Conduit Field Note`,
        description: note.body,
        mainEntityOfPage: noteUrl,
        image: toAbsoluteUrl(note.image),
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
      },
      {
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
            name: "Conduit",
            item: `${SITE_URL}/conduit`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: note.title,
            item: noteUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />
      <StructuredData id="conduit-note-structured-data" data={conduitArticleStructuredData} />

      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <Link
          href="/conduit"
          className="label text-[#F5F2EB]/40 hover:text-[#F5F2EB] transition-colors duration-300"
        >
          Conduit
        </Link>
        <p className="label text-[#E8D44D] mt-6 mb-4">{note.label}</p>
        <h1
          className="text-5xl md:text-7xl text-[#F5F2EB] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          {note.title}
        </h1>
        <div className="w-16 h-px bg-[#C0392B]" />
      </section>

      <section className="px-6 md:px-10 pb-16 max-w-4xl mx-auto">
        <div className="relative aspect-[16/9] overflow-hidden border border-[#2D4A3E]/30">
          <Image
            src={note.image}
            alt={note.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <p className="label text-[#F5F2EB]/35 mb-4">{note.coord}</p>
        <p
          className="text-[#F5F2EB]/75 text-base leading-relaxed mb-6"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {note.body}
        </p>
        <div className="space-y-8">
          {note.sections.map((section) => (
            <section key={section.heading}>
              <p className="label text-[#E8D44D] mb-3">
                {section.mode === "fact"
                  ? "Field Fact"
                  : section.mode === "reading"
                    ? "Conduit Reading"
                    : "Site Context"}
              </p>
              <h2
                className="text-2xl text-[#F5F2EB] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[#F5F2EB]/72 text-base leading-relaxed mb-4 last:mb-0"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-4xl mx-auto">
        <FactPattern
          factLabel="Field Fact"
          factBody="This note should eventually combine real local data, place-specific references, and directly attributable context from public sources."
          readingBody="Interpretive language can stay strange, but it should read as canon or editorial theory, not as a literal municipal claim."
          sourceLabel="Reference Rule"
          sourceHref="https://www.vill.shingo.aomori.jp/"
          sourceText="Use official Shingo and Aomori sources first"
        />
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2D4A3E]/20">
          {[
            [
              "Site Conditions",
              "Topography, weather, distance from major hubs, and seasonal shifts are part of the note, not background decoration.",
            ],
            [
              "Canonical Read",
              "Each field note should interpret the landscape as conduit behavior: residue, pattern, pressure, and threshold logic.",
            ],
            [
              "Target Depth",
              "Each field note should eventually expand into an 800 to 1,600 word article with local references, images, and outbound links.",
            ],
          ].map(([title, body]) => (
            <div key={title} className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6">
              <p className="label text-[#E8D44D] mb-2">{title}</p>
              <p
                className="text-[#F5F2EB]/62 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-4xl mx-auto">
        <p className="label text-[#F5F2EB]/40 mb-6">Sources</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D4A3E]/20">
          {note.sources.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6 hover:border-[#C0392B]/60 transition-colors duration-300"
            >
              <p className="label text-[#E8D44D] mb-2">{source.label}</p>
              <p
                className="text-[#F5F2EB]/62 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {source.note}
              </p>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
