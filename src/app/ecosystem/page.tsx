import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/ui";
import { EcosystemTriad } from "@/components/visuals";

export const metadata: Metadata = {
  title: "Ecosystem",
  description: "The PC-first STONIC ecosystem concept: PC, phone and cloud.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Ecosystem · Concept"
        title="PC first. Built to extend."
        lede="STONIC begins on your computer. A phone companion and a cloud connection are part of the longer-term concept."
      />
      <section className="section">
        <div className="container split">
          <Reveal>
            <EcosystemTriad />
          </Reveal>
          <div className="stack">
            {[
              ["PC", "The home of STONIC and the focus of Gen 1."],
              ["Phone", "Concept: reach STONIC and check on running work away from your desk."],
              ["Cloud", "Concept: optional connection for continuity across devices."],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i}>
                <div className="card">
                  <h2 className="h3">{t}</h2>
                  <p>{b}</p>
                </div>
              </Reveal>
            ))}
            <p className="notice">
              Phone and cloud are concepts, not part of Gen 1 and not promised for a date.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
