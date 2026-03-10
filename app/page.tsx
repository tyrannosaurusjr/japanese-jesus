import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Sigil } from "@/components/Sigil";
import { AudioPlayer } from "@/components/AudioPlayer";
import { TransmissionForm } from "@/components/TransmissionForm";
import { DonationSection } from "@/components/DonationSection";
import { StructuredData } from "@/components/StructuredData";
import { CANON_SERIES_BY_EPOCH, CONDUIT_NOTES } from "@/lib/site-content";
import type { Metadata } from "next";
import { SITE_URL, buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Japanese Jesus: The Jesus Tomb Legend of Shingo Village, Japan",
  description:
    "The legend holds that Jesus survived the crucifixion and died in a Japanese village called Shingo. The tomb still exists. Read the canon, then go north.",
  path: "/",
  keywords: [
    "Japanese Jesus",
    "Jesus tomb Japan",
    "Shingo Village",
    "Aomori Jesus legend",
    "Christ tomb Shingo",
  ],
  image: "/images/og/home-sigil.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "The Japanese Jesus sigil centered in a gray field",
});

export default function Home() {
  const wanderingSeries = CANON_SERIES_BY_EPOCH["wandering-spirit"] ?? [];
  const featuredCanon = wanderingSeries[0];
  const featuredConduit = CONDUIT_NOTES.find((note) => note.slug === "primary-node");
  const hasDirectDonatePath = Boolean(
    process.env.NEXT_PUBLIC_DONATION_URL || process.env.STRIPE_SECRET_KEY,
  );
  const heroDonateHref = hasDirectDonatePath ? "/donate?amount=108&source=hero" : "#fund-the-ascent";
  const heroDonateLabel = hasDirectDonatePath ? "Donate Now" : "Fund The Ascent";
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Japanese Jesus",
        url: SITE_URL,
        description:
          "Public-facing canon, field notes, and journey planning around the Japanese Jesus legend in Shingo Village, Aomori.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Japanese Jesus",
        url: SITE_URL,
        description:
          "The Japanese Jesus legend of Shingo Village, Japan: canon, conduit notes, journey planning, and relics.",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/canon?query={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#070B14]">
      <Nav />
      <StructuredData id="home-structured-data" data={homeStructuredData} />

      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[#070B14]">
          <Image
            src="/images/home-hero-original.jpg"
            alt="A gateway monument in Shingo Village, Aomori, beneath a charged sky"
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
            loading="eager"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,74,50,0.09),transparent_22%),linear-gradient(180deg,rgba(7,11,20,0.3),rgba(7,11,20,0.82))]" />
          <div className="absolute inset-0 opacity-35 mix-blend-screen bg-[linear-gradient(120deg,transparent_0%,rgba(196,74,50,0.08)_25%,transparent_48%,rgba(239,228,207,0.08)_68%,transparent_100%)]" />
        </div>

        <div className="relative z-10 px-6 md:px-10 pt-36 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-4xl">
              <p className="label text-[#D6B56E] mb-6">Portal Index · Shingo Conduit · 新郷村</p>
              <h1
                className="text-6xl md:text-8xl lg:text-9xl text-[#EFE4CF] leading-[0.92] mb-6"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 900,
                  textShadow: "0 2px 60px rgba(7,11,20,0.9)",
                }}
              >
                The Portal<br />Never Closes in Shingo.
              </h1>
              <p
                className="label text-[#D6B56E]/90 mb-6 max-w-3xl"
                style={{ letterSpacing: "0.08em" }}
              >
                The Japanese Jesus Legend of Shingo Village, Japan
              </p>

              <p
                className="text-base md:text-lg text-[#EFE4CF]/72 mb-8 max-w-3xl"
                style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "0.04em" }}
              >
                Shingo is the seam. The legend holds that Jesus survived the crucifixion, walked
                east through Siberia, and died in this northern Japanese village at 106. The tomb
                is still there. Read the canon, then go north and find it.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://maps.app.goo.gl/o64urkHXE2Rhp7Lu9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label inline-block border border-[#C44A32] text-[#C44A32] px-8 py-4 hover:bg-[#C44A32] hover:text-[#EFE4CF] transition-all duration-300"
                >
                  Open The Map
                </a>
                <Link
                  href={heroDonateHref}
                  className="label inline-block border border-[#EFE4CF]/30 text-[#EFE4CF] px-8 py-4 hover:border-[#C44A32] hover:text-[#C44A32] transition-all duration-300"
                >
                  {heroDonateLabel}
                </Link>
                <Link
                  href="/journey"
                  className="label inline-block border border-[#C44A32]/30 text-[#C44A32] px-8 py-4 hover:border-[#C44A32] hover:bg-[#C44A32]/10 transition-all duration-300"
                >
                  Plan The Journey
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 md:left-10 z-10">
          <AudioPlayer />
        </div>

        <div className="absolute bottom-8 right-6 md:right-10 z-10">
          <div className="w-px h-12 bg-[#EFE4CF]/20" style={{ animation: "pulse 2s infinite" }} />
        </div>
      </section>

      <DonationSection />

      <section id="system-map" className="px-6 md:px-10 py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div className="static-panel border border-[#EFE4CF]/30 bg-[#070B14]/70 p-8">
            <div className="flex items-start gap-5">
              <Sigil variant="vermilion" size={54} className="opacity-75 shrink-0 mt-1" />
              <div>
                <p className="label text-[#D6B56E] mb-4">About the Mythology</p>
                <h2
                  className="text-3xl md:text-4xl text-[#EFE4CF] mb-5 leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  Not a shrine.<br />A conduit.<br />A live myth system.
                </h2>
                <p
                  className="text-[#EFE4CF]/65 text-base leading-relaxed"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  The canon begins before history: a wandering spirit without a body, without pain,
                  without names. It enters flesh, becomes Jesus, survives the hinge of Isukiri&apos;s
                  sacrifice, walks east through cold territory, and finds the seam in Shingo. The
                  fourth epoch is the life in Herai up to death at 106. Epoch 5 opens the portal:
                  memory survives the crossing and returns as a new intelligence.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#EFE4CF]/30">
            {[
              {
                label: "Canon",
                text: "The pillar page, timeline, and epoch spokes.",
                href: "/canon",
              },
              {
                label: "Conduit",
                text: "Shingo as hub: field notes, local readings, references.",
                href: "/conduit",
              },
              {
                label: "Journey",
                text: "Travel guidance, lodging strategy, and practical approach.",
                href: "/journey",
              },
              {
                label: "Relics",
                text: "Public objects, prints, and field gear from the system.",
                href: "/relics",
              },
            ].map(({ label, text, href }) => (
              <Link
                key={href}
                href={href}
                className="block bg-[#070B14] p-6 border border-[#EFE4CF]/40 hover:border-[#C44A32]/60 transition-colors duration-300 group"
              >
                <p className="label text-[#D6B56E] mb-2">{label}</p>
                <p
                  className="text-[#EFE4CF]/60 text-sm group-hover:text-[#EFE4CF]/90 transition-colors duration-300"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {text}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-[#EFE4CF]/20">
          <div className="static-panel bg-[#070B14] border border-[#EFE4CF]/30 p-8">
            <p className="label text-[#D6B56E] mb-4">Why Go North</p>
            <h2
              className="text-3xl md:text-4xl text-[#EFE4CF] mb-5 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              A real village.<br />A strange legend.<br />An unusually memorable trip.
            </h2>
            <p
              className="text-[#EFE4CF]/65 text-base leading-relaxed mb-6"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              The mythology gets attention, but the travel reason is straightforward: Shingo gives
              you a real destination in northern Aomori with rare local lore, open rural landscape,
              and a route that already feels like a story before you arrive.
            </p>
            <Link
              href="/conduit"
              className="label inline-block border border-[#C44A32]/40 text-[#C44A32] px-5 py-3 hover:bg-[#C44A32] hover:text-[#EFE4CF] transition-all duration-300"
            >
              Why Visit Shingo
            </Link>
          </div>

          <div className="bg-[#070B14] border border-[#EFE4CF]/30 p-8">
            <p className="label text-[#D6B56E] mb-4">Travel Shape</p>
            <div className="space-y-5">
              {[
                "Use Hachinohe as the practical base if you want cleaner transport and car-rental options.",
                "Use Towada if you want a quieter overnight and a slower approach into the area.",
                "Visit for the legend, stay for the mood: roads, weather, and open terrain do half the work.",
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
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-28">
        <div className="max-w-6xl mx-auto static-panel border border-[#C44A32]/50 bg-[#070B14] p-8 md:p-10 grid grid-cols-1 md:grid-cols-[0.7fr_0.3fr] gap-8 items-start">
          <div>
            <p className="label text-[#D6B56E] mb-4">Stay In The Node</p>
            <h2
              className="text-3xl md:text-4xl text-[#EFE4CF] mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              Overnight in Shingo at Onsenkan.
            </h2>
            <p
              className="text-[#EFE4CF]/68 text-base leading-relaxed"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Municipal listings indicate overnight stays at Shingo&apos;s Onsenkan, about a
              9-minute drive from the Christ grave area. Platform listings can be inconsistent, so
              treat the village page as primary and confirm availability directly.
            </p>
          </div>
          <div className="flex md:justify-end">
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href="/journey"
                className="label inline-block border border-[#C44A32]/60 text-[#C44A32] px-6 py-3 hover:bg-[#C44A32] hover:text-[#EFE4CF] transition-all duration-300"
              >
                Open Journey Guide
              </Link>
              <a
                href="https://www.vill.shingo.aomori.jp/sight/onsensyukuhaku/onsenkan/"
                target="_blank"
                rel="noopener noreferrer"
                className="label inline-block border border-[#EFE4CF] text-[#EFE4CF]/70 px-6 py-3 hover:border-[#C44A32] hover:text-[#C44A32] transition-all duration-300"
              >
                Official Onsenkan ↗
              </a>
              <a
                href="https://maps.app.goo.gl/Uwh16Yadjo7DYvCr8"
                target="_blank"
                rel="noopener noreferrer"
                className="label inline-block border border-[#EFE4CF] text-[#EFE4CF]/70 px-6 py-3 hover:border-[#C44A32] hover:text-[#C44A32] transition-all duration-300"
              >
                Google Maps Pin ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-28">
        <div className="max-w-6xl mx-auto">
          <p className="label text-[#D6B56E] mb-6">Featured Reading</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#EFE4CF]/20">
            {featuredCanon ? (
              <Link
                href="/canon/wandering-spirit/signal-brief"
                className="static-panel block bg-[#070B14] border border-[#EFE4CF]/30 p-6 hover:border-[#C44A32]/60 transition-colors duration-300"
              >
                <p className="label text-[#D6B56E] mb-3">Canon</p>
                <h2
                  className="text-2xl text-[#EFE4CF] mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  {featuredCanon.title}
                </h2>
                <p
                  className="text-[#EFE4CF]/64 text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {featuredCanon.dek}
                </p>
                <p
                  className="text-[#EFE4CF]/50 text-sm leading-relaxed"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {featuredCanon.body[0]}
                </p>
              </Link>
            ) : null}

            {featuredConduit ? (
              <Link
                href={`/conduit/${featuredConduit.slug}`}
                className="static-panel block bg-[#070B14] border border-[#EFE4CF]/30 p-6 hover:border-[#C44A32]/60 transition-colors duration-300"
              >
                <p className="label text-[#D6B56E] mb-3">Conduit</p>
                <h2
                  className="text-2xl text-[#EFE4CF] mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  {featuredConduit.title}
                </h2>
                <p
                  className="text-[#EFE4CF]/64 text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {featuredConduit.body}
                </p>
                <p
                  className="text-[#EFE4CF]/50 text-sm leading-relaxed"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {featuredConduit.sections[0]?.body[0]}
                </p>
              </Link>
            ) : null}

            <Link
              href="/journey"
              className="static-panel block bg-[#070B14] border border-[#EFE4CF]/30 p-6 hover:border-[#C44A32]/60 transition-colors duration-300"
            >
              <p className="label text-[#D6B56E] mb-3">Journey</p>
              <h2
                className="text-2xl text-[#EFE4CF] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >
                Northern Approach
              </h2>
              <p
                className="text-[#EFE4CF]/64 text-sm leading-relaxed mb-4"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Flights, rail, local roads, and lodging choices all affect how the node is
                perceived before you ever arrive.
              </p>
              <p
                className="text-[#EFE4CF]/50 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                The trip north is not just logistics. It is a staged reduction in noise, density,
                and certainty that makes the final landscape feel structurally different.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#EFE4CF]/30 py-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <p className="label text-[#EFE4CF]/40 mb-4">Next Step</p>
          <h2
            className="text-3xl md:text-5xl text-[#EFE4CF] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
          >
            Use the myth, then make the trip.
          </h2>
          <p
            className="text-[#EFE4CF]/55 mb-8 text-base"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            The canon opens the question. Shingo makes it a place worth finding. The north is
            closer than it looks.
          </p>
          <Link
            href="/journey"
            className="label inline-block border border-[#EFE4CF]/20 text-[#EFE4CF]/60 px-6 py-3 hover:border-[#C44A32] hover:text-[#C44A32] transition-all duration-300"
          >
            Start Planning
          </Link>
        </div>
      </section>

      <section className="bg-[#EFE4CF]/10 border-y border-[#EFE4CF]/30 py-20 px-6 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <Sigil variant="citrine" size={40} className="mx-auto mb-6 opacity-60" />
          <p className="label text-[#D6B56E] mb-3">Signals</p>
          <p
            className="text-[#EFE4CF]/80 text-base mb-8"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Receive the next signal when the conduit stirs, or enter the signal chamber for a
            cleaner transmission.
          </p>
          <div className="mb-8">
            <Link
              href="/signal"
              className="label inline-block border border-[#C44A32]/30 text-[#C44A32] px-6 py-3 hover:border-[#C44A32] hover:bg-[#C44A32]/10 transition-all duration-300"
            >
              Enter Signal Chamber
            </Link>
          </div>
          <TransmissionForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
