import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { getContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Security",
  description: "How this site is secured and how to report a vulnerability.",
};

export default async function Page() {
  const { settings } = await getContent();
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Security, stated plainly."
        lede="What we do on this website, and how to reach us about a problem."
      />
      <section className="section">
        <div className="container prose">
          <h2>This website</h2>
          <ul>
            <li>Served over HTTPS with strict transport security.</li>
            <li>Restrictive content-security and browser security headers.</li>
            <li>The site runs no third-party trackers or advertising scripts.</li>
            <li>
              Admin access is limited to authorized maintainers, rate-limited and kept out of search
              indexes.
            </li>
          </ul>
          <h2>The STONIC application</h2>
          <p>
            STONIC can act on your computer, so its safeguards matter. We&apos;ll document the real,
            verified protections of Gen 1 at release and won&apos;t describe controls here that
            aren&apos;t shipped.
          </p>
          <h2>Report a vulnerability</h2>
          {settings.supportEmail ? (
            <p>
              Email{" "}
              <a href={`mailto:${settings.supportEmail}?subject=Security%20report`}>
                {settings.supportEmail}
              </a>{" "}
              with details and steps to reproduce. Please give us reasonable time to respond before
              disclosing publicly.
            </p>
          ) : (
            <p>A security contact will be published here. Please check back.</p>
          )}
        </div>
      </section>
    </>
  );
}
