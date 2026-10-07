import { ButtonLink } from "@/components/ui";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="section">
      <div className="container stack">
        <p className="eyebrow">404</p>
        <h1 className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}>
          That page doesn&apos;t exist.
        </h1>
        <p className="lede">The link may be old or mistyped.</p>
        <ButtonLink href="/" variant="primary">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}
