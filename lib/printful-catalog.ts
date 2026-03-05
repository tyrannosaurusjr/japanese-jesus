import { OBJECTS } from "@/lib/objects";

type ReadyObjectId = "carrier-cap" | "gate-tee" | "herai-hoodie" | "thin-place-print";

interface PrintfulCatalogConfig {
  variantIdEnvKey: string;
  fileUrlEnvKey: string;
  productExternalId: string;
  variantExternalId: string;
}

const PRINTFUL_CONFIG_BY_OBJECT_ID: Record<ReadyObjectId, PrintfulCatalogConfig> = {
  "carrier-cap": {
    variantIdEnvKey: "PRINTFUL_VARIANT_ID_CARRIER_CAP",
    fileUrlEnvKey: "PRINTFUL_FILE_URL_CARRIER_CAP",
    productExternalId: "japanese-jesus-carrier-cap",
    variantExternalId: "japanese-jesus-carrier-cap-variant",
  },
  "gate-tee": {
    variantIdEnvKey: "PRINTFUL_VARIANT_ID_GATE_TEE",
    fileUrlEnvKey: "PRINTFUL_FILE_URL_GATE_TEE",
    productExternalId: "japanese-jesus-gate-tee",
    variantExternalId: "japanese-jesus-gate-tee-variant",
  },
  "herai-hoodie": {
    variantIdEnvKey: "PRINTFUL_VARIANT_ID_HERAI_HOODIE",
    fileUrlEnvKey: "PRINTFUL_FILE_URL_HERAI_HOODIE",
    productExternalId: "japanese-jesus-herai-hoodie",
    variantExternalId: "japanese-jesus-herai-hoodie-variant",
  },
  "thin-place-print": {
    variantIdEnvKey: "PRINTFUL_VARIANT_ID_THIN_PLACE_PRINT",
    fileUrlEnvKey: "PRINTFUL_FILE_URL_THIN_PLACE_PRINT",
    productExternalId: "japanese-jesus-thin-place-print",
    variantExternalId: "japanese-jesus-thin-place-print-variant",
  },
};

function getReadyObject(id: string) {
  const object = OBJECTS.find((candidate) => candidate.id === id);

  if (!object || object.printfulStatus !== "ready") {
    return null;
  }

  if (!(id in PRINTFUL_CONFIG_BY_OBJECT_ID)) {
    return null;
  }

  return object;
}

export function getPrintfulCatalogReadiness(id: string) {
  const object = getReadyObject(id);

  if (!object) {
    return {
      ok: false as const,
      error: "Unsupported catalog id. Only ready-to-create Printful objects are accepted.",
    };
  }

  const config = PRINTFUL_CONFIG_BY_OBJECT_ID[object.id as ReadyObjectId];
  const variantIdRaw = process.env[config.variantIdEnvKey];
  const fileUrl = process.env[config.fileUrlEnvKey];
  const variantId = Number(variantIdRaw);

  if (!variantIdRaw || !Number.isInteger(variantId) || variantId <= 0) {
    return {
      ok: false as const,
      error: `Missing or invalid ${config.variantIdEnvKey}.`,
    };
  }

  if (!fileUrl) {
    return {
      ok: false as const,
      error: `Missing ${config.fileUrlEnvKey}.`,
    };
  }

  return {
    ok: true as const,
    object,
    config,
    variantId,
    fileUrl,
  };
}

export function buildPrintfulCatalogPayload(id: string) {
  const readiness = getPrintfulCatalogReadiness(id);

  if (!readiness.ok) {
    throw new Error(readiness.error);
  }

  return {
    sync_product: {
      external_id: readiness.config.productExternalId,
      name: readiness.object.name,
      thumbnail: readiness.fileUrl,
    },
    sync_variants: [
      {
        external_id: readiness.config.variantExternalId,
        variant_id: readiness.variantId,
        retail_price: readiness.object.price?.toFixed(2),
        files: [
          {
            url: readiness.fileUrl,
          },
        ],
      },
    ],
  };
}
