import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// MDX content under content/docs/<locale>/...; the OpenAPI source is
// merged in at the loader level so it lives in the same navigation
// tree as the prose docs.
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

export default defineConfig({
  mdxOptions: {
    // KaTeX for `$inline$` and `$$block$$` math.
    remarkPlugins: [remarkMath],
    // Renders the math AST KaTeX produces into HTML in the build step.
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});
