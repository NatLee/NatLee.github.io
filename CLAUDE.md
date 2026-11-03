# CLAUDE.md

Personal site of Nat Lee. **One body of content, several looks ("themes").** The main theme, **Persimmon**, is the Next.js 15 App Router app at the repo root (React 19 + TypeScript + Tailwind 3, static export with `trailingSlash: true`), auto-deployed to GitHub Pages on push to `main`. Older themes live under `/valhalla/<name>/` and read the same content at runtime from `/content/site.json`.

## Commands

- `npx next dev` / `npx next build` (ESLint is not installed and the build skips lint — there was never a config; type-check still runs)
- On Windows, `npm run build` fails (scripts use Unix `NODE_OPTIONS=` syntax) — call `npx next ...` directly.
- `npx next build` type-checks and statically exports all pages to `out/` (including `/content/site.json`) — this is the full verification.
- `node scripts/sync-github.mjs` — refresh star counts into `content/_generated/github.json` (CI runs it before every build; fails soft).
- `node scripts/make-thumbs.mjs [--force]` — card thumbnails `public/images/projects/<id>.webp` + `content/_generated/thumbnails.json` (uses `sharp`; run by hand after adding a project).
- `node scripts/valhalla/build-theme.mjs <name>` — rebuild one Valhalla theme (only when its code changes). `node scripts/valhalla/serve-local.mjs` — preview themes locally.

## Content — edit `content/`, never components

`content/` is the single source of truth for every theme. `data/*.ts` are typed wrappers + selectors for Persimmon (touch only for schema/logic changes).

- **Projects: one file per project** — `content/projects/<id>.json` (with `"$schema": "../schema/project.schema.json"`), registered in `data/projects-list.ts`. Each has `theme` (energy | infra | ai | libraries | web) and `tier` (flagship | selected | archive). Recipe: `.claude/rules/projects-data.md`. `/add-project` skill automates adding one.
- `personal.json`: name, tagline (`**…**` marks the accented phrase), now, story, howIWork, eras, languages, socials. zh fields sit beside the English ones with a `Zh` suffix.
- `mascots.json`: Tapi and Chiyo (names, images, lines).
- Bilingual `{ "en": …, "zh": … }` files, read with `pick(locale, value)`: `case-studies/telepy.json`, `opensource.json`, `writing.json`, `valhalla.json`.
- Chinese overlays for list data: `content/i18n/*.zh.json` (projects, experience, education, skills) — partial fields keyed by id, English fallback (details: `.claude/rules/i18n.md`).
- `content/schema/*.schema.json` give VS Code autocomplete/validation; `content/_generated/` is script output, not hand-edited.
- UI strings: `messages/en.json` + `messages/zh-TW.json` — always update both, same structure.
- **Tone:** the headline / description used for SEO and the OG image stays humble (LinkedIn-style). Project descriptions, the story and era notes may be dry, self-deprecating humour — but facts stay accurate; no invented numbers.

## The content contract (`/content/site.json`)

`app/content/site.json/route.ts` (force-static) serialises `data/bundle.ts` at build time. The format is `lib/content/contract.ts`; copies live in each Next.js theme. **Additive changes only** — never rename/remove/retype a field, or frozen themes break. If you add a field, update `lib/content/contract.ts` and the copies in `themes/*/`.

## Route map (Persimmon)

| Route | Component | Data |
|---|---|---|
| `/` | `components/home/Hero.tsx`, `Flagship.tsx`, `HomeSections.tsx` | personal, Telepy + case study, selected projects, opensource, writing |
| `/projects` | `components/projects/ProjectsIndex.tsx` | all projects (search + theme filter, tiers) |
| `/projects/telepy` | `components/projects/TelepyCaseStudy.tsx` | telepy.json + `case-studies/telepy.json` |
| `/projects/[id]` | `components/projects/ProjectPage.tsx` | one project (`generateStaticParams`) |
| `/about` | `components/about/AboutPage.tsx` | personal |
| `/experience` | `components/experience/ExperiencePage.tsx` (screen), `PrintCV.tsx` (print-only CV) | experience, education, skills, opensource |
| `/valhalla` | `components/valhalla/ValhallaHall.tsx` | valhalla.json |
| `/content/site.json` | `app/content/site.json/route.ts` | everything (for themes) |

Route files in `app/` are thin server components (metadata only); rendering lives in client components under `components/`.

## Valhalla themes

| Theme | Source | Output |
|---|---|---|
| Aerial (2015), Bonfire (2018) | plain HTML, edited directly in `public/valhalla/<name>/` | same |
| Flat (2025), Terminal (2026), Stonk (2026) | `themes/<name>/` (own package.json) | `public/valhalla/<name>/` via `build-theme.mjs` |

Rules (full brief: `themes/README.md`): themes contain **no personal content** — everything comes from `/content/site.json`; per-item pages use `?id=`; outputs are committed so CI never rebuilds them. `public/valhalla/_banner.js` is the return pill. Never create a Pages-enabled repo named `valhalla`.

## Design system (Persimmon)

- Palette from Tapi: persimmon `accent`, teal `clip`, plum `ink`. RGB-channel CSS variables in `app/globals.css` (light on `:root`, dark via `prefers-color-scheme` and `[data-theme='dark']`); Tailwind maps `paper/surface/ink/muted/line/accent/clip/plum`. No hardcoded colours — except the Valhalla hall, which is deliberately always dark.
- Fonts (`app/fonts.ts`): Familjen Grotesk, Source Sans 3, JetBrains Mono, Silkscreen (pixel — Valhalla/mascots only). CJK falls back to system fonts.
- `.shell` sets width and gutters; shared classes `.eyebrow`, `.link`, `.chip`, `.btn-primary`, `.btn-ghost`, `.section-title`. Motion tokens `--motion-*` / `--ease-*`; never define animation names in tailwind.config.js (they shadow globals.css).
- Icons: registry in `components/Icon.tsx`.

## Mascots

- Tapi: `lib/tapi/mascot.ts` + `lib/tapi/festivals.ts` are copied verbatim from NatLee/telepy (commit in the header) — re-copy to sync, don't edit. Rendered by `components/tapi/Tapi.tsx`.
- `components/mascot/Mascot.tsx`: registry over `content/mascots.json` (`TalkingMascot`, `useMascotTalk`, `SpeechBubble`). Plain-HTML themes use `public/shared/mascot.js` (same data).
- Tapi appears only in: home Telepy block, Telepy case study, footer, 404, Valhalla. Sprite sizes are multiples of 26px.

## Conventions

- i18n is hand-rolled: `useLanguage()` → `t('dot.path', {var})`; default `en`; choice in localStorage.
- Static export: no server APIs except force-static route handlers; `images.unoptimized: true`; plain `<img>` for remote/project images.
- Single-key shortcuts (1–4, `/`, `?`) live in `SiteHeader` and can be turned off (WCAG 2.1.4).

## Context guidance

- Never read: `package-lock.json`, `node_modules/`, `.next/`, `out/`, `public/valhalla/{flat,terminal,stonk}/` (build output), `themes/*/node_modules`.
- Content-only changes need no component reads — edit `content/` / `messages/` and build.
- Next 15: route `params` are Promises (`await params`); metadata routes (`robots.ts`, `sitemap.ts`) need `export const dynamic = 'force-static'`. Each `package.json` overrides `next`'s nested `postcss` to a patched 8.5.x — keep it when bumping Next.
