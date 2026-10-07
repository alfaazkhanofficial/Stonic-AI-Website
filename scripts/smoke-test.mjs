#!/usr/bin/env node
// Production smoke test. Usage: BASE_URL=https://example.com node scripts/smoke-test.mjs
// Optional admin check: ADMIN_USERNAME / ADMIN_PASSWORD (and ADMIN_TOTP_CODE) to verify login + logout.
const STATIC = process.env.STATIC === "1"; // static build: no admin, health or media routes
const base = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
let failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  " + extra : ""}`);
  if (!ok) failed++;
};
const get = (p, init) => fetch(base + p, { redirect: "manual", ...init });

const pages = [
  "/",
  "/product",
  "/capabilities",
  "/agents",
  "/ecosystem",
  "/gen-1",
  "/download",
  "/roadmap",
  "/documentation",
  "/security",
  "/support",
  "/privacy",
  "/terms",
  "/license",
];
for (const p of pages) {
  const r = await get(p);
  check(`GET ${p} → 200`, r.status === 200, String(r.status));
}

const home = await get("/");
const html = await home.text();
check("home has one <h1>", (html.match(/<h1[\s>]/g) ?? []).length === 1);
check("home has <title>", /<title>[^<]+<\/title>/.test(html));
for (const h of [
  "content-security-policy",
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "permissions-policy",
])
  check(`header ${h}`, home.headers.has(h));
check("no x-powered-by", !home.headers.has("x-powered-by"));

check("GET /nope → 404", (await get("/nope")).status === 404);
check("robots.txt", (await get("/robots.txt")).status === 200);
check("sitemap.xml", (await get("/sitemap.xml")).status === 200);
if (!STATIC) check("health", (await get("/api/health")).status === 200);
check("opengraph image", (await get("/opengraph-image")).status === 200);

if (!STATIC) {
  const dash = await get("/admin/dashboard");
  check(
    "unauthenticated /admin/dashboard is not served",
    dash.status >= 300 && dash.status < 400,
    String(dash.status),
  );
  check("admin sends noindex", /noindex/i.test(dash.headers.get("x-robots-tag") ?? ""));
  const login = await get("/admin/login");
  check("/admin/login → 200", login.status === 200);
  check(
    "media traversal rejected",
    [400, 404].includes((await get("/media/..%2f..%2fetc%2fpasswd")).status),
  );
  check("media unknown → 404", (await get("/media/missing.png")).status === 404);
}

console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
