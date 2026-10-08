import { mkdtempSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  formatBytes,
  isInstallerFile,
  isScreenshotFile,
  platformOf,
  scanMediaFolder,
  versionOf,
} from "../src/lib/media-scan";

describe("media folder scan", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "media-"));
  writeFileSync(path.join(dir, "STONIC-Setup-1.2.3.exe"), "installer-bytes");
  writeFileSync(path.join(dir, "STONIC-mac-1.2.3.dmg"), "dmg");
  writeFileSync(path.join(dir, "UI Screenshot 1.PNG"), "png");
  writeFileSync(path.join(dir, "demo.mp4"), "mp4");
  writeFileSync(path.join(dir, "notes.txt"), "ignored");
  writeFileSync(path.join(dir, "script.js"), "ignored");
  writeFileSync(path.join(dir, ".gitkeep"), "");

  it("separates installers from screenshots and ignores everything else", () => {
    const r = scanMediaFolder(dir);
    expect(r.installers.map((i) => i.name).sort()).toEqual([
      "STONIC-Setup-1.2.3.exe",
      "STONIC-mac-1.2.3.dmg",
    ]);
    expect(r.screenshots.sort()).toEqual(["UI Screenshot 1.PNG", "demo.mp4"]);
  });
  it("computes sha256, size, platform, version and an encoded url", () => {
    const exe = scanMediaFolder(dir).installers.find((i) => i.name.endsWith(".exe"))!;
    expect(exe.sha256).toBe(createHash("sha256").update("installer-bytes").digest("hex"));
    expect(exe.size).toBe(15);
    expect(exe.platform).toBe("Windows");
    expect(exe.version).toBe("1.2.3");
    expect(exe.url).toBe("/media/STONIC-Setup-1.2.3.exe");
  });
  it("returns nothing for a missing folder", () => {
    expect(scanMediaFolder(path.join(dir, "nope"))).toEqual({ screenshots: [], installers: [] });
  });
});

describe("file helpers", () => {
  it("classifies names safely", () => {
    expect(isInstallerFile("a.exe")).toBe(true);
    expect(isInstallerFile("a.AppImage")).toBe(true);
    expect(isInstallerFile("../a.exe")).toBe(false);
    expect(isInstallerFile("a.exe.txt")).toBe(false);
    expect(isScreenshotFile("a.svg")).toBe(false);
    expect(isScreenshotFile("a/b.png")).toBe(false);
  });
  it("maps platform, version and size", () => {
    expect(platformOf("x.msi")).toBe("Windows");
    expect(platformOf("x.pkg")).toBe("macOS");
    expect(platformOf("x.deb")).toBe("Linux");
    expect(platformOf("x.zip")).toBe("Portable");
    expect(versionOf("STONIC-1.0.55-setup.exe")).toBe("1.0.55");
    expect(versionOf("setup.exe")).toBeNull();
    expect(formatBytes(1536)).toBe("2 KB");
    expect(formatBytes(5 * 1024 ** 2)).toBe("5.0 MB");
  });
});
