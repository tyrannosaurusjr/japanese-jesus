import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Sigil } from "@/components/Sigil";
import { CANON_EPOCHS, CANON_SERIES_BY_EPOCH } from "@/lib/site-content";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canon — Japanese Jesus",
  description:
    "The canonical backbone: the wandering spirit, incarnation and burden, the long walk east, and the Shingo conduit.",
};

export default function CanonPage() {
  const liveCanon = CANON_EPOCHS.flatMap((epoch) =>
    (CANON_SERIES_BY_EPOCH[epoch.slug] ?? []).slice(0, 1).map((entry) => ({
      epoch,
      entry,
    })),
  );

  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />

      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <p className="label text-[#E8D44D] mb-6">Canon</p>
        <h1
          className="text-5xl md:text-7xl text-[#F5F2EB] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          Four epochs.<br />One crossing.<br />A myth that keeps moving north.
        </h1>
        <div className="w-16 h-px bg-[#C0392B]" />
      </section>

      <section className="px-6 md:px-10 pb-20 max-w-5xl mx-auto">
        <p className="label text-[#E8D44D] mb-6">Live Canon</p>
        <div className="space-y-px">
          {liveCanon.map(({ epoch, entry }) => (
            <Link
              key={`${epoch.slug}-${entry.slug}`}
              href={`/canon/${epoch.slug}/${entry.slug}`}
              className="grid grid-cols-1 md:grid-cols-[0.3fr_0.7fr] gap-0 bg-[#0D1B2A] border border-[#2D4A3E]/30 hover:border-[#C0392B]/60 transition-colors duration-300"
            >
              <div className="p-6 border-b md:border-b-0 md:border-r border-[#2D4A3E]/30">
                <p className="label text-[#E8D44D] mb-2">{epoch.step}</p>
                <h2
                  className="text-xl text-[#F5F2EB]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  {epoch.title}
                </h2>
              </div>
              <div className="p-6">
                <p className="label text-[#F5F2EB]/35 mb-2">Live Article</p>
                <h3
                  className="text-2xl text-[#F5F2EB] mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  {entry.title}
                </h3>
                <p
                  className="text-[#F5F2EB]/64 text-sm leading-relaxed"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {entry.dek}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#2D4A3E]/20">
          {CANON_EPOCHS.map((epoch, index) => (
            <Link
              key={epoch.slug}
              href={`/canon/${epoch.slug}`}
              className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6 hover:border-[#C0392B]/60 transition-colors duration-300"
            >
              <p className="label text-[#E8D44D] mb-3">{epoch.step}</p>
              <div className="mb-4 h-1 w-full bg-[#F5F2EB]/8">
                <div
                  className="h-full bg-[#C0392B]"
                  style={{ width: `${(index + 1) * 25}%` }}
                />
              </div>
              <h2
                className="text-lg text-[#F5F2EB] mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >
                {epoch.title}
              </h2>
              <p
                className="text-[#F5F2EB]/60 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {epoch.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <article className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <div
          className="space-y-12 text-[#F5F2EB]/80 text-base leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {CANON_EPOCHS.map((epoch, index) => (
            <div key={epoch.slug} className="space-y-12">
              <section>
                <p className="label text-[#E8D44D] mb-4">{epoch.step}</p>
                <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
                  <div>
                    <h2
                      className="text-2xl md:text-3xl text-[#F5F2EB] mb-6"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                    >
                      {epoch.title}
                    </h2>
                    {epoch.body.map((paragraph) => (
                      <p key={paragraph} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                    <Link
                      href={`/canon/${epoch.slug}`}
                      className="label inline-block mt-4 border border-[#C0392B]/40 px-4 py-2 text-[#C0392B] hover:bg-[#C0392B] hover:text-[#F5F2EB] transition-all duration-300"
                    >
                      Open Series
                    </Link>
                  </div>
                  <div className="relative aspect-[4/5] overflow-hidden border border-[#2D4A3E]/30">
                    <Image
                      src={epoch.image}
                      alt={epoch.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 30vw"
                    />
                  </div>
                </div>
              </section>

              {index < CANON_EPOCHS.length - 1 ? (
                <div className="flex items-center gap-4">
                  <Sigil variant="citrine" size={32} className="opacity-40 shrink-0" />
                  <div className="flex-1 h-px bg-[#2D4A3E]/60" />
                </div>
              ) : null}
            </div>
          ))}

          <blockquote className="border-l-2 border-[#C0392B] pl-6 my-12">
            <p
              className="text-xl md:text-2xl text-[#F5F2EB] italic leading-relaxed"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              &ldquo;The portal never closes. It only waits for perception to catch up.&rdquo;
            </p>
          </blockquote>
        </div>
      </article>

      <Footer />
    </main>
  );
}
