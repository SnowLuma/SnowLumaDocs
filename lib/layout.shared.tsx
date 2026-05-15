import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import Image from 'next/image';
import { appName, gitConfig } from './shared';
import { i18n, type Lang } from './i18n';

export function baseOptions(_lang: Lang): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-semibold">
          <Image src="/logo.svg" alt="" width={24} height={24} priority />
          {appName}
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

// i18nUI binds Chinese strings + display names for the language
// switcher. English falls through to Fumadocs's default English
// translations.
export const i18nUI = defineI18nUI(i18n, {
  zh: {
    displayName: '简体中文',
    search: '搜索',
    searchNoResult: '没有相关结果',
    toc: '本页目录',
    tocNoHeadings: '本页没有目录',
    lastUpdate: '最后更新于',
    chooseLanguage: '选择语言',
    nextPage: '下一页',
    previousPage: '上一页',
    chooseTheme: '主题',
    editOnGithub: '在 GitHub 上编辑',
  },
  en: {
    displayName: 'English',
  },
});
