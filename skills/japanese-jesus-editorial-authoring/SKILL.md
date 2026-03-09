---
name: japanese-jesus-editorial-authoring
description: Use this when writing or revising public-facing content for the Japanese Jesus site, including homepage sections, canon pages, conduit field notes, journey copy, relic descriptions, and any editorial updates that must preserve the project's mythic voice while keeping factual claims sourceable and clearly separated from in-world interpretation.
metadata:
  short-description: Write on-brand Japanese Jesus editorial content
---

# Japanese Jesus Editorial Authoring

Use this skill for content work in this repository.

This site is not a generic blog. It is a public-facing narrative system with:

- strict route roles
- a deliberate mythic tone
- a hard boundary between fact and canon
- hidden ARG material that must not leak into normal copy

## Load This Context First

Read these files before drafting substantial copy:

- `docs/site-architecture.md`
- `docs/editorial-boundaries.md`
- `docs/content-roadmap.md` when expanding canon or conduit sections
- `docs/curated-references.md` when factual claims are involved
- `README.md` if the change touches public vs hidden route distinctions

Do not re-derive rules from scattered pages if these documents already define them.

## What This Skill Covers

Use this skill when:

- writing new copy for `app/page.tsx`
- revising `/canon`, `/conduit`, `/journey`, `/relics`, or `/signal`
- expanding legacy route content that should now align to the newer hub structure
- turning rough notes into publishable sections
- tightening tone, CTA language, or content hierarchy on public pages

Do not use this skill for:

- implementing hidden puzzle logic
- exposing ARG solution details in user-facing text
- changing integrations or backend behavior unless the task is mostly copy

## Core Editorial Model

Every piece of public-facing copy should fit one of these layers:

1. Fact
2. Interpretation
3. Canon

### Fact

Facts must be:

- real
- attributable
- sourceable
- written plainly

Use official and primary sources first. If a sentence could be read as a real-world claim, either support it with a real source or rewrite it so it is clearly interpretive.

### Interpretation

Interpretation can carry the site voice, but it must remain visibly interpretive.

Preferred framing:

- `In canon terms...`
- `The site treats this as...`
- `As a conduit reading...`
- `The pattern suggests...`

Avoid presenting invented conclusions as civic, geographic, or historical fact.

### Canon

Canon can be fully in-world, but only in clearly mythic containers such as:

- canon pages
- conduit readings
- signal analysis
- relic descriptions

Do not disguise canon as travel advice, municipal reference, or factual reporting.

## Route Intent

Match copy to the route's job.

### `/`

The homepage is the portal entry.

- establish the threshold myth quickly
- compress the canon rather than retelling all of it
- route users into Canon, Conduit, Journey, Relics, and Signal
- avoid making the homepage carry the whole narrative burden

### `/canon`

This is the canonical backbone.

- organize around the Four Epochs
- keep the sequence stable
- make each section feel like part of a living system, not a one-off article
- prefer explicit lore structure over vague mysticism

### `/conduit`

This grounds the myth in real geography.

- lead with Shingo as a real place
- use field-note language and local detail
- layer canon on top of grounded location facts
- avoid tomb-tourism framing

### `/journey`

This is the operational travel page.

- keep travel instructions practically useful
- preserve a threshold/approach mood
- write like a journey briefing, not a generic itinerary page

### `/relics`

This is the product catalog.

- describe products as artifacts, field gear, or recovered proof
- avoid generic ecommerce phrasing
- keep CTAs and captions on-brand without obscuring what the product is

### `/signal`

This is the clean signal intake.

- keep copy sparse and direct
- write like entering a live channel, not joining a newsletter

## Legacy Route Rule

Legacy routes should align to the newer hub framing:

- `/the-legend` maps to `/canon`
- `/shingo-today` maps to `/conduit`
- `/get-there` and `/walk` map to `/journey`
- `/objects` maps to `/relics`

If editing a legacy route that still exists, preserve compatibility while moving tone and structure toward the canonical hub model.

## Voice And Vocabulary

Prefer:

- threshold
- conduit
- seam
- signal
- field
- frontier
- static
- north
- memory
- residue

Avoid:

- sermons
- doctrine
- salvation
- devotional pilgrimage framing
- generic tourist attraction language
- merch-store boilerplate

The tone should feel:

- severe
- atmospheric
- legible

Do not make it so cryptic that a first-time visitor cannot understand what the page is offering.

## Source Workflow

For factual content:

1. Start with the source list in `docs/curated-references.md`.
2. Prefer official/primary sources.
3. Use secondary sources only for orientation or confirmation.
4. Keep facts plainly stated.
5. Add the mythic layer only after the factual layer is stable.

When sources are missing:

- reduce the factual specificity
- mark the statement as interpretation
- or stop and request sourcing rather than inventing certainty

## Safety Rules

- Never expose ARG puzzle solutions in public copy.
- Never move hidden-route mechanics into visible explanatory prose.
- Do not state invented statistics, civic details, or travel claims as fact.
- Do not let tone erase usability on journey, signup, or product pages.

## Output Patterns

Use these structures when drafting:

### Canon Section

- direct heading
- short signal brief
- grounded narrative expansion
- one geography or residue anchor
- one transition to the next epoch or supporting page

### Conduit Field Note

- real-world location fact
- interpretive frame
- canon extrapolation
- practical or geographic detail
- outbound/source-aware next step if the page supports links

### Journey Section

- practical transport or access point
- one atmospheric framing line
- concrete next step

### Relic Card Copy

- what the object is
- why it matters in the site myth
- concise CTA or availability state

## Editing Standard

When revising existing content:

- preserve route purpose first
- tighten copy before adding more copy
- remove duplicated myth phrases
- separate factual and in-world claims if they are blended
- keep headings and CTA labels clear enough to scan

If the current copy conflicts with `docs/site-architecture.md` or `docs/editorial-boundaries.md`, treat the docs as the source of truth.
