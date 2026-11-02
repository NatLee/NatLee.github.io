# CLAUDE.md

Terminal-themed personal portfolio. Next.js 14 App Router + React 18 + TypeScript + Tailwind, static export (`output: 'export'`) auto-deployed to GitHub Pages on push to `main`.

## Commands

- `npx next dev` / `npx next build` / `npx next lint`
- On Windows, `npm run build` fails (scripts use Unix `NODE_OPTIONS=` syntax) — call `npx next ...` directly.
- `npx next build` runs lint + type-check and statically exports all pages to `out/` — this is the full verification.

## Route map (route → main component → data)

| Route | Page | Component | Data |
|---|---|---|---|
| `/` | `app/page.tsx` | TechHero, FeaturedProjects, InteractiveTerminal | personal.json, featured projects |
| `/about` | `app/about/page.tsx` | `components/About.tsx` | personal.json, skills.json, education.json |
| `/experience` | `app/experience/page.tsx` | `components/Experience.tsx` | experience.json |
| `/projects` | `app/projects/page.tsx` | `components/ProjectsGrid.tsx` | all projects |
| `/projects/[id]` | `app/projects/[id]/page.tsx` | `components/ProjectDetail.tsx` | one project (37 pages via `generateStaticParams`) |

Sub-page files are thin server components (metadata only); all rendering lives in `components/*.tsx` client components. Persistent `Navigation` is mounted in `app/layout.tsx`, outside the route subtree.

## Data layer — for content changes, edit JSON only, never components

`assets/data/` is the source of truth; `data/*.ts` are typed wrappers + selectors (touch only for schema/logic changes).

- **Projects: one file per project** — `assets/data/projects/<id>.json`, registered in `data/projects-list.ts` (array position = display order). Full add/edit/delete recipe: `.claude/rules/projects-data.md` (auto-loads when you touch those files). `/add-project` skill automates adding one.
- Chinese content overlays: `assets/data/i18n/*.zh.json` — partial fields keyed by id, English fallback (details: `.claude/rules/i18n.md`).
- Other content: `personal.json` (bio/contact/socials), `skills.json`, `education.json`, `experience.json`.
- UI strings (nav labels, headings, terminal text): `messages/en.json` + `messages/zh-TW.json` — always update both.

## Conventions

- i18n is hand-rolled (no library): `useLanguage()` from `contexts/LanguageContext.tsx` → `t('dot.path', {var})` for UI strings; content localization via overlay merge inside `data/*.ts`.
- Styling: Tailwind utilities + global keyframes in `app/globals.css` only. No CSS modules / styled-components. Theme: primary `#0a0a0a`, secondary `#d4741e` (tailwind.config.js).
- Icons come from the registry in `components/Icon.tsx` (react-icons); register new icons there.
- Project `category` values are canonical English strings (`ProjectCategory` union in `data/projects.ts`); zh display labels via `categoryLabelsZh` map in the same file. Known quirk: both `Tool` and `Tools` exist in data.
- Static export constraints: no server APIs/route handlers, `images.unoptimized: true`.
- `components/AIChatTerminal.tsx` is canned local responses only — no network or LLM calls despite the name.

## Context guidance

- Never read: `package-lock.json`, `node_modules/`, `.next/`, `out/`.
- Content-only changes (project text, bio, UI strings) need no component reads — edit JSON/messages and build.
- Largest components (Grep before reading whole): `ProjectDetail.tsx` (~29KB), `Icon.tsx`, `Experience.tsx`, `ProjectsGrid.tsx`, `Navigation.tsx`.
