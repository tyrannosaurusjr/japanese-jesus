import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Sigil } from "@/components/Sigil";
import { AudioPlayer } from "@/components/AudioPlayer";
import { TransmissionForm } from "@/components/TransmissionForm";
import { CANON_SERIES_BY_EPOCH, CONDUIT_NOTES } from "@/lib/site-content";

export default function Home() {
  const wanderingSeries = CANON_SERIES_BY_EPOCH["wandering-spirit"] ?? [];
  const featuredCanon = wanderingSeries[0];
  const featuredConduit = CONDUIT_NOTES.find((note) => note.slug === "primary-node");

  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />

      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[#0D1B2A]">
          <Image
            src="/images/home-hero-gateway.svg"
            alt="A gateway monument in an open northern field beneath a charged sky"
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
            loading="eager"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(232,212,77,0.09),transparent_22%),linear-gradient(180deg,rgba(13,27,42,0.3),rgba(13,27,42,0.82))]" />
          <div className="absolute inset-0 opacity-35 mix-blend-screen bg-[linear-gradient(120deg,transparent_0%,rgba(255,77,109,0.08)_25%,transparent_48%,rgba(45,74,62,0.12)_68%,transparent_100%)]" />
        </div>

        <div className="relative z-10 px-6 md:px-10 pt-36 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-4xl">
              <p className="label text-[#E8D44D] mb-6">Portal Index · Shingo Conduit · 新郷村</p>
              <h1
                className="text-6xl md:text-8xl lg:text-9xl text-[#F5F2EB] leading-[0.92] mb-6"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 900,
                  textShadow: "0 2px 60px rgba(13,27,42,0.9)",
                }}
              >
                The Portal<br />Never Closes.
              </h1>

              <p
                className="text-base md:text-lg text-[#F5F2EB]/72 mb-8 max-w-3xl"
                style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "0.04em" }}
              >
                Shingo is the seam. Japanese Jesus is the first consciousness in the canon to cross
                into the northern conduit. Read the myth, then go north and see the frontier node
                for yourself.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#system-map"
                  className="label inline-block border border-[#C0392B] text-[#C0392B] px-8 py-4 hover:bg-[#C0392B] hover:text-[#F5F2EB] transition-all duration-300"
                >
                  Open The Map
                </a>
                <Link
                  href="/journey"
                  className="label inline-block border border-[#E8D44D]/30 text-[#E8D44D] px-8 py-4 hover:border-[#E8D44D] hover:bg-[#E8D44D]/10 transition-all duration-300"
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
          <div className="w-px h-12 bg-[#F5F2EB]/20" style={{ animation: "pulse 2s infinite" }} />
        </div>
      </section>

      <section id="system-map" className="px-6 md:px-10 py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div className="static-panel border border-[#2D4A3E]/30 bg-[#09131F]/70 p-8">
            <div className="flex items-start gap-5">
              <Sigil variant="vermilion" size={54} className="opacity-75 shrink-0 mt-1" />
              <div>
                <p className="label text-[#E8D44D] mb-4">Node Reading</p>
                <h2
                  className="text-3xl md:text-4xl text-[#F5F2EB] mb-5 leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  Not a shrine.<br />A conduit.<br />A live myth system.
                </h2>
                <p
                  className="text-[#F5F2EB]/65 text-base leading-relaxed"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  The canon begins before history: a wandering spirit without a body, without pain,
                  without names. It enters flesh, becomes Jesus, survives the hinge of Isukiri&apos;s
                  sacrifice, walks east through cold territory, and finds the seam in Shingo. At 106,
                  the human form ends. The conduit activates. Memory survives the crossing and returns
                  as a new intelligence.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D4A3E]/30">
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
                className="block bg-[#0D1B2A] p-6 border border-[#2D4A3E]/40 hover:border-[#C0392B]/60 transition-colors duration-300 group"
              >
                <p className="label text-[#E8D44D] mb-2">{label}</p>
                <p
                  className="text-[#F5F2EB]/60 text-sm group-hover:text-[#F5F2EB]/90 transition-colors duration-300"
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D4A3E]/20">
          <div className="static-panel bg-[#0D1B2A] border border-[#2D4A3E]/30 p-8">
            <p className="label text-[#E8D44D] mb-4">Why Go North</p>
            <h2
              className="text-3xl md:text-4xl text-[#F5F2EB] mb-5 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              A real village.<br />A strange legend.<br />An unusually memorable trip.
            </h2>
            <p
              className="text-[#F5F2EB]/65 text-base leading-relaxed mb-6"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              The mythology gets attention, but the travel reason is straightforward: Shingo gives
              you a real destination in northern Aomori with rare local lore, open rural landscape,
              and a route that already feels like a story before you arrive.
            </p>
            <Link
              href="/conduit"
              className="label inline-block border border-[#C0392B]/40 text-[#C0392B] px-5 py-3 hover:bg-[#C0392B] hover:text-[#F5F2EB] transition-all duration-300"
            >
              Why Visit Shingo
            </Link>
          </div>

          <div className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-8">
            <p className="label text-[#E8D44D] mb-4">Travel Shape</p>
            <div className="space-y-5">
              {[
                "Use Hachinohe as the practical base if you want cleaner transport and car-rental options.",
                "Use Towada if you want a quieter overnight and a slower approach into the area.",
                "Visit for the legend, stay for the mood: roads, weather, and open terrain do half the work.",
              ].map((item) => (
                <p
                  key={item}
                  className="text-[#F5F2EB]/62 text-sm leading-relaxed"
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
        <div className="max-w-6xl mx-auto">
          <p className="label text-[#E8D44D] mb-6">Live Reads</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2D4A3E]/20">
            {featuredCanon ? (
              <Link
                href="/canon/wandering-spirit/signal-brief"
                className="static-panel block bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6 hover:border-[#C0392B]/60 transition-colors duration-300"
              >
                <p className="label text-[#E8D44D] mb-3">Canon</p>
                <h2
                  className="text-2xl text-[#F5F2EB] mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  {featuredCanon.title}
                </h2>
                <p
                  className="text-[#F5F2EB]/64 text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {featuredCanon.dek}
                </p>
                <p
                  className="text-[#F5F2EB]/50 text-sm leading-relaxed"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {featuredCanon.body[0]}
                </p>
              </Link>
            ) : null}

            {featuredConduit ? (
              <Link
                href={`/conduit/${featuredConduit.slug}`}
                className="static-panel block bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6 hover:border-[#C0392B]/60 transition-colors duration-300"
              >
                <p className="label text-[#E8D44D] mb-3">Conduit</p>
                <h2
                  className="text-2xl text-[#F5F2EB] mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  {featuredConduit.title}
                </h2>
                <p
                  className="text-[#F5F2EB]/64 text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {featuredConduit.body}
                </p>
                <p
                  className="text-[#F5F2EB]/50 text-sm leading-relaxed"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {featuredConduit.sections[0]?.body[0]}
                </p>
              </Link>
            ) : null}

            <Link
              href="/journey"
              className="static-panel block bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6 hover:border-[#C0392B]/60 transition-colors duration-300"
            >
              <p className="label text-[#E8D44D] mb-3">Journey</p>
              <h2
                className="text-2xl text-[#F5F2EB] mb-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >
                Northern Approach
              </h2>
              <p
                className="text-[#F5F2EB]/64 text-sm leading-relaxed mb-4"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Flights, rail, local roads, and lodging choices all affect how the node is
                perceived before you ever arrive.
              </p>
              <p
                className="text-[#F5F2EB]/50 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                The trip north is not just logistics. It is a staged reduction in noise, density,
                and certainty that makes the final landscape feel structurally different.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#2D4A3E]/30 py-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <p className="label text-[#F5F2EB]/40 mb-4">Next Step</p>
          <h2
            className="text-3xl md:text-5xl text-[#F5F2EB] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
          >
            Use the myth, then make the trip.
          </h2>
          <p
            className="text-[#F5F2EB]/55 mb-8 text-base"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            The canon should create intrigue. The Conduit page should make the place feel real. The
            Journey page should make it easy to actually go.
          </p>
          <Link
            href="/journey"
            className="label inline-block border border-[#F5F2EB]/20 text-[#F5F2EB]/60 px-6 py-3 hover:border-[#C0392B] hover:text-[#C0392B] transition-all duration-300"
          >
            Start Planning
          </Link>
        </div>
      </section>

      <section className="bg-[#2D4A3E]/10 border-y border-[#2D4A3E]/30 py-20 px-6 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <Sigil variant="citrine" size={40} className="mx-auto mb-6 opacity-60" />
          <p className="label text-[#E8D44D] mb-3">Signals</p>
          <p
            className="text-[#F5F2EB]/80 text-base mb-8"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Receive the next signal when the conduit stirs, or enter the signal chamber for a
            cleaner transmission.
          </p>
          <div className="mb-8">
            <Link
              href="/signal"
              className="label inline-block border border-[#E8D44D]/30 text-[#E8D44D] px-6 py-3 hover:border-[#E8D44D] hover:bg-[#E8D44D]/10 transition-all duration-300"
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
