import { AdminForm } from "@/components/admin-form";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/admin-session";
import { getContent } from "@/lib/site-content";
import { saveSettingsAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdmin();
  const { settings } = await getContent();
  return (
    <AdminShell current="/admin/settings" title="Settings">
      <AdminForm action={saveSettingsAction}>
        <div className="panel">
          <div className="field">
            <label htmlFor="siteName">Site name</label>
            <input
              className="input"
              id="siteName"
              name="siteName"
              defaultValue={settings.siteName}
              maxLength={40}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="supportEmail">Support email</label>
            <input
              className="input"
              id="supportEmail"
              name="supportEmail"
              type="email"
              defaultValue={settings.supportEmail}
              maxLength={200}
            />
            <span className="hint">Shown on the Support, Security and footer areas.</span>
          </div>
          <div className="field">
            <label htmlFor="releaseStage">Release stage</label>
            <select
              className="input"
              id="releaseStage"
              name="releaseStage"
              defaultValue={settings.releaseStage}
            >
              <option value="in-development">In development</option>
              <option value="released">Released</option>
            </select>
            <span className="hint">
              Controls hero/CTA wording and whether download links are shown.
            </span>
          </div>
        </div>
      </AdminForm>
    </AdminShell>
  );
}
