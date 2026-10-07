import Image from "next/image";
import Link from "next/link";

/** Official STONIC AI lockup (brand pack). Do not recolor/distort; min wordmark width 120px. */
export function Logo({ height = 30 }: { height?: number }) {
  const width = Math.round(height * (2048 / 436));
  return (
    <Link href="/" className="logo" aria-label="STONIC AI — home">
      <Image
        src="/brand/stonic-ai-logo-640.png"
        alt="STONIC AI"
        width={width}
        height={height}
        priority
        unoptimized
      />
    </Link>
  );
}
