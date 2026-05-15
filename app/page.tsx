import type { Metadata } from 'next';
import { i18n } from '@/lib/i18n';

const redirectTo = `/${i18n.defaultLanguage}/`;

// Static `/index.html` that redirects to the default locale. Static
// export can't run middleware, so the root URL must produce a real
// HTML file that bounces. Three redundant mechanisms:
//   - <meta http-equiv="refresh"> — works without JS.
//   - <script location.replace> — snappier hand-off in modern browsers.
//   - <a href> — last resort visible link.
export const metadata: Metadata = {
  title: 'SnowLuma',
  alternates: { canonical: redirectTo },
};

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${redirectTo}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(redirectTo)});`,
        }}
      />
      <a href={redirectTo} className="block p-8">
        Redirecting to {redirectTo}…
      </a>
    </>
  );
}
