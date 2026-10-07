"use client";
import { useEffect } from "react";

/** Publishes scroll position as CSS variables (--sy, --progress). One rAF-throttled listener; no layout reads in hot path beyond scrollY. */
export function ScrollFX() {
  useEffect(() => {
    let raf = 0;
    const root = document.documentElement;
    const update = () => {
      raf = 0;
      const max = Math.max(1, root.scrollHeight - window.innerHeight);
      root.style.setProperty("--sy", String(Math.round(window.scrollY)));
      root.style.setProperty("--progress", String(Math.min(1, window.scrollY / max)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return <div className="progress" aria-hidden="true" />;
}
