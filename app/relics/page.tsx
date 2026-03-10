import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Sigil } from "@/components/Sigil";
import { ProductCheckout } from "@/components/ProductCheckout";
import { StructuredData } from "@/components/StructuredData";
import { OBJECTS } from "@/lib/objects";
import type { Metadata } from "next";
import Image from "next/image";
import { SITE_URL, buildPageMetadata, toAbsoluteUrl } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Japanese Jesus Relics: Prints & Field Gear from Shingo",
  description:
    "Japanese Jesus prints, posters, and field gear. Wall art and objects from the Shingo conduit, designed as evidence rather than decoration.",
  path: "/relics",
  keywords: [
    "Japanese Jesus prints",
    "Shingo poster",
    "Japanese Jesus relics",
    "Jesus tomb art",
  ],
  image: "/images/og/relics.jpg",
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: "Rift Sigil bucket hat set against dark fabric",
});

export default function RelicsPage() {
  const relicsStructuredData = {
    "@context": "https://schema.org",
    "@graph": OBJECTS.map((obj) => ({
      "@type": "Product",
      "@id": `${SITE_URL}/relics#${obj.id}`,
      name: obj.name,
      description: obj.description,
      sku: obj.id,
      brand: {
        "@type": "Brand",
        name: "Japanese Jesus",
      },
      image: obj.primaryImageUrl
        ? obj.primaryImageUrl
        : obj.imageSrc
          ? toAbsoluteUrl(obj.imageSrc)
          : toAbsoluteUrl("/images/rift-sigil-bucket-hat.jpg"),
      url: `${SITE_URL}/relics`,
      offers:
        obj.price !== null
          ? {
              "@type": "Offer",
              price: obj.price.toFixed(2),
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              url: `${SITE_URL}/relics`,
            }
          : undefined,
    })),
  };

  return (
    <main className="min-h-screen bg-[#070B14]">
      <Nav />
      <StructuredData id="relics-structured-data" data={relicsStructuredData} />

      <section className="pt-40 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <p className="label text-[#D6B56E] mb-6">Relics</p>
        <h1
          className="text-5xl md:text-7xl text-[#EFE4CF] leading-none mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
        >
          Relics &amp; Prints from the Japanese Jesus Conduit
        </h1>
        <div className="w-16 h-px bg-[#C44A32]" />
      </section>

      <section className="px-6 md:px-10 pb-8 max-w-3xl mx-auto">
        <p
          className="text-[#EFE4CF]/60 text-sm leading-relaxed"
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          These are not lifestyle products. They are public-facing relics from the conduit system:
          field wear, signal marks, and wall pieces that read like evidence rather than branding.
          Each object becomes available when the system behind it is ready.
        </p>
      </section>

      <section className="px-6 md:px-10 pb-32 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#EFE4CF]/20">
          {OBJECTS.map((obj) => (
            <article
              key={obj.id}
              className="bg-[#070B14] border border-[#EFE4CF]/30 p-8 flex flex-col"
            >
              <div className="mb-6 flex items-center justify-between">
                <Sigil variant={obj.variant} size={56} className="opacity-70" />
                {obj.notForSale ? (
                  <span className="label text-[#D6B56E]">Not For Sale</span>
                ) : null}
              </div>

              <h2
                className="text-xl md:text-2xl text-[#EFE4CF] mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}
              >
                {obj.name}
              </h2>

              <p
                className="text-[#EFE4CF]/65 text-sm leading-relaxed mb-4"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {obj.description}
              </p>

              <p className="label text-[#EFE4CF]/30 mb-6">{obj.material}</p>

              {obj.printfulSyncProductId ? (
                <ProductCheckout
                  printfulSyncProductId={obj.printfulSyncProductId}
                  productName={obj.name}
                  primaryImageUrl={obj.primaryImageUrl}
                  altImageUrl={obj.altImageUrl}
                />
              ) : obj.imageSrc ? (
                <div className="relative w-full aspect-square bg-[#070B14] border border-[#EFE4CF]/40 overflow-hidden">
                  <Image
                    src={obj.imageSrc}
                    alt={obj.imageAlt || obj.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-2"
                  />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 pb-24 max-w-3xl mx-auto">
        <p
          className="text-[#EFE4CF]/35 text-xs leading-relaxed"
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
