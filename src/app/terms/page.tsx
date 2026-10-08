import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { termsSections } from "@/content/legal";
import { getContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms for using this website and STONIC.",
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
      title="Terms"
      lede="The terms for using this website and STONIC."
      effective={legal.effectiveDate}
      sections={termsSections(ctx)}
    />
  );
}
