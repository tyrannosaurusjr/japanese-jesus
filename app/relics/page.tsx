import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Sigil } from "@/components/Sigil";
import { ProductCheckout } from "@/components/ProductCheckout";
import { OBJECTS } from "@/lib/objects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relics — Japanese Jesus",
  description: "Relics, signals, field gear, and wall pieces from the northern conduit.",
};

export default function RelicsPage() {
  return (
    <main className="min-h-screen bg-[#0D1B2A]">
      <Nav />

      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <p className="label text-[#E8D44D] mb-6">Relics</p>
        <h1
          className="text-5xl md:text-7xl text-[#F5F2EB] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          Recovered proof.<br />Signal marks.<br />Artifacts from the seam.
        </h1>
        <div className="w-16 h-px bg-[#C0392B]" />
      </section>

      <section className="px-6 md:px-10 pb-8 max-w-3xl mx-auto">
        <p
          className="text-[#F5F2EB]/60 text-sm leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          These are not lifestyle products. They are public-facing relics from the conduit system:
          field wear, signal marks, and wall pieces that read like evidence rather than branding.
          Each object becomes available when the system behind it is ready.
        </p>
      </section>

      <section className="px-6 md:px-10 pb-32 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D4A3E]/20">
          {OBJECTS.map((obj) => (
            <article
              key={obj.id}
              className="bg-[#0D1B2A] border border-[#2D4A3E]/30 p-8 flex flex-col"
            >
              <div className="mb-6 flex items-center justify-between">
                <Sigil variant={obj.variant} size={56} className="opacity-70" />
                {obj.notForSale ? (
                  <span className="label text-[#FF4D6D]">Not For Sale</span>
                ) : null}
              </div>

              <h2
                className="text-xl md:text-2xl text-[#F5F2EB] mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >
                {obj.name}
              </h2>

              <p
                className="text-[#F5F2EB]/65 text-sm leading-relaxed mb-4"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {obj.description}
              </p>

              <p className="label text-[#F5F2EB]/30 mb-6">{obj.material}</p>

              {obj.printfulSyncProductId ? (
                <ProductCheckout
                  printfulSyncProductId={obj.printfulSyncProductId}
                  productName={obj.name}
                  altImageUrl={obj.altImageUrl}
                />
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <p
          className="text-[#F5F2EB]/35 text-xs leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          Keeper Card is not available for purchase. Delivery is determined by other means. Not
          every object in the system is meant for public circulation.
        </p>
      </section>

      <Footer />
    </main>
  );
}
