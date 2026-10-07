import type { Metadata } from "next";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "License",
  description: "Licensing information for STONIC and this website.",
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Legal" title="License" lede="Last updated October 2026." />
      <section className="section">
        <div className="container prose">
          <h2>STONIC application</h2>
          <p>
            The license for STONIC Gen 1 will be published here with its release, and will be shown
            before installation.
          </p>
          <h2>This website</h2>
          <p>
            The website design, copy and brand assets are proprietary to STONIC AI and all rights
            are reserved.
          </p>
          <h2>Open-source components</h2>
          <p>
            This website uses open-source software, including Next.js, React, Inter and JetBrains
            Mono, under their respective licenses.
          </p>
        </div>
      </section>
    </>
  );
}
