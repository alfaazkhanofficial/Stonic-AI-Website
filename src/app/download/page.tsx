import type { Metadata } from "next";
import { ButtonLink, PageHero } from "@/components/ui";
import { getContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Download",
  description: "Download STONIC Gen 1 when it is released.",
};

export default async function Page() {
  const { downloads, settings } = await getContent();
  const ready = settings.releaseStage === "released" && downloads.links.length > 0;
  return (
    <>
      <PageHero
        eyebrow="Download"
        title={ready ? "Get STONIC Gen 1." : "Gen 1 isn't released yet."}
        lede={
          ready
            ? `Version ${downloads.version || "—"}${downloads.releaseDate ? ` · ${downloads.releaseDate}` : ""}`
            : "There is nothing to download yet. When Gen 1 ships, the installers will appear here."
        }
      />
      <section className="section">
        <div className="container prose">
          {ready ? (
            <>
              {downloads.notes && <p>{downloads.notes}</p>}
              <div className="grid" style={{ marginTop: "1.5rem" }}>
                {downloads.links.map((l) => (
                  <div
                    className="card"
                    key={l.url}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h2 className="h3">{l.label}</h2>
                      {l.platform && <p>{l.platform}</p>}
                    </div>
                    <ButtonLink href={l.url} variant="primary">
                      Download
                    </ButtonLink>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="notice">
                We won&apos;t show a download button for something that doesn&apos;t exist. Check
                the roadmap for where Gen 1 stands.
              </p>
              <div className="btn-row" style={{ marginTop: "1.5rem" }}>
                <ButtonLink href="/roadmap" variant="primary">
                  View roadmap
                </ButtonLink>
                <ButtonLink href="/support">Contact support</ButtonLink>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
