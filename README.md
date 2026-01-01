# AILearnLabs — Astro + Cloudflare Pages

Learn AI tools faster. Build projects that matter.

This is a production‑ready landing site built with Astro + Tailwind, Cloudflare Pages Functions, Cloudflare KV, Turnstile, and Web Analytics.

## Tech Stack
- Astro (TypeScript) + Tailwind CSS
- Cloudflare Pages + Pages Functions (`/functions`)
- Cloudflare KV (binding: `CONTACTS_KV`)
- Cloudflare Turnstile (anti‑bot)
- Cloudflare Web Analytics

## Quick Start
1. Install deps: `npm i`
2. Run dev server: `npm run dev`
3. Build: `npm run build` (outputs to `dist`)
4. Preview production build: `npm run preview`

## Scripts
- `dev` — Astro dev server
- `build` — Astro build to `dist`
- `preview` — Preview production build
- `pages:dev` — Local Pages emulation for `dist` (needs `wrangler`)
- `lint` — ESLint on `.ts,.tsx,.astro`
- `format` — Prettier write
- `test` — Vitest unit tests (validation utils)

## Environment Variables
- `PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key (client)
- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret key (server)

## Cloudflare KV Binding
Pages Project → Settings → Functions → KV bindings:
- Bind `CONTACTS_KV` to a KV namespace (create if needed).

## Forms & Function
Endpoint: `functions/submit.ts` → POST `/submit`
- Validates Turnstile using `TURNSTILE_SECRET_KEY`.
- Basic rate limiting (1/min per IP hash + type) via KV.
- Stores JSON record in KV as:
  ```json
  { "type": "newsletter|contact", "email?": "...", "name?": "...", "message?": "...", "source": "landing", "ts": 123, "ipHash": "...", "ua": "..." }
  ```
- Returns `{ ok: true }` on success or `{ error }` with appropriate status code.

## Deploy to Cloudflare Pages (One‑Click)
1. Push this repo to GitHub.
2. In Cloudflare Pages: Create a project → Connect to Git → select repo.
3. Framework preset: Astro.
4. Build command: `npm run build`  • Output directory: `dist`.
5. Environment Variables:
   - `PUBLIC_TURNSTILE_SITE_KEY` = <your Turnstile site key>
   - `TURNSTILE_SECRET_KEY` = <your Turnstile secret key>
6. Pages Functions: auto‑detected from `/functions`.
7. KV: Pages Project → Settings → Functions → KV bindings → add `CONTACTS_KV`.
8. Analytics: Enable Cloudflare Web Analytics and replace beacon token in `src/layouts/Base.astro`.
9. Optional: Add a custom domain (Pages → Custom domains) and set as primary.

## Accessibility & Performance
- Semantic HTML, keyboard‑focus styles, skip link, alt text.
- System dark mode + toggle (`class` strategy).
- Fonts preconnected; noncritical images lazy.
- Sitemap + robots via Astro config (`@astrojs/sitemap`).
- OG/Twitter tags via `src/components/SEO.astro` (static `public/og-image.png`).

## Project Structure
- `astro.config.mjs` — Astro config (site, output, integrations)
- `tailwind.config.ts`, `postcss.config.js` — Tailwind setup
- `src/styles/globals.css` — tokens + utilities
- `src/layouts/Base.astro` — base HTML, fonts, analytics, Turnstile script
- `src/components/*` — UI components
- `src/pages/*` — `/`, `/privacy`, `/terms`, `/success`
- `functions/submit.ts` — Pages Function (TypeScript)
- `public/*` — logo, guide mockup, OG image
- `.github/workflows/lint.yml` — ESLint on CI

## License
MIT — see `LICENSE`.
