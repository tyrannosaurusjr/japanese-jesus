import { NextResponse } from "next/server";
import { getAuthorizedStores } from "@/lib/printful";

export async function GET() {
  try {
    const stores = await getAuthorizedStores();

    return NextResponse.json({
      ok: true,
      stores,
      storeId: stores[0]?.id ?? null,
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
