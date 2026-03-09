import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const ENV_PATH = path.join(ROOT_DIR, ".env.local");
const PRINTFUL_API_BASE = "https://api.printful.com";

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

async function printfulRequest(pathname, init = {}) {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    throw new Error("Missing PRINTFUL_API_TOKEN.");
  }

  const response = await fetch(`${PRINTFUL_API_BASE}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const json = await response.json();

  if (!response.ok) {
    const message = json?.error?.message || `Printful request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return json?.result;
}

function parseArgs(argv) {
  const [command, ...rest] = argv;

  if (!command) {
    throw new Error("Usage: node scripts/printful-inspect.mjs <catalog|catalog-variants|store|store-product|delete-store-product> [args]");
  }

  return { command, rest };
}

async function listCatalog() {
  const result = await printfulRequest("/products?limit=100");
  const products = Array.isArray(result) ? result : [];

  for (const product of products) {
    console.log(`${String(product.id).padEnd(6)} | ${product.title || product.name}`);
  }
}

async function listCatalogVariants(productIdRaw) {
  const productId = Number(productIdRaw);

  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error("catalog-variants requires a numeric product id.");
  }

  const result = await printfulRequest(`/products/${productId}`);
  const variants = Array.isArray(result?.variants) ? result.variants : [];

  for (const variant of variants) {
    console.log(`${String(variant.id).padEnd(7)} | ${variant.name}`);
  }
}

async function listStore() {
  const result = await printfulRequest("/store/products?limit=100");
  const products = Array.isArray(result) ? result : [];

  for (const product of products) {
    console.log(
      `${String(product.id).padEnd(10)} | ${(product.external_id || "").padEnd(40)} | ${product.name}`,
    );
  }
}

async function showStoreProduct(productIdRaw) {
  const productId = Number(productIdRaw);

  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error("store-product requires a numeric store product id.");
  }

  const result = await printfulRequest(`/store/products/${productId}`);
  console.log(JSON.stringify(result, null, 2));
}

async function deleteStoreProduct(productIdRaw) {
  const productId = Number(productIdRaw);

  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error("delete-store-product requires a numeric store product id.");
  }

  await printfulRequest(`/store/products/${productId}`, { method: "DELETE" });
  console.log(`Deleted store product ${productId}.`);
}

async function main() {
  loadDotEnvIfPresent(ENV_PATH);
  const { command, rest } = parseArgs(process.argv.slice(2));

  if (command === "catalog") {
    await listCatalog();
    return;
  }

  if (command === "catalog-variants") {
    await listCatalogVariants(rest[0]);
    return;
  }

  if (command === "store") {
    await listStore();
    return;
  }

  if (command === "store-product") {
    await showStoreProduct(rest[0]);
    return;
  }

  if (command === "delete-store-product") {
    await deleteStoreProduct(rest[0]);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unknown error");
  process.exit(1);
});
