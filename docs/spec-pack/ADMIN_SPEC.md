# Admin / Content Management Specification

## Route
/admin/login is the primary private entry.

## Authentication
- Server-side authentication.
- Strong unique credential or stronger auth provider.
- Secret never hardcoded.
- Secret never committed to Git.
- Secure session cookies.
- Session expiration.
- Secure logout.
- Rate limiting/brute-force protection.
- MFA should be enabled when supported.

## Dashboard
Only expose verified, working features such as:
- site content
- media
- announcements
- download links
- basic SEO metadata
- site settings

No fake controls.

## Media
If uploads are implemented: authenticate, validate type/size, sanitize filenames, prevent executable uploads and use controlled storage.

## Indexing
Admin pages require authentication and noindex/robots protection.

## Credential procedure
1. Generate a strong unique admin credential.
2. Store it in the deployment platform's secret manager.
3. Never put it in code, Git or this Spec Pack.
4. Verify production login.
5. Verify unauthorized access is rejected.
6. Verify logout and rate limiting.

If credentials are lost, use the provider's secret-management/recovery process; never add a backdoor.
