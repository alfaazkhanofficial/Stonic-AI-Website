import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "./reveal";
import { STATUS_LABEL, type CapStatus } from "@/content/capabilities";

export function ButtonLink({
  href,
  children,
  variant = "ghost",
  size,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "sm";
}) {
  const cls = ["btn", variant === "primary" ? "primary" : "", size === "sm" ? "sm" : ""]
    .filter(Boolean)
    .join(" ");
  const external = /^https?:/.test(href);
  return external ? (
    <a className={cls} href={href} rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link className={cls} href={href}>
      {children}
    </Link>
  );
}

export function StatusBadge({ status }: { status: CapStatus }) {
  return (
    <span className={`badge${status === "available" ? " live" : ""}`}>{STATUS_LABEL[status]}</span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <div className="section-head">
      {eyebrow && (
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={1}>
        <h2 className="h2">{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={2}>
          <p className="lede">{lede}</p>
        </Reveal>
      )}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="page-hero">
      <div className="container">
        <div className="stack">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display" style={{ fontSize: "clamp(2.3rem, 6vw, 4.6rem)" }}>
            {title}
          </h1>
          {lede && <p className="lede">{lede}</p>}
          {children}
        </div>
      </div>
    </header>
  );
}
