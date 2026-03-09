import { NextRequest, NextResponse } from "next/server";

function clampAmount(rawAmount: string | null) {
  const parsed = Number.parseInt(rawAmount ?? "", 10);
  if (Number.isNaN(parsed)) {
    return 108;
  }

  return Math.max(5, Math.min(5000, parsed));
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const fallbackUrl = new URL("/#fund-the-ascent", req.url);
  const externalDonationUrl = process.env.NEXT_PUBLIC_DONATION_URL;
  if (externalDonationUrl) {
    return NextResponse.redirect(externalDonationUrl);
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.redirect(fallbackUrl);
  }

  const amount = clampAmount(req.nextUrl.searchParams.get("amount"));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  const source = req.nextUrl.searchParams.get("source") ?? "site";

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", `${siteUrl}/?donation=success#fund-the-ascent`);
  params.set("cancel_url", `${siteUrl}/#fund-the-ascent`);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(amount * 100));
  params.set(
    "line_items[0][price_data][product_data][name]",
    "Japanese Jesus Field Expedition",
  );
  params.set(
    "line_items[0][price_data][product_data][description]",
    "Support travel, field recording, photography, and document collection in Shingo.",
  );
  params.set("metadata[source]", source);

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
    return NextResponse.redirect(fallbackUrl);
  }

  return NextResponse.redirect(payload.url);
}
