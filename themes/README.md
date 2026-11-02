# Valhalla themes

The site has one body of content (`content/` at the repo root) and several looks ("themes"). The main look, **Persimmon**, is the Next.js app at the repo root and renders content at build time. The older looks live under `/valhalla/<name>/` and read the same content **in the browser** from `/content/site.json`. When content changes, only the main site is rebuilt (it emits a fresh `site.json`); themes are never rebuilt for content, only when their own code changes.

| Theme | Era | Source | Output |
|---|---|---|---|
| Aerial | 2015 | plain HTML, lives directly in `public/valhalla/aerial/` | same |
| Bonfire | 2018 | plain HTML + jQuery, lives directly in `public/valhalla/bonfire/` | same |
| Flat | 2025 | `themes/flat/` (Next.js) | `public/valhalla/flat/` |
| Terminal | 2026 | `themes/terminal/` (Next.js) | `public/valhalla/terminal/` |
| Stonk | 2026 (side branch) | `themes/stonk/` (Next.js) | `public/valhalla/stonk/` |

## The contract

- Format: `lib/content/contract.ts` (a copy is in `themes/_shared/site-contract.ts`; copy it into your theme, do not import across project roots).
- URL: always fetch the absolute path **`/content/site.json`** (it is at the site root, not under the theme's basePath).
- Text fields are `Localized` (`{ en, zh? }`); use `pick(value, locale)` which falls back to `en`.
- Image paths in the bundle that start with `/` (thumbnails `/images/projects/<id>.webp`, mascots `/mascots/...`) are site-root paths: use them as-is, do not prefix the theme basePath.
- The contract only grows (fields are added, never renamed or removed). A theme must tolerate missing optional fields.
- A sample of the current bundle for local work: `themes/_shared/site.sample.json` (gitignored).

## Rules for a theme

1. **No personal content in the theme source or build.** No names, bios, companies, emails, project lists, dates or links hardcoded or stored as JSON. Everything personal comes from `/content/site.json` at runtime. Delete old data files (`assets/data/*.json` etc.). Generic UI words, decorative fake numbers that are part of the look (stock tickers, fake CPU %), and the theme's own visual assets are fine.
2. **Keep the look.** Same layout, colours, fonts, animations and interactions as the original. Only the data plumbing changes.
3. **Runtime loading.** Load the bundle once at startup (a provider/gate around the app), render an on-theme loading state while it loads and an on-theme error message if it fails. Data accessors used by components can stay synchronous after the gate.
4. **Static export with `basePath: '/valhalla/<name>'`, `assetPrefix: '/valhalla/<name>/'`, `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`.**
5. **No per-item static routes.** New projects must show up without a rebuild, so dynamic routes like `/projects/[id]` become one static page that reads a query string: `/projects/view/?id=<id>` (use `useSearchParams` inside a `<Suspense>` boundary, or read `window.location.search` in an effect). Update every internal link accordingly.
6. **No SEO plumbing.** Themes are `noindex` (the build script injects it). Remove sitemap, robots, JSON-LD and per-page dynamic metadata; a static `<title>` like `Nat Lee · <Theme> theme` is enough.
7. **No company name in the hero / first screen.** Companies may appear in experience sections only.
8. Do not touch anything outside `themes/<name>/` and `public/valhalla/<name>/`. Do not run builds at the repo root. Do not commit.

## Build and check

```bash
node scripts/valhalla/build-theme.mjs <name>     # npm ci if needed, next build, copy to public/valhalla/<name>/
node scripts/valhalla/serve-local.mjs 8801       # serves public/ + /content/site.json on http://localhost:8801
```

Then open `http://localhost:8801/valhalla/<name>/` (and a project page via `?id=telepy`). Headless screenshot on this machine:

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --no-first-run \
  --user-data-dir="<scratch dir>/prof" --window-size=1440,2400 --virtual-time-budget=15000 \
  --screenshot="<scratch dir>/shot.png" "http://localhost:8801/valhalla/<name>/"
```

Headless Chrome on this machine follows the OS dark setting; `--blink-settings=preferredColorScheme=1` forces light.
