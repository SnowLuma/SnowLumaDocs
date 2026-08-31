#!/usr/bin/env node
// Static hosts ignore next.config redirects. Emit HTML bounce pages for old Rspress URLs.
import { access, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'doc_build');

try {
  await access(outDir);
} catch {
  console.error('write-legacy-redirects: doc_build is missing; run this after DOCS_EXPORT=1 next build');
  process.exit(1);
}

function bounce(to) {
  const safe = to.replace(/"/g, '&quot;');
  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=${safe}">
<link rel="canonical" href="${safe}">
<title>Redirecting</title>
<script>location.replace(${JSON.stringify(to)}+location.search+location.hash)</script>
</head>
<body><p><a href="${safe}">Continue</a></p></body>
</html>
`;
}

async function walkHtml(dir, acc = []) {
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkHtml(full, acc);
      continue;
    }
    if (entry.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const written = new Set();

async function writeBounce(relFrom, absToUrl) {
  const rel = relFrom.replace(/^\/+/, '').replace(/\\/g, '/');
  if (written.has(rel)) return;
  written.add(rel);
  const dest = path.join(outDir, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, bounce(absToUrl));
}

async function writePair(oldPath, dest) {
  const rel = oldPath.replace(/^\/+/, '');
  await writeBounce(`${rel}.html`, dest);
  await writeBounce(`${rel}/index.html`, dest);
}

const htmlFiles = await walkHtml(outDir);

for (const file of htmlFiles) {
  const rel = path.relative(outDir, file).split(path.sep).join('/');
  const urlPath = `/${rel.replace(/index\.html$/, '').replace(/\.html$/, '')}`.replace(/\/$/, '') || '/';
  const match = urlPath.match(/^\/(zh|en)\/docs\/([^/]+)(\/.*)?$/);
  if (!match) continue;

  const [, lang, section, rest = ''] = match;

  if (section === 'guide' || section === 'mcp' || section === 'sdk') {
    await writePair(`/${lang}/${section}${rest}`, urlPath);
    if (lang === 'zh') await writePair(`/${section}${rest}`, urlPath);
    continue;
  }

  if (section === 'api') {
    await writePair(`/${lang}/api${rest}`, urlPath);
    if (lang === 'zh' && !rest) await writePair('/api', urlPath);
    continue;
  }

  await writePair(`/${lang}/api/${section}${rest}`, urlPath);
}

const extras = [
  ['/zh/guide/docker', '/zh/docs/guide/deploy/docker'],
  ['/en/guide/docker', '/en/docs/guide/deploy/docker'],
  ['/guide/docker', '/zh/docs/guide/deploy/docker'],
];

for (const [from, to] of extras) {
  await writePair(from, to);
}

console.log(`legacy redirects: ${written.size} bounce files`);
