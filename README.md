# SnowLumaDocs

SnowLuma 文档站。基于 [Rspress](https://rspress.dev)。

## 本地开发

```bash
pnpm install
pnpm dev
```

打开 http://localhost:5173

## 构建

```bash
pnpm build
pnpm preview
```

## 内容位置

文档源文件位于 `docs/` 目录下，按语言组织：

- `docs/zh/` - 简体中文文档
- `docs/en/` - 英文文档

每个语言目录下的 `_meta.json` 文件定义了侧边栏的结构和顺序。

## 技术栈

- Rspress
- React
- TypeScript
- remark-math / rehype-katex (数学公式支持)
