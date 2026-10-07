import Link from "next/link";
import Image from "next/image";
import { FOOTER } from "@/content/nav";

const TITLES: Record<string, string> = {
  Product: "Product",
  Gen1: "STONIC Gen 1",
  Company: "Company",
  Legal: "Legal",
};

export function Footer({ siteName, supportEmail }: { siteName: string; supportEmail: string }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image
              src="/brand/stonic-ai-logo-640.png"
              alt={siteName}
              width={132}
              height={28}
              unoptimized
            />
            <p className="muted" style={{ marginTop: "1rem", fontSize: "0.95rem" }}>
              A personal AI that plans, acts, observes and verifies.
            </p>
          </div>
          {Object.entries(FOOTER).map(([group, links]) => (
            <nav key={group} aria-label={TITLES[group]}>
              <h2>{TITLES[group]}</h2>
              <ul>
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </span>
          {supportEmail && <a href={`mailto:${supportEmail}`}>{supportEmail}</a>}
        </div>
      </div>
    </footer>
  );
}
