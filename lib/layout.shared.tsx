import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n } from '@/lib/i18n';
import { zhCN } from '@fumadocs/language/zh-cn';
import { uiTranslations } from 'fumadocs-ui/i18n';
import { openapiTranslations } from 'fumadocs-openapi/i18n';

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .extend(openapiTranslations())
  .preset('zh', zhCN());

export function baseOptions(locale: string): BaseLayoutProps {
  const zh = locale === 'zh';
  const prefix = `/${locale}`;
  return {
    nav: {
      title: (
        <span className="sl-wordmark">
          Snow<span>Luma</span>
        </span>
      ),
      url: prefix,
    },
    githubUrl: 'https://github.com/SnowLuma/SnowLuma',
    links: [
      {
        type: 'main',
        text: zh ? '快速开始' : 'Quick Start',
        url: `${prefix}/docs/guide/quickstart`,
      },
      {
        type: 'main',
        text: zh ? '部署' : 'Deploy',
        url: `${prefix}/docs/guide/deploy`,
      },
      {
        type: 'main',
        text: 'API',
        url: `${prefix}/docs/api`,
      },
      {
        type: 'main',
        text: 'MCP',
        url: `${prefix}/docs/mcp`,
      },
      {
        type: 'main',
        text: 'SDK',
        url: `${prefix}/docs/sdk`,
      },
    ],
  };
}
