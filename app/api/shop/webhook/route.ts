import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { createPrintfulOrder, type PrintfulOrderRecipient } from "@/lib/printful";

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

const COUNTRIES_REQUIRING_STATE_CODE = new Set(["US", "CA", "AU"]);
const JP_PREFECTURE_CODE_BY_KEY: Record<string, string> = {
  hokkaido: "01",
  aomori: "02",
  iwate: "03",
  miyagi: "04",
  akita: "05",
  yamagata: "06",
  fukushima: "07",
  ibaraki: "08",
  tochigi: "09",
  gunma: "10",
  saitama: "11",
  chiba: "12",
  tokyo: "13",
  kanagawa: "14",
  niigata: "15",
  toyama: "16",
  ishikawa: "17",
  fukui: "18",
  yamanashi: "19",
  nagano: "20",
  gifu: "21",
  shizuoka: "22",
  aichi: "23",
  mie: "24",
  shiga: "25",
  kyoto: "26",
  osaka: "27",
  hyogo: "28",
  nara: "29",
  wakayama: "30",
  tottori: "31",
  shimane: "32",
  okayama: "33",
  hiroshima: "34",
  yamaguchi: "35",
  tokushima: "36",
  kagawa: "37",
  ehime: "38",
  kochi: "39",
  fukuoka: "40",
  saga: "41",
  nagasaki: "42",
  kumamoto: "43",
  oita: "44",
  miyazaki: "45",
  kagoshima: "46",
  okinawa: "47",
  北海道: "01",
  青森県: "02",
  岩手県: "03",
  宮城県: "04",
  秋田県: "05",
  山形県: "06",
  福島県: "07",
  茨城県: "08",
  栃木県: "09",
  群馬県: "10",
  埼玉県: "11",
  千葉県: "12",
  東京都: "13",
  神奈川県: "14",
  新潟県: "15",
  富山県: "16",
  石川県: "17",
  福井県: "18",
  山梨県: "19",
  長野県: "20",
  岐阜県: "21",
  静岡県: "22",
  愛知県: "23",
  三重県: "24",
  滋賀県: "25",
  京都府: "26",
  大阪府: "27",
  兵庫県: "28",
  奈良県: "29",
  和歌山県: "30",
  鳥取県: "31",
  島根県: "32",
  岡山県: "33",
  広島県: "34",
  山口県: "35",
  徳島県: "36",
  香川県: "37",
  愛媛県: "38",
  高知県: "39",
  福岡県: "40",
  佐賀県: "41",
  長崎県: "42",
  熊本県: "43",
  大分県: "44",
  宮崎県: "45",
  鹿児島県: "46",
  沖縄県: "47",
};

function getJapanPrefectureCode(rawState: string): string | undefined {
  const trimmed = rawState.trim();
  if (!trimmed) return undefined;

  if (/^\d{1,2}$/.test(trimmed)) {
    const numeric = Number(trimmed);
    if (numeric >= 1 && numeric <= 47) {
      return String(numeric).padStart(2, "0");
    }
  }

  const latinKey = trimmed.toLowerCase().replace(/[\s.-]+/g, "");
  const latinNoSuffix = latinKey.replace(/(prefecture|metropolis|to|do|fu|ken)$/g, "");

  const japaneseKey = trimmed.replace(/\s+/g, "");
  const japaneseNoSuffix = japaneseKey.replace(/[都道府県]$/u, "");

  return (
    JP_PREFECTURE_CODE_BY_KEY[latinKey]
    || JP_PREFECTURE_CODE_BY_KEY[latinNoSuffix]
    || JP_PREFECTURE_CODE_BY_KEY[japaneseKey]
    || JP_PREFECTURE_CODE_BY_KEY[japaneseNoSuffix]
  );
}

function buildExternalOrderId(sessionId: string): string {
  // Printful validates external_id format/length. Keep it deterministic and compact.
  const digest = crypto.createHash("sha256").update(sessionId).digest("hex");
  return `jj${digest.slice(0, 30)}`;
}

function isDuplicateExternalIdError(message: string): boolean {
  const normalized = message.toLowerCase();
  const hasExternalId = normalized.includes("external_id") || normalized.includes("external id");
  const isDuplicate =
    normalized.includes("already exists") ||
    normalized.includes("already been taken") ||
    normalized.includes("duplicate");

  return hasExternalId && isDuplicate;
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

  const countryCode = shipping.address.country.toUpperCase();
  const rawState = shipping.address.state?.trim() ?? "";
  const normalizedState = rawState.toUpperCase();
  const stateCode = countryCode === "JP"
    ? getJapanPrefectureCode(rawState)
    : COUNTRIES_REQUIRING_STATE_CODE.has(countryCode) && /^[A-Z0-9-]{2,3}$/.test(normalizedState)
      ? normalizedState
      : undefined;

  return {
    name: shipping.name ?? customer?.name ?? "Customer",
    email: customer?.email ?? undefined,
    address1: shipping.address.line1,
    address2: shipping.address.line2 ?? undefined,
    city: shipping.address.city,
    state_code: stateCode,
    country_code: countryCode,
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

  if (!syncVariantId) {
    // Not a shop order (e.g. a donation) — ignore
    return NextResponse.json({ ok: true, skipped: true, reason: "no printful variant in metadata" });
  }

  const recipient = buildRecipient(session);
  const externalOrderId = buildExternalOrderId(session.id);

  if (!recipient) {
    console.error("[shop/webhook] Missing shipping details for session", session.id);
    return NextResponse.json({ error: "Missing shipping address." }, { status: 422 });
  }

  try {
    const order = await createPrintfulOrder({
      external_id: externalOrderId,
      recipient,
      items: [{ sync_variant_id: syncVariantId, quantity: 1 }],
      confirm: true,
    });

    console.log("[shop/webhook] Printful order created", order.id, "for session", session.id);
    return NextResponse.json({ ok: true, printfulOrderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (isDuplicateExternalIdError(message)) {
      console.warn(
        "[shop/webhook] Duplicate external_id; assuming order already exists",
        externalOrderId,
        "for session",
        session.id,
      );
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "duplicate external_id",
        externalOrderId,
      });
    }

    console.error("[shop/webhook] Printful order failed:", message, "for session", session.id);
    // Return 5xx so Stripe retries transient downstream failures.
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
