import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Security",
  description: "How this site is secured, how to use STONIC safely, and how to report a problem.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Security, stated plainly."
        lede="What we do on this website, how to use STONIC safely, and how to reach us about a problem."
      />
      <section className="section">
        <div className="container prose">
          <h2 style={{ marginTop: 0 }}>This website</h2>
          <ul>
            <li>Served over HTTPS with strict transport security.</li>
            <li>Restrictive content-security and browser security headers.</li>
            <li>No third-party trackers or advertising scripts.</li>
            <li>
              Admin access is limited to authorised maintainers, uses a hashed password and optional
              two-factor code, is rate-limited, and is kept out of search indexes.
            </li>
            <li>
              Download checksums (SHA-256) are published on the{" "}
              <Link href="/releases">Releases</Link> page so you can verify what you install.
            </li>
          </ul>
          <h2>Using STONIC safely</h2>
          <p>
            STONIC can act on your computer, so treat it like a capable assistant with access to
            your machine: back up important data, review actions that affect accounts or money, tell
            it clearly what is off limits, and check results that matter. Install it only from this
            website.
          </p>
          <h2>Report a vulnerability</h2>
          <p>
            Use the <Link href="/contact">Contact</Link> page and choose &ldquo;Security
            report&rdquo;. Include what you found and steps to reproduce it. Please give us
            reasonable time to respond and fix the issue before disclosing it publicly.
          </p>
        </div>
      </section>
    </>
  );
}
