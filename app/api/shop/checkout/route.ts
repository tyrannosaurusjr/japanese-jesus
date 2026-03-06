import { NextRequest, NextResponse } from "next/server";
import { getPosterVariant, POSTER_VARIANTS } from "@/lib/shop";

type CheckoutRequest = {
  variantId?: string;
};

const SHIPPING_COUNTRIES = ["US", "CA", "GB", "AU", "JP", "DE", "FR", "NL", "SE", "NO", "DK"];

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const body = (await req.json()) as CheckoutRequest;
  const variant = typeof body.variantId === "string" ? getPosterVariant(body.variantId) : undefined;

  if (!variant) {
    return NextResponse.json(
      {
        error: `Invalid variant. Valid options: ${POSTER_VARIANTS.map((v) => v.printfulSyncVariantId).join(", ")}`,
      },
      { status: 400 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  const params = new URLSearchParams();

  params.set("mode", "payment");
  params.set("success_url", `${siteUrl}/relics?order=success`);
  params.set("cancel_url", `${siteUrl}/relics`);

  // Line item
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(variant.priceUsd * 100));
  params.set(
    "line_items[0][price_data][product_data][name]",
    `Japanese Jesus Portal Poster — ${variant.label}`,
  );
  params.set(
    "line_items[0][price_data][product_data][description]",
    "Enhanced Matte Paper Poster. Print-on-demand, fulfilled by Printful. Ships in 3–5 business days.",
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
  params.set("metadata[printful_sync_variant_id]", variant.printfulSyncVariantId);
  params.set("metadata[size_label]", variant.label);

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
