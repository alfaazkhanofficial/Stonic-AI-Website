import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ButtonLink, PageHero, SectionHead } from "@/components/ui";
import { ControlLoop, OperatingLayer } from "@/components/visuals";

export const metadata: Metadata = {
  title: "Product",
  description: "What STONIC is and how it turns intent into verified execution.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Product"
        title="An AI that finishes the job."
        lede="STONIC is a personal AI operating layer. You state the intent; it plans, acts on your computer, observes the outcome and verifies it."
      />
      <section className="section">
        <div className="container split">
          <Reveal>
            <OperatingLayer />
          </Reveal>
          <div className="stack">
            <Reveal>
              <h2 className="h2">One layer between you and your computer.</h2>
            </Reveal>
            <Reveal delay={1}>
              <p className="lede">
                Voice, memory, agents, files and the web are connected into a single system, so a
                task doesn&apos;t stop at the edge of a chat window.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <SectionHead
            eyebrow="How it works"
            title="The control loop."
            lede="Every action goes through the same four steps. STONIC never assumes a step worked; it checks."
          />
          <div className="split">
            <Reveal>
              <ControlLoop />
            </Reveal>
            <div className="grid">
              {[
                ["Plan", "Turn the goal into concrete steps."],
                ["Act", "Perform a step on your computer."],
                ["Observe", "Look at what actually changed."],
                ["Verify", "Confirm success, or adjust and retry."],
              ].map(([t, b], i) => (
                <Reveal key={t} delay={i}>
                  <div className="card">
                    <h3 className="h3">{t}</h3>
                    <p>{b}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container btn-row">
          <ButtonLink href="/capabilities" variant="primary">
            See capabilities
          </ButtonLink>
          <ButtonLink href="/gen-1">About Gen 1</ButtonLink>
        </div>
      </section>
    </>
  );
}
