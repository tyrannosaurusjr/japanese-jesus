import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();
const ENV_PATH = path.join(ROOT_DIR, ".env.local");
const PRINTFUL_API_BASE = "https://api.printful.com";
const PAGE_LIMIT = 100;
const MAX_PAGES = 20;

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

async function printfulRequest(pathname) {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    throw new Error("Missing PRINTFUL_API_TOKEN.");
  }

  const response = await fetch(`${PRINTFUL_API_BASE}${pathname}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();

  if (!response.ok) {
    const message = json?.error?.message || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return json?.result;
}

function scoreProduct(productName, terms) {
  const lower = productName.toLowerCase();
  return terms.reduce((score, term) => score + (lower.includes(term) ? 1 : 0), 0);
}

function selectTopProducts(products, terms) {
  return products
    .map((product) => ({
      product,
      score: scoreProduct(product.title || product.name || "", terms),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((entry) => entry.product);
}

async function getCatalogProducts() {
  const products = [];

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const offset = page * PAGE_LIMIT;
    const result = await printfulRequest(`/products?limit=${PAGE_LIMIT}&offset=${offset}`);
    const batch = Array.isArray(result) ? result : [];

    if (batch.length === 0) {
      break;
    }

    products.push(...batch);

    if (batch.length < PAGE_LIMIT) {
      break;
    }
  }

  return products;
}

async function getProductVariants(productId) {
  const result = await printfulRequest(`/products/${productId}`);
  return {
    name: result?.product?.title || result?.product?.name || `Product ${productId}`,
    variants: Array.isArray(result?.variants) ? result.variants : [],
  };
}

function printVariantSuggestion(label, variants, filters = []) {
  const matches = variants.filter((variant) => {
    const text = `${variant.name || ""} ${variant.size || ""} ${variant.color || ""}`.toLowerCase();
    return filters.every((filter) => text.includes(filter));
  });

  console.log(`\n${label}:`);

  if (matches.length === 0) {
    console.log("  no exact filtered matches; showing first 5 variants:");
    variants.slice(0, 5).forEach((variant) => {
      console.log(`  - id=${variant.id} | ${variant.name}`);
    });
    return;
  }

  matches.slice(0, 10).forEach((variant) => {
    console.log(`  - id=${variant.id} | ${variant.name}`);
  });
}

async function main() {
  loadDotEnvIfPresent(ENV_PATH);
  const products = await getCatalogProducts();

  console.log(`Fetched ${products.length} catalog products from Printful.`);

  const capCandidates = selectTopProducts(products, ["cap", "snapback", "structured"]);
  const teeCandidates = selectTopProducts(products, ["t-shirt", "oversized", "garment-dyed"]);
  const hoodieCandidates = selectTopProducts(products, ["hoodie", "pullover"]);
  const posterCandidates = selectTopProducts(products, ["poster", "matte"]);

  const buckets = [
    { label: "Cap product candidates", items: capCandidates },
    { label: "Tee product candidates", items: teeCandidates },
    { label: "Hoodie product candidates", items: hoodieCandidates },
    { label: "Poster product candidates", items: posterCandidates },
  ];

  for (const bucket of buckets) {
    console.log(`\n${bucket.label}:`);
    if (bucket.items.length === 0) {
      console.log("  none");
      continue;
    }
    bucket.items.forEach((product) => {
      const name = product.title || product.name;
      console.log(`  - product_id=${product.id} | ${name}`);
    });
  }

  const poster = posterCandidates[0];
  if (poster) {
    const details = await getProductVariants(poster.id);
    printVariantSuggestion(`Poster variants for ${details.name}`, details.variants, ["50", "70"]);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unknown error");
  process.exit(1);
});
