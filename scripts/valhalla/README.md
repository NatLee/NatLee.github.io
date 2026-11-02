# Valhalla scripts

The full explanation of themes, the content contract and the rules lives in [`themes/README.md`](../../themes/README.md).

| Script | What it does |
|---|---|
| `build-theme.mjs <name>` | Builds `themes/<name>/` (Next.js) and copies it to `public/valhalla/<name>/`, injecting `noindex` and the return pill. Run only when a theme's **code** changes. |
| `serve-local.mjs [port]` | Serves `public/` plus `/content/site.json` locally, so themes can be checked without building the main site. |

Content changes never need either script: the main build emits `/content/site.json` and every theme reads it at runtime.
