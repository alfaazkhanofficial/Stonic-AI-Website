import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Where STONIC is today and what comes after Gen 1.",
};

const STEPS = [
  {
    tag: "Released",
    title: "STONIC Gen 1",
    body: "The first complete STONIC: control loop, agents, memory and voice working together as one product.",
  },
  {
    tag: "Ongoing",
    title: "Updates and improvements",
    body: "Fixes and refinements ship as new versions. Every version, with notes and checksums, is on the Releases page.",
  },
  {
    tag: "Later · Concept",
    title: "Beyond the PC",
    body: "Phone companion and cloud connection. Exploratory, with no committed date.",
  },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Roadmap"
        title="Where STONIC is going."
        lede="Where STONIC is today and where it may go next. We publish dates only when we can keep them."
      />
      <section className="section">
        <div className="container grid" style={{ maxWidth: 760 }}>
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i}>
              <div className="card">
                <span className="badge">{s.tag}</span>
                <h2 className="h3" style={{ marginTop: "1rem" }}>
                  {s.title}
                </h2>
                <p>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
