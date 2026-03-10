import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StructuredData } from "@/components/StructuredData";
import Image from "next/image";
import type { Metadata } from "next";
import { SITE_URL, buildPageMetadata, toAbsoluteUrl } from "@/lib/metadata";

export const journeyMetadata: Metadata = buildPageMetadata({
  title: "How to Visit Shingo Village & the Jesus Tomb, Aomori Japan",
  description:
    "How to visit Shingo Village and the Jesus Tomb in Aomori, Japan. Flights, rail, local roads, and lodging options for the northern approach.",
  path: "/journey",
  keywords: [
    "visit Shingo Village",
    "Jesus tomb Aomori",
    "how to get to Shingo",
    "Aomori travel guide",
  ],
  image: "/images/og/journey.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "A small railway station in northern Aomori beneath a bright sky",
});

export function JourneyContent() {
  const onsenkanMapUrl = "https://www.google.com/maps/search/?api=1&query=Shingo+Onsenkan";
  const hachinoheHotelsUrl = "https://www.booking.com/searchresults.html?ss=Hachinohe%2C+Japan";
  const towadaHotelsUrl = "https://www.booking.com/searchresults.html?ss=Towada%2C+Aomori%2C+Japan";
  const journeyStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Visit Shingo Village and the Jesus Tomb in Aomori, Japan",
    description:
      "Travel steps for reaching Shingo Village from major transport hubs, selecting a base, and completing the final road approach.",
    url: `${SITE_URL}/journey`,
    image: toAbsoluteUrl("/images/get-there-road.jpg"),
    step: [
      {
        "@type": "HowToStep",
        name: "Reach Aomori Prefecture",
        text: "Fly into Aomori Airport or ride the Tohoku Shinkansen north to Shin-Aomori.",
      },
      {
        "@type": "HowToStep",
        name: "Choose your regional base",
        text: "Use Hachinohe for transport flexibility or Towada for a quieter overnight base.",
      },
      {
        "@type": "HowToStep",
        name: "Complete the final road leg to Shingo",
        text: "Drive local roads into Shingo Village and account for changing weather and seasonal conditions.",
      },
      {
        "@type": "HowToStep",
        name: "Stay near the site",
        text: "If available, confirm an overnight stay at Onsenkan in Shingo before departure.",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#070B14]">
      <Nav />
      <StructuredData id="journey-structured-data" data={journeyStructuredData} />

      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <p className="label text-[#D6B56E] mb-6">Journey</p>
        <h1
          className="text-5xl md:text-7xl text-[#EFE4CF] leading-none mb-8"
        >
          Visit Shingo Village and the Jesus Tomb.
        </h1>
        <p className="label text-[#D6B56E]/85 mb-8">
          How to Visit Shingo Village &amp; the Jesus Tomb in Aomori, Japan
        </p>
        <div className="w-16 h-px bg-[#C44A32]" />
      </section>

      <section className="px-6 md:px-10 pb-12 max-w-3xl mx-auto">
        <p
          className="text-[#EFE4CF]/70 text-base leading-relaxed mb-4"
        >
          Shingo sits in the Sannohe District of Aomori Prefecture, far from the cities that prefer
          their myths polished and convenient. The route is practical, but the distance matters.
          Flights, trains, local roads, and lodging choices all change the feeling of the
          approach.
        </p>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-5xl mx-auto static-panel border border-[#C44A32]/50 bg-[#070B14] p-8 md:p-10">
          <p className="label text-[#D6B56E] mb-4">Priority Stay</p>
          <h2
            className="text-3xl md:text-4xl text-[#EFE4CF] mb-4 leading-tight"
          >
            Stay inside Shingo Village: Onsenkan (温泉館)
          </h2>
          <p
            className="text-[#EFE4CF]/72 text-base leading-relaxed mb-4"
          >
            This is the strongest on-site stay option in the current journey stack: an onsen in
            Shingo listed with overnight pricing on the municipal page, roughly a 9-minute drive
            from the Christ grave area.
          </p>
          <p
            className="text-[#EFE4CF]/55 text-sm leading-relaxed mb-6"
          >
            Booking visibility appears inconsistent across platforms. Some map listings read as
            day-use only, so use the official village page as source of truth and confirm overnight
            availability directly before travel.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.vill.shingo.aomori.jp/sight/onsensyukuhaku/onsenkan/"
              target="_blank"
              rel="noopener noreferrer"
              className="label inline-block border border-[#C44A32]/60 text-[#C44A32] px-6 py-3 hover:bg-[#C44A32] hover:text-[#EFE4CF] transition-all duration-300"
            >
              Official Onsenkan Page ↗
            </a>
            <a
              href={onsenkanMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="label inline-block border border-[#EFE4CF] text-[#EFE4CF]/70 px-6 py-3 hover:border-[#C44A32] hover:text-[#C44A32] transition-all duration-300"
            >
              Onsenkan on Google Maps ↗
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-[#EFE4CF]/20">
          {[
            [
              "Day Trip",
              "Possible from a larger base, but compressed. Better for quick curiosity than for absorbing the atmosphere.",
            ],
            [
              "One Night",
              "The strongest baseline. Enough time to travel north, visit Shingo, and let the area feel distinct.",
            ],
            [
              "Two Nights",
              "Best if you want the trip to feel intentional rather than efficient, especially if you split time between Hachinohe and Towada.",
            ],
          ].map(([title, body]) => (
            <div key={title} className="static-panel bg-[#070B14] border border-[#EFE4CF]/30 p-6">
              <p className="label text-[#D6B56E] mb-3">{title}</p>
              <p
                className="text-[#EFE4CF]/62 text-sm leading-relaxed"
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[16/9] overflow-hidden border border-[#EFE4CF]/30">
            <Image
              src="/images/get-there-station.jpg"
              alt="A small railway station building in northern Aomori beneath a bright sky"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/50 via-transparent to-transparent" />
          </div>
          <p className="label text-[#EFE4CF]/30 mt-3">
            Rail gets you close. Local roads take you the rest of the way.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-4xl mx-auto">
          <p className="label text-[#EFE4CF]/40 mb-6">Journey Sources</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-[#EFE4CF]/20">
            <a
              href="https://www.aomori-airport.co.jp/en"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#070B14] border border-[#EFE4CF]/30 p-6 hover:border-[#C44A32]/60 transition-colors duration-300"
            >
              <p className="label text-[#D6B56E] mb-2">Airport</p>
              <p
                className="text-[#EFE4CF]/62 text-sm leading-relaxed"
              >
                Aomori Airport is the cleanest official source for flight-side access into the
                region.
              </p>
            </a>
            <a
              href="https://www.jreast.co.jp/en/multi/routemaps/tohokushinkansen.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#070B14] border border-[#EFE4CF]/30 p-6 hover:border-[#C44A32]/60 transition-colors duration-300"
            >
              <p className="label text-[#D6B56E] mb-2">Rail</p>
              <p
                className="text-[#EFE4CF]/62 text-sm leading-relaxed"
              >
                JR East&apos;s Tohoku Shinkansen route map anchors the northbound rail logic in the
                factual layer.
              </p>
            </a>
            <a
              href="https://aomori-tourism.com/en/spot/detail_62.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#070B14] border border-[#EFE4CF]/30 p-6 hover:border-[#C44A32]/60 transition-colors duration-300"
            >
              <p className="label text-[#D6B56E] mb-2">Destination</p>
              <p
                className="text-[#EFE4CF]/62 text-sm leading-relaxed"
              >
                Amazing AOMORI gives the official tourism-facing entry point for the Christ Park
                area and broader visitor context.
              </p>
            </a>
            <a
              href="https://www.vill.shingo.aomori.jp/sight/onsensyukuhaku/onsenkan/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#070B14] border border-[#EFE4CF]/30 p-6 hover:border-[#C44A32]/60 transition-colors duration-300"
            >
              <p className="label text-[#D6B56E] mb-2">Stay In Shingo</p>
              <p
                className="text-[#EFE4CF]/62 text-sm leading-relaxed"
              >
                Shingo municipal Onsenkan listing with overnight stay details and pricing.
              </p>
            </a>
            <a
              href={onsenkanMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#070B14] border border-[#EFE4CF]/30 p-6 hover:border-[#C44A32]/60 transition-colors duration-300"
            >
              <p className="label text-[#D6B56E] mb-2">Map Pin</p>
              <p
                className="text-[#EFE4CF]/62 text-sm leading-relaxed"
              >
                Direct Google Maps location for Onsenkan in Shingo.
              </p>
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-4xl mx-auto">
        <div className="space-y-px">
          <div className="bg-[#070B14] border border-[#EFE4CF]/40 p-8">
            <h2
              className="text-xl md:text-2xl text-[#EFE4CF] mb-3"
            >
              Reach Aomori for the Shingo Village route
            </h2>
            <p
              className="text-[#EFE4CF]/65 text-sm leading-relaxed mb-4"
            >
              Fly into Aomori Airport (AOJ) if you want the fastest regional entry, or take the
              Tohoku Shinkansen north if you want the overland version of the trip. Either way, the
              useful objective is the same: reach Aomori cleanly, then reposition for the last
              stretch toward Shingo.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.aomori-airport.co.jp/en"
                target="_blank"
                rel="noopener noreferrer"
                className="label border border-[#EFE4CF] text-[#EFE4CF]/60 px-4 py-2 hover:border-[#C44A32] hover:text-[#C44A32] transition-all duration-300"
              >
                Aomori Airport ↗
              </a>
              <a
                href="https://www.jreast.co.jp/en/multi/routemaps/tohokushinkansen.html"
                target="_blank"
                rel="noopener noreferrer"
                className="label border border-[#EFE4CF] text-[#EFE4CF]/60 px-4 py-2 hover:border-[#C44A32] hover:text-[#C44A32] transition-all duration-300"
              >
                Shinkansen Route ↗
              </a>
            </div>
          </div>

          <div className="bg-[#070B14] border border-[#EFE4CF]/40 p-4 md:p-5">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src="/images/get-there-road.jpg"
                alt="A winding mountain road through a misty Japanese valley"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
            <p className="label text-[#EFE4CF]/30 mt-3">
              The final leg is by road. Weather and season change how the approach feels.
            </p>
          </div>

          <div className="bg-[#070B14] border border-[#EFE4CF]/40 p-8">
            <h2
              className="text-xl md:text-2xl text-[#EFE4CF] mb-3"
            >
              Base In Hachinohe Or Towada
            </h2>
            <p
              className="text-[#EFE4CF]/65 text-sm leading-relaxed mb-4"
            >
              Hachinohe is the most practical base for transport and car rental. Towada works if
              you want a quieter overnight before or after the village. Shingo itself is small
              enough that most visitors should sleep outside the node and drive in, which also keeps
              the trip simpler from a booking perspective.
            </p>
            <p
              className="text-[#EFE4CF]/50 text-sm leading-relaxed"
            >
              Use the airport and rail resources above to plan your regional transport first, then
              choose lodging by how much road time you want before and after the visit.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <a
                href={hachinoheHotelsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label border border-[#EFE4CF] text-[#EFE4CF]/60 px-4 py-2 hover:border-[#C44A32] hover:text-[#C44A32] transition-all duration-300"
              >
                Hotels in Hachinohe ↗
              </a>
              <a
                href={towadaHotelsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label border border-[#EFE4CF] text-[#EFE4CF]/60 px-4 py-2 hover:border-[#C44A32] hover:text-[#C44A32] transition-all duration-300"
              >
                Ryokan near Towada ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[16/9] overflow-hidden border border-[#EFE4CF]/30">
            <Image
              src="/images/get-there-coast.jpg"
              alt="A weathered signpost beside the cold blue sea at the northern edge of Aomori"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
          <p className="label text-[#EFE4CF]/30 mt-3">
            Northern Honshu feels different before the village ever comes into view.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
