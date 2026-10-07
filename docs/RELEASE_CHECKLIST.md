# Release checklist (status as of last build)

Legend: ✅ verified in this repo · 🔧 needs you / a live environment

## Visual

- ✅ Desktop (1440) and mobile (390) reviewed by screenshot; no horizontal overflow
- ✅ Correct logo/brand assets (official pack: lockup, symbol, favicons, share image)
- ✅ Typography consistent (Inter + JetBrains Mono, self-hosted)
- ✅ Animation: reduced-motion honoured; reveals are no-JS safe
- 🔧 Real-device pass on a physical phone and tablet
- 🔧 No placeholders: "Coming with Gen 1" media state and "docs arrive with Gen 1" are intentional status messages

## Functional

- ✅ Navigation, CTAs, 404, legal/support links, admin login/logout, content + media controls (browser e2e)
- ✅ Download page shows nothing downloadable until stage = Released and links exist
- ✅ Forms: none on the public site (support is by email, no data collected)

## Product integrity

- ✅ No fake STONIC UI; visuals are labelled concept illustrations
- ✅ Real-media section only renders uploaded files
- ✅ Every capability labelled; all default to "Planned for Gen 1"
- 🔧 Owner to verify each capability and flip status in `src/content/capabilities.ts`
- 🔧 Upload real Gen 1 screenshots/recordings (Phase 6)

## Performance

- ✅ Production build; no heavy JS libraries; lazy-loaded media; logo assets pre-sized
- 🔧 Run Lighthouse against the deployed URL and record scores

## SEO

- ✅ Per-page metadata, canonical, sitemap, robots (noindex outside production), OG image, JSON-LD
- 🔧 Submit sitemap in Search Console after launch

## Security

- ✅ Security headers (CSP, HSTS on https, frame/MIME/referrer/permissions policies)
- ✅ No secrets in client bundle (scan clean); admin protected; scrypt hashes; signed httpOnly SameSite=Strict session; optional TOTP; login rate limit; upload validation
- ✅ Accessibility: axe (WCAG 2.x A/AA + best practice), 0 violations on all pages, desktop + mobile
- 🔧 HTTPS/HSTS only observable on the real domain

## Free static deployment

- ✅ `build:static` verified: 14 pages + 404, sitemap, robots, OG image, `_headers`, content/media from `site.ts` and `public/media`, unsafe URLs and path-traversal names dropped
- 🔧 Connect Cloudflare Pages, set env vars, run `STATIC=1 BASE_URL=... node scripts/smoke-test.mjs` on the live URL
- ℹ️ Admin panel is not available on the static build by design

## Production

- ✅ CI pipeline, Dockerfile, Fly template, smoke-test script, runbook
- 🔧 Domain/DNS, first deploy, preview test, production smoke test, monitoring hookup
- 🔧 Rollback drill on the live host
- 🔧 Legal review of Privacy, Terms, License drafts
- 🔧 Set support email in admin
