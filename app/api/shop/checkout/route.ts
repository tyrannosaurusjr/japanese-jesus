import { NextRequest, NextResponse } from "next/server";
import { getSyncVariant } from "@/lib/printful";

type CheckoutRequest = {
  syncVariantId?: string;
};

const SHIPPING_COUNTRIES = ["US", "CA", "GB", "AU", "JP", "DE", "FR", "NL", "SE", "NO", "DK"];

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const body = (await req.json()) as CheckoutRequest;

  if (!body.syncVariantId || typeof body.syncVariantId !== "string") {
    return NextResponse.json({ error: "syncVariantId is required." }, { status: 400 });
  }

  let variantName: string;
  let priceUsd: number;
  let productName: string;

  try {
    const data = await getSyncVariant(body.syncVariantId);
    variantName = data.sync_variant.name;
    priceUsd = parseFloat(data.sync_variant.retail_price);
    productName = data.sync_product.name;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not look up product variant: ${message}` },
      { status: 502 },
    );
  }

  if (isNaN(priceUsd) || priceUsd <= 0) {
    return NextResponse.json({ error: "Invalid product price." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  const params = new URLSearchParams();

  params.set("mode", "payment");
  params.set("success_url", `${siteUrl}/relics?order=success`);
  params.set("cancel_url", `${siteUrl}/relics`);

  // Line item
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(Math.round(priceUsd * 100)));
  params.set("line_items[0][price_data][product_data][name]", variantName);
  params.set(
    "line_items[0][price_data][product_data][description]",
    "Print-on-demand, fulfilled by Printful. Ships in 3–5 business days.",
  );

  // Shipping address collection
  SHIPPING_COUNTRIES.forEach((country, i) => {
    params.set(`shipping_address_collection[allowed_countries][${i}]`, country);
  });

  // Flat shipping rate
  params.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
  params.set("shipping_options[0][shipping_rate_data][display_name]", "Standard Shipping");
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", "800");
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "usd");
  params.set(
    "shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]",
    "business_day",
  );
  params.set("shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]", "5");
  params.set(
    "shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]",
    "business_day",
  );
  params.set("shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]", "10");

  // Metadata for webhook → Printful order
  params.set("metadata[printful_sync_variant_id]", body.syncVariantId);
  params.set("metadata[product_name]", productName);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const payload = (await response.json()) as { error?: { message?: string }; url?: string };

  if (!response.ok || !payload.url) {
    return NextResponse.json(
      { error: payload.error?.message ?? "Stripe could not create a checkout session." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: payload.url });
}
