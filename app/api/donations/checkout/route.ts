import { NextRequest, NextResponse } from "next/server";

type CheckoutRequest = {
  amount?: number;
  email?: string;
  name?: string;
  note?: string;
};

function clampAmount(amount?: number) {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return 108;
  }

  return Math.max(5, Math.min(5000, Math.round(amount)));
}

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Stripe is not configured on this site yet." },
        { status: 503 },
      );
    }

    const body = (await req.json()) as CheckoutRequest;
    const amount = clampAmount(body.amount);
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const note = typeof body.note === "string" ? body.note.trim() : "";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("success_url", `${siteUrl}/?donation=success`);
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

    if (email) {
      params.set("customer_email", email);
    }

    if (name) {
      params.set("metadata[supporter_name]", name);
    }

    if (note) {
      params.set("metadata[supporter_note]", note.slice(0, 500));
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
  } catch {
    return NextResponse.json(
      { error: "Stripe could not create a checkout session." },
      { status: 500 },
    );
  }
}
