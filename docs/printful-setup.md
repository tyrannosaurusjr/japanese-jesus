# Printful Setup

This file is the current product setup brief for the `/objects` catalog.

It does not create products automatically. It is the spec to use when creating them in Printful, either manually in the dashboard or later through an API integration.

## Current Catalog

### 1. Rift Signal Cap

- Site SKU: `carrier-cap`
- Printful fit: embroidered structured cap or embroidered snapback
- Decoration: front embroidery only
- Recommendation: upload a high-resolution PNG of the sigil in a single vermilion thread color on a black hat
- Status: ready to create
- Source: [Custom hats overview](https://www.printful.com/design-your-own-hat/a/abls), [Snapback Trucker Cap | Richardson 112](https://www.printful.com/custom/embroidered/trucker-hats/snapback-trucker-cap-richardson-112), [Closed-Back Structured Cap | Flexfit 6277](https://www.printful.com/custom/hats-embroidery/140/flexfit-6277-structured-twill-cap)

### 2. Portal Lantern Tee

- Site SKU: `gate-tee`
- Printful fit: oversized or garment-dyed t-shirt
- Decoration: front print plus small back detail
- Recommendation: use the sigil as the front print and add the coordinates as a small back print placement
- Status: ready to create
- Source: [Oversized Faded T-Shirt | AS Colour 5082](https://www.printful.com/custom/mens/embroidered-shirts/oversized-faded-t-shirt-ascolour-5082), [Unisex Oversized Garment-Dyed T-Shirt | Bella + Canvas 4810](https://www.printful.com/custom/mens/all/unisex-oversized-garment-dyed-t-shirt-bella-canvas-4810)

### 3. Herai Threshold Hoodie

- Site SKU: `herai-hoodie`
- Printful fit: pullover hoodie
- Decoration: chest and back, using print, embroidery, or a mix
- Recommendation: chest sigil on the front, `HERAI` on the back
- Status: ready to create
- Source: [Custom Hoodies](https://www.printful.com/custom-hoodies), [Unisex Pullover Hoodie | Bella + Canvas 3719](https://www.printful.com/custom/mens/hoodies/unisex-pullover-hoodie-bella-canvas-3719)

### 4. Japanese Jesus Poster

- Site SKU: `thin-place-print`
- Printful fit: matte poster
- Decoration: full poster print
- Recommendation: use a matte poster whose aspect ratio matches the final production raster for the seated Japanese Jesus hero art
- API note: do not use the Printful sample variant ID (`10760`) for production; use the real unframed poster variant ID that matches the final chosen size
- Asset note: the current source artwork is the seated Japanese Jesus hero image and should be exported as a Printful-safe PNG sized for the exact poster variant selected
- Local pipeline: set `PRINTFUL_POSTER_SOURCE_PATH`, run `npm run export:printful-poster` to generate both the Printful-ready PNG and a smaller proof image, then run `npm run check:printful-poster` before the creation route
- Status: ready to create
- Source: [Custom posters](https://www.printful.com/fr/posters-personnalises)

### 5. Keeper Card

- Site SKU: `keeper-card`
- Printful fit: none for public storefront use
- Recommendation: do not create this as a live storefront product
- Status: intentionally excluded

### 6. Static Conduit Patch

- Site SKU: `frequency-patch`
- Printful fit: embroidered patch
- Decoration: embroidery
- Recommendation: use the nearest supported patch shape and size since the site copy's 8×8 cm spec is not a direct Printful stock size
- Status: manual decision required
- Source: [Custom patches](https://www.printful.com/custom-patches), [Embroidered patches](https://www.printful.com/uk/custom/collections/embroidery/embroidered-patches)

## Important Constraints

- Printful digitizes embroidery files itself. Reuse is supported only within Printful by product type and embroidery type.
- New embroidery files usually incur a digitization fee unless you hit the free digitization threshold.
- Hats and wall art have packaging limitations under Printful branding presets.
- The patch product line uses fixed supported shapes and sizes, not arbitrary dimensions.

Sources:

- [Embroidery digitization file policy](https://help.printful.com/hc/en-us/articles/360014007500-Can-I-use-my-own-digitized-file-for-embroidery)
- [Digitization and adjustment fees](https://help.printful.com/hc/en-us/articles/360014009540-What-are-digitization-and-adjustment-fees-for-embroidery)
- [Branding preset limitations](https://help.printful.com/hc/en-us/articles/4853272440476-Can-branding-presets-be-used-for-all-Printful-products)

## What Still Needs To Happen

- Build or source the actual production artwork files for each product
- Create the products in the Printful dashboard (or verify the API token's catalog actually contains the required product families and sizes before API creation)
- Save the resulting product URLs or sync IDs
- Replace the dead storefront CTA behavior with real links or checkout flow
- Decide whether checkout will be direct Printful storefront links or a Stripe-backed custom flow
