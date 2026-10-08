# Vercel setup (free) — site + admin login + GitHub-backed storage

How it works: public pages are static and fast. The admin (login, credentials) runs on Vercel and saves every change by **committing it to your GitHub repo**; Vercel then redeploys automatically (about a minute). No database, no paid service.

## 1. GitHub token (lets the admin commit)

GitHub → your avatar → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.

- Repository access: **Only select repositories** → pick the website repo.
- Permissions → Repository → **Contents: Read and write** (nothing else).
- Expiration: 1 year (put a reminder in your calendar to renew it).
  Copy the token once. Never commit it.

## 2. Vercel → Project → Settings → Environment Variables (Production)

| Name                   | Value                                                          |
| ---------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | your live https address, e.g. `https://yourproject.vercel.app` |
| `APP_ENV`              | `production`                                                   |
| `STORAGE`              | `github`                                                       |
| `GITHUB_TOKEN`         | the token from step 1                                          |
| `GITHUB_REPO`          | `your-username/your-repo`                                      |
| `GITHUB_BRANCH`        | `main`                                                         |
| `ADMIN_USERNAME`       | from `node scripts/gen-admin-credentials.mjs --totp`           |
| `ADMIN_PASSWORD_HASH`  | from the same command (keep the whole value)                   |
| `SESSION_SECRET`       | from the same command                                          |
| `ADMIN_TOTP_SECRET`    | from the same command (optional two-factor)                    |

Build settings: leave the defaults (**Build command `npm run build`**, framework Next.js). Do **not** use `build:static` here: that mode has no admin.

For Preview deployments set `APP_ENV=preview` so test versions are never indexed.

## 3. Redeploy, then sign in

Deployments → ⋯ → **Redeploy** (variables only apply after a redeploy). Open `https://YOUR-SITE/admin/login`, sign in with the username, password and the 6-digit code from your authenticator app.

## 4. What you can do in the admin

- **Settings:** contact/support email (turns on the Contact form), site name, release stage.
- **Content:** announcement banner, external download links, SEO.
- **Media:** upload screenshots and recordings (PNG, JPG, WebP, AVIF, GIF up to 8 MB; MP4, WebM up to 40 MB). Each change becomes a Git commit and goes live after the redeploy.
- **Dashboard:** shows whether an installer and screenshots were detected.

## 5. Publishing the installer (turns the Download button on)

The Download buttons are greyed until an installer exists. Two ways:

1. **Put the file in `public/media/`** in the repo (GitHub → Add file → Upload files, or `git push`). Name it with the version, e.g. `STONIC-Setup-1.0.0.exe`. Accepted: `.exe .msi .dmg .pkg .zip .deb .rpm .AppImage`. The build detects it, reads the version from the name, computes its SHA-256 and enables the buttons.
2. **Large installers:** GitHub's web upload allows ~25 MB per file and Git allows 100 MB. For bigger files, create a **GitHub Release** (free, up to 2 GB per file), then paste its https link in Admin → Content → Download links. External links also enable the buttons (no checksum is shown for them).

## 6. Limits to know

- Vercel's free **Hobby** plan is for non-commercial use. Check Vercel's terms for a product site, or use Cloudflare Pages (`docs/FREE_DEPLOYMENT.md`, no admin) / any host with `STORAGE=github`.
- One admin, one rate limiter in memory (5 failed logins / 15 minutes / IP).
- Rotate credentials: run the generator again, update the three variables, and change `ADMIN_SESSION_VERSION` to sign everyone out.
