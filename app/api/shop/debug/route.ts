import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "PRINTFUL_API_TOKEN is not set" }, { status: 500 });
  }

  const productsRes = await fetch("https://api.printful.com/store/products?limit=100", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const productsBody = await productsRes.json();

  return NextResponse.json({ status: productsRes.status, products: productsBody });
}
