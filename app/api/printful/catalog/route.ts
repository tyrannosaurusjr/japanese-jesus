import { NextRequest, NextResponse } from "next/server";
import { createStoreProduct } from "@/lib/printful";
import { buildPrintfulCatalogPayload, getPrintfulCatalogReadiness } from "@/lib/printful-catalog";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const readiness = getPrintfulCatalogReadiness(id);

  if (!readiness.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: readiness.error,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    id: readiness.object.id,
    name: readiness.object.name,
    variantId: readiness.variantId,
    fileUrl: readiness.fileUrl,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { id?: string };
    const id = typeof body.id === "string" ? body.id : "";
    const payload = buildPrintfulCatalogPayload(id);
    const created = await createStoreProduct(payload);

    return NextResponse.json({
      ok: true,
      created,
      note: "Catalog product created in Printful from the configured variant ID and artwork URL.",
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
