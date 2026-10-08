import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";

const PATHS = [
  "",
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
  "/contact",
  "/privacy",
  "/terms",
  "/license",
];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((p) => ({
    url: `${siteUrl}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.6,
  }));
}
