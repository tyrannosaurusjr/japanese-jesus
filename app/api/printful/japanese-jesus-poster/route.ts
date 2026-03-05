import path from "node:path";
import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { createPrintfulFile, createStoreProduct } from "@/lib/printful";
import {
  getPosterUsdRetailPrice,
  getPosterVariantId,
  POSTER_ASSET_PATH,
  validatePosterAsset,
} from "@/lib/printful-poster";

const PRODUCT_EXTERNAL_ID = "japanese-jesus-poster";
const VARIANT_EXTERNAL_ID = "japanese-jesus-poster-variant";

export async function POST() {
  try {
    const imageBuffer = await readFile(POSTER_ASSET_PATH);
    const poster = validatePosterAsset(imageBuffer);
    const imageDataUri = `data:image/png;base64,${imageBuffer.toString("base64")}`;
    const variantId = getPosterVariantId();
    const retailPrice = getPosterUsdRetailPrice();

    const file = await createPrintfulFile({
      data: imageDataUri,
      filename: path.basename(POSTER_ASSET_PATH),
      visible: false,
    });

    const product = await createStoreProduct({
      sync_product: {
        external_id: PRODUCT_EXTERNAL_ID,
        name: "Japanese Jesus Poster",
        thumbnail: file.preview_url || file.thumbnail_url || undefined,
      },
      sync_variants: [
        {
          external_id: VARIANT_EXTERNAL_ID,
          variant_id: variantId,
          retail_price: retailPrice,
          files: [
            {
              id: file.id,
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      ok: true,
      poster,
      file,
      created: product,
      note: "Japanese Jesus Poster created in Printful from the local 50x70 cm poster asset.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Printful error.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
