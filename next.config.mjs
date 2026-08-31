import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const isExport = process.env.DOCS_EXPORT === '1';

const apiTags = [
  'system',
  'message',
  'friend',
  'group-info',
  'group-admin',
  'group-file',
  'group-album',
  'request',
  'extended',
  'qzone',
  'sys-face',
  'stream',
];

const config = {
  reactStrictMode: true,
  allowedDevOrigins: ['127.0.0.1'],
  ...(isExport
    ? { output: 'export', distDir: 'doc_build', images: { unoptimized: true } }
    : {}),
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    const tagMoves = apiTags.flatMap((tag) => [
      { source: `/zh/docs/${tag}`, destination: `/zh/docs/api/${tag}`, permanent: true },
      { source: `/zh/docs/${tag}/:path*`, destination: `/zh/docs/api/${tag}/:path*`, permanent: true },
      { source: `/en/docs/${tag}`, destination: `/en/docs/api/${tag}`, permanent: true },
      { source: `/en/docs/${tag}/:path*`, destination: `/en/docs/api/${tag}/:path*`, permanent: true },
    ]);
    return [
      { source: '/zh/docs/guide/install', destination: '/zh/docs/guide/deploy/install', permanent: true },
      { source: '/en/docs/guide/install', destination: '/en/docs/guide/deploy/install', permanent: true },
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
      { source: '/zh/api/:path*', destination: '/zh/docs/api/:path*', permanent: true },
      { source: '/en/api', destination: '/en/docs/api', permanent: true },
      { source: '/en/api/:path*', destination: '/en/docs/api/:path*', permanent: true },
      ...tagMoves,
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
