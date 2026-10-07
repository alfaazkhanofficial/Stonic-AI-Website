/**
 * Editable site content for the FREE STATIC build (`npm run build:static`, e.g. Cloudflare Pages).
 * On the static build there is no admin panel: edit this file (GitHub web editor works) and the site redeploys.
 * The server build (with /admin) ignores this file and uses the admin-managed content instead.
 *
 * Rules (enforced by the same sanitizer the admin uses): plain text only, URLs must be https:// or a /path.
 */
import type { SiteContent } from "../lib/site-content";

export const STATIC_CONTENT: Partial<SiteContent> = {
  settings: {
    siteName: "STONIC AI",
    supportEmail: "", // e.g. "support@yourdomain.com" — shown on Support, Security and the footer
    releaseStage: "in-development", // change to "released" on release day
  },
  announcement: {
    enabled: false,
    text: "", // e.g. "Gen 1 progress update"
    href: "", // optional: https://... or /roadmap
  },
  downloads: {
    version: "", // e.g. "1.0.0"
    releaseDate: "", // e.g. "October 2026"
    notes: "",
    // Only shown when releaseStage is "released". Each needs a label and an https:// url (max 8).
    // { label: "STONIC for Windows", platform: "Windows 11", url: "https://github.com/you/repo/releases/download/v1.0.0/STONIC-Setup.exe" }
    links: [],
  },
  seo: {
    title: "STONIC AI — Your computer is about to become intelligent",
    description:
      "STONIC Gen 1 is a personal AI that doesn't stop at answering. It plans, acts, observes and verifies.",
  },
  // Real Gen 1 screenshots/recordings: put the files in public/media/ and list the exact file names here
  // (png, jpg, webp, avif, gif, mp4, webm; lowercase letters, numbers, dot, dash, underscore). Max 6.
  featuredMedia: [],
};
