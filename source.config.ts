import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// MDX content sources — each defineDocs() entry produces its own typed
// collection in `.source/`. Currently:
//   - `docs`           : long-form prose docs under content/docs (zh + en)
//   - `apiReference`   : the auto-generated OneBot OpenAPI pages
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const apiReference = defineDocs({
  dir: 'content/api',
  docs: {
    schema: pageSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // KaTeX for `$inline$` and `$$block$$` math.
    remarkPlugins: [remarkMath],
    // Renders the math AST KaTeX produces into HTML in the build step.
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});
