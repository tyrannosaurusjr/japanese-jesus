import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get There — Japanese Jesus",
  description: "How to reach Shingo Village, Aomori. Flights. Train. Local transport.",
};

export default function GetThere() {
  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />

      {/* Header */}
      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <p className="label text-[#E8D44D] mb-6">Get There</p>
        <h1
          className="text-5xl md:text-7xl text-[#F5F2EB] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          Aomori.<br />Then north.<br />Then further north.
        </h1>
        <div className="w-16 h-px bg-[#C0392B]" />
      </section>

      {/* Route overview */}
      <section className="px-6 md:px-10 pb-12 max-w-3xl mx-auto">
        <p
          className="text-[#F5F2EB]/70 text-base leading-relaxed mb-4"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          Shingo Village sits in the Sannohe District of Aomori Prefecture, at the northern tip of
          Honshu. There is no bullet train direct. There is no airport nearby.
          Getting there requires intention. That is part of it.
        </p>
      </section>

      {/* Route steps */}
      <section className="px-6 md:px-10 pb-24 max-w-4xl mx-auto">
        <div className="space-y-px">

          {/* Step 1 */}
          <div className="bg-[#0D1B2A] border border-[#2D4A3E]/40 p-8">
            <div className="flex items-start gap-6">
              <span
                className="text-4xl text-[#C0392B]/30"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >01</span>
              <div className="flex-1">
                <h2
                  className="text-xl md:text-2xl text-[#F5F2EB] mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  Fly to Aomori
                </h2>
                <p
                  className="text-[#F5F2EB]/65 text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  Aomori Airport (AOJ) receives domestic flights from Tokyo (HND/NRT), Osaka (ITM),
                  and Nagoya (NGO). Flight time from Tokyo: approximately 75 minutes.
                  International travelers arrive via Tokyo and connect.
                </p>
                <p
                  className="text-[#F5F2EB]/65 text-sm leading-relaxed mb-6"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  Alternatively: Shinkansen from Tokyo to Shin-Aomori takes approximately 3 hours.
                  The Japan Rail Pass covers this entirely.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.booking.com/flights/index.html?aid=japanesejesus"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="label border border-[#2D4A3E] text-[#F5F2EB]/60 px-4 py-2 hover:border-[#C0392B] hover:text-[#C0392B] transition-all duration-300"
                  >
                    Search Flights ↗
                  </a>
                  <a
                    href="https://www.jrpass.com/?a_aid=japanesejesus"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="label border border-[#2D4A3E] text-[#F5F2EB]/60 px-4 py-2 hover:border-[#C0392B] hover:text-[#C0392B] transition-all duration-300"
                  >
                    JR Pass ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0D1B2A] border border-[#2D4A3E]/40 p-8">
            <div className="flex items-start gap-6">
              <span
                className="text-4xl text-[#C0392B]/30"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >02</span>
              <div className="flex-1">
                <h2
                  className="text-xl md:text-2xl text-[#F5F2EB] mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  Aomori City to Hachinohe
                </h2>
                <p
                  className="text-[#F5F2EB]/65 text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  Take the Shinkansen or local JR Tohoku Line from Shin-Aomori to Hachinohe.
                  Approximately 30–40 minutes by Shinkansen. Hachinohe is the last major hub
                  before you enter Sannohe District.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.booking.com/searchresults.html?city=-241697&aid=japanesejesus"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="label border border-[#2D4A3E] text-[#F5F2EB]/60 px-4 py-2 hover:border-[#C0392B] hover:text-[#C0392B] transition-all duration-300"
                  >
                    Hotels in Aomori ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0D1B2A] border border-[#2D4A3E]/40 p-8">
            <div className="flex items-start gap-6">
              <span
                className="text-4xl text-[#C0392B]/30"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >03</span>
              <div className="flex-1">
                <h2
                  className="text-xl md:text-2xl text-[#F5F2EB] mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  Into the Mountains
                </h2>
                <p
                  className="text-[#F5F2EB]/65 text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  From Hachinohe, rent a car. This is the only practical option.
                  Shingo Village has no train station, no bus service worth naming.
                  The drive from Hachinohe takes approximately 1 hour.
                  The roads are narrow in places. In winter, some close entirely.
                </p>
                <p
                  className="text-[#F5F2EB]/65 text-sm leading-relaxed mb-6"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  The tomb is on a hill on the edge of the village. It is signposted, reluctantly.
                  The museum sits adjacent. Opening hours: 9am–4pm. Closed in heavy snow.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.klook.com/en-US/activity/5413-aomori-activities/?aid=japanesejesus"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="label border border-[#2D4A3E] text-[#F5F2EB]/60 px-4 py-2 hover:border-[#C0392B] hover:text-[#C0392B] transition-all duration-300"
                  >
                    Klook Aomori Activities ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-[#0D1B2A] border border-[#2D4A3E]/40 p-8">
            <div className="flex items-start gap-6">
              <span
                className="text-4xl text-[#C0392B]/30"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >04</span>
              <div className="flex-1">
                <h2
                  className="text-xl md:text-2xl text-[#F5F2EB] mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
                >
                  Where to Sleep
                </h2>
                <p
                  className="text-[#F5F2EB]/65 text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  There is no accommodation in Shingo Village. The nearest options are in Hachinohe
                  or Towada. Base yourself in Hachinohe for a day trip.
                  If you are making a pilgrimage of it, Towada has ryokan options.
                  One night minimum recommended if arriving from Tokyo.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.booking.com/searchresults.html?city=-236370&aid=japanesejesus"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="label border border-[#2D4A3E] text-[#F5F2EB]/60 px-4 py-2 hover:border-[#C0392B] hover:text-[#C0392B] transition-all duration-300"
                  >
                    Hotels in Hachinohe ↗
                  </a>
                  <a
                    href="https://www.booking.com/searchresults.html?city=-241669&aid=japanesejesus"
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="label border border-[#2D4A3E] text-[#F5F2EB]/60 px-4 py-2 hover:border-[#C0392B] hover:text-[#C0392B] transition-all duration-300"
                  >
                    Ryokan in Towada ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Timing note */}
      <section className="px-6 md:px-10 pb-32 max-w-3xl mx-auto">
        <div className="border-l-2 border-[#E8D44D] pl-6">
          <p className="label text-[#E8D44D] mb-3">Best Time to Visit</p>
          <p
            className="text-[#F5F2EB]/70 text-sm leading-relaxed"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            June, for the Christ Festival. The ceremony happens at the tomb.
            There are no large crowds. You will not be jostling for space.
            Autumn — September and October — for the foliage against the mountain.
            Avoid January and February unless you are accustomed to deep snow and closed roads.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
