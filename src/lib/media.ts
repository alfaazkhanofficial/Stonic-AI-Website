import { promises as fs } from "node:fs";
import path from "node:path";
import { dataDir } from "./env";
import { isMediaName } from "./site-content";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 40 * 1024 * 1024;

export const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
};

export const extOf = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";
export const isVideo = (name: string) => ["mp4", "webm"].includes(extOf(name));

/** Verifies file bytes match the claimed extension (never trust the client's type or name). */
export function matchesMagic(ext: string, b: Uint8Array): boolean {
  const eq = (off: number, sig: number[]) => sig.every((v, i) => b[off + i] === v);
  const ascii = (off: number, s: string) => [...s].every((c, i) => b[off + i] === c.charCodeAt(0));
  switch (ext) {
    case "png":
      return eq(0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "jpg":
    case "jpeg":
      return eq(0, [0xff, 0xd8, 0xff]);
    case "gif":
      return ascii(0, "GIF87a") || ascii(0, "GIF89a");
    case "webp":
      return ascii(0, "RIFF") && ascii(8, "WEBP");
    case "avif":
      return ascii(4, "ftyp") && (ascii(8, "avif") || ascii(8, "avis"));
    case "mp4":
      return ascii(4, "ftyp");
    case "webm":
      return eq(0, [0x1a, 0x45, 0xdf, 0xa3]);
    default:
      return false;
  }
}

/** Builds a safe, unique stored filename from a user-supplied one. */
export function sanitizeFilename(original: string): string | null {
  const ext = extOf(original);
  if (!MIME[ext]) return null;
  const base =
    original
      .replace(/\.[^.]*$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "media";
  const name = `${base}-${Date.now().toString(36)}.${ext === "jpeg" ? "jpg" : ext}`;
  return isMediaName(name) ? name : null;
}

const uploads = () => path.join(dataDir(), "uploads");

export async function listMedia(): Promise<{ name: string; size: number }[]> {
  try {
    const names = (await fs.readdir(uploads())).filter(isMediaName);
    const items = await Promise.all(
      names.map(async (name) => ({ name, size: (await fs.stat(path.join(uploads(), name))).size })),
    );
    return items.sort((a, b) => b.name.localeCompare(a.name));
  } catch {
    return [];
  }
}

export async function saveMedia(name: string, bytes: Uint8Array): Promise<void> {
  if (!isMediaName(name)) throw new Error("Invalid filename");
  await fs.mkdir(uploads(), { recursive: true });
  await fs.writeFile(path.join(uploads(), name), bytes, { mode: 0o600 });
}

export async function readMedia(name: string): Promise<Buffer | null> {
  if (!isMediaName(name)) return null;
  try {
    return await fs.readFile(path.join(uploads(), name));
  } catch {
    return null;
  }
}

export async function deleteMedia(name: string): Promise<void> {
  if (!isMediaName(name)) return;
  await fs.rm(path.join(uploads(), name), { force: true });
}
