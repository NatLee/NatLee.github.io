---
paths:
  - "content/projects/**"
  - "data/projects-list.ts"
  - "content/i18n/projects.zh.json"
---

# Project data recipes

One JSON file per project: `content/projects/<id>.json`. Schema = `ProjectDetail` interface in `data/projects.ts` (id, title, subtitle, category, theme, tier, status, images, description, longDescription, technologies, features, challenges, solutions, results, links?, timeline, role, company?, githubUrl?). Missing array fields are normalized to `[]` in `data/projects.ts`.

- **Add a project**: create `content/projects/<id>.json`, then add one import line + one array entry in `data/projects-list.ts`. Array position = display order within its tier. Then run `node scripts/make-thumbs.mjs` for the card thumbnail.
- **Edit**: touch only that project's file. Do not read other project files.
- **Delete**: remove the file + its import line and array entry in `data/projects-list.ts`; also remove its key from `content/i18n/projects.zh.json` and `content/_generated/thumbnails.json`, and `public/images/projects/<id>.webp`.
- **Chinese text**: optional per-id overlay in `content/i18n/projects.zh.json` (only fields: title, subtitle, description, longDescription, role, features, challenges, solutions, results — partial OK, English is the fallback).
- `category` must be a canonical English value from the `ProjectCategory` union. `theme`: `energy` | `infra` | `ai` | `libraries` | `web`. `tier`: `flagship` (Telepy only) | `selected` (card grid; home shows the first 6) | `archive` (list). `status`: `Completed` | `In Progress` | `Archived`.
- `links`: `github` (or top-level `githubUrl`), `demo`, `pypi`, `documentation`, `article`.
- `images` are external URLs (usually `https://github.com/NatLee/<repo>/raw/main/doc/...`); `images[0]` is the detail-page hero and the source for the local thumbnail; `[]` is valid.
- Telepy's case-study page reads extra content from `content/case-studies/telepy.json`.
- Verify with `npx next build` (each project generates a static page at `/projects/<id>`).
- Every project file starts with `"$schema": "../schema/project.schema.json"` (editor autocomplete + validation); keep it when adding one.
