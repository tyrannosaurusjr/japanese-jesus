import { sanitizeImpactClickId } from "@/lib/impact-click";

const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

interface ImpactConfig {
  accountSid: string;
  authToken: string;
  campaignId: string;
  actionTrackerId?: string;
  eventTypeCode?: string;
}

export interface ImpactConversionInput {
  orderId: string;
  clickId: string;
  amountMinor: number;
  currency: string;
  customerId?: string;
  eventDateIso?: string;
}

export interface ImpactConversionResult {
  sent: boolean;
  reason?: string;
}

function getImpactConfig(): ImpactConfig | null {
  if ((process.env.IMPACT_CONVERSIONS_ENABLED ?? "true").toLowerCase() !== "true") {
    return null;
  }

  const accountSid = process.env.IMPACT_ACCOUNT_SID?.trim();
  const authToken = process.env.IMPACT_AUTH_TOKEN?.trim();
  const campaignId = process.env.IMPACT_CAMPAIGN_ID?.trim();
  const actionTrackerId = process.env.IMPACT_ACTION_TRACKER_ID?.trim();
  const eventTypeCode = process.env.IMPACT_EVENT_TYPE_CODE?.trim();

  if (!accountSid || !authToken || !campaignId) {
    return null;
  }

  if (!actionTrackerId && !eventTypeCode) {
    return null;
  }

  return {
    accountSid,
    authToken,
    campaignId,
    actionTrackerId,
    eventTypeCode,
  };
}

function toImpactAmount(amountMinor: number, currencyCode: string): string {
  if (ZERO_DECIMAL_CURRENCIES.has(currencyCode)) {
    return String(Math.round(amountMinor));
  }

  return (amountMinor / 100).toFixed(2);
}

export function isDuplicateImpactOrderError(message: string): boolean {
  const normalized = message.toLowerCase();
  const hasOrderIdReference = normalized.includes("orderid") || normalized.includes("order id");
  const hasDuplicateIndicator =
    normalized.includes("duplicate") ||
    normalized.includes("already exists") ||
    normalized.includes("already been taken");

  return hasOrderIdReference && hasDuplicateIndicator;
}

export async function sendImpactConversion(
  input: ImpactConversionInput,
): Promise<ImpactConversionResult> {
  const config = getImpactConfig();
  if (!config) {
    return { sent: false, reason: "not_configured" };
  }

  const clickId = sanitizeImpactClickId(input.clickId);
  if (!clickId) {
    return { sent: false, reason: "missing_click_id" };
  }

  if (!Number.isFinite(input.amountMinor) || input.amountMinor <= 0) {
    return { sent: false, reason: "invalid_amount" };
  }

  const currencyCode = input.currency.trim().toUpperCase();
  if (!currencyCode) {
    return { sent: false, reason: "missing_currency" };
  }

  const params = new URLSearchParams();
  params.set("CampaignId", config.campaignId);
  params.set("OrderId", input.orderId);
  params.set("Amount", toImpactAmount(input.amountMinor, currencyCode));
  params.set("CurrencyCode", currencyCode);
  params.set("ClickId", clickId);
  params.set("EventDate", input.eventDateIso ?? new Date().toISOString());

  if (config.actionTrackerId) {
    params.set("ActionTrackerId", config.actionTrackerId);
  } else if (config.eventTypeCode) {
    params.set("EventTypeCode", config.eventTypeCode);
  }

  if (input.customerId?.trim()) {
    params.set("CustomerId", input.customerId.trim());
  }

  const endpoint = new URL(
    `https://api.impact.com/Advertisers/${encodeURIComponent(config.accountSid)}/Conversions`,
  );
  endpoint.search = params.toString();

  const auth = Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64");
  const response = await fetch(endpoint.toString(), {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });

  const rawBody = await response.text();

  if (!response.ok) {
    const compactBody = rawBody.replace(/\s+/g, " ").trim().slice(0, 400);
    throw new Error(
      `Impact conversion request failed (${response.status}): ${compactBody || "no response body"}`,
    );
  }

  return { sent: true };
}
