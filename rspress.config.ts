import * as path from 'path';
import { defineConfig } from 'rspress/config';
export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'SnowLuma',
  description: '面向 NTQQ 的 Remote Protocol Framework',
  icon: '/logo.svg',
  lang: 'zh',
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/SnowLuma/SnowLuma',
      },
    ],
    locales: [
      {
        lang: 'zh',
        label: '简体中文',
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '快速开始', link: '/zh/guide/quickstart' },
          { text: '部署', link: '/zh/guide/deploy/' },
          { text: 'MCP', link: '/zh/mcp/' },
          { text: 'SDK', link: '/zh/sdk/' },
          { text: 'API', link: '/zh/api/' },
          { text: '开发者', link: '/zh/guide/developer' },
        ],
      },
      {
        lang: 'en',
        label: 'English',
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Quick Start', link: '/en/guide/quickstart' },
          { text: 'Deploy', link: '/en/guide/deploy/' },
          { text: 'MCP', link: '/en/mcp/' },
          { text: 'SDK', link: '/en/sdk/' },
          { text: 'API', link: '/en/api/' },
          { text: 'Developer', link: '/en/guide/developer' },
        ],
      },
    ],
  },
  globalUIComponents: [
    path.join(__dirname, 'docs', 'components', 'Splash.tsx'),
    path.join(__dirname, 'docs', 'components', 'NavLogo.tsx'),
  ],
  globalStyles: path.join(__dirname, 'docs', 'styles', 'api.css'),
  locales: [
    {
      lang: 'zh',
      label: '简体中文',
      title: 'SnowLuma',
      description: '面向 NTQQ 的 Remote Protocol Framework',
    },
    {
      lang: 'en',
      label: 'English',
      title: 'SnowLuma',
      description: 'A Remote Protocol Framework for NTQQ',
    },
  ]
});
