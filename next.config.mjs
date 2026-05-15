import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // Static export so the site can be hosted on GitHub Pages.
  output: 'export',
  reactStrictMode: true,
  // Static export cannot run the Next image optimizer (it requires a
  // running server). All images go through unoptimized.
  images: { unoptimized: true },
  // Emit `out/foo/index.html` rather than `out/foo.html` so static
  // hosts serve `/foo/` cleanly.
  trailingSlash: true,
};

export default withMDX(config);
