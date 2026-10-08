import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, PageHero } from "@/components/ui";
import { getContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Support", description: "Get help with STONIC." };

export default async function Page() {
  const { settings } = await getContent();
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="We're here to help."
        lede="Start with the documentation. If you're still stuck, tell us what you were trying to do."
      />
      <section className="section">
        <div className="container grid c2">
          <div className="card">
            <h2 className="h3">Documentation</h2>
            <p>Install, verify, and use STONIC.</p>
            <div style={{ marginTop: "1.25rem" }}>
              <ButtonLink href="/documentation">Read the docs</ButtonLink>
            </div>
          </div>
          <div className="card">
            <h2 className="h3">Contact support</h2>
            <p>
              {settings.supportEmail
                ? `Email ${settings.supportEmail} or use the form.`
                : "Send us a message and we'll reply by email."}
            </p>
            <div style={{ marginTop: "1.25rem" }}>
              <ButtonLink href="/contact" variant="primary">
                Contact us
              </ButtonLink>
            </div>
          </div>
          <div className="card">
            <h2 className="h3">Downloads</h2>
            <p>
              Installers and checksums live on the <Link href="/releases">Releases</Link> page.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
