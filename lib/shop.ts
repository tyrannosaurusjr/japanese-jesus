// Printful sync variant IDs for the Japanese Jesus Portal Poster.
// These come from the Printful dashboard → Products → variant list.
// The product is Enhanced Matte Paper Poster (in), already created in the Printful store.

export const POSTER_VARIANTS = [
  {
    label: '12″×16″',
    printfulSyncVariantId: '69aa7d69761684',
    priceUsd: 35,
  },
  {
    label: '16″×20″',
    printfulSyncVariantId: '69aa7d69761716',
    priceUsd: 45,
  },
  {
    label: '18″×24″',
    printfulSyncVariantId: '69aa7d697617a7',
    priceUsd: 55,
  },
] as const;

export type PosterVariant = (typeof POSTER_VARIANTS)[number];
export type PosterSyncVariantId = PosterVariant['printfulSyncVariantId'];

export function getPosterVariant(syncVariantId: string): PosterVariant | undefined {
  return POSTER_VARIANTS.find((v) => v.printfulSyncVariantId === syncVariantId);
}
