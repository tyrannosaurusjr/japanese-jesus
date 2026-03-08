const PRINTFUL_API_BASE = "https://api.printful.com";

interface PrintfulEnvelope<T> {
  code: number;
  result: T;
}

export interface PrintfulStoreSummary {
  id: number;
  name: string;
  type: string;
}

export interface PrintfulSyncProductResponse {
  sync_product: {
    id: number;
    external_id: string | null;
    name: string;
    variants: number;
    synced: number;
    thumbnail_url?: string;
  };
  sync_variants: Array<{
    id: number;
    external_id: string | null;
    sync_product_id: number;
    variant_id: number;
    retail_price: string;
    currency: string;
    name: string;
    synced: boolean;
  }>;
}

export interface PrintfulFileResponse {
  id: number;
  url: string | null;
  filename: string | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  dpi: number | null;
  status: string;
  thumbnail_url: string | null;
  preview_url: string | null;
}

function getPrintfulToken() {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    throw new Error("PRINTFUL_API_TOKEN is not configured.");
  }

  return token;
}

export async function printfulRequest<T>(path: string, init?: RequestInit) {
  const token = getPrintfulToken();
  const response = await fetch(`${PRINTFUL_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = (await response.json()) as PrintfulEnvelope<T> | { error?: { message?: string } };

  if (!response.ok) {
    const message = "error" in data ? data.error?.message : undefined;
    throw new Error(message || `Printful request failed with status ${response.status}.`);
  }

  return data as PrintfulEnvelope<T>;
}

export async function getAuthorizedStores() {
  const response = await printfulRequest<PrintfulStoreSummary[]>("/stores");

  return response.result;
}

export async function createStoreProduct(body: unknown) {
  const response = await printfulRequest<PrintfulSyncProductResponse>("/store/products", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return response.result;
}

export async function createPrintfulFile(body: unknown) {
  const response = await printfulRequest<PrintfulFileResponse>("/files", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return response.result;
}

export interface PrintfulOrderRecipient {
  name: string;
  email?: string;
  address1: string;
  address2?: string;
  city: string;
  state_code?: string;
  country_code: string;
  zip: string;
}

export interface PrintfulOrderResult {
  id: number;
  external_id: string | null;
  status: string;
}

export interface PrintfulSyncVariantDetail {
  id: number;
  name: string;
  retail_price: string;
  currency: string;
  sync_product_id: number;
}

export async function getSyncProduct(syncProductId: string | number) {
  const response = await printfulRequest<PrintfulSyncProductResponse>(
    `/store/products/${syncProductId}`,
  );
  return response.result;
}

export async function getSyncVariant(syncVariantId: string | number) {
  // Printful v1 API returns the variant directly in result (not wrapped in { sync_variant })
  const response = await printfulRequest<PrintfulSyncVariantDetail>(
    `/store/variants/${syncVariantId}`,
  );
  return response.result;
}

export async function createPrintfulOrder(body: {
  recipient: PrintfulOrderRecipient;
  items: Array<{ sync_variant_id: string; quantity: number }>;
  confirm?: boolean;
}) {
  const response = await printfulRequest<PrintfulOrderResult>("/orders", {
    method: "POST",
    body: JSON.stringify({ confirm: true, ...body }),
  });

  return response.result;
}
