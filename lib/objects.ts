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
    name: "Portal Lantern Tee",
    description:
      "A heavyweight tee for the long walk north. Front sigil in frozen white. Coordinates at the lower back hem like a quiet location mark. Midnight blue and intentionally severe.",
    material: "280gsm organic cotton · oversized cut · preshrunk",
    price: 54,
    variant: "white",
    printfulSyncProductId: "422792119",
  },
  {
    id: "herai-hoodie",
    name: "Herai Threshold Hoodie",
    description:
      "Heavyweight fleece built for cedar wind and late static. Sigil at the chest. HERAI on the back like a place-name passed forward instead of explained.",
    material: "400gsm cotton fleece · boxy · unlined hood",
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
