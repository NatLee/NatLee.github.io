---
name: add-project
description: Add a new project entry to the portfolio (per-project JSON + index registration + optional zh overlay), then verify the build.
---

Add a new project to the portfolio. Steps:

1. Gather from the user (or the given GitHub repo): id (kebab-case, becomes the URL `/projects/<id>`), title, subtitle, category, status, whether it's featured/opensource, tech stack, and a short + long description. If a GitHub URL is given, derive fields from the repo README.
2. Create `assets/data/projects/<id>.json` following the `ProjectDetail` schema in `data/projects.ts`. Copy the field layout from one existing file in `assets/data/projects/` (read only one, e.g. `telepy.json`). Use canonical English `category` values from the `ProjectCategory` union; image URLs are external GitHub raw links (`[]` if none).
3. Register it in `data/projects-list.ts`: one import line + one array entry. Array position = display order.
4. If Chinese text was provided, add a partial overlay under the project id in `assets/data/i18n/projects.zh.json` (fields: title, subtitle, description, longDescription, role, features, challenges, solutions, results — English is the fallback, so only include what's translated).
5. Verify with `npx next build` (on Windows do NOT use `npm run build`) — confirm `/projects/<id>` appears in the generated pages.
6. Do not modify any components — this is a data-only change.
