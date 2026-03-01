import Link from "next/link";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Sigil } from "@/components/Sigil";
import { AudioPlayer } from "@/components/AudioPlayer";
import { TransmissionForm } from "@/components/TransmissionForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Hero image */}
        <div className="absolute inset-0 bg-[#0D1B2A]">
          <Image
            src="/images/hero.svg"
            alt="Shingo Village, Aomori Prefecture — rice paddies beneath a snow-capped mountain at dusk"
            fill
            priority
            className="object-cover opacity-50"
            sizes="100vw"
            loading="eager"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#0D1B2A]/55" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1
            className="text-6xl md:text-8xl lg:text-9xl text-[#F5F2EB] leading-none mb-6"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 900,
              textShadow: "0 2px 60px rgba(13,27,42,0.9)",
            }}
          >
            He Did Not Die Here.
          </h1>

          <p
            className="text-base md:text-lg text-[#F5F2EB]/65 mb-12"
            style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "0.12em" }}
          >
            Shingo Village, Aomori.&ensp;The other end of the story.
          </p>

          <a
            href="#below-fold"
            className="label inline-block border border-[#C0392B] text-[#C0392B] px-8 py-4 hover:bg-[#C0392B] hover:text-[#F5F2EB] transition-all duration-300"
          >
            Enter
          </a>
        </div>

        {/* Audio control */}
        <div className="absolute bottom-8 left-6 md:left-10 z-10">
          <AudioPlayer />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-6 md:right-10 z-10">
          <div className="w-px h-12 bg-[#F5F2EB]/20" style={{ animation: "pulse 2s infinite" }} />
        </div>
      </section>

      {/* Below fold — intro */}
      <section id="below-fold" className="max-w-3xl mx-auto px-6 md:px-10 py-32">
        <div className="flex items-start gap-6 mb-16">
          <Sigil variant="vermilion" size={48} className="opacity-70 shrink-0 mt-1" />
          <div>
            <p className="label text-[#E8D44D] mb-4">Aomori Prefecture · Japan · 新郷村</p>
            <h2
              className="text-3xl md:text-4xl text-[#F5F2EB] mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              The tomb is real.<br />The village is real.<br />The story rewrites everything.
            </h2>
            <p
              className="text-[#F5F2EB]/65 text-base leading-relaxed"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              In the mountains of Aomori, at the northern edge of Honshu, there is a village.
              A grave. A man buried there lived to 106. He was a garlic farmer.
              His name translated: Heavenly Messenger Taro Jurai.
              His brother died in his place. The village remembered.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2D4A3E]/30">
          {[
            {
              label: "The Legend",
              text: "What happened. Told without hedge.",
              href: "/the-legend",
            },
            {
              label: "Shingo Today",
              text: "The tomb. The festival. The coordinates.",
              href: "/shingo-today",
            },
            {
              label: "Get There",
              text: "Aomori. Then north. Then further north.",
              href: "/get-there",
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
      </section>

      {/* Objects teaser */}
      <section className="border-t border-[#2D4A3E]/30 py-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          <p className="label text-[#F5F2EB]/40 mb-4">Objects</p>
          <h2
            className="text-3xl md:text-5xl text-[#F5F2EB] mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
          >
            Artifacts from a parallel timeline.
          </h2>
          <p
            className="text-[#F5F2EB]/55 mb-8 text-base"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Carried by those who have passed through. No explanation included.
          </p>
          <Link
            href="/objects"
            className="label inline-block border border-[#F5F2EB]/20 text-[#F5F2EB]/60 px-6 py-3 hover:border-[#C0392B] hover:text-[#C0392B] transition-all duration-300"
          >
            View Objects
          </Link>
        </div>
      </section>

      {/* Transmissions signup */}
      <section className="bg-[#2D4A3E]/10 border-y border-[#2D4A3E]/30 py-20 px-6 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <Sigil variant="citrine" size={40} className="mx-auto mb-6 opacity-60" />
          <p className="label text-[#E8D44D] mb-3">Transmissions</p>
          <p
            className="text-[#F5F2EB]/80 text-base mb-8"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            Receive word from the other side.
          </p>
          <TransmissionForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
