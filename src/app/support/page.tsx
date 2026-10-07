import type { Metadata } from "next";
import { ButtonLink, PageHero } from "@/components/ui";
import { getContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Support", description: "Get help with STONIC." };

export default async function Page() {
  const { settings } = await getContent();
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Talk to a human."
        lede="Questions, feedback or problems. Tell us what you were trying to do."
      />
      <section className="section">
        <div className="container prose">
          {settings.supportEmail ? (
            <>
              <p>Email us and include what you expected, what happened and your system details.</p>
              <div className="btn-row" style={{ marginTop: "1.5rem" }}>
                <ButtonLink href={`mailto:${settings.supportEmail}`} variant="primary">
                  {settings.supportEmail}
                </ButtonLink>
              </div>
            </>
          ) : (
            <p className="notice">A support address will be published here shortly.</p>
          )}
        </div>
      </section>
    </>
  );
}
