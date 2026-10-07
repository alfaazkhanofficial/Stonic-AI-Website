import type { Metadata } from "next";
import { ButtonLink, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Documentation",
  description: "STONIC Gen 1 documentation.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Documentation"
        title="Docs arrive with Gen 1."
        lede="Documentation is published alongside the release, so it describes what the product actually does."
      />
      <section className="section">
        <div className="container prose">
          <h2>What will be covered</h2>
          <ul>
            <li>Installing and first run</li>
            <li>Voice and text interaction</li>
            <li>Computer control and its safeguards</li>
            <li>Agents, memory and projects</li>
            <li>Troubleshooting</li>
          </ul>
          <div className="btn-row" style={{ marginTop: "2rem" }}>
            <ButtonLink href="/support" variant="primary">
              Ask a question
            </ButtonLink>
            <ButtonLink href="/roadmap">Roadmap</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
