# Cloudflare Workers deployment

This project uses Next.js 16 with the OpenNext Cloudflare adapter.

## Source-controlled configuration

- `wrangler.jsonc` is the Worker configuration source of truth.
- `open-next.config.ts` configures the OpenNext adapter.
- `.node-version` pins the Cloudflare build image to Node.js 22.23.2.
- `package.json` uses pinned `npx` commands so OpenNext/Wrangler do not need to be added as direct project dependencies.

## Worker identity

The Worker name and the OpenNext self-reference service are intentionally identical:

`stonic-ai-website`

`WORKER_SELF_REFERENCE` → `stonic-ai-website`

This prevents the stale `stonic-website` service-binding error.

## Cloudflare Workers Builds settings

Repository: `alfaazkhanofficial/Stonic-AI-Website`

Production branch: `main`

Root directory: `/`

Build command: leave blank

Deploy command: `npm run deploy`

The deploy script performs the OpenNext build and then deploys the generated Worker with the checked-in `wrangler.jsonc`.

## Node version

Cloudflare Workers Builds should detect `.node-version` automatically. If a dashboard override exists, set:

`NODE_VERSION=22.23.2`

## Do not use

Do not use `npx wrangler deploy` as the Workers Builds deploy command for this project. That can trigger framework auto-configuration when configuration is missing or incomplete.
