#!/usr/bin/env bash
# ARG Layer 1 — LSB Steganography
# Embeds a hidden message into the hero photograph using steghide
# Passphrase: 7.83 (from Layer 0 Schumann resonance clue)
# Run this at build time — output goes to /public/images/hero.jpg
# Source image MUST exist at /private/steg-source.jpg

set -e

SOURCE="./private/steg-source.jpg"
OUTPUT="./public/images/hero.jpg"
PASSPHRASE="7.83"
MESSAGE="HE DID NOT STAY. THE FORM WAS TEMPORARY. THE GATE REMAINS OPEN. japanesejesus.com/the-gate"

if [ ! -f "$SOURCE" ]; then
  echo "[steg] Source image not found at $SOURCE"
  echo "[steg] Copying placeholder. Add real source to /private/steg-source.jpg"
  # Use a placeholder if source doesn't exist (dev mode)
  if [ -f "./public/images/hero.jpg" ]; then
    echo "[steg] Using existing hero.jpg"
    exit 0
  fi
  exit 1
fi

# Check for steghide
if ! command -v steghide &> /dev/null; then
  echo "[steg] steghide not installed. Copying source as-is."
  cp "$SOURCE" "$OUTPUT"
  exit 0
fi

# Write message to temp file
TMPFILE=$(mktemp /tmp/steg-msg.XXXXXX.txt)
echo -n "$MESSAGE" > "$TMPFILE"

# Embed using steghide
steghide embed \
  -cf "$SOURCE" \
  -sf "$OUTPUT" \
  -p "$PASSPHRASE" \
  -f \
  -ef "$TMPFILE"

rm -f "$TMPFILE"
echo "[steg] ✓ Hero image embedded → $OUTPUT"
echo "[steg] Passphrase: $PASSPHRASE"
echo "[steg] Message: $MESSAGE"
