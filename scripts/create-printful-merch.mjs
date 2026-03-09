import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const ENV_PATH = path.join(ROOT_DIR, ".env.local");
const PRINTFUL_API_BASE = "https://api.printful.com";

const ITEMS = [
  {
    id: "carrier-cap",
    name: "Sigil Carrier Cap",
    priceUsd: 48,
    productExternalId: "japanese-jesus-carrier-cap",
    variantExternalId: "japanese-jesus-carrier-cap-variant",
    variantIdEnvKey: "PRINTFUL_VARIANT_ID_CARRIER_CAP",
    fileUrlEnvKey: "PRINTFUL_FILE_URL_CARRIER_CAP",
    rules: {
      requireAny: ["snapback", "structured", "trucker", "flexfit"],
      requireAll: ["cap"],
      forbid: ["dad hat", "all-over print"],
    },
  },
  {
    id: "gate-tee",
    name: "The Gate Tee",
    priceUsd: 54,
    productExternalId: "japanese-jesus-gate-tee",
    variantExternalId: "japanese-jesus-gate-tee-variant",
    variantIdEnvKey: "PRINTFUL_VARIANT_ID_GATE_TEE",
    fileUrlEnvKey: "PRINTFUL_FILE_URL_GATE_TEE",
    rules: {
      requireAny: ["oversized", "garment-dyed", "heavyweight", "heavy weight"],
      requireAll: ["t-shirt"],
      forbid: ["all-over print", "performance", "athletic"],
    },
  },
  {
    id: "herai-hoodie",
    name: "Herai Pullover",
    priceUsd: 118,
    productExternalId: "japanese-jesus-herai-hoodie",
    variantExternalId: "japanese-jesus-herai-hoodie-variant",
    variantIdEnvKey: "PRINTFUL_VARIANT_ID_HERAI_HOODIE",
    fileUrlEnvKey: "PRINTFUL_FILE_URL_HERAI_HOODIE",
    rules: {
      requireAny: ["pullover", "bella", "3719"],
      requireAll: ["hoodie"],
      forbid: ["all-over print", "zip hoodie", "quarter zip"],
    },
  },
  {
    id: "thin-place-print",
    name: "Japanese Jesus Poster",
    priceUsd: 72,
    productExternalId: "japanese-jesus-thin-place-print",
    variantExternalId: "japanese-jesus-thin-place-print-variant",
    variantIdEnvKey: "PRINTFUL_VARIANT_ID_THIN_PLACE_PRINT",
    fileUrlEnvKey: "PRINTFUL_FILE_URL_THIN_PLACE_PRINT",
    rules: {
      requireAny: ["50×70", "50x70", "20″×28″", "20x28"],
      requireAll: ["poster"],
      forbid: ["framed"],
    },
  },
];

function loadDotEnvIfPresent(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const contents = fs.readFileSync(filePath, "utf8");

  for (const rawLine of contents.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex < 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function parseArgs(argv) {
  const selectedIds = [];
  let dryRun = false;
  let includePoster = false;
  let strict = true;

  for (const arg of argv) {
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (arg === "--include-poster") {
      includePoster = true;
      continue;
    }

    if (arg === "--allow-mismatch") {
      strict = false;
      continue;
    }

    if (arg.startsWith("--ids=")) {
      const ids = arg
        .slice("--ids=".length)
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      selectedIds.push(...ids);
    }
  }

  return { selectedIds, dryRun, includePoster, strict };
}

function getConfiguredItem(item) {
  const variantIdRaw = process.env[item.variantIdEnvKey];
  const fileUrl = process.env[item.fileUrlEnvKey];
  const variantId = Number(variantIdRaw);

  if (!variantIdRaw || !Number.isInteger(variantId) || variantId <= 0) {
    return { ok: false, reason: `Missing or invalid ${item.variantIdEnvKey}.` };
  }

  if (!fileUrl) {
    return { ok: false, reason: `Missing ${item.fileUrlEnvKey}.` };
  }

  return {
    ok: true,
    payload: {
      sync_product: {
        external_id: item.productExternalId,
        name: item.name,
        thumbnail: fileUrl,
      },
      sync_variants: [
        {
          external_id: item.variantExternalId,
          variant_id: variantId,
          retail_price: item.priceUsd.toFixed(2),
          files: [{ url: fileUrl }],
        },
      ],
    },
  };
}

async function createProduct(token, payload) {
  const response = await fetch(`${PRINTFUL_API_BASE}/store/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    const message = json?.error?.message || `Printful request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return json?.result;
}

async function getVariantMetadata(token, variantId) {
  const response = await fetch(`${PRINTFUL_API_BASE}/products/variant/${variantId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();

  if (!response.ok) {
    const message = json?.error?.message || `Variant lookup failed with status ${response.status}.`;
    throw new Error(message);
  }

  const variant = json?.result?.variant;
  const product = json?.result?.product;

  return {
    descriptor: `${variant?.name || ""} ${variant?.size || ""} ${variant?.color || ""} ${product?.title || ""} ${product?.type || ""} ${product?.type_name || ""}`.toLowerCase(),
    variantName: variant?.name || "Unknown variant",
  };
}

function validateRules(descriptor, rules) {
  const missingRequiredAll = rules.requireAll.filter((term) => !descriptor.includes(term));

  if (missingRequiredAll.length > 0) {
    return {
      ok: false,
      reason: `Missing required terms: ${missingRequiredAll.join(", ")}.`,
    };
  }

  if (rules.requireAny.length > 0 && !rules.requireAny.some((term) => descriptor.includes(term))) {
    return {
      ok: false,
      reason: `Must include one of: ${rules.requireAny.join(", ")}.`,
    };
  }

  const forbidden = rules.forbid.find((term) => descriptor.includes(term));

  if (forbidden) {
    return {
      ok: false,
      reason: `Contains forbidden term: ${forbidden}.`,
    };
  }

  return { ok: true };
}

async function main() {
  loadDotEnvIfPresent(ENV_PATH);

  const { selectedIds, dryRun, includePoster, strict } = parseArgs(process.argv.slice(2));
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    throw new Error("Missing PRINTFUL_API_TOKEN.");
  }

  const defaultIds = includePoster
    ? ["carrier-cap", "gate-tee", "herai-hoodie", "thin-place-print"]
    : ["carrier-cap", "gate-tee", "herai-hoodie"];
  const ids = selectedIds.length > 0 ? selectedIds : defaultIds;
  const selectedItems = ITEMS.filter((item) => ids.includes(item.id));

  if (selectedItems.length === 0) {
    throw new Error("No valid SKU ids selected. Use --ids=carrier-cap,gate-tee,herai-hoodie,thin-place-print");
  }

  console.log(dryRun ? "Running Printful merch creation dry run..." : "Creating Printful merch...");

  for (const item of selectedItems) {
    const configured = getConfiguredItem(item);

    if (!configured.ok) {
      console.log(`[skip] ${item.id}: ${configured.reason}`);
      continue;
    }

    let variantMetadata;
    try {
      variantMetadata = await getVariantMetadata(token, configured.payload.sync_variants[0].variant_id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.log(`[skip] ${item.id}: could not verify variant metadata (${message})`);
      continue;
    }

    if (strict) {
      const validation = validateRules(variantMetadata.descriptor, item.rules);
      if (!validation.ok) {
        console.log(
          `[skip] ${item.id}: variant mismatch (${validation.reason}) variant="${variantMetadata.variantName}"`,
        );
        continue;
      }
    }

    if (dryRun) {
      console.log(
        `[dry-run] ${item.id}: ready (variant ${configured.payload.sync_variants[0].variant_id}, $${configured.payload.sync_variants[0].retail_price})`,
      );
      continue;
    }

    try {
      const created = await createProduct(token, configured.payload);
      const productId = created?.sync_product?.id ?? "unknown";
      const variantCount = created?.sync_product?.variants ?? 1;
      console.log(`[ok] ${item.id}: created sync_product_id=${productId}, variants=${variantCount}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.log(`[error] ${item.id}: ${message}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unknown error");
  process.exit(1);
});
