# Project Audit

This is the current completion checklist for the repo as it exists locally.

## Code And Runtime

- [x] Public pages are implemented in `app/`
- [x] Hidden ARG routes exist and are marked `noindex`
- [x] `/axis` now varies by request without render-time `Math.random()`
- [x] `npm run build` succeeds in the local environment
- [x] Font loading now uses `next/font/google` in `app/layout.tsx`

## Content And Documentation

- [x] Core project README now reflects the real app instead of the default template
- [ ] `CLAUDE.md` still describes the project as Next.js 15, while `package.json` is now on Next.js 16
- [ ] Public-facing copy should be reviewed for factual claims versus intentional myth/ARG framing before production launch

## Assets

- [ ] Hero art is still using `public/images/hero.svg`; production brief expects a final image asset
- [ ] `public/images/gate-aerial.svg` is present, but the project brief still treats the final gate image as pending
- [ ] `public/images/shingo-village.svg` and `public/images/tomb.svg` are still placeholder-style illustrations rather than confirmed production photography
- [ ] `public/audio/drone.mp3` is referenced by `components/AudioPlayer.tsx` but is missing
- [ ] `public/audio/transmission_00.wav` is referenced by `app/thin-place/page.tsx` but is missing
- [ ] Untracked media files in the repo root and `Images/` need triage so the correct production assets are either moved into `public/` or ignored explicitly

## Backend And Integrations

- [ ] Transmission signup is only partially wired: it posts to Resend if env vars exist, but there is no persistence fallback, admin view, or explicit error handling
- [ ] The Resend call in `app/api/transmissions/route.ts` does not check the upstream response status before returning `{ ok: true }`
- [ ] The objects page is static only; no Stripe checkout, Printful fulfillment, or product data integration exists yet
- [ ] Email handling for `keeper@japanesejesus.com` is outside the repo and still needs operational confirmation

## Launch Cleanup

- [x] Run `npm run build` and verify the Vercel production build path
- [ ] Replace remaining placeholder assets with final approved media
- [ ] Decide which untracked local media files belong in source control
- [ ] Confirm `.gitignore` rules still match the intended private/public asset split
- [ ] Document the required Vercel environment variables in deployment notes if this will be handed to another developer
