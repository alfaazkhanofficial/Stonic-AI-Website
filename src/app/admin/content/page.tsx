import { AdminForm } from "@/components/admin-form";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/admin-session";
import { getAdminContent } from "@/lib/site-content";
import { saveContentAction } from "../actions";

export const dynamic = "force-dynamic";

const Field = ({
  id,
  label,
  defaultValue,
  hint,
  area,
  max,
}: {
  id: string;
  label: string;
  defaultValue: string;
  hint?: string;
  area?: boolean;
  max: number;
}) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    {area ? (
      <textarea className="input" id={id} name={id} defaultValue={defaultValue} maxLength={max} />
    ) : (
      <input className="input" id={id} name={id} defaultValue={defaultValue} maxLength={max} />
    )}
    {hint && <span className="hint">{hint}</span>}
  </div>
);

export default async function ContentPage() {
  await requireAdmin();
  const c = await getAdminContent();
  const links = [0, 1, 2, 3].map(
    (i) => c.downloads.links[i] ?? { label: "", platform: "", url: "" },
  );
  return (
    <AdminShell current="/admin/content" title="Content">
      <AdminForm action={saveContentAction}>
        <div className="panel">
          <h2>Announcement banner</h2>
          <div className="field">
            <label className="check">
              <input type="checkbox" name="ann_enabled" defaultChecked={c.announcement.enabled} />{" "}
              Show banner on every page
            </label>
          </div>
          <Field
            id="ann_text"
            label="Text"
            defaultValue={c.announcement.text}
            max={160}
            hint="Plain text, up to 160 characters."
          />
          <Field
            id="ann_href"
            label="Link (optional)"
            defaultValue={c.announcement.href}
            max={500}
            hint="An https:// URL or a path such as /roadmap."
          />
        </div>
        <div className="panel">
          <h2>Downloads</h2>
          <p className="hint" style={{ marginBottom: "1rem" }}>
            Links only appear on the Download page when the release stage (Settings) is “Released”.
          </p>
          <Field id="dl_version" label="Version" defaultValue={c.downloads.version} max={40} />
          <Field
            id="dl_date"
            label="Release date"
            defaultValue={c.downloads.releaseDate}
            max={40}
          />
          <Field
            id="dl_notes"
            label="Release notes"
            defaultValue={c.downloads.notes}
            max={600}
            area
          />
          {links.map((l, i) => (
            <fieldset
              key={i}
              style={{
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: "1rem",
                marginBottom: "0.75rem",
              }}
            >
              <legend className="eyebrow">Link {i + 1}</legend>
              <Field id={`link${i}_label`} label="Label" defaultValue={l.label} max={60} />
              <Field id={`link${i}_platform`} label="Platform" defaultValue={l.platform} max={40} />
              <Field id={`link${i}_url`} label="URL (https only)" defaultValue={l.url} max={500} />
            </fieldset>
          ))}
        </div>
        <div className="panel">
          <h2>SEO</h2>
          <Field id="seo_title" label="Default title" defaultValue={c.seo.title} max={70} />
          <Field
            id="seo_description"
            label="Default description"
            defaultValue={c.seo.description}
            max={200}
            area
          />
        </div>
      </AdminForm>
    </AdminShell>
  );
}
