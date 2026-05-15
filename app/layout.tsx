import './global.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { appName } from '@/lib/shared';
import { i18n } from '@/lib/i18n';

const inter = Inter({ subsets: ['latin'] });

// Single root layout owning <html>+<body>. Static export cannot run
// middleware so we can't dynamically pick the lang attribute per
// request — it's pinned to the default locale here, and downstream
// per-locale layouts inside `[lang]/` adjust it client-side.
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snowluma.dev',
  ),
  title: {
    default: `${appName} Docs`,
    template: `%s — ${appName} Docs`,
  },
  description: 'SnowLuma — Remote Protocol Framework for NTQQ.',
  icons: { icon: '/logo.svg' },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang={i18n.defaultLanguage === 'zh' ? 'zh-CN' : i18n.defaultLanguage}
      className={inter.className}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">{children}</body>
    </html>
  );
}
