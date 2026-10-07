#!/usr/bin/env node
// Builds the free static-hosting version into ./out (for Cloudflare Pages, GitHub Pages, Netlify).
//
// Nothing is deleted. The server-only parts (admin panel, media route, health route and their helpers) can't be
// part of a static export, so they are moved to .static-stash/ for the duration of the build and ALWAYS moved
// back afterwards (also on Ctrl+C, on failure, and on the next run if a previous run was killed).
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { securityHeaders } from "../security-headers.mjs";

const STASH_DIR = ".static-stash";
const SERVER_ONLY = [
  "src/app/admin",
  "src/app/media",
  "src/app/api",
  "src/components/admin-form.tsx",
  "src/components/admin-shell.tsx",
  "src/lib/admin-session.ts",
  "src/lib/limiters.ts",
];

function restore() {
  if (!existsSync(STASH_DIR)) return;
  for (const p of SERVER_ONLY) {
    const stashed = join(STASH_DIR, p);
    if (existsSync(stashed) && !existsSync(p)) {
      mkdirSync(dirname(p), { recursive: true });
      renameSync(stashed, p);
    }
  }
  rmSync(STASH_DIR, { recursive: true, force: true });
}

function stash() {
  for (const p of SERVER_ONLY) {
    if (!existsSync(p)) continue;
    const target = join(STASH_DIR, p);
    mkdirSync(dirname(target), { recursive: true });
    renameSync(p, target);
  }
}

restore(); // self-heal if an earlier run was interrupted
process.on("SIGINT", () => {
  restore();
  process.exit(130);
});
process.on("SIGTERM", () => {
  restore();
  process.exit(143);
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const secure = siteUrl.startsWith("https:");
let code = 1;
try {
  stash();
  rmSync(".next", { recursive: true, force: true });
  rmSync("out", { recursive: true, force: true });
  const r = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      DEPLOY_TARGET: "static",
      APP_ENV: process.env.APP_ENV ?? "production",
      NEXT_PUBLIC_SITE_URL: siteUrl,
    },
  });
  code = r.status ?? 1;
  if (code === 0) {
    const lines = ["/*", ...securityHeaders({ secure }).map((h) => `  ${h.key}: ${h.value}`)];
    lines.push("", "/_next/static/*", "  Cache-Control: public, max-age=31536000, immutable");
    lines.push("", "/media/*", "  Cache-Control: public, max-age=3600");
    lines.push("", "/brand/*", "  Cache-Control: public, max-age=86400");
    writeFileSync(join("out", "_headers"), lines.join("\n") + "\n");
    console.log("\nStatic site ready in ./out  (includes _headers for security headers)");
  }
} finally {
  restore();
}
process.exit(code);
