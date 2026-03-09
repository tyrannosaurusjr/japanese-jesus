# Project Agents

This repository includes project-local Codex skills under `skills/`.

These skills are specific to Japanese Jesus. Keep them local to this repo rather than installing them globally unless they are intentionally being generalized.

## Local Skills

Use these skills when the task clearly matches the workflow below.

### `japanese-jesus-editorial-authoring`

Use for public-facing copy work:

- homepage sections
- canon, conduit, journey, relic, and signal pages
- route-aligned editorial rewrites
- factual-versus-canon framing

### `japanese-jesus-arg-guardrails`

Use for hidden puzzle work:

- `/the-gate`, `/axis`, `/thin-place`
- spoiler-sensitive UI
- clue-bearing assets
- robots, cache, or isolation rules for hidden routes

### `japanese-jesus-printful-catalog-workflow`

Use for relic catalog product plumbing:

- Printful routes
- SKU and variant mapping
- product env vars
- poster export and validation flow

### `japanese-jesus-transmission-intake`

Use for transmission signup changes:

- form behavior
- popup states
- `app/api/transmissions/route.ts`
- Resend integration and degraded-mode handling

### `japanese-jesus-asset-pipeline`

Use for media asset operations:

- placeholder replacement
- `public/` asset organization
- root-level media triage
- image/audio reference validation

If the asset may carry an ARG clue, also use `japanese-jesus-arg-guardrails`.

### `japanese-jesus-launch-audit`

Use for release-readiness and handoff checks:

- build/lint validation
- asset completeness
- factual-copy review
- integration readiness
- documentation drift

### `japanese-jesus-route-evolution`

Use for route structure changes:

- adding or reorganizing routes
- preserving hub roles
- maintaining legacy aliases and redirects
- aligning route purpose with the site architecture

### `japanese-jesus-brand-ui`

Use for visual and frontend presentation changes:

- shared components
- layout and hierarchy
- typography and color usage
- preserving the site’s specific visual language

## Coordination

Use the minimal set of skills needed for the task.

Common pairings:

- editorial page work with route changes: `japanese-jesus-editorial-authoring` + `japanese-jesus-route-evolution`
- hidden-route UI or asset changes: `japanese-jesus-arg-guardrails` + `japanese-jesus-brand-ui`
- product copy plus product wiring: `japanese-jesus-editorial-authoring` + `japanese-jesus-printful-catalog-workflow`
- asset swaps that touch clues: `japanese-jesus-asset-pipeline` + `japanese-jesus-arg-guardrails`

## Maintenance Rule

When adding new recurring workflows to this project, prefer adding or refining a repo-local skill under `skills/` instead of expanding these instructions into a long project manual.
