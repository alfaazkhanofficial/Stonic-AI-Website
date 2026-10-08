import { PageHero } from "./ui";
import type { LegalSection } from "@/content/legal";

export function LegalPage({
  title,
  lede,
  effective,
  sections,
}: {
  title: string;
  lede: string;
  effective: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} lede={`${lede} Effective ${effective}.`} />
      <section className="section">
        <div className="container prose">
          <nav className="toc" aria-label="On this page">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.title.replace(/^\d+\.\s*/, "")}
              </a>
            ))}
          </nav>
          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`}>{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {s.list && (
                <ul>
                  {s.list.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
