# SnowLumaDocs

SnowLuma 文档站。基于 [Fumadocs](https://fumadocs.dev)（Next.js 16 + MDX）。

## 本地开发

```bash
pnpm install
pnpm dev
```

打开 http://localhost:3000

## 构建

```bash
pnpm build
pnpm start
```

## 内容位置

文档源文件位于 `content/docs/`，按 `meta.json` 中的顺序在侧边栏排列。新增页面时同步更新 `meta.json` 即可。

## 技术栈

- Next.js 16 (App Router)
- Fumadocs Core / UI / MDX
- React 19
- Tailwind CSS 4
- TypeScript
