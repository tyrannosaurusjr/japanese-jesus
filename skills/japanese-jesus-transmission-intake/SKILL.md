---
name: japanese-jesus-transmission-intake
description: Use this when changing the Japanese Jesus transmission signup flow, including frontend form behavior, popup messaging, the transmissions API route, Resend integration, environment-variable handling, and backend reliability or error-handling improvements that must not break the public intake UX.
metadata:
  short-description: Maintain the transmission signup and intake workflow
---

# Japanese Jesus Transmission Intake

Use this skill when working on the site’s email capture and transmission flow.

This path blends brand-sensitive UX with backend integration. The frontend should stay smooth, but the backend should not hide operational failures indefinitely.

## Load This Context First

Read these files before making substantial changes:

- `README.md`
- `docs/project-audit.md`

Then inspect the specific implementation files involved:

- `components/TransmissionForm.tsx`
- `components/TransmissionPopup.tsx`
- `app/api/transmissions/route.ts`

## What This Skill Covers

Use this skill when:

- revising signup form copy or states
- changing submission behavior
- improving Resend integration
- adding validation or error handling
- tightening the contract between the UI and the API route

Do not use this skill for unrelated newsletter or generic form work.

## Product Requirement

The site should continue to feel responsive and intentional even when the email backend is not fully configured.

That means:

- frontend UX should not become brittle
- backend responses should become more truthful and observable over time

Balance those requirements instead of optimizing only one.

## API Behavior Rule

The API route must distinguish between:

1. accepted by design without persistence
2. accepted and forwarded successfully
3. rejected because the request is invalid
4. failed because the upstream service failed

Do not collapse all four into unconditional success.

## Environment Variable Handling

If `RESEND_API_KEY` or `RESEND_AUDIENCE_ID` is missing:

- handle the path intentionally
- do not throw unhelpful server errors
- keep the frontend behavior aligned with the intended degraded mode

If credentials are present:

- validate the upstream response
- do not assume success without checking status and payload

## Frontend Contract

Keep the form and popup states simple and legible.

- users should understand whether submission completed
- loading and disabled states should prevent accidental duplicates
- copy can stay on-brand, but should not hide whether the action worked

Avoid overcomplicating the UX for a simple email capture flow.

## Validation Standard

Validate early and cheaply.

- reject clearly malformed input
- return concise error responses
- avoid leaking unnecessary implementation detail

If additional fields are added later, validation should scale cleanly rather than becoming ad hoc.

## Safe Change Pattern

When changing the intake flow:

1. inspect the current frontend submission path
2. inspect the API route contract
3. define the desired success and failure states
4. implement backend truthfulness
5. preserve a stable frontend experience

## Common Failure Modes

Avoid:

- optimistic success responses when upstream storage failed
- vague frontend messages that hide invalid input
- backend-only fixes that break the existing UI contract
- hard failures when env vars are intentionally absent in development

## Review Standard

When reviewing changes, check:

- whether the frontend still handles degraded mode gracefully
- whether the backend now reports real failure states
- whether upstream responses are actually inspected
- whether user-visible states still make sense
