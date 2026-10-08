import type { Metadata } from "next";
import Link from "next/link";
import { DownloadButton, InstallerCard, NotUploadedHint, VerifyHelp } from "@/components/downloads";
import { Reveal } from "@/components/reveal";
import { ButtonLink } from "@/components/ui";
import { SYSTEM_REQUIREMENTS, type Release } from "@/content/releases";
import { getRelease, installersFor } from "@/lib/release";

export const metadata: Metadata = {
  title: "Releases",
  description: "Every STONIC release: downloads with checksums, and what changed in each version.",
};

function Notes({ r }: { r: Release }) {
  const groups: [string, string[] | undefined][] = [
    ["New", r.added],
    ["Improved", r.improved],
    ["Fixed", r.fixed],
  ];
  return (
    <div className="notes">
      {groups.map(([label, items]) =>
        items && items.length > 0 ? (
          <div key={label}>
            <h4>{label}</h4>
            <ul>
              {items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ) : null,
      )}
    </div>
  );
}

export default async function Page() {
  const { installers, releases, latest } = await getRelease();
  const latestFiles = latest ? installersFor(latest, installers, true) : [];
  const primary = latestFiles.find((f) => f.platform === "Windows") ?? latestFiles[0];

  return (
    <>
      <header className="release-hero">
        <div className="container">
          <div className="stack">
            <p className="eyebrow">Releases</p>
            {latest ? (
              <>
                <div
                  style={{
                    display: "flex",
                    gap: "0.6rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <span className="badge live">Latest</span>
                  {latest.date && <span className="badge">{latest.date}</span>}
                </div>
                <h1 className="release-version">v{latest.version}</h1>
                <p className="lede" style={{ marginInline: "auto" }}>
                  {latest.summary}
                </p>
                <div className="btn-row" style={{ justifyContent: "center" }}>
                  <DownloadButton file={primary} />
                  <ButtonLink href="#notes">Release notes</ButtonLink>
                </div>
                {!primary && <NotUploadedHint />}
              </>
            ) : (
              <h1 className="display">No releases yet.</h1>
            )}
          </div>
        </div>
      </header>

      <section className="section" aria-labelledby="dl-title">
        <div className="container split" style={{ alignItems: "start" }}>
          <div className="stack">
            <Reveal>
              <p className="eyebrow">Download</p>
            </Reveal>
            <Reveal delay={1}>
              <h2 id="dl-title" className="h2">
                Get the installer.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="lede">
                Every file comes with a SHA-256 checksum so you can confirm it is exactly what we
                published.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div>
                <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
                  System requirements
                </p>
                <ul className="req">
                  {SYSTEM_REQUIREMENTS.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          <div className="grid">
            {latestFiles.length > 0 ? (
              <>
                {latestFiles.map((f) => (
                  <InstallerCard key={f.url} file={f} />
                ))}
                <VerifyHelp />
              </>
            ) : (
              <div className="card">
                <span className="badge">Windows</span>
                <h3 className="h3" style={{ margin: "0.9rem 0 1.25rem" }}>
                  STONIC installer
                </h3>
                <DownloadButton />
                <NotUploadedHint />
              </div>
            )}
            <p className="muted" style={{ fontSize: "0.92rem" }}>
              By downloading you agree to the{" "}
              <Link href="/license" style={{ color: "var(--c1)" }}>
                license
              </Link>{" "}
              and{" "}
              <Link href="/terms" style={{ color: "var(--c1)" }}>
                terms
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section id="notes" className="section alt" aria-labelledby="notes-title">
        <div className="container" style={{ maxWidth: 820 }}>
          <Reveal>
            <h2 id="notes-title" className="h2" style={{ marginBottom: "3rem" }}>
              Release notes
            </h2>
          </Reveal>
          <div className="timeline">
            {releases.map((r, i) => {
              const files = installersFor(r, installers, i === 0);
              return (
                <Reveal key={r.version}>
                  <article className={`rel${i === 0 ? " latest" : ""}`}>
                    <div className="rel-head">
                      <h3>v{r.version}</h3>
                      <span className="muted">{r.title}</span>
                      {i === 0 && <span className="badge live">Latest</span>}
                      {r.date && <span className="muted">{r.date}</span>}
                    </div>
                    <p className="lede" style={{ fontSize: "1.05rem" }}>
                      {r.summary}
                    </p>
                    <Notes r={r} />
                    {files.length > 0 && (
                      <div className="btn-row" style={{ marginTop: "1.25rem" }}>
                        {files.map((f) => (
                          <DownloadButton key={f.url} file={f} size="sm" />
                        ))}
                      </div>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
