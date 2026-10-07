# Security Specification

Minimize public endpoints.

Admin requires authentication, authorization, secure cookies, expiration, logout, rate limiting and noindex.

Use appropriate production headers including CSP where compatible, HSTS, X-Content-Type-Options, Referrer-Policy and Permissions-Policy.

Lock dependencies and run vulnerability checks.

Sanitize rich admin content.

Never expose secrets in Git, client bundles, HTML, public storage or logs.

Document credential rotation and rollback.
