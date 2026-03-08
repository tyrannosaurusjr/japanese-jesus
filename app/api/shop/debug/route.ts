import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "PRINTFUL_API_TOKEN is not set" }, { status: 500 });
  }

  // Test 1: list stores
  const storesRes = await fetch("https://api.printful.com/stores", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const storesBody = await storesRes.json();

  // Test 2: fetch one known product
  const productRes = await fetch("https://api.printful.com/store/products/422702408", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const productBody = await productRes.json();

  return NextResponse.json({
    tokenLength: token.length,
    stores: { status: storesRes.status, body: storesBody },
    product: { status: productRes.status, body: productBody },
  });
}
