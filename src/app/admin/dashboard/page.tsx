import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/admin-session";
import { adminConfig } from "@/lib/auth";
import { appEnv } from "@/lib/env";
import { listMedia } from "@/lib/media";
import { getContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  await requireAdmin();
  const [c, media] = await Promise.all([getContent(), listMedia()]);
  const stats: [string, string][] = [
    ["Environment", appEnv],
    ["Release stage", c.settings.releaseStage === "released" ? "Released" : "In development"],
    ["Download links", String(c.downloads.links.length)],
    ["Media files", `${media.length} (${c.featuredMedia.length} featured)`],
    ["Announcement", c.announcement.enabled ? "Showing" : "Off"],
    ["Two-factor sign-in", adminConfig()?.totpSecret ? "On" : "Off"],
    ["Last content update", c.updatedAt ? new Date(c.updatedAt).toUTCString() : "Never"],
  ];
  return (
    <AdminShell current="/admin/dashboard" title="Dashboard">
      <div className="stat-grid">
        {stats.map(([k, v]) => (
          <div className="stat" key={k}>
            <span className="eyebrow">{k}</span>
            <b>{v}</b>
          </div>
        ))}
      </div>
      <div className="panel" style={{ marginTop: "1.5rem" }}>
        <h2>Manage</h2>
        <p className="muted">
          Edit <Link href="/admin/content">announcements, download links and SEO</Link>, upload{" "}
          <Link href="/admin/media">real product media</Link>, or change{" "}
          <Link href="/admin/settings">site settings</Link>.
        </p>
      </div>
    </AdminShell>
  );
}
