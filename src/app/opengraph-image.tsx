import { ImageResponse } from "next/og";
import { promises as fs } from "node:fs";
import path from "node:path";

export const dynamic = "force-static";
export const alt = "STONIC AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const logo = await fs.readFile(path.join(process.cwd(), "public/brand/stonic-ai-logo-1280.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 35%, #12204f, #04060d 70%)",
        color: "#fff",
      }}
    >
      {}
      <img src={src} width={760} height={162} alt="" />
      <div style={{ marginTop: 48, fontSize: 40, color: "#c7d2fe", letterSpacing: -1 }}>
        Your computer is about to become intelligent.
      </div>
    </div>,
    size,
  );
}
