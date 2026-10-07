# Free ($0) deployment — Cloudflare Pages

This repo has two build modes. **Nothing was removed** to support the free one.

|                                           | Server build (`npm run build`)                      | Free static build (`npm run build:static`)                      |
| ----------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------- |
| Hosting cost                              | Needs a paid host with a disk (see `DEPLOYMENT.md`) | **$0** (Cloudflare Pages free plan)                             |
| Pages, design, motion, SEO, accessibility | ✅                                                  | ✅ identical                                                    |
| Admin panel, uploads, sign-in, rate limit | ✅                                                  | ❌ not available (no server)                                    |
| How you change content                    | `/admin`                                            | edit `src/content/site.ts` + add files to `public/media/`       |
| Security headers                          | `next.config.ts`                                    | `out/_headers` (generated from the same `security-headers.mjs`) |

The admin code stays in the repo untouched. `build:static` moves the server-only files to `.static-stash/` while it builds and always moves them back.

## One-time setup

1. Create a GitHub account and a **private** repo; push this project.
2. Create a Cloudflare account (free). Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pick the repo.
3. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build:static`
   - Build output directory: `out`
4. Environment variables (Settings → Variables and Secrets):
   - Production: `NODE_VERSION=22`, `APP_ENV=production`, `NEXT_PUBLIC_SITE_URL=https://<your-project>.pages.dev`
   - Preview: `NODE_VERSION=22`, `APP_ENV=preview`, `NEXT_PUBLIC_SITE_URL=https://<your-project>.pages.dev`
     (Preview builds must stay `preview` so they are never indexed.)
5. Save and deploy. Your site is at `https://<your-project>.pages.dev`.

> The Cloudflare dashboard changes often. If the labels differ, look for "Pages" and "Connect to Git". **No-Git alternative:** run `npm run build:static` locally, then drag the `out` folder into Pages → Direct Upload, or run `npx wrangler pages deploy out`.

## Updating the site

- **Text/settings/download links/announcement:** edit `src/content/site.ts` (GitHub's web editor is fine). Commit → auto-redeploys in about a minute.
- **Real Gen 1 screenshots/recordings:** upload files into `public/media/`, then list the exact file names in `featuredMedia` in `site.ts`.
- **Capability status:** `src/content/capabilities.ts` (`"planned"` → `"available"`).
- **Release day:** in `site.ts` set `releaseStage: "released"`, fill `downloads` (https links only, e.g. GitHub Releases), commit.

## Verify a live deploy

`STATIC=1 BASE_URL=https://<your-project>.pages.dev node scripts/smoke-test.mjs` (all lines PASS, including the security headers).

## Rollback

Cloudflare Pages → your project → **Deployments** → pick an older deployment → **Rollback to this deployment**.

## Limits to know

- The address is `*.pages.dev`. A custom domain can be attached later (the domain itself costs money, Cloudflare hosting does not).
- Free-plan terms can change: check Cloudflare's pricing page before launch.
- To get the admin back later, deploy the server build on any host with a persistent disk (`DEPLOYMENT.md`); no code changes needed.
