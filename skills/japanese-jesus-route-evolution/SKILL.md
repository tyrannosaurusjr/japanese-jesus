---
name: japanese-jesus-route-evolution
description: Use this when adding, restructuring, renaming, or redirecting Japanese Jesus routes, including preserving the documented narrative information architecture, maintaining legacy aliases, and keeping route purpose aligned with the site's canon, conduit, journey, relic, and signal hub model.
metadata:
  short-description: Evolve site routes without breaking narrative structure
---

# Japanese Jesus Route Evolution

Use this skill when changing site structure at the route level.

This site’s URLs are part of the product. Route changes affect narrative clarity, legacy compatibility, and discoverability.

## Load This Context First

Read these files before changing routes:

- `docs/site-architecture.md`
- `README.md`
- `app/` files for the routes directly involved

## What This Skill Covers

Use this skill when:

- adding a new page
- converting a legacy page into a hub-aligned page
- adding redirects or aliases
- changing route-level metadata or structure
- reorganizing content across `/canon`, `/conduit`, `/journey`, `/relics`, and `/signal`

Do not use this skill for simple copy edits that do not affect route purpose.

## Core Rule

Keep the route map coherent with the documented narrative system.

The route should not only render. It should do the right job in the story architecture.

## Canonical Hubs

The public structure is organized around:

- `/`
- `/canon`
- `/conduit`
- `/journey`
- `/relics`
- `/signal`

New route work should reinforce those hubs rather than fragment them unnecessarily.

## Legacy Alias Rule

Legacy public URLs may still exist for continuity. If they remain, they should align with the newer hub model instead of drifting into a second content architecture.

Preserve the documented alias relationships unless there is an intentional migration plan.

## Route Design Standard

Before adding a route, answer:

1. is this a true new destination or just a section that belongs inside an existing hub
2. what role does this route play in the narrative system
3. does it require indexing, redirecting, or hidden-route treatment

If the answer is unclear, do not create route sprawl.

## Metadata And Discoverability

For public routes:

- keep titles and metadata aligned with route purpose
- avoid mismatched descriptions carried over from replaced pages

For hidden routes:

- preserve isolation and `noindex` expectations
- do not pull them into the public architecture accidentally

## Common Failure Modes

Avoid:

- creating overlapping pages that compete with existing hubs
- leaving legacy pages with stale framing after hub shifts
- adding redirects without checking the documented route plan
- turning hidden routes into normal content pages

## Review Standard

When reviewing route changes, check:

- whether the route map is simpler or more fragmented
- whether legacy behavior still makes sense
- whether metadata and purpose match
- whether the site architecture docs should be updated too
