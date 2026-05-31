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
          { text: '介绍', link: '/zh/' },
          { text: '指南', link: '/zh/guide/docker' },
        ],
      },
      {
        lang: 'en',
        label: 'English',
        nav: [
          { text: 'Introduction', link: '/en/' },
          { text: 'Guide', link: '/en/guide/docker' },
        ],
      },
    ],
  },
  globalUIComponents: [
    path.join(__dirname, 'docs', 'components', 'Splash.tsx'),
    path.join(__dirname, 'docs', 'components', 'NavLogo.tsx'),
  ],
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
