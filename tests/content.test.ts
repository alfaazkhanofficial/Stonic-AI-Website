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
  it("defaults release stage to released and honours in-development", () => {
    expect(sanitizeContent({ settings: { releaseStage: "bogus" } }).settings.releaseStage).toBe(
      "released",
    );
    expect(
      sanitizeContent({ settings: { releaseStage: "in-development" } }).settings.releaseStage,
    ).toBe("in-development");
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
    expect(c.settings.releaseStage).toBe("released");
    expect(c.downloads.links).toEqual([]);
    expect(c.featuredMedia).toEqual([]);
    expect(c.seo.title.length).toBeGreaterThan(0);
  });
});

import { mergeContent } from "../src/lib/site-content";
import { GithubStore, githubConfig } from "../src/lib/github-store";

describe("mergeContent", () => {
  it("overlays objects one level deep and replaces arrays", () => {
    const m = mergeContent(
      {
        settings: { siteName: "A", supportEmail: "" },
        featuredMedia: ["a.png"],
        seo: { title: "t" },
      },
      { settings: { supportEmail: "x@y.co" }, featuredMedia: ["b.png"] },
    ) as { settings: Record<string, string>; featuredMedia: string[]; seo: { title: string } };
    expect(m.settings).toEqual({ siteName: "A", supportEmail: "x@y.co" });
    expect(m.featuredMedia).toEqual(["b.png"]);
    expect(m.seo.title).toBe("t");
  });
  it("tolerates garbage", () => {
    expect(mergeContent(null, "x")).toEqual({});
  });
});

describe("GitHub store", () => {
  it("rejects incomplete or malformed config", () => {
    expect(githubConfig({} as NodeJS.ProcessEnv)).toBeNull();
    expect(
      githubConfig({
        GITHUB_TOKEN: "t",
        GITHUB_REPO: "not a repo",
      } as unknown as NodeJS.ProcessEnv),
    ).toBeNull();
    expect(
      githubConfig({ GITHUB_TOKEN: "t", GITHUB_REPO: "me/site" } as unknown as NodeJS.ProcessEnv)
        ?.branch,
    ).toBe("main");
  });
  it("creates, updates (with sha), lists and deletes via the Contents API", async () => {
    const files = new Map<string, { sha: string; content: string }>();
    const calls: string[] = [];
    const fake = (async (url: string, init: RequestInit = {}) => {
      const u = new URL(url);
      const p = decodeURIComponent(u.pathname.split("/contents/")[1] ?? "");
      const method = init.method ?? "GET";
      calls.push(`${method} ${p}`);
      expect((init.headers as Record<string, string>).Authorization).toBe("Bearer tok");
      const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });
      if (method === "GET") {
        const f = files.get(p);
        if (f) return json({ sha: f.sha, content: f.content, type: "file" });
        const dir = [...files.keys()].filter((k) => k.startsWith(p + "/"));
        return dir.length
          ? json(dir.map((k) => ({ name: k.split("/").pop(), size: 3, sha: "s", type: "file" })))
          : json({}, 404);
      }
      const body = JSON.parse(String(init.body));
      if (method === "PUT") {
        const existing = files.get(p);
        if (existing && body.sha !== existing.sha) return json({}, 409);
        files.set(p, { sha: `sha${files.size}${Date.now()}`, content: body.content });
        return json({}, existing ? 200 : 201);
      }
      if (method === "DELETE") {
        if (files.get(p)?.sha !== body.sha) return json({}, 409);
        files.delete(p);
        return json({});
      }
      return json({}, 400);
    }) as unknown as typeof fetch;
    const s = new GithubStore({ token: "tok", repo: "me/site", branch: "main" }, fake);
    await s.putFile("content/site.json", '{"a":1}', "m");
    await s.putFile("content/site.json", '{"a":2}', "m"); // update path uses current sha
    expect((await s.getFile("content/site.json"))!.bytes.toString()).toBe('{"a":2}');
    await s.putFile("public/media/x.png", new Uint8Array([1, 2, 3]), "m");
    expect((await s.list("public/media")).map((f) => f.name)).toEqual(["x.png"]);
    await s.deleteFile("public/media/x.png", "m");
    expect(await s.list("public/media")).toEqual([]);
    expect(await s.getFile("nope.json")).toBeNull();
    expect(calls.length).toBeGreaterThan(5);
  });
  it("surfaces write failures", async () => {
    const fake = (async (_u: string, init: RequestInit = {}) =>
      new Response("{}", { status: init.method === "PUT" ? 403 : 404 })) as unknown as typeof fetch;
    const s = new GithubStore({ token: "t", repo: "a/b", branch: "main" }, fake);
    await expect(s.putFile("x", "y", "m")).rejects.toThrow("403");
  });
});
