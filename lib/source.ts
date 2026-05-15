import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { i18n } from './i18n';
import { openapi } from './openapi';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';

// Single loader merging two sources into the `/docs` tree:
//   - `docs`    : prose MDX (zh + en).
//   - `openapi` : the auto-generated OneBot API reference, grouped by
//                 OpenAPI tag. OpenAPI is locale-agnostic; the same
//                 pages appear in every language's sidebar.
//
// The OpenAPI page tree lives next to the prose docs (e.g. `/docs/system`,
// `/docs/group-admin`, ...). Page objects discriminate on `page.type`
// so the route renderer can switch between MDX and the API page.
export const source = loader(
  {
    docs: docs.toFumadocsSource(),
    openapi: await openapiSource(openapi, {
      groupBy: 'tag',
    }),
  },
  {
    baseUrl: docsRoute,
    i18n,
    plugins: [lucideIconsPlugin(), openapiPlugin()],
  },
);

export function getPageImage(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  // OpenAPI pages don't have getText('processed'); only prose pages.
  if (page.type !== 'docs') {
    return `# ${page.data.title} (${page.url})\n\n(see live page for OpenAPI specification)\n`;
  }
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
