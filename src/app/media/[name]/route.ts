import { MIME, extOf, readMedia } from "@/lib/media";

export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const data = await readMedia(name); // validates name against a strict allowlist (no traversal)
  if (!data) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": MIME[extOf(name)] ?? "application/octet-stream",
      "Content-Length": String(data.length),
      "Cache-Control": "public, max-age=31536000, immutable", // filenames are unique per upload
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
