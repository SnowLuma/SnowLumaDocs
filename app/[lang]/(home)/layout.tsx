import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { SnowMark } from '@/components/snow-mark';
import './home.css';

export default async function Layout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  const options = baseOptions(lang);
  return (
    <HomeLayout
      {...options}
      className="sl-home-layout"
      nav={{
        ...options.nav,
        title: <span className="sl-nav-brand"><SnowMark /><span className="sl-wordmark">Snow<span>Luma</span></span><span className="sl-nav-docs">Docs</span></span>,
      }}
    >
      {children}
    </HomeLayout>
  );
}
