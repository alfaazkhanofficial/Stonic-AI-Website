/**
 * Legal text. Parameterised by owner/contact/governing law from site content.
 * This is a good-faith draft: have a lawyer review it for your jurisdiction before relying on it.
 */
export type LegalCtx = { owner: string; email: string; law: string; effective: string };
export type LegalSection = { id: string; title: string; body: string[]; list?: string[] };

const contact = (c: LegalCtx) =>
  c.email
    ? `You can contact us at ${c.email} or through the Contact page.`
    : "You can contact us through the Contact page.";
const law = (c: LegalCtx) =>
  c.law
    ? `This agreement is governed by the laws of ${c.law}, without regard to its conflict-of-law rules. The courts of ${c.law} have exclusive jurisdiction, except where mandatory consumer law in your country of residence gives you the right to bring a claim elsewhere.`
    : "This agreement is governed by the laws of the jurisdiction in which the Licensor is established, without regard to its conflict-of-law rules, except where mandatory consumer law in your country of residence provides otherwise.";

export function licenseSections(c: LegalCtx): LegalSection[] {
  return [
    {
      id: "overview",
      title: "1. Overview",
      body: [
        `This STONIC Software License Agreement (the "License") is between ${c.owner} ("Licensor", "we", "us") and you. STONIC Gen 1 and all updates, installers, documentation and related materials are the "Software". By downloading, installing or using the Software you agree to this License. If you do not agree, do not install or use the Software.`,
        "STONIC is proprietary software. It is licensed to you, not sold.",
      ],
    },
    {
      id: "grant",
      title: "2. License grant",
      body: [
        "Subject to this License, we grant you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to install and use the Software on devices that you own or control, for your personal use or for the internal operations of your business, in accordance with the documentation.",
      ],
    },
    {
      id: "ownership",
      title: "3. Ownership",
      body: [
        `The Software, including its code, design, models of operation, interface, logos, names and documentation, is owned by ${c.owner} and protected by copyright, trademark and other laws. No rights are granted except those expressly stated in this License. The STONIC name and logo are trademarks of the Licensor.`,
      ],
    },
    {
      id: "restrictions",
      title: "4. Restrictions",
      body: ["You must not, and must not allow anyone else to:"],
      list: [
        "copy the Software, except for the installation and one backup copy for your own use",
        "modify, translate, adapt or create derivative works of the Software",
        "reverse engineer, decompile or disassemble the Software or attempt to obtain its source code, except to the limited extent that applicable law permits despite this restriction",
        "sell, rent, lease, lend, sublicense, host as a service, or otherwise redistribute or make the Software available to third parties",
        "remove or alter any proprietary notices, labels or marks",
        "circumvent or disable any technical protection, usage limit or license mechanism",
        "use the Software or its outputs to build or train a competing product, or to systematically extract its prompts, logic or assets",
        "use the Software to break the law, infringe the rights of others, or cause harm",
      ],
    },
    {
      id: "third-party",
      title: "5. Third-party components and AI services",
      body: [
        "The Software may include open-source or third-party components that are licensed under their own terms. Those terms apply to those components, and nothing in this License limits rights you have under them.",
        "If you connect the Software to a third-party AI or online service, including by supplying your own credentials, that service is governed by its own terms and privacy policy, and any fees it charges are your responsibility. We do not control those services.",
      ],
    },
    {
      id: "control",
      title: "6. Actions on your computer",
      body: [
        "STONIC is designed to act on your computer on your instructions, including operating applications and working with files. You are responsible for the tasks you ask it to perform, for reviewing actions that could affect important data or accounts, and for keeping backups. AI output can be wrong; check results that matter.",
      ],
    },
    {
      id: "updates",
      title: "7. Updates",
      body: [
        "We may provide updates, which are part of the Software and covered by this License. Some updates may be needed to keep the Software working or secure. We are not obliged to provide any particular update or support.",
      ],
    },
    {
      id: "feedback",
      title: "8. Feedback",
      body: [
        "If you send us suggestions or feedback, you give us a perpetual, worldwide, royalty-free right to use them without obligation to you.",
      ],
    },
    {
      id: "privacy",
      title: "9. Privacy",
      body: ["Our handling of personal information is described in the Privacy Policy."],
    },
    {
      id: "termination",
      title: "10. Term and termination",
      body: [
        "This License lasts until terminated. It ends automatically if you breach it. You may end it at any time by uninstalling the Software and deleting all copies. On termination you must stop using the Software and delete all copies. Sections 3, 4, 11, 12, 13 and 14 survive termination.",
      ],
    },
    {
      id: "warranty",
      title: "11. Disclaimer of warranties",
      body: [
        'To the maximum extent permitted by law, the Software is provided "as is" and "as available", without warranties of any kind, whether express or implied, including merchantability, fitness for a particular purpose, accuracy, and non-infringement. We do not warrant that the Software will be uninterrupted, error-free or free of harmful components, or that AI outputs will be correct.',
      ],
    },
    {
      id: "liability",
      title: "12. Limitation of liability",
      body: [
        "To the maximum extent permitted by law, the Licensor will not be liable for any indirect, incidental, special, consequential or punitive damages, or for loss of data, profits, revenue or goodwill, arising out of or related to the Software or this License. Our total liability for any claim is limited to the amount you paid for the Software in the twelve months before the claim, or if you paid nothing, to a nominal amount permitted by law. Nothing in this License excludes liability that cannot be excluded by law.",
      ],
    },
    {
      id: "export",
      title: "13. Export and compliance",
      body: [
        "You must comply with all laws that apply to your use of the Software, including export control and sanctions laws.",
      ],
    },
    { id: "law", title: "14. Governing law", body: [law(c)] },
    {
      id: "changes",
      title: "15. Changes",
      body: [
        "We may update this License. The version published with a release applies to that release. Continued use after an update means you accept it.",
      ],
    },
    { id: "contact", title: "16. Contact", body: [contact(c)] },
  ];
}

export function termsSections(c: LegalCtx): LegalSection[] {
  return [
    {
      id: "acceptance",
      title: "1. Acceptance",
      body: [
        `These Terms apply to your use of this website and related services provided by ${c.owner}. By using the website you agree to them. If you do not agree, please do not use it.`,
      ],
    },
    {
      id: "software",
      title: "2. The software",
      body: [
        "Use of the STONIC software is governed by the STONIC Software License (proprietary). If these Terms and the License conflict about the software, the License prevails.",
      ],
    },
    {
      id: "use",
      title: "3. Acceptable use",
      body: ["You agree not to:"],
      list: [
        "attempt to disrupt, overload, probe or gain unauthorised access to the website or its systems",
        "scrape or copy the website at a rate or in a way that harms it",
        "use the website to distribute malware or unlawful content",
        "misrepresent your affiliation with us or imply our endorsement",
      ],
    },
    {
      id: "ai",
      title: "4. AI features",
      body: [
        "STONIC uses artificial intelligence, which can produce incorrect, incomplete or unexpected results. You are responsible for reviewing outputs and actions before relying on them, particularly for anything affecting important data, finances, security or other people.",
      ],
    },
    {
      id: "ip",
      title: "5. Intellectual property",
      body: [
        `The website, its text, design, graphics, the STONIC name and logo, and the software are owned by ${c.owner} or its licensors and are protected by law. You may view the website for personal use and share links to it. You may not copy, alter or reuse our content or marks without written permission. The logo may only be used in its approved forms.`,
      ],
    },
    {
      id: "downloads",
      title: "6. Downloads and checksums",
      body: [
        "Install software only from this website. Compare the SHA-256 checksum of any file you download with the value published on the Releases page. We are not responsible for files obtained from other sources.",
      ],
    },
    {
      id: "third-party",
      title: "7. Third-party links and services",
      body: [
        "The website may link to third-party sites and services we do not control. We are not responsible for their content or practices.",
      ],
    },
    {
      id: "disclaimer",
      title: "8. Disclaimer",
      body: [
        'The website and its information are provided "as is" and "as available" to the maximum extent permitted by law, without warranties of any kind. Descriptions of the software are for information and may change as the software evolves.',
      ],
    },
    {
      id: "liability",
      title: "9. Limitation of liability",
      body: [
        "To the maximum extent permitted by law, we are not liable for indirect, incidental, special or consequential damages, or loss of data or profits, arising from your use of the website. Nothing here excludes liability that cannot be excluded by law.",
      ],
    },
    {
      id: "changes",
      title: "10. Changes",
      body: [
        "We may update these Terms. The date at the top shows when they last changed. Continued use after a change means you accept it.",
      ],
    },
    { id: "law", title: "11. Governing law", body: [law(c)] },
    { id: "contact", title: "12. Contact", body: [contact(c)] },
  ];
}

export function privacySections(c: LegalCtx): LegalSection[] {
  return [
    {
      id: "who",
      title: "1. Who we are",
      body: [
        `${c.owner} ("we", "us") provides STONIC and this website. This policy explains what personal information is involved and how we treat it. ${contact(c)}`,
      ],
    },
    {
      id: "website",
      title: "2. This website",
      body: [
        "We do not run advertising or analytics trackers on this website, and we do not set cookies for visitors. Our hosting provider records standard technical logs (such as IP address, pages requested, and time) to keep the service secure and reliable.",
        "If you email us or use the contact form, we receive the information you choose to send (for example your name, email address and message). The contact form opens your own email application; nothing is stored by the website itself.",
      ],
    },
    {
      id: "app",
      title: "3. The STONIC application",
      body: ["Depending on the features you use, STONIC may handle:"],
      list: [
        "voice and text you give it",
        "files, screen content and application state you ask it to work with",
        "memory entries created so it can remember context between sessions",
        "settings and credentials you provide, such as keys for AI services you choose to connect",
      ],
    },
    {
      id: "processing",
      title: "4. How information is processed",
      body: [
        "To generate responses, STONIC may send the content of your requests to third-party AI service providers. Those providers process that content under their own terms and privacy policies. Review what you ask STONIC to work with, especially sensitive material.",
        "We use information only to provide, secure and improve STONIC and to respond to you. We do not sell personal information.",
      ],
    },
    {
      id: "sharing",
      title: "5. Sharing",
      body: [
        "We share information only with service providers that help us run the website or software, when required by law, or to protect rights and safety. We require providers we engage to protect the information.",
      ],
    },
    {
      id: "retention",
      title: "6. Retention",
      body: [
        "We keep information only as long as needed for the purposes above or as the law requires. Messages you send us are kept for as long as needed to handle your request and for reasonable record-keeping.",
      ],
    },
    {
      id: "security",
      title: "7. Security",
      body: [
        "We use reasonable technical and organisational measures to protect information. No system is perfectly secure. Please report suspected security problems to us.",
      ],
    },
    {
      id: "rights",
      title: "8. Your rights",
      body: [
        "Depending on where you live, you may have rights to access, correct, delete or restrict the use of your personal information, to object to certain uses, and to complain to your data protection authority. To exercise a right, contact us and we will respond within a reasonable time.",
      ],
    },
    {
      id: "children",
      title: "9. Children",
      body: [
        "STONIC and this website are not directed to children under 13, and we do not knowingly collect their personal information. If you believe a child has sent us information, contact us and we will delete it.",
      ],
    },
    {
      id: "transfers",
      title: "10. International transfers",
      body: [
        "Our providers may process information in other countries. Where required, we use appropriate safeguards for such transfers.",
      ],
    },
    {
      id: "changes",
      title: "11. Changes",
      body: ["We may update this policy. The date at the top shows the latest version."],
    },
  ];
}
