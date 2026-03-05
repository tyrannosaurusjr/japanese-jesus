import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT_DIR = process.cwd();
const ENV_PATH = path.join(ROOT_DIR, ".env.local");
const TARGET_WIDTH = 3000;
const TARGET_HEIGHT = 4200;
const PROOF_WIDTH = 1000;
const PROOF_HEIGHT = 1400;
const TARGET_RATIO_WIDTH = 5;
const TARGET_RATIO_HEIGHT = 7;

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

function runSips(args) {
  const result = spawnSync("sips", args, { encoding: "utf8" });

  if (result.status !== 0) {
    fail(result.stderr.trim() || result.stdout.trim() || `sips failed for args: ${args.join(" ")}`);
  }

  return result.stdout;
}

function getDimensions(filePath) {
  const output = runSips(["-g", "pixelWidth", "-g", "pixelHeight", filePath]);
  const widthMatch = output.match(/pixelWidth:\s+(\d+)/u);
  const heightMatch = output.match(/pixelHeight:\s+(\d+)/u);

  if (!widthMatch || !heightMatch) {
    fail(`Unable to read image dimensions for ${filePath}.`);
  }

  return {
    width: Number(widthMatch[1]),
    height: Number(heightMatch[1]),
  };
}

loadDotEnvIfPresent(ENV_PATH);

const sourceArg = process.argv[2];
const outputArg = process.argv[3];
const configuredSourcePath =
  sourceArg || process.env.PRINTFUL_POSTER_SOURCE_PATH?.trim() || "public/images/japanese-jesus-poster-art.png";
const configuredOutputPath =
  outputArg || process.env.PRINTFUL_POSTER_ASSET_PATH?.trim() || "public/images/japanese-jesus-poster-printful.png";
const configuredProofPath =
  process.env.PRINTFUL_POSTER_PROOF_PATH?.trim() || "public/images/japanese-jesus-poster-proof.png";
const sourcePath = path.resolve(ROOT_DIR, configuredSourcePath);
const outputPath = path.resolve(ROOT_DIR, configuredOutputPath);
const proofPath = path.resolve(ROOT_DIR, configuredProofPath);
const outputDir = path.dirname(outputPath);
const proofDir = path.dirname(proofPath);

if (!fs.existsSync(sourcePath)) {
  fail(`Poster source asset not found at ${sourcePath}.`);
}

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(proofDir, { recursive: true });
fs.copyFileSync(sourcePath, outputPath);

const sourceSize = getDimensions(outputPath);
const sourceRatioValue = sourceSize.width / sourceSize.height;
const targetRatioValue = TARGET_RATIO_WIDTH / TARGET_RATIO_HEIGHT;

let cropWidth = sourceSize.width;
let cropHeight = sourceSize.height;

if (Math.abs(sourceRatioValue - targetRatioValue) > 0.0001) {
  if (sourceRatioValue > targetRatioValue) {
    cropWidth = Math.round(sourceSize.height * targetRatioValue);
  } else {
    cropHeight = Math.round(sourceSize.width / targetRatioValue);
  }

  runSips(["-c", String(cropHeight), String(cropWidth), outputPath, "--out", outputPath]);
}

fs.copyFileSync(outputPath, proofPath);

runSips(["-z", String(TARGET_HEIGHT), String(TARGET_WIDTH), outputPath, "--out", outputPath]);
runSips(["-z", String(PROOF_HEIGHT), String(PROOF_WIDTH), proofPath, "--out", proofPath]);

const exportedSize = getDimensions(outputPath);
const proofSize = getDimensions(proofPath);

console.log("Printful poster asset exported.");
console.log(`Source: ${sourcePath}`);
console.log(`Output: ${outputPath}`);
console.log(`Proof: ${proofPath}`);
console.log(`Original size: ${sourceSize.width}x${sourceSize.height}`);
console.log(`Cropped size: ${cropWidth}x${cropHeight}`);
console.log(`Exported size: ${exportedSize.width}x${exportedSize.height}`);
console.log(`Proof size: ${proofSize.width}x${proofSize.height}`);
console.log(`Target ratio: ${TARGET_RATIO_WIDTH}:${TARGET_RATIO_HEIGHT}`);
