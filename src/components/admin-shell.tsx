import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";

const LINKS = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/content", "Content"],
  ["/admin/media", "Media"],
  ["/admin/settings", "Settings"],
] as const;

export function AdminShell({
  current,
  title,
  children,
}: {
  current: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="admin-wrap">
      <nav className="admin-nav" aria-label="Admin">
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} aria-current={current === href ? "page" : undefined}>
            {label}
          </Link>
        ))}
        <form action={logoutAction}>
          <button className="btn sm" type="submit">
            Sign out
          </button>
        </form>
      </nav>
      <h1 className="h2" style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        {title}
      </h1>
      {children}
    </div>
  );
}
