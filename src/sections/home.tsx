import Image from "next/image";
import Link from "next/link";
import { HeroCanvas } from "@/components/hero-canvas";
import { Reveal } from "@/components/reveal";
import { ButtonLink, SectionHead, StatusBadge } from "@/components/ui";
import {
  AgentGraph,
  ControlLoop,
  EcosystemTriad,
  MemoryThreads,
  OperatingLayer,
  ParallelLanes,
  VoiceWave,
} from "@/components/visuals";
import { CAPABILITIES } from "@/content/capabilities";
import { isVideo } from "@/lib/media";
import type { SiteContent } from "@/lib/site-content";

/** 01 Hero */
export function Hero({ stage }: { stage: SiteContent["settings"]["releaseStage"] }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <HeroCanvas />
      <div className="hero-orb" aria-hidden="true" />
      <div className="container hero-inner">
        <p className="eyebrow">
          {stage === "released" ? "STONIC Gen 1" : "STONIC Gen 1 · In development"}
        </p>
        <h1 id="hero-title" className="display">
          <span className="mask-line" style={{ "--i": 0 } as React.CSSProperties}>
            <span>Your computer is</span>
          </span>
          <span className="mask-line" style={{ "--i": 1 } as React.CSSProperties}>
            <span className="grad-text">about to become intelligent.</span>
          </span>
        </h1>
        <p className="lede">
          STONIC is a personal AI that doesn&apos;t stop at answering. It plans the work, acts on
          your computer, watches what happens, and verifies the result.
        </p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <ButtonLink href="/download" variant="primary">
            Get STONIC Gen 1
          </ButtonLink>
          <ButtonLink href="/product">See how it works</ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** 02 Problem */
export function Problem() {
  return (
    <section className="section" aria-labelledby="problem-title">
      <div className="container">
        <div className="split">
          <div className="stack">
            <Reveal>
              <p className="eyebrow">The problem</p>
            </Reveal>
            <Reveal delay={1}>
              <h2 id="problem-title" className="h2">
                AI that only answers leaves the work to you.
              </h2>
            </Reveal>
          </div>
          <div className="stack">
            <Reveal delay={2}>
              <p className="lede">
                Most AI tools stop at a reply. You still copy it, switch windows, click through the
                steps and find out later whether it worked.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <p className="lede">
                The assistant is smart, but it never touches your actual work. The gap between an
                answer and a finished task is still entirely yours.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 03 Introducing STONIC */
export function Introducing() {
  return (
    <section className="section alt" aria-labelledby="intro-title">
      <div className="container split">
        <div className="stack">
          <Reveal>
            <p className="eyebrow">Introducing STONIC</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 id="intro-title" className="h2">
              A personal AI operating layer.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="lede">
              STONIC sits between you and your computer. You state the intent; it connects voice,
              memory, agents, files and the web to get it done.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <ButtonLink href="/product">Explore the product</ButtonLink>
          </Reveal>
        </div>
        <Reveal delay={2}>
          <OperatingLayer />
        </Reveal>
      </div>
    </section>
  );
}

/** 04 One Mind */
export function OneMind() {
  return (
    <section className="section" aria-labelledby="mind-title">
      <div className="container">
        <SectionHead
          eyebrow="One mind"
          title={<span id="mind-title">One continuous intelligence.</span>}
          lede="Not a new chat every time. STONIC is built as a single, persistent intelligence, so what it learns about your work and preferences continues across tasks."
        />
        <div className="grid c3">
          {[
            ["Continuity", "Work picks up where it left off instead of starting from zero."],
            ["Coherence", "The same intelligence handles the plan, the action and the follow-up."],
            ["Context", "Your projects, preferences and history stay part of the conversation."],
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
    </section>
  );
}

/** 05 Agent System */
export function AgentSystem() {
  return (
    <section className="section alt" aria-labelledby="agents-title">
      <div className="container split rev">
        <div className="stack">
          <Reveal>
            <p className="eyebrow">Agent system</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 id="agents-title" className="h2">
              A main mind. Specialists on demand.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="lede">
              STONIC coordinates the work. When a task needs it, it brings in temporary specialists
              for research, code, files or the web, and lets them go when the job is done.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <ButtonLink href="/agents">How agents work</ButtonLink>
          </Reveal>
        </div>
        <Reveal delay={2}>
          <AgentGraph />
        </Reveal>
      </div>
    </section>
  );
}

/** 06 Action */
export function Action() {
  return (
    <section className="section" aria-labelledby="action-title">
      <div className="container">
        <SectionHead
          eyebrow="Action"
          title={<span id="action-title">From intent to execution.</span>}
          lede="Say what you want done. STONIC turns the intent into steps, carries them out, and reports back with what actually happened."
        />
        <Reveal>
          <div className="flow" aria-label="Intent to execution">
            <span>Intent</span>
            <i>→</i>
            <span>Plan</span>
            <i>→</i>
            <span>Execution</span>
            <i>→</i>
            <span>Verified result</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** 07 Computer Control */
export function ComputerControl() {
  const steps = [
    ["PLAN", "Break the goal into concrete steps."],
    ["ACT", "Carry out a step on your computer."],
    ["OBSERVE", "Look at what actually changed."],
    ["VERIFY", "Confirm it worked, or adjust and try again."],
  ];
  return (
    <section className="section alt" aria-labelledby="control-title">
      <div className="container split">
        <Reveal>
          <ControlLoop />
        </Reveal>
        <div className="stack">
          <Reveal>
            <p className="eyebrow">Computer control</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 id="control-title" className="h2">
              Plan. Act. Observe. Verify.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="lede">
              The loop is the difference. STONIC doesn&apos;t assume a step succeeded. It checks,
              then moves on or corrects.
            </p>
          </Reveal>
          <div className="loop-steps">
            {steps.map(([k, v], i) => (
              <Reveal key={k} delay={i + 2}>
                <div className="loop-step">
                  <b>{k}</b>
                  <span className="muted" style={{ fontSize: "0.95rem" }}>
                    {v}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** 08 Memory */
export function Memory() {
  return (
    <section className="section" aria-labelledby="memory-title">
      <div className="container split rev">
        <div className="stack">
          <Reveal>
            <p className="eyebrow">Memory</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 id="memory-title" className="h2">
              Remembers what matters.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="lede">
              Relevant context is carried forward, so you stop re-explaining your projects,
              preferences and past decisions every time.
            </p>
          </Reveal>
        </div>
        <Reveal delay={2}>
          <MemoryThreads />
        </Reveal>
      </div>
    </section>
  );
}

/** 09 Voice */
export function Voice() {
  return (
    <section className="section alt" aria-labelledby="voice-title">
      <div className="container split">
        <Reveal>
          <VoiceWave />
        </Reveal>
        <div className="stack">
          <Reveal>
            <p className="eyebrow">Voice</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 id="voice-title" className="h2">
              Just talk to it.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="lede">
              Natural, conversational interaction. Speak the task, hear the answer. Text is always
              there when voice isn&apos;t the right fit.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** 10 Capabilities — horizontal storytelling */
export function Capabilities() {
  return (
    <section className="section" aria-labelledby="caps-title">
      <div className="container">
        <SectionHead
          eyebrow="Capabilities"
          title={<span id="caps-title">Built to do real work.</span>}
          lede="Each capability is labelled with its real status. We only mark something Available once it ships."
        />
        <div
          className="hscroll"
          role="region"
          aria-label="Capabilities, scroll horizontally"
        >
          {CAPABILITIES.map((c, i) => (
            <article key={c.id} className="card cap-card">
              <div>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3" style={{ marginTop: "0.6rem" }}>
                  {c.title}
                </h3>
                <p>{c.body}</p>
              </div>
              <div style={{ marginTop: "1.25rem" }}>
                <StatusBadge status={c.status} />
              </div>
            </article>
          ))}
        </div>
        <div style={{ marginTop: "1rem" }}>
          <ButtonLink href="/capabilities">All capabilities</ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** 11 Parallel Work */
export function ParallelWork() {
  return (
    <section className="section alt" aria-labelledby="parallel-title">
      <div className="container split rev">
        <div className="stack">
          <Reveal>
            <p className="eyebrow">Parallel work</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 id="parallel-title" className="h2">
              Many things at once.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="lede">
              STONIC can work on several tasks concurrently. Real limits apply: your hardware,
              available models and the tasks themselves decide how much runs in parallel.
            </p>
          </Reveal>
        </div>
        <Reveal delay={2}>
          <ParallelLanes />
        </Reveal>
      </div>
    </section>
  );
}

/** 12 Ecosystem */
export function Ecosystem() {
  return (
    <section className="section" aria-labelledby="eco-title">
      <div className="container split">
        <Reveal>
          <EcosystemTriad />
        </Reveal>
        <div className="stack">
          <Reveal>
            <p className="eyebrow">Ecosystem · Concept</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 id="eco-title" className="h2">
              Starts on your PC. Designed to extend.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="lede">
              The PC is where STONIC begins. A phone companion and cloud connection are part of the
              longer-term concept, not part of Gen 1.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <ButtonLink href="/ecosystem">Read the concept</ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** 13 Real Product — only real Gen 1 media uploaded through the admin. Never mockups. */
export function RealProduct({ media }: { media: string[] }) {
  return (
    <section className="section alt" aria-labelledby="real-title">
      <div className="container">
        <SectionHead
          eyebrow="Real product"
          title={<span id="real-title">The actual application.</span>}
          lede="Only real STONIC Gen 1 captures appear here. No mockups, no concept art passed off as the product."
        />
        {media.length > 0 ? (
          <div className="media-grid">
            {media.map((name, i) => (
              <Reveal key={name} delay={i % 3}>
                <div className="media-frame">
                  {isVideo(name) ? (
                    <video
                      src={`/media/${name}`}
                      controls
                      preload="metadata"
                      playsInline
                      aria-label="STONIC Gen 1 recording"
                    >
                    </video>
                  ) : (
                    <Image
                      src={`/media/${name}`}
                      alt="STONIC Gen 1 screenshot"
                      width={1280}
                      height={720}
                      loading="lazy"
                      unoptimized
                    />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="media-empty">
              <span className="badge">Coming with Gen 1</span>
              <h3 className="h3">Real captures are on the way.</h3>
              <p className="muted" style={{ maxWidth: "34rem" }}>
                We&apos;ll publish screenshots and recordings of the real application as soon as Gen
                1 is ready to show, and nothing before.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/** 14 Built Different */
export function BuiltDifferent() {
  return (
    <section className="section" aria-labelledby="diff-title">
      <div className="container">
        <SectionHead
          eyebrow="Built different"
          title={<span id="diff-title">Answering is not doing.</span>}
        />
        <div className="compare">
          <Reveal>
            <div className="card">
              <span className="badge">Answer-only AI</span>
              <h3 className="h3" style={{ marginTop: "1rem" }}>
                You do the work.
              </h3>
              <p>
                It produces text. You copy, click, switch apps and find out later whether it worked.
              </p>
              <div className="flow">
                <span>Prompt</span>
                <i>→</i>
                <span>Response</span>
                <i>→</i>
                <span>You</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="card hl">
              <span className="badge live">STONIC</span>
              <h3 className="h3" style={{ marginTop: "1rem" }}>
                It closes the loop.
              </h3>
              <p>
                It plans, acts, observes the outcome and verifies, then tells you what actually
                happened.
              </p>
              <div className="flow">
                <span>Plan</span>
                <i>→</i>
                <span>Act</span>
                <i>→</i>
                <span>Observe</span>
                <i>→</i>
                <span>Verify</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** 15 Technology — high level, no secrets */
export function Technology() {
  const layers: [string, string][] = [
    ["Interface", "Voice and text"],
    ["Core intelligence", "One persistent mind"],
    ["Agent coordination", "Temporary specialists"],
    ["Memory", "Context carried forward"],
    ["Tools & computer control", "Plan · act · observe · verify"],
    ["Models", "Language and speech intelligence"],
  ];
  return (
    <section className="section alt" aria-labelledby="tech-title">
      <div className="container split">
        <div className="stack">
          <Reveal>
            <p className="eyebrow">Technology</p>
          </Reveal>
          <Reveal delay={1}>
            <h2 id="tech-title" className="h2">
              The architecture, at a glance.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="lede">
              A high-level view of how STONIC is layered. This is a conceptual overview, not an
              implementation guide.
            </p>
          </Reveal>
        </div>
        <div className="arch">
          {layers.map(([a, b], i) => (
            <Reveal key={a} delay={i}>
              <div className="arch-layer">
                <span>{a}</span>
                <span>{b}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 16 Gen 1 */
export function Gen1({ stage }: { stage: SiteContent["settings"]["releaseStage"] }) {
  return (
    <section className="section" aria-labelledby="gen1-title">
      <div className="container">
        <SectionHead
          eyebrow="STONIC Gen 1"
          title={<span id="gen1-title">The first complete STONIC.</span>}
          lede="Gen 1 is the first complete, releasable version of STONIC, with everything above working together as one product."
        />
        <Reveal>
          <div className="btn-row" style={{ alignItems: "center" }}>
            <span className={`badge${stage === "released" ? " live" : ""}`}>
              {stage === "released" ? "Released" : "In development"}
            </span>
            <ButtonLink href="/gen-1">About Gen 1</ButtonLink>
            <ButtonLink href="/roadmap">Roadmap</ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** 17 Final CTA */
export function FinalCta({ stage }: { stage: SiteContent["settings"]["releaseStage"] }) {
  return (
    <section className="section alt" aria-labelledby="cta-title" style={{ textAlign: "center" }}>
      <div
        className="container stack"
        style={{ display: "grid", justifyItems: "center", gap: "1.5rem" }}
      >
        <Reveal>
          <h2 id="cta-title" className="display" style={{ fontSize: "clamp(2.2rem, 6vw, 4.8rem)" }}>
            Meet <span className="grad-text">STONIC</span>.
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="lede" style={{ marginInline: "auto" }}>
            {stage === "released"
              ? "Download STONIC Gen 1 and put your computer to work."
              : "Gen 1 is in development. See where it stands and how to get it when it ships."}
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="btn-row" style={{ justifyContent: "center" }}>
            <ButtonLink href="/download" variant="primary">
              {stage === "released" ? "Download Gen 1" : "Download status"}
            </ButtonLink>
            <Link className="btn" href="/support">
              Contact support
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
