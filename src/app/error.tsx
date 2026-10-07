"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error", error.digest ?? error.message);
  }, [error]);
  return (
    <section className="section">
      <div className="container stack">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}>
          We hit a snag.
        </h1>
        <p className="lede">
          The page failed to load. Try again, and if it keeps happening, contact support.
        </p>
        <button className="btn primary" type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </section>
  );
}
