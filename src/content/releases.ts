/**
 * Release history shown on /releases. Newest first. Edit this file (or let your admin/GitHub flow edit it) when you ship.
 * Installers are NOT listed here: drop the installer into public/media/ and it is detected automatically
 * (its version is read from the file name, e.g. STONIC-Setup-1.0.0.exe → 1.0.0).
 */
export type Release = {
  version: string;
  date: string; // e.g. "October 2026" — leave "" to hide
  title: string;
  summary: string;
  added?: string[];
  improved?: string[];
  fixed?: string[];
};

export const RELEASES: Release[] = [
  {
    version: "1.0.0",
    date: "",
    title: "STONIC Gen 1",
    summary:
      "The first complete release of STONIC: one personal AI that plans, acts, observes and verifies.",
    added: [
      "Computer control with the plan, act, observe, verify loop",
      "Agent system: a main mind with temporary specialists",
      "Persistent memory carried between sessions",
      "Natural voice conversation, with text always available",
      "Web research, code work, files and projects, and communication help",
      "Parallel work within your hardware's real limits",
    ],
  },
];

export const SYSTEM_REQUIREMENTS = [
  "Windows 10 or later (64-bit)",
  "A microphone for voice (text works without one)",
  "An internet connection for features that use online AI services",
];
