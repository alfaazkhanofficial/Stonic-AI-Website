import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { PageHero, StatusBadge } from "@/components/ui";
import { CAPABILITIES } from "@/content/capabilities";

export const metadata: Metadata = {
  title: "Capabilities",
  description: "What STONIC Gen 1 is built to do, with the real status of each capability.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title="What STONIC is built to do."
        lede="Every capability carries its real status. We only label something Available after it ships and has been verified."
      />
      <section className="section">
        <div className="container grid c2">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.id} delay={i % 2}>
              <article className="card">
                <StatusBadge status={c.status} />
                <h2 className="h3" style={{ marginTop: "1rem" }}>
                  {c.title}
                </h2>
                <p>{c.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
