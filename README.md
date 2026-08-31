# SnowLuma Docs

Fumadocs + Next.js 16 documentation. Previous Rspress tree is snapshotted at `../SnowLumaDocs-rspress-backup` (local only).

## Develop

```bash
pnpm install
pnpm openapi
pnpm dev
```

http://localhost:5173

## Build

```bash
pnpm build
```

`catalog.json` → OpenAPI is `tools/catalog-to-openapi.mjs`. Do not revive `generate-api-pages.mjs`.
