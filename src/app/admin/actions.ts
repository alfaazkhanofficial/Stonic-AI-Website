"use server";
import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminConfig, verifyPassword, verifyTotp } from "@/lib/auth";
import { clientIp, endAdminSession, requireAdmin, startAdminSession } from "@/lib/admin-session";
import { loginLimiters } from "@/lib/limiters";
import {
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  deleteMedia,
  extOf,
  isVideo,
  matchesMagic,
  sanitizeFilename,
  saveMedia,
} from "@/lib/media";
import { getContent, isMediaName, safeEmail, saveContent } from "@/lib/site-content";

export type FormState = { ok?: string; error?: string };

const str = (fd: FormData, k: string, max = 1000) => {
  const v = fd.get(k);
  return typeof v === "string" ? v.slice(0, max) : "";
};
const digest = (s: string) => createHash("sha256").update(s).digest();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const refresh = () => revalidatePath("/", "layout");

/* ---------------- Auth ---------------- */
export async function loginAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const cfg = adminConfig();
  if (!cfg) return { error: "Admin sign-in is not configured on this server." };

  const ip = await clientIp();
  if (loginLimiters.ip.isLimited(ip) || loginLimiters.global.isLimited("all")) {
    return { error: "Too many failed attempts. Try again in 15 minutes." };
  }

  const username = str(fd, "username", 200);
  const password = str(fd, "password", 200);
  const code = str(fd, "code", 10).replace(/\s/g, "");

  // Always do all the work so timing doesn't reveal which factor failed.
  const userOk = timingSafeEqual(digest(username), digest(cfg.username));
  const passOk = await verifyPassword(password, cfg.passwordHash);
  const totpOk = cfg.totpSecret ? verifyTotp(cfg.totpSecret, code) : true;

  if (!(userOk && passOk && totpOk)) {
    loginLimiters.ip.recordFailure(ip);
    loginLimiters.global.recordFailure("all");
    await sleep(500);
    return {
      error: cfg.totpSecret
        ? "Invalid username, password or code."
        : "Invalid username or password.",
    };
  }

  loginLimiters.ip.reset(ip);
  await startAdminSession(cfg.username);
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await endAdminSession();
  redirect("/admin/login");
}

/* ---------------- Content ---------------- */
export async function saveContentAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const cur = await getContent();
  const links = [0, 1, 2, 3].map((i) => ({
    label: str(fd, `link${i}_label`, 60),
    platform: str(fd, `link${i}_platform`, 40),
    url: str(fd, `link${i}_url`, 500),
  }));
  const hadLinks = links.filter((l) => l.label || l.url);
  await saveContent({
    ...cur,
    announcement: {
      enabled: fd.get("ann_enabled") === "on",
      text: str(fd, "ann_text", 160),
      href: str(fd, "ann_href", 500),
    },
    downloads: {
      version: str(fd, "dl_version", 40),
      releaseDate: str(fd, "dl_date", 40),
      notes: str(fd, "dl_notes", 600),
      links,
    },
    seo: { title: str(fd, "seo_title", 70), description: str(fd, "seo_description", 200) },
  });
  const saved = await getContent();
  refresh();
  const dropped = hadLinks.length - saved.downloads.links.length;
  return dropped > 0
    ? {
        ok: `Saved. ${dropped} download link(s) were not saved: each needs a label and an https:// URL.`,
      }
    : { ok: "Saved." };
}

export async function saveSettingsAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const email = str(fd, "supportEmail", 200).trim();
  if (email && !safeEmail(email)) return { error: "Enter a valid support email address." };
  const cur = await getContent();
  await saveContent({
    ...cur,
    settings: {
      siteName: str(fd, "siteName", 40),
      supportEmail: email,
      releaseStage: str(fd, "releaseStage") === "released" ? "released" : "in-development",
    },
  });
  refresh();
  return { ok: "Saved." };
}

/* ---------------- Media ---------------- */
export async function uploadMediaAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a file to upload." };
  const name = sanitizeFilename(file.name);
  if (!name) return { error: "Unsupported file type. Use PNG, JPG, WebP, AVIF, GIF, MP4 or WebM." };
  const limit = isVideo(name) ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit)
    return { error: `File too large (max ${Math.round(limit / 1048576)} MB).` };
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!matchesMagic(extOf(name), bytes)) return { error: "File contents don't match its type." };
  await saveMedia(name, bytes);
  refresh();
  return { ok: `Uploaded ${name}.` };
}

export async function toggleFeaturedAction(fd: FormData) {
  await requireAdmin();
  const name = str(fd, "name", 200);
  if (!isMediaName(name)) return;
  const cur = await getContent();
  const on = cur.featuredMedia.includes(name);
  await saveContent({
    ...cur,
    featuredMedia: on ? cur.featuredMedia.filter((m) => m !== name) : [...cur.featuredMedia, name],
  });
  refresh();
}

export async function deleteMediaAction(fd: FormData) {
  await requireAdmin();
  const name = str(fd, "name", 200);
  if (!isMediaName(name)) return;
  const cur = await getContent();
  await deleteMedia(name);
  await saveContent({ ...cur, featuredMedia: cur.featuredMedia.filter((m) => m !== name) });
  refresh();
}
