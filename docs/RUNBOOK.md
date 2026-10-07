# Runbook

## Rollback

`fly releases` → `fly deploy --image <previous image ref>` (or `fly machine update --image ...`). Content/uploads are on the volume and are unaffected. Verify with the smoke test.

## Rotate admin credentials / suspected compromise

1. `node scripts/gen-admin-credentials.mjs --totp`
2. `fly secrets set ADMIN_PASSWORD_HASH=... SESSION_SECRET=... ADMIN_TOTP_SECRET=... ADMIN_SESSION_VERSION=<n+1>` (rolls machines; every existing session is invalid).
3. Review recent content/media in the admin for tampering; restore from a volume snapshot if needed.

## Locked out of admin

Rate limit is in memory: `fly machine restart` clears it. Lost authenticator: unset `ADMIN_TOTP_SECRET`, sign in, then generate a new one.

## Health & monitoring

`/api/health` is checked by the platform every 30s. Add an external uptime monitor on the same URL. Errors are logged to stdout (`fly logs`). Add an error tracker (e.g. Sentry) if desired; no third-party scripts are loaded by default.

## Dependency hygiene

CI fails on high-severity `npm audit` findings. Update monthly: `npm update && npm run check`.
