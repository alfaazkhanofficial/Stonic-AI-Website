import type { Metadata } from "next";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How this website handles your data.",
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy" lede="Last updated October 2026." />
      <section className="section">
        <div className="container prose">
          <h2>What this website collects</h2>
          <p>
            We do not run analytics, advertising or tracking scripts on this website, and we set no
            cookies for visitors. Our hosting provider keeps standard server logs (such as IP
            address, requested page and time) for security and reliability.
          </p>
          <h2>Email</h2>
          <p>
            If you email us, we use your message and address only to reply and to improve STONIC.
          </p>
          <h2>Administrators</h2>
          <p>
            Authorized maintainers receive a secure session cookie that is used only to keep them
            signed in to the admin area.
          </p>
          <h2>The STONIC application</h2>
          <p>
            How the application handles data will be described in its own privacy information at
            release.
          </p>
          <h2>Contact</h2>
          <p>
            Use the details on the <a href="/support">support page</a> for any privacy question.
          </p>
        </div>
      </section>
    </>
  );
}
