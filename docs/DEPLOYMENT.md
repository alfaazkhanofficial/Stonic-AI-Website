# Deployment (server build, with admin)

> Want **$0 hosting**? Use `docs/FREE_DEPLOYMENT.md` (static build, no admin panel). This document is for the paid, full server build.

Target: any host that runs a Docker container with a **persistent volume** (Fly.io template included). The admin stores content and uploads on disk (`DATA_DIR`), so serverless/read-only hosts such as Vercel do not fit without changing the storage layer.

## Environments

| Env             | `APP_ENV`   | Indexed | Notes                       |
| --------------- | ----------- | ------- | --------------------------- |
| Local           | development | no      | `npm run dev`               |
| Preview/staging | preview     | no      | `Disallow: /` and `noindex` |
| Production      | production  | yes     | real domain, HTTPS          |

## First deploy (Fly.io)

1. `fly launch --no-deploy --copy-config` (edit `fly.toml`: unique `app`, real domain in both `NEXT_PUBLIC_SITE_URL` entries).
2. `fly volumes create stonic_data --size 1 --region <region>`
3. Generate admin credentials locally: `node scripts/gen-admin-credentials.mjs --totp`. Store the password in a password manager and set the secrets (never in files or Git):
   `fly secrets set ADMIN_USERNAME=... ADMIN_PASSWORD_HASH='...' SESSION_SECRET=... ADMIN_TOTP_SECRET=...`
4. `fly deploy` then `fly certs add your-domain` and point DNS as instructed. Confirm HTTPS.
5. `BASE_URL=https://your-domain node scripts/smoke-test.mjs`
6. In `/admin`: set support email, release stage, announcement. Upload real Gen 1 media when ready.

## Important constraints

- `NEXT_PUBLIC_SITE_URL` is baked into security headers at **build** time. Wrong value = wrong HSTS/CSP. Rebuild after changing it.
- Run **one** instance (in-memory login rate limit, single volume).
- Back up the volume (`fly volumes snapshots`); it holds all admin content and uploads.

## CI/CD

`.github/workflows/ci.yml` runs lint, typecheck, tests, build, `npm audit` and a Docker image build on every PR. Deploy from `main` manually (`fly deploy`) or add a deploy job using a scoped `FLY_API_TOKEN` stored as a GitHub secret.
