# Japanese Jesus — CLAUDE.md

Project context for Claude Code sessions. Read this before doing anything.

---

## What This Is

A Next.js 15 / React 19 website about the real-world legend that Jesus survived the crucifixion, fled to Japan, and died at 106 in Shingo Village, Aomori Prefecture. The site doubles as an **ARG (alternate reality game)** — a multi-layer puzzle hidden inside an otherwise straightforward editorial/commerce site.

Live domain: `japanesejesus.com`
GitHub repo: `tyrannosaurusjr/japanese-jesus`
Branch to develop on: `claude/build-japanese-jesus-site-MIIzP`

---

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19
- **Styling:** Tailwind CSS v4 (PostCSS plugin), inline styles for brand-critical colors
- **Fonts:** Playfair Display (headings, 900 weight) + Inter (body/labels) via Google Fonts
- **Deployment:** Vercel (auto-deploys on push to connected branch)
- **Edge runtime:** `/axis` page uses `export const runtime = "edge"` for no-cache random variants

---

## Brand Palette

| Name | Hex | Usage |
|---|---|---|
| Abyssal Midnight | `#0D1B2A` | Background (default) |
| Frozen White | `#F5F2EB` | Foreground text |
| Cosmic Vermilion | `#C0392B` | Accent, CTAs, sigil default |
| Neon Citrine | `#E8D44D` | Labels, secondary accent |
| Cedar | `#2D4A3E` | Borders, dividers |
| Infrared Pink | `#FF4D6D` | Hidden elements (puzzle use) |

The `.label` CSS class = Inter, 0.65rem, 0.2em letter-spacing, uppercase, weight 600.

---

## Site Structure

### Public pages (indexed)
- `/` — Hero + intro + nav cards + Objects teaser + Transmissions signup
- `/the-legend` — Long-form narrative: The Substitution, The Farmer, The Passage, Isukiri
- `/shingo-today` — The tomb, the Christ Festival, coordinates
- `/get-there` — Travel directions to Shingo Village
- `/relics` — Shop: bucket hat, tee, sweatshirt, posters, patches, Keeper Card (not for sale). `/objects` permanently redirects here.
- `/canon` — Canon epochs / series content (uses `lib/site-content` CANON_EPOCHS data)
- `/conduit` — Conduit page (uses FactPattern component)
- `/signal` — Signal page
- `/journey` — Journey page. `/walk` permanently redirects here.

### Hidden ARG pages (noindex)
- `/the-gate` — Layer 2 ARG page
- `/axis` — Layer 3 ARG page (Edge, 15 random variants, no cache)
- `/thin-place` — Layer 4 ARG page

---

## The ARG — Full Puzzle Chain

**NEVER expose this in public-facing content. Keep puzzle logic in code comments only.**

```
LAYER 0 → LAYER 1 → LAYER 2 → LAYER 3 → LAYER 4 → LAYER 5
HTML/Audio  Steg     /the-gate  /axis    /thin-place  Email
```

### Layer 0 — Carrier Signal
- HTML comment in `layout.tsx`: `<!-- 周波数: 7.83 Hz — すべての門は開いている -->`
  - Translation: "Frequency: 7.83 Hz — all gates are open." (Schumann resonance)
- Hero audio drone (`/public/audio/drone.mp3`) contains Morse code at 0.5% volume
  - Morse: `HERAI IS NOT A PLACE`
  - Embedded at 30s and 90s marks

### Layer 1 — Steganography
- Hero image (`/public/images/hero.jpg`) has LSB steganography via `steghide`
- Passphrase: `7.83` (from Layer 0)
- Extracted message: `HE DID NOT STAY. THE FORM WAS TEMPORARY. THE GATE REMAINS OPEN. japanesejesus.com/the-gate`
- Build script: `scripts/embed-steg.sh`
- Source image lives at `/private/steg-source.jpg` — **never commit**

### Layer 2 — /the-gate
- Page title: `门` (Chinese: gate)
- Single aerial photograph with coordinates: `40.6542° N, 141.1389° E`
- The terrain is deliberately wrong (river runs backwards) — these are coords of a "parallel Shingo"
- Pixel cipher: 4 single pixels in brand colors at specific (x,y) coords encode AXIS via A1Z26
  - `(1,1)` = Cosmic Vermilion → A; `(24,1)` = Midnight → X; `(9,1)` = Citrine → I; `(19,1)` = Infrared → S
  - Spells: **AXIS** → `/axis`

### Layer 3 — /axis
- Edge runtime, no cache — 15 random variants per load
- Constants on every variant: broken-circle sigil, number sequence `3–1–4–1–5–9–2–6` (pi), lore text
- Variant index 7 only: timed clue appears for 4 seconds → "Read the spiral inward."
- Sigil has spiral micro-text at 4px (readable when downloaded and zoomed)
- Reading every 3rd character of the spiral text gives: **THINPLACE** → `/thin-place`

### Layer 4 — /thin-place
- Inverted color scheme (white bg `#F5F2EB`, dark text) — deliberate contrast
- Contains list of thin places, including Shingo
- Audio file: `/public/audio/transmission_00.wav` (wind + static)
  - Must be run through **DeepSound** — the `_00` filename hints at this
  - DeepSound payload: long message ending with `keeper@japanesejesus.com`
- Email address rendered in Infrared Pink (`#FF4D6D`) on Frozen White (`#F5F2EB`) background — invisible at face value
  - Visible under: color inversion, CSS filter, or source inspection (aria-label attribute)
  - Subject line: `THE FORM WAS TEMPORARY`

### Layer 5 — The Crossing
- Solver emails `keeper@japanesejesus.com` with subject `THE FORM WAS TEMPORARY`
- Human response within 48 hours (no autoresponder)
- Response template: `/private/keeper-response.md` — personalize each reply
- First 33 solvers who include mailing address receive a physical Keeper Card
- Track solvers in Airtable: "Portal at Herai — Solver Log"
  - Columns: Email, Name, Date received, Layer they described, Mailing address, Card sent (Y/N), Variant number (1–33), Notes

---

## Key Components

- **`Sigil`** (`components/Sigil.tsx`) — SVG broken-circle sigil. Props: `variant`, `size`, `withSpiral`, `spiralText`. The `withSpiral` prop renders spiral micro-text on concentric circle paths (used on `/axis`).
- **`AudioPlayer`** (`components/AudioPlayer.tsx`) — Controls for hero drone audio
- **`TransmissionForm`** (`components/TransmissionForm.tsx`) — Email signup on homepage
- **`TransmissionPopup`** (`components/TransmissionPopup.tsx`) — Global popup, rendered in root layout
- **`ProductCheckout`** (`components/ProductCheckout.tsx`) — Fetches variants + thumbnail from `/api/shop/variants/[id]`, handles Stripe checkout. Props: `printfulSyncProductId`, `productName`, `altImageUrl?`. On mount it also fetches `altThumbnailUrl` from the API (extracted from Printful variant files — prefers `type: "back"`, falls back to second file). Cross-fades to alt image on hover when available.
- **`PosterCheckout`** (`components/PosterCheckout.tsx`) — Variant of checkout for poster products.
- **`FactPattern`** (`components/FactPattern.tsx`) — Used on `/conduit`
- **`Nav`** / **`Footer`** — Site-wide navigation and footer

## Shop / Commerce

Fully wired to Printful + Stripe:
- **`/api/shop/variants/[productId]`** — fetches sync product from Printful, returns `{ variants, thumbnailUrl, altThumbnailUrl }`. `altThumbnailUrl` comes from first variant's files (back > second file > null). Cached 5 min.
- **`/api/shop/checkout`** — creates Stripe checkout session
- **`/api/shop/webhook`** — Stripe webhook handler
- **`lib/printful.ts`** — Printful API client. `PrintfulSyncProductResponse` includes `sync_variants[].files[]` typed with `type`, `preview_url`, `thumbnail_url`.
- **`lib/objects.ts`** — `CatalogObject` type + `OBJECTS` array. Fields: `id`, `name`, `description`, `material`, `price`, `variant`, `printfulSyncProductId?`, `notForSale?`, `altImageUrl?` (manual override for hover alt image, takes precedence over API-fetched alt).

### Current product list (lib/objects.ts)
| id | name | Printful ID |
|---|---|---|
| carrier-cap | Rift Sigil Bucket Hat | 422702408 |
| gate-tee | Portal Lantern Tee | 422792119 |
| herai-hoodie | Unisex Cotton Portal Lantern Sweatshirt | 422747921 |
| thin-place-print | Japanese Jesus Poster | 422563554 |
| framed-poster | Japanese Jesus Framed Poster | 422563382 |
| frequency-patch-red | Static Conduit Patch — Red | 422788293 |
| frequency-patch-blue | Static Conduit Patch — Blue | 422781829 |
| keeper-card | Keeper Card | — (not for sale) |

---

## Files Never to Commit

```
/private/keeper-response.md    ← response template (already exists, already excluded)
/private/steg-source.jpg       ← raw image before steganography
/private/deepsound-project/    ← audio steganography project files
/private/SPOILERS.md           ← full ARG documentation
/private/solver-log.csv        ← solver tracking
```

These live outside `/public` and won't be served. Confirm `.gitignore` covers `/private/` before pushing.

---

## Git / Deployment Workflow

- Develop on: `claude/build-japanese-jesus-site-MIIzP`
- Push with: `git push -u origin claude/build-japanese-jesus-site-MIIzP`
- Vercel auto-deploys on push — check Vercel dashboard for preview URLs
- Production branch is separate — do not push to main without explicit instruction

---

## Things Still To Do / Open Questions

- Hero audio: `drone.mp3` with embedded Morse code needs to be produced and placed at `/public/audio/drone.mp3`
- `transmission_00.wav` with DeepSound payload needs to be produced and placed at `/public/audio/transmission_00.wav`
- Hero image steganography: `hero-home.jpg` exists at `/public/images/hero-home.jpg` but LSB steg has not been embedded yet. Source lives at `/private/steg-source.jpg`.
- Hover alt images: infrastructure is in place (`altImageUrl` field on `CatalogObject`, auto-fetch from Printful variant files). Verify that Printful is returning `files` on sync variants — if not, manually populate `altImageUrl` in `lib/objects.ts` with direct image URLs.
- `keeper@japanesejesus.com` inbox: confirm email is set up (Postmark or Fastmail)
- `/canon`, `/conduit`, `/signal`, `/journey` pages — verify content is complete and navigation links are correct
- Transmissions form backend: `/app/api/transmissions/route.ts` exists — verify it's correctly saving/forwarding emails
