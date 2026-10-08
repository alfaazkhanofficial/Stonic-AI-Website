import { RELEASES, type Release } from "../content/releases";
import { getContent } from "./site-content";
import { scanMediaFolder, versionOf, type Installer } from "./media-scan";

const platformFromText = (t: string): Installer["platform"] => {
  const s = t.toLowerCase();
  if (s.includes("mac")) return "macOS";
  if (s.includes("linux") || s.includes("ubuntu") || s.includes("debian")) return "Linux";
  if (s.includes("win")) return "Windows";
  return "Portable";
};

export async function getRelease() {
  const content = await getContent();
  const scanned = scanMediaFolder();
  const external: Installer[] = content.downloads.links.map((l) => ({
    name: l.label,
    url: l.url,
    size: 0,
    sha256: "",
    platform: platformFromText(l.platform || l.label),
    version: content.downloads.version || versionOf(l.url),
    external: true,
  }));
  const installers = [...scanned.installers, ...external];
  const screenshots = [...new Set([...content.featuredMedia, ...scanned.screenshots])];
  return {
    content,
    installers,
    screenshots,
    releases: RELEASES,
    latest: (RELEASES[0] ?? null) as Release | null,
  };
}

/** Installers belonging to a release: matching version, plus un-versioned files for the latest release. */
export function installersFor(
  release: Release,
  installers: Installer[],
  isLatest: boolean,
): Installer[] {
  return installers.filter((i) => (i.version ? i.version === release.version : isLatest));
}
