import { NextRequest, NextResponse } from "next/server";
import { getSyncVariant } from "@/lib/printful";
import { sanitizeImpactClickId } from "@/lib/impact-click";

// Stripe zero-decimal currencies (amount is in the smallest unit = the main unit)
const ZERO_DECIMAL = new Set(["BIF","CLP","DJF","GNF","JPY","KMF","KRW","MGA","PYG","RWF","UGX","VND","VUV","XAF","XOF","XPF"]);

function toStripeAmount(price: number, currency: string): number {
  return ZERO_DECIMAL.has(currency.toUpperCase()) ? Math.round(price) : Math.round(price * 100);
}

type CheckoutRequest = {
  syncVariantId?: string;
  impactClickId?: string;
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
  let retailPrice: number;
  let currency: string;

  try {
    const variant = await getSyncVariant(body.syncVariantId);
    variantName = variant.name;
    retailPrice = parseFloat(variant.retail_price);
    currency = variant.currency;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Could not look up product variant: ${message}` },
      { status: 502 },
    );
  }

  if (isNaN(retailPrice) || retailPrice <= 0) {
    return NextResponse.json({ error: "Invalid product price." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  const params = new URLSearchParams();

  params.set("mode", "payment");
  params.set("success_url", `${siteUrl}/relics?order=success`);
  params.set("cancel_url", `${siteUrl}/relics`);

  const stripeCurrency = currency.toLowerCase();
  const stripeAmount = toStripeAmount(retailPrice, currency);
  // Shipping: ~$8 USD equivalent, scaled per currency
  const shippingAmount = ZERO_DECIMAL.has(currency.toUpperCase())
    ? toStripeAmount(800 / 100, currency) * 100  // rough parity
    : 800;
  // Simple fixed shipping amounts for known currencies
  const SHIPPING: Record<string, number> = { usd: 800, eur: 700, gbp: 600, jpy: 1200, aud: 1200, cad: 1100 };
  const shippingFinal = SHIPPING[stripeCurrency] ?? shippingAmount;

  // Line item
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", stripeCurrency);
  params.set("line_items[0][price_data][unit_amount]", String(stripeAmount));
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
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(shippingFinal));
  params.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", stripeCurrency);
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
  params.set("metadata[product_name]", variantName);

  const impactClickId = sanitizeImpactClickId(body.impactClickId);
  if (impactClickId) {
    params.set("metadata[impact_click_id]", impactClickId);
  }

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
