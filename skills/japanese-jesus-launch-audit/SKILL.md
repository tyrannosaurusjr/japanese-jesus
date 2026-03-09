---
name: japanese-jesus-launch-audit
description: Use this when checking Japanese Jesus for release readiness, including build and lint verification, environment-variable documentation, redirect and hidden-route sanity checks, placeholder asset review, factual-copy risk review, and pre-handoff deployment cleanup.
metadata:
  short-description: Run Japanese Jesus launch-readiness checks
---

# Japanese Jesus Launch Audit

Use this skill for release-readiness and handoff checks.

The main goal is to catch drift between the intended launch state and the current repo state before deployment or handoff.

## Load This Context First

Read these files before starting:

- `README.md`
- `docs/project-audit.md`
- `docs/site-architecture.md`
- `CLAUDE.md`

Then inspect only the code or config files needed for the specific checklist items you are validating.

## What This Skill Covers

Use this skill when:

- preparing for launch
- auditing the repo before a handoff
- checking whether documented behavior matches the code
- validating that critical missing pieces are identified clearly

Do not use this skill for feature implementation unless the task is explicitly an audit or cleanup pass.

## Audit Priorities

Check the project in this order:

1. runtime health
2. asset completeness
3. content and factual safety
4. integration readiness
5. deployment and handoff clarity

## Runtime Health

Confirm:

- the app builds
- lint remains usable
- redirects or route aliases still match the documented architecture
- hidden routes still preserve intended metadata and isolation

## Asset Completeness

Confirm:

- production-critical images are not still placeholder-only by accident
- referenced audio files exist
- root-level media has been triaged intentionally
- `.gitignore` still reflects the intended private/public split

## Content And Factual Safety

Review public-facing copy for:

- statements that read as factual but are unsourced
- myth framed as civic fact
- route copy that conflicts with the documented route purpose

Treat `docs/editorial-boundaries.md` and `docs/site-architecture.md` as the standard.

## Integration Readiness

Confirm whether:

- transmission intake is truthfully wired
- Printful/product paths are production-ready or intentionally partial
- environment variables required for deployment are documented

Do not describe an integration as “done” if the UI merely degrades gracefully.

## Documentation Drift

Check for stale statements in:

- version claims
- route descriptions
- deployment assumptions
- setup instructions

If the code has moved, the docs should move too.

## Output Standard

When delivering an audit:

- list concrete findings first
- cite file paths
- separate confirmed issues from assumptions
- distinguish blockers from polish items

If no issues are found, say so explicitly and name any residual risks.

## Common Failure Modes

Avoid:

- calling the app launch-ready because it builds while obvious assets are missing
- ignoring doc drift because the runtime still works
- treating degraded fallback behavior as production completion
- mixing speculative issues with verified findings
