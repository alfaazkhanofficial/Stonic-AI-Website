# Implementation Decisions

Recorded per the spec pack (DESIGN_SYSTEM.md, DEPLOYMENT_SPEC.md).

| Area              | Decision                                                                                                                                                             | Why                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Framework         | Next.js (App Router) + React + TypeScript (strict)                                                                                                                   | Server rendering for SEO, server actions/routes for the admin, one codebase                            |
| Hosting           | Docker container on a host with a persistent volume (Fly.io template). Supersedes the earlier Vercel proposal                                                        | Admin stores content and uploads on disk, which serverless hosts cannot persist                        |
| Environments      | `APP_ENV` = development / preview / production                                                                                                                       | Non-production is always `noindex` and `Disallow: /`                                                   |
| CI                | GitHub Actions: lint, typecheck, test, build, `npm audit`, Docker build                                                                                              | DEPLOYMENT_SPEC pipeline                                                                               |
| Typography        | Inter (UI/display) + JetBrains Mono (labels), self-hosted via Fontsource                                                                                             | No third-party font requests; strict CSP                                                               |
| Brand             | Official STONIC AI logo pack (Oct 5 2026); electric blue + silver on near-black                                                                                      | Matches the identity board; tokens live in `src/styles/globals.css`                                    |
| Admin             | Single admin; scrypt hash in env; HMAC-signed httpOnly SameSite=Strict session (8h); optional TOTP; file-based store (`DATA_DIR/site.json`); plain-text content only | Simplest secure real system; no database or third-party service                                        |
| CSP               | `script-src 'unsafe-inline'` (no nonce)                                                                                                                              | Next.js inline bootstrap; all else same-origin. Revisit with nonces if untrusted HTML is ever rendered |
| Rate limit        | In-memory, per instance (5 fails/15 min/IP, 25 global)                                                                                                               | Run one instance; use a shared store to scale out                                                      |
| Capability claims | Single source `src/content/capabilities.ts`; default "Planned for Gen 1"                                                                                             | Never claim what is not verified                                                                       |

## Secrets

No secrets exist in this repo. `.env*` is git-ignored except `.env.example`. Private values never use `NEXT_PUBLIC_*`.
