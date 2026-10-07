# Deployment Specification

## Environments
Development → Preview/Staging → Production.

## Pipeline
1. Push approved code.
2. Run lint/type checks/tests.
3. Build production artifact.
4. Run security/configuration checks.
5. Deploy preview/staging.
6. Human review.
7. Promote approved build to production.
8. Run production smoke tests.
9. Record release.
10. Keep rollback available.

## Production
- Official custom STONIC domain.
- HTTPS mandatory.
- Canonical host and redirects configured.
- Production environment variables/secrets configured.
- Monitoring enabled.

## Secrets
Store only in the deployment provider's secure secret manager. Never commit .env files containing secrets. Never expose private values through public frontend variables such as NEXT_PUBLIC_* or VITE_*.

Potential secrets include admin/auth secrets, session secrets, database/storage credentials and private API keys.

## Admin production verification
- /admin/login works.
- Unauthorized requests are rejected.
- Authorized login works.
- Logout works.
- Session expiry works.
- Rate limiting works.
- Admin is not indexed.

## SEO
Titles, descriptions, canonical URLs, sitemap, robots, OG metadata and appropriate structured data.

## QA
Responsive layouts, browser compatibility, accessibility, performance, security, media loading, CTAs, download links, legal pages, monitoring and rollback.

## Deployment provider
Provider is intentionally not hardcoded here. Select the best production host during implementation based on the final stack, reliability, cost, performance and deployment needs, then record the decision in this pack.
