/**
 * Original marketing visualizations. These are abstract illustrations of concepts —
 * they are NOT screenshots or recreations of the STONIC app UI (see spec: no fake product UI).
 */
import type { ReactNode } from "react";

function Defs() {
  return (
    <defs>
      <radialGradient id="coreGrad" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor="#8ea6ff" />
        <stop offset="100%" stopColor="#2a45d6" />
      </radialGradient>
    </defs>
  );
}

function Frame({
  children,
  label,
  caption,
  wide = false,
}: {
  children: ReactNode;
  label: string;
  caption?: string;
  wide?: boolean;
}) {
  return (
    <figure style={{ margin: 0 }}>
      <div className={`visual${wide ? " wide" : ""}`}>{children}</div>
      {caption && <figcaption className="visual-caption">{caption}</figcaption>}
      <span className="sr-only">{label}</span>
    </figure>
  );
}

const pol = (cx: number, cy: number, r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
};

/** Core intelligence surrounded by the surfaces it operates on. */
export function OperatingLayer() {
  const nodes = ["Voice", "Memory", "Agents", "Computer", "Web", "Files"];
  return (
    <Frame
      label="Diagram: STONIC at the center, connected to voice, memory, agents, computer, web and files."
      caption="Concept illustration"
    >
      <svg viewBox="0 0 400 400" role="img" aria-hidden="true">
        <Defs />
        <circle className="v-line" cx="200" cy="200" r="150" />
        <circle className="v-line" cx="200" cy="200" r="100" />
        <g className="spin">
          <circle className="v-dash" cx="200" cy="200" r="125" />
        </g>
        <g className="spin rev">
          <circle className="v-dash" cx="200" cy="200" r="175" />
        </g>
        {nodes.map((n, i) => {
          const p = pol(200, 200, 150, i * 60);
          return (
            <g key={n}>
              <line className="v-line" x1="200" y1="200" x2={p.x} y2={p.y} />
              <circle className="v-node" cx={p.x} cy={p.y} r="26" />
              <circle
                cx={p.x}
                cy={p.y}
                r="3"
                fill="#8ea6ff"
                className="pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
              />
              <text
                className="v-text"
                x={p.x}
                y={p.y + 44 * (p.y > 200 ? 0.72 : -0.55)}
                textAnchor="middle"
              >
                {n}
              </text>
            </g>
          );
        })}
        <circle className="v-core pulse" cx="200" cy="200" r="38" />
        <text
          className="v-text strong"
          x="200"
          y="204"
          textAnchor="middle"
          style={{ fill: "#04060d", fontWeight: 700 }}
        >
          STONIC
        </text>
      </svg>
    </Frame>
  );
}

/** A core that summons temporary specialists. */
export function AgentGraph() {
  const specs = ["Research", "Code", "Files", "Web", "Comms"];
  return (
    <Frame
      label="Diagram: a core agent briefly creating specialist agents for research, code, files, web and communication."
      caption="Illustrative · specialists appear per task"
    >
      <svg viewBox="0 0 400 400" role="img" aria-hidden="true">
        <Defs />
        {specs.map((s, i) => {
          const p = pol(200, 200, 140, i * 72 + 18);
          return (
            <g key={s} className="blink" style={{ "--i": i } as React.CSSProperties}>
              <line className="v-dash" x1="200" y1="200" x2={p.x} y2={p.y} />
              <circle className="v-node" cx={p.x} cy={p.y} r="28" />
              <text
                className="v-text"
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                style={{ fontSize: 9 }}
              >
                {s}
              </text>
            </g>
          );
        })}
        <circle cx="200" cy="200" r="60" fill="none" className="v-line" />
        <circle className="v-core pulse" cx="200" cy="200" r="34" />
        <text
          className="v-text"
          x="200"
          y="204"
          textAnchor="middle"
          style={{ fill: "#04060d", fontWeight: 700 }}
        >
          CORE
        </text>
      </svg>
    </Frame>
  );
}

/** PLAN → ACT → OBSERVE → VERIFY. */
export function ControlLoop() {
  const steps = ["Plan", "Act", "Observe", "Verify"];
  return (
    <Frame
      label="Diagram: a loop of four steps — plan, act, observe, verify."
      caption="The control loop"
    >
      <svg viewBox="0 0 400 400" role="img" aria-hidden="true">
        <Defs />
        <circle className="v-line" cx="200" cy="200" r="130" />
        <circle
          className="orbit-dot"
          r="6"
          fill="#9db4ff"
          style={{ offsetPath: "path('M 200 70 a 130 130 0 1 1 -0.01 0')" }}
        />
        {steps.map((s, i) => {
          const p = pol(200, 200, 130, i * 90);
          return (
            <g key={s}>
              <circle className="v-node" cx={p.x} cy={p.y} r="34" />
              <text
                className="v-text strong"
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                style={{ fontSize: 10 }}
              >
                {s}
              </text>
            </g>
          );
        })}
        <text className="v-text" x="200" y="205" textAnchor="middle">
          repeat until true
        </text>
      </svg>
    </Frame>
  );
}

/** Context carried forward through time. */
export function MemoryThreads() {
  return (
    <Frame
      wide
      label="Diagram: past sessions as threads converging into the present moment."
      caption="Context carried forward"
    >
      <svg viewBox="0 0 640 400" role="img" aria-hidden="true">
        <Defs />
        {[110, 200, 290].map((y, r) => (
          <g key={y}>
            <line className="v-line" x1="30" y1={y} x2="500" y2={y} />
            {[70, 170, 270, 380].map((x, i) => (
              <circle
                key={x}
                cx={x + r * 22}
                cy={y}
                r="5"
                className="pulse"
                fill="#6f93ff"
                style={{ animationDelay: `${(i + r) * 0.4}s` }}
              />
            ))}
            <path className="v-dash" d={`M ${380 + r * 22} ${y} C 470 ${y}, 480 200, 540 200`} />
          </g>
        ))}
        <circle className="v-core pulse" cx="560" cy="200" r="34" />
        <text
          className="v-text strong"
          x="560"
          y="204"
          textAnchor="middle"
          style={{ fill: "#04060d", fontWeight: 700 }}
        >
          NOW
        </text>
        <text className="v-text" x="30" y="60">
          Earlier sessions
        </text>
      </svg>
    </Frame>
  );
}

export function VoiceWave() {
  return (
    <Frame wide label="Illustration: an animated voice waveform." caption="Voice">
      <svg viewBox="0 0 640 400" role="img" aria-hidden="true">
        {Array.from({ length: 41 }).map((_, i) => {
          const h = 40 + 150 * Math.abs(Math.sin(i * 0.55)) * (1 - Math.abs(i - 20) / 26);
          return (
            <rect
              key={i}
              className="wave-bar"
              style={{ "--i": i } as React.CSSProperties}
              x={30 + i * 14.5}
              y={200 - h / 2}
              width="6"
              height={h}
              rx="3"
              fill="url(#coreGrad)"
            />
          );
        })}
        <Defs />
      </svg>
    </Frame>
  );
}

/** Parallel lanes of work with a real-limits marker. */
export function ParallelLanes() {
  const lanes = ["Research", "Build", "Review", "Organize"];
  return (
    <Frame
      wide
      label="Diagram: four parallel lanes of work progressing at the same time, with a limit marker."
      caption="Parallel work · real limits apply"
    >
      <svg viewBox="0 0 640 400" role="img" aria-hidden="true">
        {lanes.map((l, i) => (
          <g key={l}>
            <text className="v-text" x="30" y={90 + i * 70}>
              {l}
            </text>
            <rect x="140" y={76 + i * 70} width="440" height="14" rx="7" className="v-node" />
            <rect
              className="lane-fill"
              style={{ "--i": i } as React.CSSProperties}
              x="140"
              y={76 + i * 70}
              width="440"
              height="14"
              rx="7"
              fill="#4f6bff"
            />
          </g>
        ))}
        <line x1="500" y1="50" x2="500" y2="350" className="v-dash" />
        <text className="v-text" x="500" y="372" textAnchor="middle">
          Limit
        </text>
      </svg>
    </Frame>
  );
}

/** PC at the center, phone and cloud as concept satellites. */
export function EcosystemTriad() {
  return (
    <Frame
      label="Concept diagram: the PC as the center of the ecosystem, with phone and cloud as future extensions."
      caption="Concept · PC first"
    >
      <svg viewBox="0 0 400 400" role="img" aria-hidden="true">
        <Defs />
        <line className="v-dash" x1="200" y1="200" x2="80" y2="90" />
        <line className="v-dash" x1="200" y1="200" x2="320" y2="90" />
        <circle className="v-core pulse" cx="200" cy="215" r="52" />
        <text
          className="v-text"
          x="200"
          y="219"
          textAnchor="middle"
          style={{ fill: "#04060d", fontWeight: 700 }}
        >
          PC
        </text>
        <rect className="v-node" x="48" y="50" width="64" height="80" rx="12" />
        <text className="v-text" x="80" y="150" textAnchor="middle">
          Phone
        </text>
        <ellipse className="v-node" cx="320" cy="90" rx="46" ry="30" />
        <text className="v-text" x="320" y="150" textAnchor="middle">
          Cloud
        </text>
      </svg>
    </Frame>
  );
}
