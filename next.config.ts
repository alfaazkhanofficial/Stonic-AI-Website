import type { NextConfig } from "next";
import { securityHeaders } from "./security-headers.mjs";

const isProd = process.env.NODE_ENV === "production";
const secure = (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https:");
// DEPLOY_TARGET=static builds the free static-hosting version (see docs/FREE_DEPLOYMENT.md).
const isStatic = process.env.DEPLOY_TARGET === "static";

const serverConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  experimental: { serverActions: { bodySizeLimit: "45mb" } },
  async headers() {
    const base = securityHeaders({ secure, dev: !isProd });
    return [
      { source: "/:path*", headers: base },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

// Static export has no server: headers are emitted to out/_headers by scripts/build-static.mjs instead.
const staticConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  images: { unoptimized: true },
};

export default isStatic ? staticConfig : serverConfig;
