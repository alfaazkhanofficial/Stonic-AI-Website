import { readFileSync, promises as fs } from "node:fs";
import path from "node:path";
import { connection } from "next/server";
import { STATIC_CONTENT } from "../content/site";
import { dataDir, isStaticTarget, storageMode } from "./env";
import { githubStore } from "./github-store";

export type DownloadLink = { label: string; platform: string; url: string };

export type SiteContent = {
  updatedAt: string | null;
  announcement: { enabled: boolean; text: string; href: string };
  downloads: { version: string; releaseDate: string; notes: string; links: DownloadLink[] };
  seo: { title: string; description: string };
  settings: { siteName: string; supportEmail: string; releaseStage: "in-development" | "released" };
  featuredMedia: string[];
  socials: { label: string; url: string }[];
  legal: { ownerName: string; governingLaw: string; effectiveDate: string };
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
  settings: { siteName: "STONIC AI", supportEmail: "", releaseStage: "released" },
  featuredMedia: [],
  socials: [],
  legal: { ownerName: "STONIC AI", governingLaw: "", effectiveDate: "October 8, 2026" },
};

const clean = (v: unknown, max: number): string =>
  typeof v === "string"
    ? v
        .replace(/[\u0000-\u001f\u007f]/g, " ")
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
  const lg = obj("legal");
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
      releaseStage: st.releaseStage === "in-development" ? "in-development" : "released",
    },
    featuredMedia: (Array.isArray(r.featuredMedia) ? r.featuredMedia : [])
      .filter((m): m is string => typeof m === "string" && isMediaName(m))
      .slice(0, 6),
    socials: (Array.isArray(r.socials) ? r.socials : [])
      .slice(0, 6)
      .map((x) => {
        const o = (x && typeof x === "object" ? x : {}) as Record<string, unknown>;
        return { label: clean(o.label, 40), url: safeUrl(o.url) };
      })
      .filter((x) => x.label && x.url),
    legal: {
      ownerName: clean(lg.ownerName, 100) || DEFAULT_CONTENT.legal.ownerName,
      governingLaw: clean(lg.governingLaw, 120),
      effectiveDate: clean(lg.effectiveDate, 40) || DEFAULT_CONTENT.legal.effectiveDate,
    },
  };
}

const file = () => path.join(dataDir(), "site.json");
export const REPO_CONTENT_PATH = "content/site.json";

/** Shallow per-section merge: overlay wins, objects merge one level deep, arrays are replaced. */
export function mergeContent(base: unknown, overlay: unknown): Record<string, unknown> {
  const b = (base && typeof base === "object" ? base : {}) as Record<string, unknown>;
  const o = (overlay && typeof overlay === "object" ? overlay : {}) as Record<string, unknown>;
  const out: Record<string, unknown> = { ...b };
  for (const [k, v] of Object.entries(o)) {
    const bv = b[k];
    out[k] =
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      bv &&
      typeof bv === "object" &&
      !Array.isArray(bv)
        ? { ...(bv as object), ...(v as object) }
        : v;
  }
  return out;
}

/** Content baked in at build time: src/content/site.ts overlaid by the committed content/site.json (if any). */
function buildTimeContent(): SiteContent {
  let overlay: unknown = {};
  try {
    overlay = JSON.parse(readFileSync(path.join(process.cwd(), REPO_CONTENT_PATH), "utf8"));
  } catch {
    /* no committed overlay yet */
  }
  return sanitizeContent(mergeContent(STATIC_CONTENT, overlay));
}

export async function getContent(): Promise<SiteContent> {
  // Static and GitHub-backed builds: content is fixed at build time (pages stay fully static / fast / free).
  if (isStaticTarget || storageMode === "github") return buildTimeContent();
  // Disk build: opt out of prerendering so admin edits show up immediately.
  await connection();
  try {
    return sanitizeContent(JSON.parse(await fs.readFile(file(), "utf8")));
  } catch {
    return DEFAULT_CONTENT;
  }
}

/** Admin view: always the freshest saved content (in GitHub mode: straight from the repo, before the redeploy lands). */
export async function getAdminContent(): Promise<SiteContent> {
  if (storageMode === "github") {
    const store = githubStore();
    if (store) {
      try {
        const f = await store.getFile(REPO_CONTENT_PATH);
        if (f)
          return sanitizeContent(
            mergeContent(STATIC_CONTENT, JSON.parse(f.bytes.toString("utf8"))),
          );
      } catch {
        /* fall back to the deployed snapshot */
      }
    }
    return buildTimeContent();
  }
  return getContent();
}

export async function saveContent(next: SiteContent): Promise<void> {
  const value = sanitizeContent({ ...next, updatedAt: new Date().toISOString() });
  if (storageMode === "github") {
    const store = githubStore();
    if (!store) throw new Error("GitHub storage is not configured (GITHUB_TOKEN / GITHUB_REPO).");
    await store.putFile(
      REPO_CONTENT_PATH,
      JSON.stringify(value, null, 2) + "\n",
      "Admin: update site content",
    );
    return;
  }
  await fs.mkdir(dataDir(), { recursive: true });
  const tmp = `${file()}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), { mode: 0o600 });
  await fs.rename(tmp, file()); // atomic replace
}
