import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const isExport = process.env.DOCS_EXPORT === '1';

const config = {
  reactStrictMode: true,
  ...(isExport
    ? { output: 'export', distDir: 'doc_build', images: { unoptimized: true } }
    : {}),
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return [
      { source: '/zh/guide/docker', destination: '/zh/docs/guide/deploy/docker', permanent: true },
      { source: '/en/guide/docker', destination: '/en/docs/guide/deploy/docker', permanent: true },
      { source: '/zh/guide/:path*', destination: '/zh/docs/guide/:path*', permanent: true },
      { source: '/en/guide/:path*', destination: '/en/docs/guide/:path*', permanent: true },
      { source: '/zh/mcp', destination: '/zh/docs/mcp', permanent: true },
      { source: '/zh/mcp/:path*', destination: '/zh/docs/mcp/:path*', permanent: true },
      { source: '/en/mcp', destination: '/en/docs/mcp', permanent: true },
      { source: '/en/mcp/:path*', destination: '/en/docs/mcp/:path*', permanent: true },
      { source: '/zh/sdk', destination: '/zh/docs/sdk', permanent: true },
      { source: '/zh/sdk/:path*', destination: '/zh/docs/sdk/:path*', permanent: true },
      { source: '/en/sdk', destination: '/en/docs/sdk', permanent: true },
      { source: '/en/sdk/:path*', destination: '/en/docs/sdk/:path*', permanent: true },
      { source: '/zh/api', destination: '/zh/docs/api', permanent: true },
      { source: '/zh/api/:path*', destination: '/zh/docs/:path*', permanent: true },
      { source: '/en/api', destination: '/en/docs/api', permanent: true },
      { source: '/en/api/:path*', destination: '/en/docs/:path*', permanent: true },
      { source: '/guide', destination: '/zh/docs/guide', permanent: true },
      { source: '/guide/:path*', destination: '/zh/docs/guide/:path*', permanent: true },
      { source: '/mcp', destination: '/zh/docs/mcp', permanent: true },
      { source: '/mcp/:path*', destination: '/zh/docs/mcp/:path*', permanent: true },
      { source: '/sdk', destination: '/zh/docs/sdk', permanent: true },
      { source: '/sdk/:path*', destination: '/zh/docs/sdk/:path*', permanent: true },
      { source: '/api', destination: '/zh/docs/api', permanent: true },
    ];
  },
};

export default withMDX(config);
