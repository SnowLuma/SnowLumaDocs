import { Provider } from '@/components/provider';
import { i18nUI } from '@/lib/layout.shared';
import { i18n, type Lang } from '@/lib/i18n';

// Per-locale layout: wraps everything under `/[lang]/...` with the
// Fumadocs RootProvider so i18n translations + theme switching are
// available. <html>+<body> live in `app/layout.tsx`.
export default async function Layout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  return (
    <Provider lang={lang as Lang} i18n={i18nUI.provider(lang)}>
      {children}
    </Provider>
  );
}

// Static export needs the full list of language segments at build time.
export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
