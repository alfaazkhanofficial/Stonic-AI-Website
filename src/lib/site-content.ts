import { promises as fs } from "node:fs";
import path from "node:path";
import { connection } from "next/server";
import { STATIC_CONTENT } from "../content/site";
import { dataDir, isStaticTarget } from "./env";

export type DownloadLink = { label: string; platform: string; url: string };

export type SiteContent = {
  updatedAt: string | null;
  announcement: { enabled: boolean; text: string; href: string };
  downloads: { version: string; releaseDate: string; notes: string; links: DownloadLink[] };
  seo: { title: string; description: string };
  settings: { siteName: string; supportEmail: string; releaseStage: "in-development" | "released" };
  featuredMedia: string[];
};

export const DEFAULT_CONTENT: SiteContent = {
  updatedAt: null,
  announcement: { enabled: false, text: "", href: "" },
  downloads: { version: "", releaseDate: "", notes: "", links: [] },
  seo: {
    title: "STONIC AI — Your computer is about to become intelligent",
    description:
      "STONIC Gen 1 is a personal AI that doesn't stop at answering. It plans, acts, observes and verifies.",
  },
  settings: { siteName: "STONIC AI", supportEmail: "", releaseStage: "in-development" },
  featuredMedia: [],
};

const clean = (v: unknown, max: number): string =>
  typeof v === "string"
    ? v
        .replace(/\p{Cc}/gu, " ")
        .trim()
        .slice(0, max)
    : "";

/** Only https URLs or site-relative paths. Blocks javascript:, data:, protocol-relative, etc. */
export function safeUrl(v: unknown): string {
  const s = clean(v, 500);
  if (!s) return "";
  if (s.startsWith("/") && !s.startsWith("//") && !s.includes("\\")) return s;
  try {
    const u = new URL(s);
    return u.protocol === "https:" ? u.toString() : "";
  } catch {
    return "";
  }
}

export function safeEmail(v: unknown): string {
  const s = clean(v, 200);
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(s) ? s : "";
}

const MEDIA_NAME = /^[a-z0-9][a-z0-9._-]{0,120}\.(png|jpe?g|webp|avif|gif|mp4|webm)$/;
export const isMediaName = (s: string) => MEDIA_NAME.test(s);

/** Normalises untrusted/partial input into a valid SiteContent. Plain text only (React escapes on render). */
export function sanitizeContent(input: unknown): SiteContent {
  const r = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const obj = (k: string) =>
    (r[k] && typeof r[k] === "object" ? r[k] : {}) as Record<string, unknown>;
  const a = obj("announcement");
  const d = obj("downloads");
  const s = obj("seo");
  const st = obj("settings");
  const links = Array.isArray(d.links) ? d.links : [];
  return {
    updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : null,
    announcement: {
      enabled: a.enabled === true,
      text: clean(a.text, 160),
      href: safeUrl(a.href),
    },
    downloads: {
      version: clean(d.version, 40),
      releaseDate: clean(d.releaseDate, 40),
      notes: clean(d.notes, 600),
      links: links
        .slice(0, 8)
        .map((l) => {
          const x = (l && typeof l === "object" ? l : {}) as Record<string, unknown>;
          return {
            label: clean(x.label, 60),
            platform: clean(x.platform, 40),
            url: safeUrl(x.url),
          };
        })
        .filter((l) => l.label && l.url),
    },
    seo: {
      title: clean(s.title, 70) || DEFAULT_CONTENT.seo.title,
      description: clean(s.description, 200) || DEFAULT_CONTENT.seo.description,
    },
    settings: {
      siteName: clean(st.siteName, 40) || DEFAULT_CONTENT.settings.siteName,
      supportEmail: safeEmail(st.supportEmail),
      releaseStage: st.releaseStage === "released" ? "released" : "in-development",
    },
    featuredMedia: (Array.isArray(r.featuredMedia) ? r.featuredMedia : [])
      .filter((m): m is string => typeof m === "string" && isMediaName(m))
      .slice(0, 6),
  };
}

const file = () => path.join(dataDir(), "site.json");

export async function getContent(): Promise<SiteContent> {
  // Static (free-hosting) build: content is the file src/content/site.ts, baked in at build time.
  if (isStaticTarget) return sanitizeContent(STATIC_CONTENT);
  // Server build: opt out of prerendering so admin edits show up immediately.
  await connection();
  try {
    return sanitizeContent(JSON.parse(await fs.readFile(file(), "utf8")));
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function saveContent(next: SiteContent): Promise<void> {
  const value = sanitizeContent({ ...next, updatedAt: new Date().toISOString() });
  await fs.mkdir(dataDir(), { recursive: true });
  const tmp = `${file()}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), { mode: 0o600 });
  await fs.rename(tmp, file()); // atomic replace
}
