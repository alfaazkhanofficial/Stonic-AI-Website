import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/ui";
import { getContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the STONIC team for support, licensing, security or press.",
};

export default async function Page() {
  const { settings, socials } = await getContent();
  const email = settings.supportEmail;
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to us."
        lede="Support, licensing, security reports or press. Tell us what you need and we'll reply by email."
      />
      <section className="section">
        <div className="container contact-grid">
          <div className="stack">
            <div className="card">
              <p className="eyebrow">Email</p>
              {email ? (
                <p className="h3" style={{ marginTop: "0.75rem", wordBreak: "break-all" }}>
                  <a href={`mailto:${email}`}>{email}</a>
                </p>
              ) : (
                <p className="muted" style={{ marginTop: "0.75rem" }}>
                  The contact email hasn&apos;t been set up on this site yet.
                </p>
              )}
            </div>
            {socials.length > 0 && (
              <div className="card">
                <p className="eyebrow">Elsewhere</p>
                <ul className="req" style={{ marginTop: "0.75rem" }}>
                  {socials.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} rel="noopener noreferrer">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="notice">
              Reporting a security problem? Choose &ldquo;Security report&rdquo; as the topic and
              include steps to reproduce it.
            </p>
          </div>
          <div className="card">
            {email ? (
              <ContactForm email={email} />
            ) : (
              <p className="muted">The contact form turns on as soon as a contact email is set.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
