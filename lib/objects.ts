export type ObjectVariant = "vermilion" | "citrine" | "white";

export interface CatalogObject {
  id: string;
  name: string;
  description: string;
  material: string;
  price: number | null;
  variant: ObjectVariant;
  printfulCategory: string;
  printfulRecommendation: string;
  printfulStatus: "ready" | "manual" | "not-for-sale";
  shopUrl?: string;
}

const SHOP_URL_ENV_BY_OBJECT_ID: Partial<Record<CatalogObject["id"], string>> = {
  "carrier-cap": process.env.NEXT_PUBLIC_PRINTFUL_CARRIER_CAP_URL,
  "gate-tee": process.env.NEXT_PUBLIC_PRINTFUL_GATE_TEE_URL,
  "herai-hoodie": process.env.NEXT_PUBLIC_PRINTFUL_HERAI_HOODIE_URL,
  "thin-place-print": process.env.NEXT_PUBLIC_PRINTFUL_THIN_PLACE_PRINT_URL,
  "frequency-patch": process.env.NEXT_PUBLIC_PRINTFUL_FREQUENCY_PATCH_URL,
};

const BASE_OBJECTS: CatalogObject[] = [
  {
    id: "carrier-cap",
    name: "Rift Signal Cap",
    description:
      "A black field cap for cold roads and signal weather. Marked only with the conduit sigil in vermilion thread. Built to read like issued gear from a system that never officially existed.",
    material: "100% cotton twill · structured front · unstructured back",
    price: 48,
    variant: "vermilion",
    printfulCategory: "Hat",
    printfulRecommendation: "Start with an embroidered structured cap or snapback in black and use a single-color front embroidery file.",
    printfulStatus: "ready",
  },
  {
    id: "gate-tee",
    name: "Portal Lantern Tee",
    description:
      "A heavyweight tee for the long walk north. Front sigil in frozen white. Coordinates at the lower back hem like a quiet location mark. Midnight blue and intentionally severe.",
    material: "280gsm cotton · oversized cut · preshrunk",
    price: 54,
    variant: "white",
    printfulCategory: "T-Shirt",
    printfulRecommendation: "Use an oversized heavyweight tee and place the sigil on the chest with a small back detail for the coordinates.",
    printfulStatus: "ready",
  },
  {
    id: "herai-hoodie",
    name: "Herai Threshold Hoodie",
    description:
      "Heavyweight fleece built for cedar wind and late static. Sigil at the chest. HERAI on the back like a place-name passed forward instead of explained.",
    material: "400gsm cotton fleece · boxy · unlined hood",
    price: 118,
    variant: "citrine",
    printfulCategory: "Hoodie",
    printfulRecommendation: "Use a pullover hoodie with front and back print placements or combine chest embroidery with a back print.",
    printfulStatus: "ready",
  },
  {
    id: "thin-place-print",
    name: "Japanese Jesus Poster",
    description:
      "A flagship wall piece: Japanese Jesus seated at the seam, radiating static through the northern myth field. Direct, confrontational, and built to hold the room on its own.",
    material: "300gsm uncoated · offset print · Aomori cedar ink",
    price: 72,
    variant: "vermilion",
    printfulCategory: "Poster",
    printfulRecommendation: "Use a matte poster sized to the final production raster. This is the flagship hero-image poster and should lead the wall-art collection.",
    printfulStatus: "ready",
  },
  {
    id: "keeper-card",
    name: "Keeper Card",
    description:
      "Not for sale. Sent only to those who have crossed. A private marker in thick stock with a unique sigil variation and no public explanation.",
    material: "350gsm duplex board · letterpress · not available",
    price: null,
    variant: "citrine",
    printfulCategory: "Postcard / insert",
    printfulRecommendation: "Keep this off the storefront. If produced at all, treat it as a private fulfillment item rather than a public catalog product.",
    printfulStatus: "not-for-sale",
  },
  {
    id: "frequency-patch",
    name: "Static Conduit Patch",
    description:
      "A woven conduit mark with iron-on backing. Deep cedar field. Citrine edge. Built like a recovered unit patch from a system that does not admit it exists.",
    material: "Woven polyester · iron-on · 8×8cm",
    price: 18,
    variant: "citrine",
    printfulCategory: "Patch",
    printfulRecommendation: "Use Printful embroidered patches. The exact 8×8 cm size is not a direct stock match, so choose the closest supported shape and size.",
    printfulStatus: "manual",
  },
];

export const OBJECTS: CatalogObject[] = BASE_OBJECTS.map((object) => ({
  ...object,
  shopUrl: SHOP_URL_ENV_BY_OBJECT_ID[object.id],
}));
