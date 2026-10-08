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
    releaseStage: "released", // "released" or "in-development"
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
  // Screenshots/recordings and the installer are DETECTED AUTOMATICALLY from public/media/ — no need to list them.
  // (Optional) list extra file names here to force them into the gallery.
  featuredMedia: [],
  // Optional social links shown on the Contact page: { label: "YouTube", url: "https://youtube.com/@yourchannel" }
  socials: [],
  // Used by the License, Terms and Privacy pages.
  legal: {
    ownerName: "STONIC AI", // the legal name of the licensor (person or company)
    governingLaw: "", // e.g. "Pakistan" — leave "" to use the generic clause
    effectiveDate: "October 8, 2026",
  },
};
