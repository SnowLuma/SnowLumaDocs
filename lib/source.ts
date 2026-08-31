import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import { i18n } from '@/lib/i18n';
import { openapi } from '@/lib/openapi';

const docs = defineDocs({
  dir: 'content/docs',
});

export const source = loader(
  {
    docs: docs.toFumadocsSource(),
    openapi: await openapi.staticSource({
      baseDir: 'api',
      groupBy: 'tag',
      meta: true,
    }),
  },
  {
    baseUrl: '/docs',
    i18n,
    plugins: [openapi.loaderPlugin()],
  },
);
