---
name: japanese-jesus-brand-ui
description: Use this when changing the Japanese Jesus front-end presentation, including shared components, page layouts, visual hierarchy, typography usage, color application, motion, and UI refinements that must preserve the site's severe, atmospheric, legible brand language instead of collapsing into generic modern web design.
metadata:
  short-description: Preserve the Japanese Jesus visual language in UI work
---

# Japanese Jesus Brand UI

Use this skill for visual and frontend presentation work.

The project’s value depends heavily on atmosphere. Generic “clean modern” UI changes can damage the product even when the code is technically correct.

## Load This Context First

Read these files before making substantial UI changes:

- `CLAUDE.md`
- `README.md`
- the specific page or component files you are changing
- `app/globals.css` and `app/layout.tsx` when the change affects site-wide styling

## What This Skill Covers

Use this skill when:

- changing shared UI components
- revising page section layout
- adjusting typography, spacing, color, or visual hierarchy
- updating CTAs, cards, navigation, or signal/relic presentation

Do not use this skill for backend-only work.

## Brand Standard

The UI should feel:

- severe
- atmospheric
- deliberate
- readable

Do not let it drift into:

- generic SaaS styling
- default Tailwind utility aesthetics
- playful or soft ecommerce polish

## Typography Rule

Preserve purposeful contrast between display and body styles.

- headings should feel ceremonial or declarative
- body text should remain legible
- labels and utility text should support the signal-system feel

If changing fonts or typographic hierarchy, check that the new result still feels specific to this site rather than interchangeable.

## Color Rule

Use the established palette intentionally.

- accents should reinforce signal, warning, threshold, or relic emphasis
- contrast should stay readable
- hidden or special states should not leak into ordinary UI use without reason

Do not flatten the palette into neutral defaults.

## Layout Rule

Prefer compositions that feel intentional and authored.

- section ordering should support the route’s narrative role
- whitespace should create tension and clarity, not emptiness for its own sake
- cards and content blocks should feel like artifacts, dossiers, or transmissions where appropriate

## Motion And Interaction

Use restraint.

- interactions can feel deliberate or uncanny
- avoid over-animated or trendy microinteraction clutter
- ensure hover and focus states stay readable and accessible

## Component Standard

When editing shared components:

- preserve the site’s visual language across pages
- avoid one-off styling that breaks cohesion
- keep component APIs simple unless the visual system genuinely needs new states

## Common Failure Modes

Avoid:

- replacing brand-specific styling with generic utility defaults
- making atmospheric sections unreadable
- letting relic or signal UI look like normal ecommerce widgets
- introducing visual inconsistency across shared components

## Review Standard

When reviewing UI changes, check:

- whether the page still feels like Japanese Jesus at a glance
- whether readability held up
- whether the route’s narrative role is clearer
- whether the shared component still fits the rest of the site
