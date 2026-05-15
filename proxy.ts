import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware';
import { docsContentRoute, docsRoute } from '@/lib/shared';
import { i18n } from '@/lib/i18n';

// Next.js 16 renamed `middleware.ts` to `proxy.ts`. This file runs on
// every request and chains three concerns in priority order:
//   1. `.md` suffix rewrite — `/docs/foo.md` fetches raw markdown
//      (handy for `curl` / LLM clients). Wins over i18n because the
//      `.md` path is content-addressed, not user-facing.
//   2. Accept-Markdown content negotiation.
//   3. i18n redirect (`/foo` → `/zh/foo` or `/en/foo`).
//
// The cast around `createI18nMiddleware`: its runtime signature is
// `(req) => Response`, but the d.ts declares `NextProxy` which expects
// `(req, event)`. Calling with one arg works at runtime.
const i18nProxy = createI18nMiddleware(i18n) as unknown as (
  request: NextRequest,
) => NextResponse;

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Explicit `.md` suffix.
  const suffix = rewriteSuffix(pathname);
  if (suffix) {
    return NextResponse.rewrite(new URL(suffix, request.nextUrl));
  }

  // 2. Accept: text/markdown content negotiation.
  if (isMarkdownPreferred(request)) {
    const negotiated = rewriteDocs(pathname);
    if (negotiated) {
      return NextResponse.rewrite(new URL(negotiated, request.nextUrl));
    }
  }

  // 3. Skip i18n entirely for routes that aren't page-facing.
  const skipI18n =
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/og') ||
    pathname.startsWith('/llms') ||
    pathname.startsWith(docsContentRoute) ||
    pathname === '/favicon.ico' ||
    pathname === '/logo.svg';
  if (skipI18n) {
    return NextResponse.next();
  }

  return i18nProxy(request);
}

export const config = {
  matcher: [
    // Everything except static assets that need zero processing.
    '/((?!_next/static|_next/image|favicon\\.ico|logo\\.svg).*)',
  ],
};
