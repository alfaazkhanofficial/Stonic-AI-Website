# Legal pages: facts to confirm before launch

License (proprietary), Terms and Privacy are written as good-faith drafts in `src/content/legal.ts` and are parameterised from `src/content/site.ts` (`legal.ownerName`, `legal.governingLaw`, `legal.effectiveDate`) and the contact email. Have a lawyer review them. Confirm these facts match your product:

1. **Licensor name** (person or company) and **governing law / courts**.
2. **Who may use it**: personal and internal business use is granted. Change if you want personal-only.
3. **Privacy: AI providers.** The policy says request content may be sent to third-party AI providers. Make sure that is true of Gen 1 and name them if you wish.
4. **Privacy: data you collect.** The policy says the website sets no cookies and runs no analytics, and does not describe app telemetry. If Gen 1 sends any usage/diagnostic data, add it.
5. **Memory:** the policy says memory entries are created "so STONIC can remember context". Add where they are stored and how users delete them.
6. **Liability cap** (12 months' fees, or nominal if free) and **children under 13**: adjust to your market.
7. **Refunds / pricing**: none are described. Add pages if you charge.
8. **System requirements** (`SYSTEM_REQUIREMENTS` in `src/content/releases.ts`): defaults say Windows 10+ (64-bit). Correct them.
