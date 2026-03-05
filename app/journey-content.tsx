import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import type { Metadata } from "next";

export const journeyMetadata: Metadata = {
  title: "Journey — Japanese Jesus",
  description:
    "How to reach the Shingo conduit in Aomori. Flights, roads, lodging, and the final approach.",
};

export function JourneyContent() {
  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />

      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <p className="label text-[#E8D44D] mb-6">Journey</p>
        <h1
          className="text-5xl md:text-7xl text-[#F5F2EB] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          Get there.<br />Stay near the edge.<br />Let the approach do its work.
        </h1>
        <div className="w-16 h-px bg-[#C0392B]" />
      </section>

      <section className="px-6 md:px-10 pb-12 max-w-3xl mx-auto">
        <p
          className="text-[#F5F2EB]/70 text-base leading-relaxed mb-4"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          Shingo sits in the Sannohe District of Aomori Prefecture, far from the cities that prefer
          their myths polished and convenient. The route is practical, but the distance matters.
          Flights, trains, local roads, and lodging choices all change the feeling of the
          approach.
        </p>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2D4A3E]/20">
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
            <div key={title} className="static-panel bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6">
              <p className="label text-[#E8D44D] mb-3">{title}</p>
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

      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[16/9] overflow-hidden border border-[#2D4A3E]/30">
            <Image
              src="/images/get-there-station.jpg"
              alt="A small railway station building in northern Aomori beneath a bright sky"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/50 via-transparent to-transparent" />
          </div>
          <p className="label text-[#F5F2EB]/30 mt-3">
            Rail gets you close. Local roads finish the sentence.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-4xl mx-auto">
          <p className="label text-[#F5F2EB]/40 mb-6">Journey Sources</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2D4A3E]/20">
            <a
              href="https://www.aomori-airport.co.jp/en"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6 hover:border-[#C0392B]/60 transition-colors duration-300"
            >
              <p className="label text-[#E8D44D] mb-2">Airport</p>
              <p
                className="text-[#F5F2EB]/62 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Aomori Airport is the cleanest official source for flight-side access into the
                region.
              </p>
            </a>
            <a
              href="https://www.jreast.co.jp/en/multi/routemaps/tohokushinkansen.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6 hover:border-[#C0392B]/60 transition-colors duration-300"
            >
              <p className="label text-[#E8D44D] mb-2">Rail</p>
              <p
                className="text-[#F5F2EB]/62 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                JR East&apos;s Tohoku Shinkansen route map anchors the northbound rail logic in the
                factual layer.
              </p>
            </a>
            <a
              href="https://aomori-tourism.com/en/spot/detail_62.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-6 hover:border-[#C0392B]/60 transition-colors duration-300"
            >
              <p className="label text-[#E8D44D] mb-2">Destination</p>
              <p
                className="text-[#F5F2EB]/62 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                Amazing AOMORI gives the official tourism-facing entry point for the Christ Park
                area and broader visitor context.
              </p>
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-4xl mx-auto">
        <div className="space-y-px">
          <div className="bg-[#0D1B2A] border border-[#2D4A3E]/40 p-8">
            <h2
              className="text-xl md:text-2xl text-[#F5F2EB] mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              Reach Aomori
            </h2>
            <p
              className="text-[#F5F2EB]/65 text-sm leading-relaxed mb-4"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
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
                className="label border border-[#2D4A3E] text-[#F5F2EB]/60 px-4 py-2 hover:border-[#C0392B] hover:text-[#C0392B] transition-all duration-300"
              >
                Aomori Airport ↗
              </a>
              <a
                href="https://www.jreast.co.jp/en/multi/routemaps/tohokushinkansen.html"
                target="_blank"
                rel="noopener noreferrer"
                className="label border border-[#2D4A3E] text-[#F5F2EB]/60 px-4 py-2 hover:border-[#C0392B] hover:text-[#C0392B] transition-all duration-300"
              >
                Shinkansen Route ↗
              </a>
            </div>
          </div>

          <div className="bg-[#0D1B2A] border border-[#2D4A3E]/40 p-4 md:p-5">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src="/images/get-there-road.jpg"
                alt="A winding mountain road through a misty Japanese valley"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
            <p className="label text-[#F5F2EB]/30 mt-3">
              The final leg is by road, weather, and attention span.
            </p>
          </div>

          <div className="bg-[#0D1B2A] border border-[#2D4A3E]/40 p-8">
            <h2
              className="text-xl md:text-2xl text-[#F5F2EB] mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
            >
              Base In Hachinohe Or Towada
            </h2>
            <p
              className="text-[#F5F2EB]/65 text-sm leading-relaxed mb-4"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Hachinohe is the most practical base for transport and car rental. Towada works if
              you want a quieter overnight before or after the village. Shingo itself is small
              enough that most visitors should sleep outside the node and drive in, which also keeps
              the trip simpler from a booking perspective.
            </p>
            <p
              className="text-[#F5F2EB]/50 text-sm leading-relaxed"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Use the airport and rail resources above to lock the regional leg first, then choose
              lodging by how much road time you want before and after the visit.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <a
                href="https://www.booking.com/searchresults.html?ss=Hachinohe&dest_type=city&group_adults=2&no_rooms=1&group_children=0"
                target="_blank"
                rel="noopener noreferrer"
                className="label border border-[#2D4A3E] text-[#F5F2EB]/60 px-4 py-2 hover:border-[#C0392B] hover:text-[#C0392B] transition-all duration-300"
              >
                Hotels in Hachinohe ↗
              </a>
              <a
                href="https://www.booking.com/searchresults.html?ss=Towada%2C%20Aomori&group_adults=2&no_rooms=1&group_children=0"
                target="_blank"
                rel="noopener noreferrer"
                className="label border border-[#2D4A3E] text-[#F5F2EB]/60 px-4 py-2 hover:border-[#C0392B] hover:text-[#C0392B] transition-all duration-300"
              >
                Ryokan near Towada ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[16/9] overflow-hidden border border-[#2D4A3E]/30">
            <Image
              src="/images/get-there-coast.jpg"
              alt="A weathered signpost beside the cold blue sea at the northern edge of Aomori"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
          <p className="label text-[#F5F2EB]/30 mt-3">
            Northern Honshu feels different before the village ever comes into view.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
