import path from "node:path";
import { OBJECTS } from "@/lib/objects";

const CM_PER_INCH = 2.54;
const POSTER_WIDTH_CM = 50;
const POSTER_HEIGHT_CM = 70;
const POSTER_MIN_DPI = 150;
const PNG_SIGNATURE = "89504e470d0a1a0a";

export const POSTER_ASSET_PATH =
  process.env.PRINTFUL_POSTER_ASSET_PATH ??
  path.join(process.cwd(), "public/images/japanese-jesus-poster-printful.png");

export function getPosterVariantId() {
  const variantIdRaw = process.env.PRINTFUL_VARIANT_ID_THIN_PLACE_PRINT;
  const variantId = Number(variantIdRaw);

  if (!variantIdRaw || !Number.isInteger(variantId) || variantId <= 0) {
    throw new Error("Missing or invalid PRINTFUL_VARIANT_ID_THIN_PLACE_PRINT.");
  }

  return variantId;
}

export function getPosterUsdRetailPrice() {
  const poster = OBJECTS.find((object) => object.id === "thin-place-print");

  if (!poster?.price) {
    throw new Error("The thin-place-print catalog price is missing.");
  }

  const override = process.env.PRINTFUL_PRICE_USD_THIN_PLACE_PRINT;
  const price = override ? Number(override) : poster.price;

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Missing or invalid PRINTFUL_PRICE_USD_THIN_PLACE_PRINT.");
  }

  return price.toFixed(2);
}

function getMinimumPixels(lengthCm: number) {
  return Math.ceil((lengthCm / CM_PER_INCH) * POSTER_MIN_DPI);
}

function readPngDimensions(buffer: Buffer) {
  const signature = buffer.subarray(0, 8).toString("hex");

  if (signature !== PNG_SIGNATURE) {
    throw new Error("Poster asset must be a PNG file.");
  }

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);

  if (!width || !height) {
    throw new Error("Unable to read PNG dimensions for the poster asset.");
  }

  return { width, height };
}

export function validatePosterAsset(buffer: Buffer) {
  const { width, height } = readPngDimensions(buffer);
  const scaledWidth = width * POSTER_HEIGHT_CM;
  const scaledHeight = height * POSTER_WIDTH_CM;
  const minWidth = getMinimumPixels(POSTER_WIDTH_CM);
  const minHeight = getMinimumPixels(POSTER_HEIGHT_CM);

  if (scaledWidth !== scaledHeight) {
    throw new Error(
      `Poster asset must use a 5:7 aspect ratio for 50x70 cm. Received ${width}x${height}.`,
    );
  }

  if (width < minWidth || height < minHeight) {
    throw new Error(
      `Poster asset is too small for 50x70 cm at ${POSTER_MIN_DPI} DPI. Minimum ${minWidth}x${minHeight}; received ${width}x${height}.`,
    );
  }

  return {
    width,
    height,
    sizeCm: `${POSTER_WIDTH_CM}x${POSTER_HEIGHT_CM} cm`,
    minPixels: `${minWidth}x${minHeight}`,
  };
}
