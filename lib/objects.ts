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
}

export const OBJECTS: CatalogObject[] = [
  {
    id: "carrier-cap",
    name: "Rift Sigil Bucket Hat",
    description:
      "A black bucket hat for cold roads and signal weather. Marked only with the conduit sigil in embroidered thread. Built to read like issued gear from a system that never officially existed.",
    material: "100% cotton · unstructured · one size",
    price: 48,
    variant: "vermilion",
    printfulSyncProductId: "422702408",
  },
  {
    id: "gate-tee",
    name: "Unisex Organic Cotton Pilgrimage T-shirt",
    description:
      "Organic cotton. Minimal front — Japanese Jesus in small white type above the left chest. The back carries the full record: Shingo Village in kanji and coordinates, the walk out of the desert and into the rice fields, the Tomb of Christ, EST. 33 AD. The portal is opening.",
    material: "Organic cotton · unisex fit · preshrunk",
    price: 54,
    variant: "white",
    printfulSyncProductId: "422792119",
    primaryImageUrl: "/images/pilgrimage-tee-front.jpg",
    altImageUrl: "/images/pilgrimage-tee-back.jpg",
  },
  {
    id: "herai-hoodie",
    name: "Unisex Cotton Portal Lantern Sweatshirt",
    description:
      "Heavyweight cotton built for cedar wind and late static. Sigil at the chest. HERAI on the back like a place-name passed forward instead of explained.",
    material: "100% cotton · unisex · preshrunk",
    price: 118,
    variant: "citrine",
    printfulSyncProductId: "422747921",
  },
  {
    id: "thin-place-print",
    name: "Japanese Jesus Poster",
    description:
      "A flagship wall piece: Japanese Jesus seated at the seam, radiating static through the northern myth field. Direct, confrontational, and built to hold the room on its own.",
    material: "Enhanced matte paper · print-on-demand",
    price: 35,
    variant: "vermilion",
    printfulSyncProductId: "422563554",
  },
  {
    id: "framed-poster",
    name: "Japanese Jesus Framed Poster",
    description:
      "The flagship wall piece in a black wooden frame. Ready to hang. Same confrontational image — now fully enclosed, like a relic behind glass at the edge of a myth the museum won't acknowledge.",
    material: "Enhanced matte paper · black wood frame · ready to hang",
    price: 89,
    variant: "vermilion",
    printfulSyncProductId: "422563382",
  },
  {
    id: "frequency-patch-red",
    name: "Static Conduit Patch — Red",
    description:
      "A woven conduit mark with velcro backing. Cosmic vermilion field. Built like a recovered unit patch from a system that does not admit it exists.",
    material: "Embroidered woven · velcro backing · approx 3″",
    price: 18,
    variant: "vermilion",
    printfulSyncProductId: "422788293",
  },
  {
    id: "frequency-patch-blue",
    name: "Static Conduit Patch — Blue",
    description:
      "A woven conduit mark with velcro backing. Deep cedar field. The same mark, shifted frequency. Same system, different channel.",
    material: "Embroidered woven · velcro backing · approx 3″",
    price: 18,
    variant: "citrine",
    printfulSyncProductId: "422781829",
  },
  {
    id: "keeper-card",
    name: "Keeper Card",
    description:
      "Not for sale. Sent only to those who have crossed. A private marker in thick stock with a unique sigil variation and no public explanation.",
    material: "350gsm duplex board · letterpress · not available",
    price: null,
    variant: "citrine",
    notForSale: true,
  },
];
