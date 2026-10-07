import Image from "next/image";
import { AdminForm } from "@/components/admin-form";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/admin-session";
import { isVideo, listMedia } from "@/lib/media";
import { getContent } from "@/lib/site-content";
import { deleteMediaAction, toggleFeaturedAction, uploadMediaAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireAdmin();
  const [media, c] = await Promise.all([listMedia(), getContent()]);
  return (
    <AdminShell current="/admin/media" title="Media">
      <div className="panel">
        <h2>Upload</h2>
        <p className="hint" style={{ marginBottom: "1rem" }}>
          Real Gen 1 screenshots and recordings only. PNG, JPG, WebP, AVIF, GIF (max 8 MB) · MP4,
          WebM (max 40 MB).
        </p>
        <AdminForm action={uploadMediaAction} submitLabel="Upload">
          <div className="field">
            <label htmlFor="file">File</label>
            <input
              className="input"
              id="file"
              name="file"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif,image/gif,video/mp4,video/webm"
              required
            />
          </div>
        </AdminForm>
      </div>
      <div className="panel">
        <h2>Library ({media.length})</h2>
        {media.length === 0 ? (
          <p className="muted">Nothing uploaded yet.</p>
        ) : (
          <div className="media-list">
            {media.map((m) => {
              const featured = c.featuredMedia.includes(m.name);
              return (
                <div className="media-item" key={m.name}>
                  {isVideo(m.name) ? (
                    <video src={`/media/${m.name}`} muted preload="metadata" />
                  ) : (
                    <Image src={`/media/${m.name}`} alt="" width={72} height={54} unoptimized />
                  )}
                  <div className="meta">
                    <b>{m.name}</b>
                    <span className="hint">
                      {(m.size / 1024).toFixed(0)} KB{featured ? " · Featured on homepage" : ""}
                    </span>
                  </div>
                  <div className="actions">
                    <form action={toggleFeaturedAction}>
                      <input type="hidden" name="name" value={m.name} />
                      <button className="btn sm" type="submit">
                        {featured ? "Unfeature" : "Feature"}
                      </button>
                    </form>
                    <form action={deleteMediaAction}>
                      <input type="hidden" name="name" value={m.name} />
                      <button className="btn sm danger" type="submit">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
