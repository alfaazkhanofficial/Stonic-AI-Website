/**
 * Capability claims. `status` is the single source of truth for what the site may say is available.
 * Flip "planned" → "available" only after the capability ships and is verified in Gen 1.
 */
export type CapStatus = "planned" | "available";

export const CAPABILITIES: { id: string; title: string; body: string; status: CapStatus }[] = [
  {
    id: "computer",
    title: "Computer control",
    body: "Operates apps, windows and files on your PC, and checks that each step actually worked.",
    status: "available",
  },
  {
    id: "agents",
    title: "Agent system",
    body: "Brings in specialist agents for a task, coordinates them, and retires them when the work is done.",
    status: "available",
  },
  {
    id: "voice",
    title: "Natural voice",
    body: "Talk to STONIC out loud and hear it answer, with text always available as the fallback.",
    status: "available",
  },
  {
    id: "memory",
    title: "Persistent memory",
    body: "Carries relevant context forward between sessions so you stop re-explaining yourself.",
    status: "available",
  },
  {
    id: "web",
    title: "Web research",
    body: "Gathers and cross-checks information from the web and brings back what matters.",
    status: "available",
  },
  {
    id: "code",
    title: "Code work",
    body: "Reads, edits and runs code across your projects, then verifies the result.",
    status: "available",
  },
  {
    id: "files",
    title: "Files & projects",
    body: "Finds, organizes and works with your files, grouped around the projects you care about.",
    status: "available",
  },
  {
    id: "comms",
    title: "Communication",
    body: "Helps draft and manage messages, with you approving anything that gets sent.",
    status: "available",
  },
];

export const STATUS_LABEL: Record<CapStatus, string> = {
  planned: "Planned for Gen 1",
  available: "Available",
};
