import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ButtonLink, PageHero } from "@/components/ui";
import { getContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "STONIC Gen 1",
  description: "Gen 1 is the first complete, releasable version of STONIC.",
};

export default async function Page() {
  const { settings } = await getContent();
  const released = settings.releaseStage === "released";
  return (
    <>
      <PageHero
        eyebrow="STONIC Gen 1"
        title="The first complete STONIC."
        lede="Gen 1 brings the control loop, agents, memory and voice together as one releasable product."
      >
        <span
          className={`badge${released ? " live" : ""}`}
          style={{ justifySelf: "start", width: "fit-content" }}
        >
          {released ? "Released" : "In development"}
        </span>
      </PageHero>
      <section className="section">
        <div className="container grid c3">
          {[
            [
              "One product",
              "Everything described on this site works together instead of shipping as separate experiments.",
            ],
            [
              "PC first",
              "Gen 1 is focused on your computer. Phone and cloud are concepts beyond it.",
            ],
            [
              "Real media only",
              "Screenshots and recordings on this site are of the real application, never mockups.",
            ],
          ].map(([t, b], i) => (
            <Reveal key={t} delay={i}>
              <div className="card">
                <h2 className="h3">{t}</h2>
                <p>{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="container btn-row" style={{ marginTop: "2rem" }}>
          <ButtonLink href="/download" variant="primary">
            Download status
          </ButtonLink>
          <ButtonLink href="/roadmap">Roadmap</ButtonLink>
        </div>
      </section>
    </>
  );
}
