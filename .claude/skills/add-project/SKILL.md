---
name: add-project
description: Add a new project entry to the portfolio (per-project JSON + index registration + thumbnail + optional zh overlay), then verify the build.
---

Add a new project to the portfolio. Steps:

1. Gather from the user (or the given GitHub repo): id (kebab-case, becomes the URL `/projects/<id>`), title, subtitle, category, `theme`, `tier`, status, tech stack, and a short + long description. If a GitHub URL is given, derive fields from the repo README.
   - `theme`: one of `energy` | `infra` | `ai` | `libraries` | `web` (the filter chips on /projects).
   - `tier`: `selected` puts it in the card grid (home shows the first 6 selected); `archive` puts it in the list. `flagship` is reserved for Telepy.
2. Create `content/projects/<id>.json` (keep the `"$schema"` line) following the `ProjectDetail` schema in `data/projects.ts`. Copy the field layout from one existing file in `content/projects/` (read only one, e.g. `morphkit.json`). Use canonical English `category` values from the `ProjectCategory` union; image URLs are external GitHub raw links (`[]` if none). Links: `links.demo`, `links.pypi`, `links.documentation`, `links.article` as available.
3. Register it in `data/projects-list.ts`: one import line + one array entry. Array position = display order within its tier.
4. Thumbnail for the card: `node scripts/make-thumbs.mjs` (creates `public/images/projects/<id>.webp` from `images[0]` and updates `content/_generated/thumbnails.json`). Projects without images get a typographic card automatically.
5. Stars: `node scripts/sync-github.mjs` refreshes `content/_generated/github.json` (CI also runs it on every deploy).
6. If Chinese text was provided, add a partial overlay under the project id in `content/i18n/projects.zh.json` (fields: title, subtitle, description, longDescription, role, features, challenges, solutions, results — English is the fallback, so only include what's translated).
7. Verify with `npx next build` (on Windows do NOT use `npm run build`) — confirm `/projects/<id>` appears in the generated pages.
8. Do not modify any components — this is a data-only change.
