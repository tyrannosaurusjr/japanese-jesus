import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CANON_EPOCHS, CANON_SERIES_BY_EPOCH } from "@/lib/site-content";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return CANON_EPOCHS.map((epoch) => ({ slug: epoch.slug }));
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

  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />

      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <Link
          href="/canon"
          className="label text-[#F5F2EB]/40 hover:text-[#F5F2EB] transition-colors duration-300"
        >
          Canon
        </Link>
        <p className="label text-[#E8D44D] mt-6 mb-4">{epoch.step}</p>
        <h1
          className="text-5xl md:text-7xl text-[#F5F2EB] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          {epoch.title}
        </h1>
        <div className="w-16 h-px bg-[#C0392B]" />
      </section>

      <section className="px-6 md:px-10 pb-16 max-w-4xl mx-auto">
        <div className="relative aspect-[16/9] overflow-hidden border border-[#2D4A3E]/30">
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
          className="text-[#F5F2EB]/70 text-lg leading-relaxed mb-8"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {epoch.summary}
        </p>
        <div
          className="space-y-6 text-[#F5F2EB]/78 text-base leading-relaxed"
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
        <p className="label text-[#E8D44D] mb-6">Series Articles</p>
        {liveSeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D4A3E]/20">
            {liveSeries.map((liveArticle) => (
              <Link
                key={liveArticle.slug}
                href={`/canon/${epoch.slug}/${liveArticle.slug}`}
                className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6 hover:border-[#C0392B]/60 transition-colors duration-300"
              >
                <p className="label text-[#F5F2EB]/35 mb-2">Live Article</p>
                <h2
                  className="text-xl text-[#F5F2EB] mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  {liveArticle.title}
                </h2>
                <p
                  className="text-[#F5F2EB]/62 text-sm leading-relaxed"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {liveArticle.dek}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6">
            <p
              className="text-[#F5F2EB]/62 text-sm leading-relaxed"
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
