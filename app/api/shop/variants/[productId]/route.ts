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
      { variants, thumbnailUrl },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=3600" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
