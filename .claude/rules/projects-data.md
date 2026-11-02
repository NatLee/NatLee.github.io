---
paths:
  - "assets/data/projects/**"
  - "data/projects-list.ts"
  - "assets/data/i18n/projects.zh.json"
---

# Project data recipes

One JSON file per project: `assets/data/projects/<id>.json`. Schema = `ProjectDetail` interface in `data/projects.ts` (id, title, subtitle, category, status, featured, opensource, images, description, longDescription, technologies, features, challenges, solutions, results, links?, timeline, role, company?, githubUrl?).

- **Add a project**: create `assets/data/projects/<id>.json`, then add one import line + one array entry in `data/projects-list.ts`. Array position = display order (newest/most important first).
- **Edit**: touch only that project's file. Do not read other project files.
- **Delete**: remove the file + its import line and array entry in `data/projects-list.ts`; also remove its key from `assets/data/i18n/projects.zh.json` if present.
- **Chinese text**: optional per-id overlay in `assets/data/i18n/projects.zh.json` (only fields: title, subtitle, description, longDescription, role, features, challenges, solutions, results — partial OK, English is the fallback).
- `category` must be a canonical English value from the `ProjectCategory` union in `data/projects.ts`. `status`: `Completed` | `In Progress` | `Archived`. `featured: true` shows it on the home page.
- `images` are external URLs (usually `https://github.com/NatLee/<repo>/raw/main/doc/...`); `images[0]` becomes the thumbnail; `[]` is valid.
- Verify with `npx next build` (each project generates a static page at `/projects/<id>`).
