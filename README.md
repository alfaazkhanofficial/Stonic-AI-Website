# STONIC AI Website

Official website for STONIC Gen 1. Authoritative spec: `docs/spec-pack/`. Build phases: `docs/spec-pack/IMPLEMENTATION_ORDER.md`.

## Run

```bash
cp .env.example .env.local
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + test + build
```

## Structure

`src/app` routes · `src/components` · `src/sections` · `src/styles` · `src/content` · `src/lib` · `tests` · `public`

Status: Phases 0–10 built and verified locally. Phases 11–12 (live deploy, release gate) need a real host and domain: see `docs/DEPLOYMENT.md`, `docs/RUNBOOK.md`, `docs/RELEASE_CHECKLIST.md`, `docs/DECISIONS.md`.

## Releases and downloads

Put the installer and real UI screenshots into `public/media/` (see `docs/MEDIA_FOLDER.md`). Download buttons stay greyed until an installer exists. Release history: `src/content/releases.ts`.

## Vercel (free) with admin login

`docs/VERCEL_SETUP.md`: admin saves to your GitHub repo (`STORAGE=github`), Vercel redeploys.

## Free hosting ($0)

`npm run build:static` produces a static site in `out/` for Cloudflare Pages. Content is edited in `src/content/site.ts`. See `docs/FREE_DEPLOYMENT.md`. The admin panel remains in the codebase for the server build.

## Admin (server build)

Set credentials with `node scripts/gen-admin-credentials.mjs --totp`, then visit `/admin`. Smoke test: `BASE_URL=... node scripts/smoke-test.mjs`.
