# Japanese Jesus

Marketing site and ARG for the legend of Jesus traveling to Shingo Village, Aomori after the crucifixion.

The site is built as a Next.js App Router project. On the surface it is an editorial experience with travel and product pages. Underneath, it includes a noindex puzzle path routed through hidden pages.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- ESLint
- Vercel deployment target

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run export:printful-poster
npm run check:printful-poster
npm run printful:inspect -- catalog
npm run build
npm run start
```

Local development runs at [http://localhost:3000](http://localhost:3000).
Production builds use Webpack mode (`next build --webpack`) for stability.

## Project Structure

- `app/` App Router pages, layout, globals, and API routes
- `components/` Shared UI components such as navigation, sigil rendering, audio controls, and signup forms
- `public/` Static assets served by Next.js
- `scripts/` Utility scripts used during asset preparation
- `proxy.ts` Request-time header and cache handling for ARG routes

## Routes

Public routes:

- `/`
- `/canon`
- `/canon/game`
- `/conduit`
- `/journey`
- `/relics`
- `/signal`

Legacy redirects (permanent):

- `/the-legend` → `/canon`
- `/shingo-today` → `/conduit`
- `/get-there` → `/journey`
- `/objects` → `/relics`
- `/walk` → `/journey`

Hidden routes (served with `noindex` and disabled caching):

- `/the-gate`
- `/axis`
- `/thin-place`

## Notable Implementation Details

- `app/api/transmissions/route.ts` accepts email signups and forwards them to Resend if `RESEND_API_KEY` and `RESEND_AUDIENCE_ID` are set.
- `proxy.ts` injects per-request headers for `/axis` so the page can vary on each request without using impure render-time randomness.
- The shared `Sigil` component renders the broken-circle symbol used throughout the site and supports the spiral-text ARG variant.

## Environment

Optional environment variables for transmission signup:

- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`

Without these, the signup flow still returns success to avoid breaking the front-end UX, but no contact is stored.

Optional environment variables for direct product links on `/objects`:

- `NEXT_PUBLIC_PRINTFUL_CARRIER_CAP_URL`
- `NEXT_PUBLIC_PRINTFUL_GATE_TEE_URL`
- `NEXT_PUBLIC_PRINTFUL_HERAI_HOODIE_URL`
- `NEXT_PUBLIC_PRINTFUL_THIN_PLACE_PRINT_URL`
- `NEXT_PUBLIC_PRINTFUL_FREQUENCY_PATCH_URL`

When these are set, the corresponding object card links out directly to the configured Printful product page. If omitted, the UI shows that the Printful link is still pending.

Optional environment variables for API-based Printful catalog creation:

- `PRINTFUL_API_TOKEN`
- `PRINTFUL_VARIANT_ID_CARRIER_CAP`
- `PRINTFUL_FILE_URL_CARRIER_CAP`
- `PRINTFUL_VARIANT_ID_GATE_TEE`
- `PRINTFUL_FILE_URL_GATE_TEE`
- `PRINTFUL_VARIANT_ID_HERAI_HOODIE`
- `PRINTFUL_FILE_URL_HERAI_HOODIE`
- `PRINTFUL_VARIANT_ID_THIN_PLACE_PRINT`
- `PRINTFUL_FILE_URL_THIN_PLACE_PRINT`
- `PRINTFUL_PRICE_USD_THIN_PLACE_PRINT`
- `PRINTFUL_POSTER_ASSET_PATH`

These are used by `POST /api/printful/catalog` with a JSON body like `{ "id": "carrier-cap" }` to create configured Printful products for the ready catalog items.

Important: `npm run create:printful-merch` now validates the actual Printful variant metadata against SKU rules and skips mismatches by default. Use `npm run printful:inspect -- catalog` and `npm run printful:inspect -- catalog-variants <productId>` to source correct variant IDs first.

Poster-specific route notes for `POST /api/printful/japanese-jesus-poster`:

- `PRINTFUL_VARIANT_ID_THIN_PLACE_PRINT` must be the real 50×70 cm poster variant, not the sample `10760` doc variant.
- `PRINTFUL_PRICE_USD_THIN_PLACE_PRINT` overrides the poster retail price in USD; otherwise the route uses the catalog price.
- `PRINTFUL_POSTER_SOURCE_PATH` is the raw local art used to generate the Printful-ready export.
- `PRINTFUL_POSTER_ASSET_PATH` is the generated local PNG used by the poster route; it must be 5:7 and at least `2953x4134` to meet the 50×70 cm target at 150 DPI.
- `PRINTFUL_POSTER_PROOF_PATH` is a smaller preview image generated from the same crop so you can inspect composition quickly.
- Copy [.env.local.example](/Users/mkultraman/Desktop/Japanese%20Jesus/.env.local.example) to `.env.local`, then run `npm run export:printful-poster` to generate both the full export and proof image, and `npm run check:printful-poster` before calling the poster API route.

## Assets

Several committed visuals are placeholder SVGs. The intended production experience also references audio and image assets that are not currently present in `public/`.

The detailed status list is in [docs/project-audit.md](docs/project-audit.md).

## Repository Notes

- Main working branch in this repo: `claude/build-japanese-jesus-site-MIIzP`
- Production deployment is intended for Vercel
- Root-level untracked media files currently exist in the working tree; review them before committing
