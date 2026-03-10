import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StructuredData } from "@/components/StructuredData";
import { CANON_EPOCHS, CANON_SERIES_BY_EPOCH } from "@/lib/site-content";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL, buildPageMetadata, toAbsoluteUrl } from "@/lib/metadata";

export async function generateStaticParams() {
  return CANON_EPOCHS.map((epoch) => ({ slug: epoch.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const epoch = CANON_EPOCHS.find((item) => item.slug === slug);

  if (!epoch) {
    return buildPageMetadata({
      title: "Canon Epoch — Japanese Jesus",
      description: "A canon epoch page from the Japanese Jesus myth system.",
      path: "/canon",
      image: "/images/og/canon.jpg",
      imageWidth: 1200,
      imageHeight: 630,
      imageAlt: "A hilltop marker in Shingo under low evening light",
    });
  }

  return buildPageMetadata({
    title: `${epoch.title} — Canon — Japanese Jesus`,
    description: epoch.summary,
    path: `/canon/${epoch.slug}`,
    keywords: [
      "Japanese Jesus canon",
      "Shingo mythology",
      "Jesus in Japan legend",
      epoch.title,
    ],
    image: "/images/og/canon.jpg",
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: epoch.imageAlt,
  });
}

export default async function CanonSpokePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const epoch = CANON_EPOCHS.find((item) => item.slug === slug);

  if (!epoch) {
    notFound();
  }

  const liveSeries = CANON_SERIES_BY_EPOCH[epoch.slug] ?? [];
  const epochUrl = `${SITE_URL}/canon/${epoch.slug}`;
  const canonicalEpochStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${epochUrl}#collection`,
        name: `${epoch.title} - Japanese Jesus Canon`,
        description: epoch.summary,
        url: epochUrl,
        image: toAbsoluteUrl(epoch.image),
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
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
            name: "Canon",
            item: `${SITE_URL}/canon`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: epoch.title,
            item: epochUrl,
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#070B14]">
      <Nav />
      <StructuredData id="canon-epoch-structured-data" data={canonicalEpochStructuredData} />

      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <Link
          href="/canon"
          className="label text-[#EFE4CF]/40 hover:text-[#EFE4CF] transition-colors duration-300"
        >
          Canon
        </Link>
        <p className="label text-[#D6B56E] mt-6 mb-4">{epoch.step}</p>
        <h1
          className="text-5xl md:text-7xl text-[#EFE4CF] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          {epoch.title}
        </h1>
        <div className="w-16 h-px bg-[#C44A32]" />
      </section>

      <section className="px-6 md:px-10 pb-16 max-w-4xl mx-auto">
        <div className="relative aspect-[16/9] overflow-hidden border border-[#EFE4CF]/30">
          <Image
            src={epoch.image}
            alt={epoch.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <p
          className="text-[#EFE4CF]/70 text-lg leading-relaxed mb-8"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {epoch.summary}
        </p>
        <div
          className="space-y-6 text-[#EFE4CF]/78 text-base leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {epoch.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            This page is a spoke in the larger canon. The point is not to settle the mythology into
            doctrine. The point is to let the epoch breathe long enough to change the shape of the
            next one.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-4xl mx-auto">
        <p className="label text-[#D6B56E] mb-6">Series Articles</p>
        {liveSeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#EFE4CF]/20">
            {liveSeries.map((liveArticle) => (
              <Link
                key={liveArticle.slug}
                href={`/canon/${epoch.slug}/${liveArticle.slug}`}
                className="bg-[#070B14] border border-[#EFE4CF]/30 p-6 hover:border-[#C44A32]/60 transition-colors duration-300"
              >
                <p className="label text-[#EFE4CF]/35 mb-2">Live Article</p>
                <h2
                  className="text-xl text-[#EFE4CF] mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  {liveArticle.title}
                </h2>
                <p
                  className="text-[#EFE4CF]/62 text-sm leading-relaxed"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {liveArticle.dek}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#070B14] border border-[#EFE4CF]/30 p-6">
            <p
              className="text-[#EFE4CF]/62 text-sm leading-relaxed"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              No public long-form entries are live for this epoch yet.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
