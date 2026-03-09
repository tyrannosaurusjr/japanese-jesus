---
name: japanese-jesus-arg-guardrails
description: Use this when changing hidden routes, puzzle-linked UI, spoiler-sensitive assets, or any code that could expose, break, or reframe the Japanese Jesus ARG, including noindex handling, cache behavior, clue-bearing media, and route-specific secrecy constraints.
metadata:
  short-description: Protect hidden ARG logic and spoiler boundaries
---

# Japanese Jesus ARG Guardrails

Use this skill when a task touches the hidden puzzle system.

This project includes a layered ARG embedded inside a public editorial site. The public site must stay usable without revealing the puzzle chain.

## Load This Context First

Read these files before making substantial ARG-related changes:

- `README.md`
- `CLAUDE.md`
- `docs/project-audit.md`

Read the relevant route/component files only after you know which layer the task affects.

## What This Skill Covers

Use this skill when:

- editing `/the-gate`, `/axis`, or `/thin-place`
- modifying `proxy.ts`
- changing `components/Sigil.tsx` when used for spiral or clue-bearing variants
- touching clue-linked audio or image references
- updating page metadata, cache, robots, or runtime behavior for hidden routes

Do not use this skill for normal public copy work unless the change directly intersects hidden routes.

## Core Rule

Protect two things at the same time:

1. puzzle integrity
2. public secrecy

It is not enough for the puzzle to still work. The public-facing surface must also avoid explaining the trick.

## Spoiler Boundary

Never place explicit puzzle solutions in:

- visible UI copy
- public documentation meant for content authors
- user-facing labels, helper text, or marketing copy

If puzzle logic must be documented, keep it in code comments or existing internal-only documentation patterns. Do not expand spoiler surface area casually.

## Hidden Route Rules

Hidden routes should remain clearly separated from indexed editorial pages.

- preserve `noindex` behavior
- preserve non-cacheable or per-request behavior where the route depends on it
- do not add internal links that make hidden routes part of normal navigation
- avoid introducing explanatory breadcrumbs, headings, or copy that turn the page into a public article

## Layer-Specific Expectations

### `/the-gate`

- keep the page sparse
- avoid adding explanatory text that decodes the clue
- preserve whatever visual encoding carries the layer transition

### `/axis`

- preserve request-varying behavior if the clue depends on it
- avoid render-time randomness that breaks Next.js constraints when headers or request data are the intended mechanism
- protect any subtle timing, variant, or spiral-text behavior from “cleanup” changes that make it too obvious

### `/thin-place`

- keep contrast, audio references, and hidden messaging behavior intentional
- do not make invisible or low-visibility clue material trivially obvious in normal viewing

## Asset Handling

Clue-bearing assets are fragile.

- do not recompress, optimize, or replace media casually if it may carry hidden data
- confirm whether an image or audio file is part of the puzzle before changing formats
- if replacing a placeholder with a final asset, preserve the embedded clue workflow rather than only matching the visible appearance

When unsure whether an asset is clue-bearing, stop and inspect the relevant docs before modifying it.

## Private Material Rule

Respect the project’s “never commit” boundaries.

- do not move private source material into `public/`
- do not surface private asset paths in code comments unless the repo already does so intentionally
- do not create new public references to solver operations, response templates, or spoiler logs

## Safe Change Pattern

When changing ARG code:

1. identify the affected layer
2. identify the delivery mechanism for the clue
3. preserve the clue channel
4. preserve secrecy
5. preserve route isolation from the public site

If you cannot verify all five, do not make a speculative cleanup.

## Common Failure Modes

Avoid these mistakes:

- “improving” hidden copy until it explains too much
- converting subtle clues into obvious labels
- adding caching to pages that rely on per-request variation
- stripping metadata or robots directives from hidden routes
- replacing assets without preserving embedded signal behavior
- moving hidden routes into standard nav structures

## Review Standard

When reviewing ARG-related changes, check:

- whether a first-time public visitor would learn too much
- whether the clue still survives the new code path
- whether caching or optimization changed clue delivery
- whether hidden pages still feel hidden

If a change improves code style but weakens puzzle integrity, reject the change.
