import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CANON_EPOCHS, CANON_SERIES_BY_EPOCH } from "@/lib/site-content";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "The Five Epochs: Japanese Jesus Canon & Shingo Mythology",
  description:
    "Explore the five-epoch canon behind the Japanese Jesus legend: the wandering spirit, incarnation, the long walk east, and the Shingo conduit in Aomori, Japan.",
  path: "/canon",
  keywords: [
    "Japanese Jesus canon",
    "Shingo mythology",
    "Jesus in Japan legend",
    "Five epochs Japanese Jesus",
  ],
  image: "/images/og/canon.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "A hilltop marker in Shingo under low evening light",
});

export default function CanonPage() {
  return (
    <main className="min-h-screen bg-[#070B14]">
      <Nav />

      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <p className="label text-[#D6B56E] mb-6">Canon</p>
        <h1
          className="text-5xl md:text-7xl text-[#EFE4CF] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          Five Epochs<br />of Japanese Jesus.
        </h1>
        <p className="label text-[#D6B56E]/85 mb-8">The Japanese Jesus Canon</p>
        <div className="w-16 h-px bg-[#C44A32]" />
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-5xl mx-auto">
        <p className="label text-[#D6B56E] mb-6">Epoch Index</p>
        <div className="space-y-px">
          {CANON_EPOCHS.map((epoch) => {
            const featuredEntry = (CANON_SERIES_BY_EPOCH[epoch.slug] ?? [])[0];

            return (
              <article
                key={epoch.slug}
                className="grid grid-cols-1 md:grid-cols-[0.25fr_0.45fr_0.3fr] bg-[#070B14] border border-[#EFE4CF]/30"
              >
                <div className="p-6 border-b md:border-b-0 md:border-r border-[#EFE4CF]/30">
                  <p className="label text-[#D6B56E] mb-2">{epoch.step}</p>
                  <h2
                    className="text-xl text-[#EFE4CF] mb-3"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                  >
                    {epoch.title}
                  </h2>
                  <p
                    className="text-[#EFE4CF]/62 text-sm leading-relaxed"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                  >
                    {epoch.summary}
                  </p>
                </div>

                <div className="relative min-h-[220px] border-b md:border-b-0 md:border-r border-[#EFE4CF]/30">
                  <Image
                    src={epoch.image}
                    alt={epoch.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/30 to-transparent" />
                </div>

                <div className="p-6">
                  <p className="label text-[#EFE4CF]/35 mb-2">Read</p>
                  <Link
                    href={`/canon/${epoch.slug}`}
                    className="label inline-block mb-5 border border-[#C44A32]/40 px-4 py-2 text-[#C44A32] hover:bg-[#C44A32] hover:text-[#EFE4CF] transition-all duration-300"
                  >
                    Open Epoch
                  </Link>

                  {featuredEntry ? (
                    <div>
                      <p className="label text-[#EFE4CF]/35 mb-2">Featured Article</p>
                      <Link
                        href={`/canon/${epoch.slug}/${featuredEntry.slug}`}
                        className="block hover:text-[#EFE4CF] text-[#EFE4CF]/80 transition-colors duration-300"
                        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                      >
                        <p className="text-sm font-semibold mb-1">{featuredEntry.title}</p>
                        <p className="text-xs text-[#EFE4CF]/55 leading-relaxed">
                          {featuredEntry.dek}
                        </p>
                      </Link>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16 max-w-5xl mx-auto">
        <Link
          href="/canon/game"
          className="static-panel block border border-[#EFE4CF]/30 p-7 bg-[linear-gradient(130deg,rgba(239,228,207,0.07),rgba(196,74,50,0.07))] hover:border-[#C44A32]/60 transition-colors duration-300"
        >
          <p className="label text-[#D6B56E] mb-3">Interactive Canon</p>
          <h2
            className="text-2xl md:text-3xl text-[#EFE4CF] mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
          >
            Canon Blade Game
          </h2>
          <p
            className="text-[#EFE4CF]/68 text-sm md:text-base leading-relaxed"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Play through the first four canon epochs in a 16-bit side-scrolling myth-action run.
            Master blade, conduit shot, and phase dash while pushing through lush stages, enemy
            waves, and boss fights from wandering spirit to the Herai years. Epoch 5, where the
            portal opens, is the next chapter in canon.
          </p>
        </Link>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <blockquote className="border-l-2 border-[#C44A32] pl-6">
          <p
            className="text-xl md:text-2xl text-[#EFE4CF] italic leading-relaxed"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
          >
            &ldquo;The portal never closes. It only waits for perception to catch up.&rdquo;
          </p>
        </blockquote>
      </section>

      <Footer />
    </main>
  );
}
