import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { SYSTEM_REQUIREMENTS } from "@/content/releases";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Install, verify and use STONIC Gen 1.",
};

const TOC = [
  ["install", "Install"],
  ["verify", "Verify your download"],
  ["use", "Voice and text"],
  ["control", "Computer control"],
  ["agents", "Agents and memory"],
  ["safe", "Using it safely"],
  ["help", "Troubleshooting"],
] as const;

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Documentation"
        title="Using STONIC."
        lede="The essentials: install it, check it, and get real work done."
      />
      <section className="section">
        <div className="container prose">
          <nav className="toc" aria-label="On this page">
            {TOC.map(([id, l]) => (
              <a key={id} href={`#${id}`}>
                {l}
              </a>
            ))}
          </nav>

          <section id="install">
            <h2>Install</h2>
            <p>
              Download the installer from the <Link href="/releases">Releases</Link> page and run
              it. Make sure your computer meets the requirements:
            </p>
            <ul className="req">
              {SYSTEM_REQUIREMENTS.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p>Install only from this website. Installers from anywhere else are not ours.</p>
          </section>

          <section id="verify">
            <h2>Verify your download</h2>
            <p>
              Each installer on the Releases page shows a SHA-256 checksum. Compute the checksum of
              your file and compare:
            </p>
            <pre className="verify" style={{ padding: "0.8rem 1rem" }}>
              <code>
                Get-FileHash .\FILE-NAME -Algorithm SHA256 # Windows PowerShell{"\n"}shasum -a 256
                FILE-NAME # macOS / Linux
              </code>
            </pre>
            <p>
              They must match exactly. If they don&apos;t, delete the file and download it again.
            </p>
          </section>

          <section id="use">
            <h2>Voice and text</h2>
            <p>
              Talk to STONIC out loud or type to it. Text is always available, so a missing
              microphone never blocks you. Describe the outcome you want rather than the clicks to
              get there, for example what should be finished, in which project, and anything it must
              not touch.
            </p>
          </section>

          <section id="control">
            <h2>Computer control</h2>
            <p>
              STONIC works in a loop. It <strong>plans</strong> the steps, <strong>acts</strong> on
              your computer, <strong>observes</strong> what actually changed, and{" "}
              <strong>verifies</strong> the result before moving on or correcting itself. It reports
              back with what really happened, not what it hoped would happen.
            </p>
          </section>

          <section id="agents">
            <h2>Agents and memory</h2>
            <p>
              One main intelligence owns your goal. When a task needs it, STONIC brings in temporary
              specialists, such as research, code, files or web, and retires them when their part is
              done. Memory carries relevant context between sessions so you don&apos;t have to
              repeat yourself.
            </p>
          </section>

          <section id="safe">
            <h2>Using it safely</h2>
            <ul>
              <li>
                Keep backups of anything important before asking STONIC to reorganise or change it.
              </li>
              <li>
                Review actions that touch accounts, money, or data you can&apos;t easily recover.
              </li>
              <li>Be specific about what is off limits.</li>
              <li>AI can be wrong. Check results that matter.</li>
            </ul>
            <p>
              See the <Link href="/security">Security</Link> page and the{" "}
              <Link href="/license">License</Link> for the full picture.
            </p>
          </section>

          <section id="help">
            <h2>Troubleshooting</h2>
            <ul>
              <li>
                <strong>Installer won&apos;t run:</strong> re-download it, verify the checksum, and
                run it again.
              </li>
              <li>
                <strong>Voice isn&apos;t picking you up:</strong> check that your microphone is
                allowed and selected in your system sound settings, or use text.
              </li>
              <li>
                <strong>A task didn&apos;t finish:</strong> restate the goal with more detail and
                what &ldquo;done&rdquo; looks like.
              </li>
            </ul>
            <p>
              Still stuck? <Link href="/contact">Contact us</Link> with what you expected, what
              happened and your system details.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
