#!/usr/bin/env node
// catalog.json → per-category MDX (zh + en). Each action is a markdown `##`
// heading (so Rspress full-text search indexes + deep-links it) followed by an
// <ActionCard/> with the action's full doc embedded. Regenerated on prebuild;
// the output under docs/<lang>/api/ is committed so the deploy build is
// deterministic and the catalog.json is the single source.
//
// The category→slug map MUST stay identical to docs/components/ActionIndex.tsx
// (CATEGORY_SLUG) or the index page's deep links 404.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(
  await readFile(path.join(root, 'docs/public/api/catalog.json'), 'utf8'),
);

const CATEGORY_SLUG = {
  '信息': 'system',
  '消息': 'message',
  '好友': 'friend',
  '群信息': 'group-info',
  '群管理': 'group-admin',
  '群文件': 'group-file',
  '请求': 'request',
  '扩展': 'extended',
  '群相册': 'group-album',
  '空间': 'qzone',
};
const CATEGORY_LABEL_EN = {
  system: 'System',
  message: 'Message',
  friend: 'Friend',
  'group-info': 'Group Info',
  'group-admin': 'Group Admin',
  'group-file': 'Group File',
  request: 'Request',
  extended: 'Extended',
  'group-album': 'Group Album',
  qzone: 'Qzone',
};

const LOCALES = [
  {
    lang: 'zh',
    indexTitle: 'API 参考',
    indexLead:
      'SnowLuma OneBot v11 兼容 API。所有动作通过 HTTP POST 或 WebSocket 调用，请求体为 JSON，响应为 OneBot 标准应答信封。本页由 `catalog.json` 自动生成，与运行时校验同源。',
    tailNote:
      '> 注：`extended.ts` 中约 15 个不规则的遗留动作不在自动目录内，详见源码 `packages/onebot/src/actions/extended.ts`。',
  },
  {
    lang: 'en',
    indexTitle: 'API Reference',
    indexLead:
      'SnowLuma OneBot v11-compatible API. Every action is called via HTTP POST or WebSocket with a JSON body; responses use the OneBot envelope. This page is generated from `catalog.json`, sharing its source with runtime validation. (Action descriptions are authored in Chinese.)',
    tailNote:
      '> Note: ~15 irregular legacy actions in `extended.ts` are not in the generated catalog; see `packages/onebot/src/actions/extended.ts`.',
  },
];

function groupByCategory(actions) {
  const groups = new Map();
  for (const a of actions) {
    const slug = CATEGORY_SLUG[a.category ?? ''] ?? 'extended';
    if (!groups.has(slug)) groups.set(slug, []);
    groups.get(slug).push(a);
  }
  for (const list of groups.values()) list.sort((x, y) => x.name.localeCompare(y.name));
  return groups;
}

function labelFor(lang, slug, actions) {
  if (lang === 'en') return CATEGORY_LABEL_EN[slug] ?? slug;
  return actions[0]?.category ?? slug;
}

function categoryPage(lang, slug, actions) {
  const label = labelFor(lang, slug, actions);
  const head =
    `---\ntitle: ${label}\n---\n\n` +
    `import { ActionCard } from '../../components/ActionCard';\n\n` +
    `# ${label}\n\n`;
  const body = actions
    .map((a) => {
      const summary = a.summary ? `${a.summary}\n\n` : '';
      // Backtick the name so leading-underscore / dotted names (e.g.
      // `_del_group_notice`, `.handle_quick_operation`) are not parsed as
      // markdown emphasis. The card's own `id="action-<name>"` is the anchor.
      return `## \`${a.name}\`\n\n${summary}<ActionCard action={${JSON.stringify(a)}} />\n`;
    })
    .join('\n');
  return head + body;
}

function indexPage(loc) {
  return (
    `---\ntitle: ${loc.indexTitle}\n---\n\n` +
    `import { ActionIndex } from '../../components/ActionIndex';\n\n` +
    `# ${loc.indexTitle}\n\n${loc.indexLead}\n\n` +
    `<ActionIndex lang="${loc.lang}" />\n\n${loc.tailNote}\n`
  );
}

const groups = groupByCategory(catalog.actions);
const orderedSlugs = [...groups.keys()];

for (const loc of LOCALES) {
  const dir = path.join(root, 'docs', loc.lang, 'api');
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.mdx'), indexPage(loc));
  for (const [slug, actions] of groups) {
    await writeFile(path.join(dir, `${slug}.mdx`), categoryPage(loc.lang, slug, actions));
  }
  const meta = [
    { type: 'file', name: 'index', label: loc.indexTitle },
    ...orderedSlugs.map((slug) => ({
      type: 'file',
      name: slug,
      label: labelFor(loc.lang, slug, groups.get(slug)),
    })),
  ];
  await writeFile(path.join(dir, '_meta.json'), JSON.stringify(meta, null, 2) + '\n');
}

console.log(
  `Generated API pages for ${LOCALES.length} locales, ${orderedSlugs.length} categories, ` +
    `${catalog.actions.length} actions.`,
);
