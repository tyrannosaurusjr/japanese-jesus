import fs from "node:fs";
import path from "node:path";

const CM_PER_INCH = 2.54;
const POSTER_WIDTH_CM = 50;
const POSTER_HEIGHT_CM = 70;
const POSTER_MIN_DPI = 150;
const ROOT_DIR = process.cwd();
const ENV_PATH = path.join(ROOT_DIR, ".env.local");
const PNG_SIGNATURE = "89504e470d0a1a0a";

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

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function getEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    fail(`Missing ${name}.`);
  }

  return value;
}

function getMinimumPixels(lengthCm) {
  return Math.ceil((lengthCm / CM_PER_INCH) * POSTER_MIN_DPI);
}

function readPngDimensions(buffer) {
  if (buffer.subarray(0, 8).toString("hex") !== PNG_SIGNATURE) {
    fail("Poster asset must be a PNG file.");
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

loadDotEnvIfPresent(ENV_PATH);

const variantIdRaw = getEnv("PRINTFUL_VARIANT_ID_THIN_PLACE_PRINT");
const variantId = Number(variantIdRaw);
const retailPriceRaw = process.env.PRINTFUL_PRICE_USD_THIN_PLACE_PRINT?.trim() || "72.00";
const retailPrice = Number(retailPriceRaw);
const configuredAssetPath =
  process.env.PRINTFUL_POSTER_ASSET_PATH?.trim() || "public/images/japanese-jesus-poster-printful.png";
const assetPath = path.resolve(ROOT_DIR, configuredAssetPath);

if (!Number.isInteger(variantId) || variantId <= 0) {
  fail(
    `PRINTFUL_VARIANT_ID_THIN_PLACE_PRINT must be a positive integer for the real 50x70 cm poster variant. Received: ${variantIdRaw}`,
  );
}

if (!Number.isFinite(retailPrice) || retailPrice <= 0) {
  fail(
    `PRINTFUL_PRICE_USD_THIN_PLACE_PRINT must be a positive USD amount. Received: ${retailPriceRaw}`,
  );
}

if (!fs.existsSync(assetPath)) {
  fail(`Poster asset not found at ${assetPath}.`);
}

const buffer = fs.readFileSync(assetPath);
const { width, height } = readPngDimensions(buffer);
const minWidth = getMinimumPixels(POSTER_WIDTH_CM);
const minHeight = getMinimumPixels(POSTER_HEIGHT_CM);

if (width * POSTER_HEIGHT_CM !== height * POSTER_WIDTH_CM) {
  fail(`Poster asset must be 5:7 for 50x70 cm. Received ${width}x${height}.`);
}

if (width < minWidth || height < minHeight) {
  fail(
    `Poster asset is too small for 50x70 cm at ${POSTER_MIN_DPI} DPI. Minimum ${minWidth}x${minHeight}; received ${width}x${height}.`,
  );
}

console.log("Printful poster config is valid.");
console.log(`Variant ID: ${variantId}`);
console.log(`USD price: ${retailPrice.toFixed(2)}`);
console.log(`Asset: ${assetPath}`);
console.log(`Dimensions: ${width}x${height}`);
console.log(`Target size: ${POSTER_WIDTH_CM}x${POSTER_HEIGHT_CM} cm`);
