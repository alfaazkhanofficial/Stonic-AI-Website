import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { privacySections } from "@/content/legal";
import { getContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How information is handled on this website and in STONIC.",
};

export default async function Page() {
  const { legal, settings } = await getContent();
  const ctx = {
    owner: legal.ownerName,
    email: settings.supportEmail,
    law: legal.governingLaw,
    effective: legal.effectiveDate,
  };
  return (
    <LegalPage
      title="Privacy"
      lede="How information is handled on this website and in STONIC."
      effective={legal.effectiveDate}
      sections={privacySections(ctx)}
    />
  );
}
