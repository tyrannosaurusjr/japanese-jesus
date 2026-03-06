import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { createPrintfulOrder, type PrintfulOrderRecipient } from "@/lib/printful";
import { getPosterVariant } from "@/lib/shop";

interface StripeAddress {
  city: string | null;
  country: string | null;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
}

interface StripeCheckoutSession {
  id: string;
  payment_status: string;
  metadata: Record<string, string>;
  shipping_details: {
    name: string | null;
    address: StripeAddress;
  } | null;
  customer_details: {
    name: string | null;
    email: string | null;
  } | null;
}

interface StripeEvent {
  type: string;
  data: { object: StripeCheckoutSession };
}

function verifyStripeSignature(payload: string, sig: string, secret: string): boolean {
  const parts = sig.split(",");
  const tPart = parts.find((p) => p.startsWith("t="));
  const v1Part = parts.find((p) => p.startsWith("v1="));

  if (!tPart || !v1Part) return false;

  const timestamp = tPart.slice(2);
  const expectedSig = v1Part.slice(3);
  const signedPayload = `${timestamp}.${payload}`;
  const hmac = crypto.createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(hmac, "hex"), Buffer.from(expectedSig, "hex"));
  } catch {
    return false;
  }
}

function buildRecipient(session: StripeCheckoutSession): PrintfulOrderRecipient | null {
  const shipping = session.shipping_details;
  const customer = session.customer_details;

  if (!shipping?.address?.line1 || !shipping.address.city || !shipping.address.country) {
    return null;
  }

  return {
    name: shipping.name ?? customer?.name ?? "Customer",
    email: customer?.email ?? undefined,
    address1: shipping.address.line1,
    address2: shipping.address.line2 ?? undefined,
    city: shipping.address.city,
    state_code: shipping.address.state ?? undefined,
    country_code: shipping.address.country,
    zip: shipping.address.postal_code ?? "",
  };
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured." }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature") ?? "";
  const body = await req.text();

  if (!verifyStripeSignature(body, sig, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(body) as StripeEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const session = event.data.object;

  if (session.payment_status !== "paid") {
    return NextResponse.json({ ok: true, skipped: true, reason: "payment_status not paid" });
  }

  const syncVariantId = session.metadata?.printful_sync_variant_id;
  const variant = syncVariantId ? getPosterVariant(syncVariantId) : undefined;

  if (!variant) {
    // Not a shop order (e.g. a donation) — ignore
    return NextResponse.json({ ok: true, skipped: true, reason: "no printful variant in metadata" });
  }

  const recipient = buildRecipient(session);

  if (!recipient) {
    console.error("[shop/webhook] Missing shipping details for session", session.id);
    return NextResponse.json({ error: "Missing shipping address." }, { status: 422 });
  }

  try {
    const order = await createPrintfulOrder({
      recipient,
      items: [{ sync_variant_id: syncVariantId, quantity: 1 }],
      confirm: true,
    });

    console.log("[shop/webhook] Printful order created", order.id, "for session", session.id);
    return NextResponse.json({ ok: true, printfulOrderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[shop/webhook] Printful order failed:", message);
    // Return 200 so Stripe doesn't retry — log the failure instead
    return NextResponse.json({ ok: false, error: message }, { status: 200 });
  }
}
