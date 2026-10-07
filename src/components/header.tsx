"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV } from "@/content/nav";
import { Logo } from "./logo";

export function Header() {
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname; // menu auto-closes on navigation
  const current = (href: string) => (pathname === href ? "page" : undefined);

  return (
    <>
      <header className="site-header">
        <div className="container">
          <Logo height={28} />
          <nav className="nav" aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={current(n.href)}>
                {n.label}
              </Link>
            ))}
          </nav>
          <Link className="btn primary sm header-cta" href="/download">
            Get STONIC
          </Link>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpenAt(open ? null : pathname)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 6h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </header>
      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={current(n.href)}>
              {n.label}
            </Link>
          ))}
          <Link href="/download" aria-current={current("/download")}>
            Download
          </Link>
        </nav>
      )}
    </>
  );
}
