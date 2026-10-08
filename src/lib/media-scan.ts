import { createHash } from "node:crypto";
import { closeSync, existsSync, openSync, readSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Detects what has been put in the `public/media/` folder (build time on static hosts, request time on a server):
 *  - screenshots / recordings  (png, jpg, webp, avif, gif, mp4, webm) → shown on the site
 *  - installers                (exe, msi, dmg, pkg, zip, deb, rpm, AppImage) → enable the Download buttons
 * Files are repo files you control. Names are validated and URL-encoded anyway.
 */
export type Installer = {
  name: string;
  url: string;
  size: number;
  sha256: string;
  platform: "Windows" | "macOS" | "Linux" | "Portable";
  version: string | null;
  external: boolean;
};

export type ScannedMedia = { screenshots: string[]; installers: Installer[] };

const MEDIA_RE = /^[A-Za-z0-9][A-Za-z0-9._ ()-]{0,150}\.(png|jpe?g|webp|avif|gif|mp4|webm)$/i;
const INSTALLER_RE =
  /^[A-Za-z0-9][A-Za-z0-9._ ()-]{0,150}\.(exe|msi|dmg|pkg|zip|deb|rpm|appimage)$/i;

export const isScreenshotFile = (n: string) => MEDIA_RE.test(n);
export const isInstallerFile = (n: string) => INSTALLER_RE.test(n);
export const isVideoFile = (n: string) => /\.(mp4|webm)$/i.test(n);

export function platformOf(name: string): Installer["platform"] {
  const ext = name.split(".").pop()!.toLowerCase();
  if (ext === "exe" || ext === "msi") return "Windows";
  if (ext === "dmg" || ext === "pkg") return "macOS";
  if (ext === "deb" || ext === "rpm" || ext === "appimage") return "Linux";
  return "Portable";
}

export function versionOf(name: string): string | null {
  const m = name.match(/(\d+\.\d+(?:\.\d+)*)/);
  return m ? m[1]! : null;
}

const hashCache = new Map<string, string>();
function sha256File(file: string, size: number, mtimeMs: number): string {
  const key = `${file}:${size}:${mtimeMs}`;
  const hit = hashCache.get(key);
  if (hit) return hit;
  const h = createHash("sha256");
  const fd = openSync(file, "r");
  try {
    const buf = Buffer.allocUnsafe(8 * 1024 * 1024);
    let n: number;
    while ((n = readSync(fd, buf, 0, buf.length, null)) > 0) h.update(buf.subarray(0, n));
  } finally {
    closeSync(fd);
  }
  const digest = h.digest("hex");
  hashCache.set(key, digest);
  return digest;
}

export function scanMediaFolder(dir = path.join(process.cwd(), "public", "media")): ScannedMedia {
  if (!existsSync(dir)) return { screenshots: [], installers: [] };
  const screenshots: string[] = [];
  const installers: Installer[] = [];
  for (const name of readdirSync(dir).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  )) {
    const file = path.join(dir, name);
    let st;
    try {
      st = statSync(file);
    } catch {
      continue;
    }
    if (!st.isFile()) continue;
    if (isInstallerFile(name)) {
      installers.push({
        name,
        url: `/media/${encodeURIComponent(name)}`,
        size: st.size,
        sha256: sha256File(file, st.size, st.mtimeMs),
        platform: platformOf(name),
        version: versionOf(name),
        external: false,
      });
    } else if (isScreenshotFile(name)) {
      screenshots.push(name);
    }
  }
  return { screenshots, installers };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(0)} KB`;
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${(n / 1024 ** 3).toFixed(2)} GB`;
}
