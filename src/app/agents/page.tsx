import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { PageHero } from "@/components/ui";
import { AgentGraph, ParallelLanes } from "@/components/visuals";

export const metadata: Metadata = {
  title: "Agents",
  description: "How STONIC coordinates temporary specialist agents.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Agents"
        title="A main mind. Specialists on demand."
        lede="STONIC stays in charge of the task and brings in temporary specialists only when the work calls for it."
      />
      <section className="section">
        <div className="container split">
          <Reveal>
            <AgentGraph />
          </Reveal>
          <div className="stack prose">
            <Reveal>
              <h2 className="h2">Coordinated, not scattered.</h2>
            </Reveal>
            <Reveal delay={1}>
              <p>
                The main intelligence owns the goal and the context. Specialists handle a slice of
                the work, such as research, code, files or the web, and report back.
              </p>
            </Reveal>
            <Reveal delay={2}>
              <p>
                When their part is finished they are retired, so context stays with one mind instead
                of fragmenting across many.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container split rev">
          <div className="stack prose">
            <Reveal>
              <h2 className="h2">Parallel, within real limits.</h2>
            </Reveal>
            <Reveal delay={1}>
              <p>
                Several tasks can run at once. How many depends on your hardware, the models
                available and the work itself, and STONIC doesn&apos;t pretend otherwise.
              </p>
            </Reveal>
          </div>
          <Reveal>
            <ParallelLanes />
          </Reveal>
        </div>
      </section>
    </>
  );
}
