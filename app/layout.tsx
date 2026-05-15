import './global.css';
import type { Metadata } from 'next';
import { appName } from '@/lib/shared';

// Root layout is a passthrough now — `<html>` + `<body>` + provider
// live inside `app/[lang]/layout.tsx` so the language attribute on
// the document can track the routed locale.
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
  return children;
}
