export type ObjectVariant = "vermilion" | "citrine" | "white";

export interface CatalogObject {
  id: string;
  name: string;
  description: string;
  material: string;
  price: number | null; // display price on card (starting from)
  variant: ObjectVariant;
  printfulSyncProductId?: string; // set = wired to Printful checkout
  notForSale?: boolean;
  primaryImageUrl?: string; // overrides Printful thumbnail as main image
  altImageUrl?: string; // optional back/alt product image shown on hover
  imageSrc?: string;
  imageAlt?: string;
}

export const OBJECTS: CatalogObject[] = [
  {
    id: "herai-hoodie",
    name: "Portal Lantern Sweatshirt",
    description:
      "Unisex organic cotton layer for night crossings, platform drafts, and the cold edge of signal weather. Clean chest mark in front, HERAI spread across the back as a location code instead of a slogan. Dense, structured, and made to wear like archive uniform gear rather than seasonal merch.",
    material: "Organic cotton · unisex fit · preshrunk",
    price: 118,
    variant: "citrine",
    printfulSyncProductId: "422747921",
    primaryImageUrl: "https://files.cdn.printful.com/files/ed3/ed34ca040484adea282b79d6b9babbda_preview.png",
  },
  {
    id: "gate-tee",
    name: "Pilgrimage T-shirt",
    description:
      "Unisex organic cotton build. Minimal front — Japanese Jesus in small white type above the left chest. The back carries the full record: Shingo Village in kanji and coordinates, the walk out of the desert and into the rice fields, the Tomb of Christ, EST. 33 AD. The portal is opening.",
    material: "Organic cotton · unisex fit · preshrunk",
    price: 54,
    variant: "white",
    printfulSyncProductId: "422792119",
    primaryImageUrl: "https://files.cdn.printful.com/files/cd3/cd3d6057b6cfde239ec20b3c2e7a6f94_preview.png",
  },
  {
    id: "thin-place-print",
    name: "Japanese Jesus Poster",
    description:
      "Enhanced matte wall print of the Japanese Jesus figure seated at the seam line, with field static radiating across a northern myth map of Japan. Composed for long viewing at full size, with deep contrast and deliberate negative space. Built to read like evidence on a wall, not decoration above a couch.",
    material: "Enhanced matte paper · print-on-demand",
    price: 35,
    variant: "vermilion",
    printfulSyncProductId: "422563554",
    primaryImageUrl: "https://files.cdn.printful.com/files/3c9/3c93379d68cf9246a8a39ec94f51bcd9_preview.png",
  },
  {
    id: "framed-poster",
    name: "Japanese Jesus Framed Poster",
    description:
      "The same flagship print enclosed in a black wood frame with hanging hardware pre-installed and sightlines set for immediate display. The image holds the same confrontational field energy, but the frame shifts it toward archive-object territory. Reads like a documented relic under glass, not poster merch.",
    material: "Enhanced matte paper · black wood frame · ready to hang",
    price: 89,
    variant: "vermilion",
    printfulSyncProductId: "422563382",
    primaryImageUrl: "https://files.cdn.printful.com/files/a50/a508298000d9f689c14f3ad737abdfed_preview.png",
  },
  {
    id: "frequency-patch-red",
    name: "Static Conduit Patch — Red",
    description:
      "Embroidered conduit mark in cosmic vermilion with hook backing for jackets, packs, and field cases that rotate often. Stitching is intentionally high contrast so the symbol reads clearly at distance and under low light. Made to resemble recovered unit insignia from a network that never files public records.",
    material: "Embroidered woven · velcro backing · approx 3″",
    price: 18,
    variant: "vermilion",
    printfulSyncProductId: "422788293",
    primaryImageUrl: "https://files.cdn.printful.com/files/db7/db7bc51b4766e01b6c3a2f70932c9f5b_preview.png",
  },
  {
    id: "frequency-patch-blue",
    name: "Static Conduit Patch — Blue",
    description:
      "Companion conduit patch in deep cedar blue with hook backing and dense embroidery tuned for clean edge definition. Uses the same core mark as the red channel, but with a cooler frequency profile for alternate kits and signal sets. Designed as functional insignia first, visual branding second.",
    material: "Embroidered woven · velcro backing · approx 3″",
    price: 18,
    variant: "citrine",
    printfulSyncProductId: "422781829",
    primaryImageUrl: "https://files.cdn.printful.com/files/632/632fc07e4424d8937c51cc0610749d71_preview.png",
  },
  {
    id: "carrier-cap",
    name: "Rift Sigil Bucket Hat",
    description:
      "Organic cotton bucket hat built for long station walks, wind off the cedar ridge, and sudden static rain. Front embroidery carries the Rift sigil in conduit green with no slogan, no back print, and no decorative noise. Packable field gear made to look issued, not branded.",
    material: "100% cotton · unstructured · one size",
    price: 48,
    variant: "vermilion",
    printfulSyncProductId: "422702408",
    primaryImageUrl: "https://files.cdn.printful.com/files/2e2/2e2afcf7b6d7af68ad936c72e11c647d_preview.png",
    imageSrc: "https://files.cdn.printful.com/files/2e2/2e2afcf7b6d7af68ad936c72e11c647d_preview.png", // fallback slot if card renderer uses legacy imageSrc
    imageAlt: "Rift Sigil Bucket Hat in black with conduit green embroidery",
  },
  {
    id: "keeper-card",
    name: "Keeper Card",
    description:
      "Not for sale. Issued privately to confirmed participants only, on thick stock with a unique sigil variant and no storefront metadata. No reorder link, no open listing, and no public batch schedule. This card functions as a closed-channel marker inside the project, not a retail product.",
    material: "350gsm duplex board · letterpress · not available",
    price: null,
    variant: "citrine",
    notForSale: true,
    imageSrc: "/images/keeper-card-placeholder.svg",
    imageAlt: "Keeper Card placeholder image marked as private issue",
  },
];
