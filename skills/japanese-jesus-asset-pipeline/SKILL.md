---
name: japanese-jesus-asset-pipeline
description: Use this when sourcing, replacing, organizing, or validating Japanese Jesus media assets, including placeholder-to-production swaps, public image/audio placement, root-level media triage, clue-sensitive asset handling, and checks that referenced files exist in the expected public paths.
metadata:
  short-description: Manage Japanese Jesus media assets safely
---

# Japanese Jesus Asset Pipeline

Use this skill when working on media assets in this repository.

This project mixes production-facing assets, placeholder assets, untracked source media, and some clue-sensitive ARG media. Asset work here is operationally risky.

## Load This Context First

Read these files before making substantial asset changes:

- `README.md`
- `docs/project-audit.md`
- `CLAUDE.md` if the asset may intersect ARG behavior

Then inspect only the relevant component or page that references the asset.

## What This Skill Covers

Use this skill when:

- replacing placeholder imagery or audio
- moving approved files into `public/`
- triaging root-level or local media files
- checking whether referenced assets actually exist
- updating image/audio references in pages or components

Do not use this skill for purely textual content changes.

## Asset Classes

Treat assets as one of these classes:

1. public production asset
2. public placeholder asset
3. local candidate asset pending triage
4. private or clue-bearing source asset

Do not move files between those classes casually.

## Placement Rules

- assets served by the site belong under `public/`
- root-level media files should be treated as candidate inputs until reviewed
- private source material should stay out of public paths and out of commits when marked sensitive

If a file is referenced by the app but missing, fix the mismatch explicitly. Do not leave “temporary” broken references in place.

## Placeholder Replacement Workflow

When replacing a placeholder:

1. confirm the target route/component that uses it
2. confirm the new asset is actually approved for that slot
3. move or add it into the correct `public/` location
4. update the reference path if needed
5. verify the old placeholder is not still referenced elsewhere

## Audio Rules

Audio assets are easy to forget but user-visible when missing.

- confirm the referenced file exists at the expected path
- do not rename audio files without updating every code reference
- if an audio file may carry ARG signal data, treat it as clue-sensitive and coordinate with ARG guardrails

## Image Rules

- preserve aspect ratio expectations used by the page layout
- avoid replacing a raster with a different format if the rendering assumptions change
- keep hero and location images aligned with the visual role defined by the page

## Triage Standard

When reviewing untracked or root-level media:

- decide whether the file belongs in `public/`
- decide whether it should remain local-only
- decide whether it should be ignored explicitly

Do not commit ambiguous media just because it exists in the workspace.

## Common Failure Modes

Avoid:

- updating code references without moving the asset
- committing private source material to public paths
- replacing clue-bearing media as if it were decorative only
- leaving placeholder assets in production-critical slots without documenting it

## Review Standard

When reviewing asset work, check:

- whether every referenced file now exists
- whether the chosen asset class is correct
- whether any ARG-sensitive asset was handled safely
- whether placeholder drift was actually resolved rather than renamed
