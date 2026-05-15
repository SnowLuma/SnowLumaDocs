import { defineI18n } from 'fumadocs-core/i18n';

// Default zh; English secondary. With `hideLocale: 'default-locale'`
// Chinese routes stay at /docs/* (no prefix) and English routes get
// /en/docs/*. Add more languages by extending the `languages` array
// and creating the matching content/docs/<lang>/ directory.
export const i18n = defineI18n({
  defaultLanguage: 'zh',
  languages: ['zh', 'en'],
  hideLocale: 'default-locale',
  // Strip the locale from the first path segment of files in `content/docs/`.
  // So `content/docs/zh/index.mdx` → slug `index`, locale `zh`.
  parser: 'dir',
});

export type Lang = (typeof i18n.languages)[number];
