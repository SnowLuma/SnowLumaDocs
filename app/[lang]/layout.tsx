import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google';
import { translations } from '@/lib/layout.shared';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { i18n } from '@/lib/i18n';
import { notFound } from 'next/navigation';

const sans = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
});

const serif = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-serif',
});

export default async function Layout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (lang !== 'zh' && lang !== 'en') notFound();

  return (
    <html lang={lang} className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col" style={{ fontFamily: 'var(--font-sans), sans-serif' }}>
        <RootProvider i18n={i18nProvider(translations, lang)} search={{ enabled: false }}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
