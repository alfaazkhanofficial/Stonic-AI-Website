import type { Metadata } from "next";
import Link from "next/link";
import { DownloadButton, InstallerCard, NotUploadedHint, VerifyHelp } from "@/components/downloads";
import { ButtonLink, PageHero } from "@/components/ui";
import { SYSTEM_REQUIREMENTS } from "@/content/releases";
import { getRelease, installersFor } from "@/lib/release";

export const metadata: Metadata = { title: "Download", description: "Download STONIC Gen 1." };

export default async function Page() {
  const { installers, latest } = await getRelease();
  const files = latest ? installersFor(latest, installers, true) : installers;
  const primary = files.find((f) => f.platform === "Windows") ?? files[0];
  return (
    <>
      <PageHero
        eyebrow="Download"
        title="Get STONIC Gen 1."
        lede={
          latest ? `Version ${latest.version}${latest.date ? ` · ${latest.date}` : ""}` : undefined
        }
      >
        <div className="btn-row">
          <DownloadButton file={primary} />
          <ButtonLink href="/releases">All releases</ButtonLink>
        </div>
        {!primary && <NotUploadedHint />}
      </PageHero>
      <section className="section">
        <div className="container split" style={{ alignItems: "start" }}>
          <div className="grid">
            <h2 className="sr-only">Installers</h2>
            {files.map((f) => (
              <InstallerCard key={f.url} file={f} />
            ))}
            {files.length > 0 && <VerifyHelp />}
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
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>System requirements</h2>
            <ul className="req">
              {SYSTEM_REQUIREMENTS.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <h2>Need help installing?</h2>
            <p>
              Read the <Link href="/documentation">documentation</Link> or{" "}
              <Link href="/contact">contact us</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
