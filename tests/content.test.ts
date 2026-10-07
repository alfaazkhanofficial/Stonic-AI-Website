import { describe, expect, it } from "vitest";
import {
  DEFAULT_CONTENT,
  isMediaName,
  safeEmail,
  safeUrl,
  sanitizeContent,
} from "../src/lib/site-content";
import { matchesMagic, sanitizeFilename } from "../src/lib/media";

describe("safeUrl", () => {
  it("allows https and site-relative paths", () => {
    expect(safeUrl("https://example.com/a")).toBe("https://example.com/a");
    expect(safeUrl("/roadmap")).toBe("/roadmap");
  });
  it.each([
    "javascript:alert(1)",
    "data:text/html,x",
    "http://insecure.test",
    "//evil.test",
    "/\\evil",
    "ftp://x",
    "not a url",
  ])("rejects %s", (u) => expect(safeUrl(u)).toBe(""));
});

describe("sanitizeContent", () => {
  it("returns defaults for garbage input", () => {
    expect(sanitizeContent(null).seo.title).toBe(DEFAULT_CONTENT.seo.title);
    expect(sanitizeContent("x").downloads.links).toEqual([]);
  });
  it("strips control characters, trims and caps lengths", () => {
    const c = sanitizeContent({
      announcement: { enabled: true, text: "  hi\u0000there  " + "a".repeat(500) },
    });
    expect(c.announcement.text.startsWith("hi there")).toBe(true);
    expect(c.announcement.text.length).toBeLessThanOrEqual(160);
  });
  it("drops download links with unsafe URLs or no label", () => {
    const c = sanitizeContent({
      downloads: {
        links: [
          { label: "Win", platform: "Windows", url: "https://x.test/a.exe" },
          { label: "Bad", url: "javascript:alert(1)" },
          { label: "", url: "https://x.test" },
        ],
      },
    });
    expect(c.downloads.links).toHaveLength(1);
  });
  it("keeps only valid media names", () => {
    expect(
      sanitizeContent({ featuredMedia: ["ok-1.png", "../etc/passwd", "x.exe", 5] }).featuredMedia,
    ).toEqual(["ok-1.png"]);
  });
  it("defaults release stage to in-development", () => {
    expect(sanitizeContent({ settings: { releaseStage: "bogus" } }).settings.releaseStage).toBe(
      "in-development",
    );
  });
});

describe("email + media names", () => {
  it("validates email", () => {
    expect(safeEmail("a@b.co")).toBe("a@b.co");
    expect(safeEmail("a b@c.d")).toBe("");
  });
  it("rejects traversal, svg, html and executables", () => {
    for (const n of [
      "../a.png",
      "a/b.png",
      "a.svg",
      "a.html",
      "a.exe",
      "a.png.exe",
      ".png",
      "A.PNG",
    ])
      expect(isMediaName(n)).toBe(false);
  });
});

describe("media upload safety", () => {
  it("sanitizes filenames and rejects disallowed types", () => {
    expect(sanitizeFilename("My Shot (1).PNG")).toMatch(/^my-shot-1-[a-z0-9]+\.png$/);
    expect(sanitizeFilename("evil.svg")).toBeNull();
    expect(sanitizeFilename("run.exe")).toBeNull();
    expect(sanitizeFilename("noext")).toBeNull();
  });
  it("checks magic bytes against the claimed extension", () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]);
    expect(matchesMagic("png", png)).toBe(true);
    expect(matchesMagic("jpg", png)).toBe(false);
    expect(matchesMagic("png", new TextEncoder().encode("<script>alert(1)</script>"))).toBe(false);
  });
});

describe("static content file", () => {
  it("ships valid, safe defaults", async () => {
    const { STATIC_CONTENT } = await import("../src/content/site");
    const c = sanitizeContent(STATIC_CONTENT);
    expect(c.settings.releaseStage).toBe("in-development");
    expect(c.downloads.links).toEqual([]);
    expect(c.featuredMedia).toEqual([]);
    expect(c.seo.title.length).toBeGreaterThan(0);
  });
});
