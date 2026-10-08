/**
 * Free-hosting backend: the admin saves content and media by COMMITTING them to your GitHub repository
 * (Contents API). Your host (Vercel / Cloudflare Pages) then redeploys, so the public site stays fully static.
 *
 * Needs a fine-grained token limited to THIS repo with "Contents: Read and write". Server-only; never sent to the browser.
 */
export type GithubConfig = { token: string; repo: string; branch: string; apiBase?: string };
type FetchFn = typeof fetch;

export function githubConfig(env: NodeJS.ProcessEnv = process.env): GithubConfig | null {
  const token = env.GITHUB_TOKEN?.trim();
  const repo = env.GITHUB_REPO?.trim();
  if (!token || !repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) return null;
  return {
    token,
    repo,
    branch: env.GITHUB_BRANCH?.trim() || "main",
    apiBase: env.GITHUB_API_BASE?.trim() || undefined,
  };
}

export class GithubStore {
  constructor(
    private cfg: GithubConfig,
    private fetchImpl: FetchFn = (...a) => fetch(...a),
  ) {}

  private url(p: string, withRef: boolean) {
    const safe = p.split("/").map(encodeURIComponent).join("/");
    return `${this.cfg.apiBase ?? "https://api.github.com"}/repos/${this.cfg.repo}/contents/${safe}${withRef ? `?ref=${encodeURIComponent(this.cfg.branch)}` : ""}`;
  }
  private headers(extra: Record<string, string> = {}) {
    return {
      Authorization: `Bearer ${this.cfg.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "stonic-website-admin",
      ...extra,
    };
  }

  /** Returns the file bytes + sha, or null if it does not exist. */
  async getFile(p: string): Promise<{ sha: string; bytes: Buffer } | null> {
    const r = await this.fetchImpl(this.url(p, true), {
      headers: this.headers(),
      cache: "no-store",
    });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`GitHub read failed (${r.status})`);
    const j = (await r.json()) as { sha: string; content?: string; encoding?: string };
    return { sha: j.sha, bytes: Buffer.from(j.content ?? "", "base64") };
  }

  async list(dir: string): Promise<{ name: string; size: number; sha: string }[]> {
    const r = await this.fetchImpl(this.url(dir, true), {
      headers: this.headers(),
      cache: "no-store",
    });
    if (r.status === 404) return [];
    if (!r.ok) throw new Error(`GitHub list failed (${r.status})`);
    const j = (await r.json()) as { name: string; size: number; sha: string; type: string }[];
    return Array.isArray(j)
      ? j.filter((x) => x.type === "file").map(({ name, size, sha }) => ({ name, size, sha }))
      : [];
  }

  async putFile(
    p: string,
    bytes: Uint8Array | string,
    message: string,
    attempt = 0,
  ): Promise<void> {
    const existing = await this.getFile(p);
    const content = Buffer.from(typeof bytes === "string" ? bytes : bytes).toString("base64");
    const r = await this.fetchImpl(this.url(p, false), {
      method: "PUT",
      headers: this.headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        message,
        content,
        branch: this.cfg.branch,
        ...(existing ? { sha: existing.sha } : {}),
      }),
    });
    if (r.status === 409 && attempt < 2) return this.putFile(p, bytes, message, attempt + 1); // concurrent edit: retry
    if (!r.ok) throw new Error(`GitHub write failed (${r.status})`);
  }

  async deleteFile(p: string, message: string): Promise<void> {
    const existing = await this.getFile(p);
    if (!existing) return;
    const r = await this.fetchImpl(this.url(p, false), {
      method: "DELETE",
      headers: this.headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ message, sha: existing.sha, branch: this.cfg.branch }),
    });
    if (!r.ok) throw new Error(`GitHub delete failed (${r.status})`);
  }
}

export function githubStore(): GithubStore | null {
  const cfg = githubConfig();
  return cfg ? new GithubStore(cfg) : null;
}
