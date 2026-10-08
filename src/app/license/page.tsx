import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { licenseSections } from "@/content/legal";
import { getContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "License",
  description: "The STONIC software is proprietary and licensed, not sold.",
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
      title="License"
      lede="The STONIC software is proprietary and licensed, not sold."
      effective={legal.effectiveDate}
      sections={licenseSections(ctx)}
    />
  );
}
