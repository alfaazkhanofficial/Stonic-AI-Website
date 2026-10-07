import type { Metadata } from "next";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Terms", description: "Terms for using this website." };

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms" lede="Last updated October 2026." />
      <section className="section">
        <div className="container prose">
          <h2>Use of this website</h2>
          <p>
            This website provides information about STONIC. You may browse it and share links to it.
            Do not attempt to disrupt it, probe it for weaknesses without permission, or misuse its
            content.
          </p>
          <h2>Information accuracy</h2>
          <p>
            We aim to keep the site accurate and mark capabilities as Planned or Available.
            Descriptions of unreleased capabilities are plans, not guarantees.
          </p>
          <h2>Intellectual property</h2>
          <p>
            The STONIC AI name, logo and site content belong to STONIC AI. The logo may not be
            altered, recolored outside approved variants, or used to imply endorsement.
          </p>
          <h2>Liability</h2>
          <p>
            This website is provided as is, to the extent permitted by law. Terms for the STONIC
            application will accompany its release.
          </p>
        </div>
      </section>
    </>
  );
}
