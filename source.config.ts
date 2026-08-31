import { defineConfig } from 'fumadocs-mdx/config';
import { remarkGithubAlert } from './lib/remark-github-alert';

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkGithubAlert],
  },
});
