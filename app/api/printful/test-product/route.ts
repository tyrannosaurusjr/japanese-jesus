import { NextResponse } from "next/server";
import { createStoreProduct } from "@/lib/printful";

const TEST_PRODUCT_EXTERNAL_ID = "japanese-jesus-test-thin-place-print";
const TEST_VARIANT_EXTERNAL_ID = "japanese-jesus-test-thin-place-print-variant";

// Public JPEG placeholder so Printful can fetch a supported file type during API-based product creation.
const DEFAULT_TEST_FILE_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Example.jpg/1200px-Example.jpg";

// Printful's docs use 10760 as a poster example variant ID for a first product walkthrough.
const DEFAULT_TEST_VARIANT_ID = 10760;

export async function POST() {
  try {
    const product = await createStoreProduct({
      sync_product: {
        external_id: TEST_PRODUCT_EXTERNAL_ID,
        name: "Japanese Jesus Test Poster",
        thumbnail: DEFAULT_TEST_FILE_URL,
      },
      sync_variants: [
        {
          external_id: TEST_VARIANT_EXTERNAL_ID,
          variant_id: DEFAULT_TEST_VARIANT_ID,
          retail_price: "21.00",
          files: [
            {
              url: DEFAULT_TEST_FILE_URL,
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      ok: true,
      created: product,
      note: "Test product created in Printful. This uses a single poster-style test variant.",
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
