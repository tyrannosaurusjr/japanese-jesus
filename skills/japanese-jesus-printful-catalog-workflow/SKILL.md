---
name: japanese-jesus-printful-catalog-workflow
description: Use this when changing the relic catalog's Printful setup, product configuration, catalog API routes, product environment variables, or poster asset pipeline for Japanese Jesus, including SKU mapping, route behavior, and export/check workflows for Printful-ready assets.
metadata:
  short-description: Manage the Japanese Jesus Printful product workflow
---

# Japanese Jesus Printful Catalog Workflow

Use this skill for product and Printful-related work in this repository.

The relic catalog is not a generic storefront. It combines atmospheric product copy with a partially manual Printful setup and some route-specific automation.

## Load This Context First

Read these files before making substantial changes:

- `README.md`
- `docs/printful-setup.md`
- `docs/project-audit.md`

Then inspect only the specific code paths involved:

- `lib/printful.ts`
- `lib/printful-catalog.ts`
- `lib/printful-poster.ts`
- `app/api/printful/*`
- `scripts/export-printful-poster.mjs`
- `scripts/check-printful-poster.mjs`

## What This Skill Covers

Use this skill when:

- editing the relic catalog’s product linkage
- wiring or revising Printful API routes
- changing SKU configuration or variant mapping
- adjusting Printful-related environment variable handling
- generating or validating the poster export/proof assets

Do not use this skill for generic page copy unless the task depends on product behavior.

## Product Model

Treat the site catalog and Printful catalog as separate layers:

1. site-facing object identity and copy
2. fulfillment-facing Printful product configuration

Do not assume a UI label change is harmless if it desynchronizes SKU or route logic.

## Source Of Truth

Use `docs/printful-setup.md` as the business spec unless the code clearly reflects a newer intentional change.

If the docs and code diverge:

- confirm whether the code is ahead of the docs
- preserve working runtime behavior
- prefer updating both rather than letting drift grow

## SKU And Route Discipline

- keep site SKU names stable unless a migration is intentional
- do not swap variant IDs across products
- keep route inputs, env vars, and UI references aligned
- avoid hardcoding product assumptions in multiple places when they belong in shared config

## Environment Variable Rules

Handle missing product configuration safely.

- do not crash the public UI when a direct product URL is absent
- expose pending or unavailable states intentionally
- validate required env vars before attempting API-side product creation
- fail with explicit API errors when a server-side creation path cannot run correctly

For public pages, degraded behavior is acceptable. Silent backend misconfiguration is not.

## Poster Workflow

The poster path is fragile and should remain deterministic.

Follow this order:

1. confirm source artwork path
2. generate the Printful-ready PNG and proof image
3. validate dimensions and aspect ratio
4. use the poster creation route only after validation

Do not skip the asset check step when changing poster logic.

## Asset Constraints

When touching poster generation:

- preserve the required aspect ratio for the selected product
- preserve the minimum effective resolution target
- keep proof generation aligned to the same crop logic as the full export
- avoid introducing lossy transformations that alter the production asset unintentionally

## API Route Standard

For Printful routes:

- validate required inputs early
- return explicit failure states
- do not report success if upstream creation failed
- keep product-specific branching easy to audit

If a route creates a remote product, the response must reflect real upstream success, not optimistic local success.

## Safe Change Pattern

When changing Printful behavior:

1. map the affected site SKU
2. map the required env vars
3. confirm the shared library path used by the API route
4. preserve the UI fallback state
5. verify the poster pipeline if the product is `thin-place-print`

## Common Failure Modes

Avoid:

- mixing up direct storefront links and API-created products
- using sample or placeholder variant IDs in production paths
- returning `ok: true` before upstream errors are checked
- changing file dimensions without updating validation logic
- drifting product copy and runtime configuration apart

## Review Standard

When reviewing product changes, check:

- whether the SKU mapping is still coherent
- whether missing env vars degrade safely
- whether poster export and validation still agree
- whether the API reports real failure states
