import { NextRequest, NextResponse } from "next/server";
import { getSyncProduct } from "@/lib/printful";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;

  try {
    const data = await getSyncProduct(productId);
    const productName = data.sync_product.name;
    const thumbnailUrl = data.sync_product.thumbnail_url ?? null;

    // Extract an alt image from the first variant's files:
    // prefer a "back" placement file, fall back to any second file.
    const firstVariantFiles = data.sync_variants[0]?.files ?? [];
    const backFile = firstVariantFiles.find((f) => f.type === "back");
    const altFile = backFile ?? firstVariantFiles[1] ?? null;
    const altThumbnailUrl = altFile?.preview_url ?? altFile?.thumbnail_url ?? null;

    const variants = data.sync_variants.map((v) => {
      // Strip the product name prefix from variant name to get just the size/color label
      const label = v.name.startsWith(productName)
        ? v.name.slice(productName.length).replace(/^[\s–-]+/, "").trim()
        : v.name.trim();

      return {
        id: String(v.id),
        label: label || v.name,
        price: parseFloat(v.retail_price),
        currency: v.currency,
      };
    });

    return NextResponse.json(
      { variants, thumbnailUrl, altThumbnailUrl },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=3600" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
