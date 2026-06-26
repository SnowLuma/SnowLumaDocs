#!/usr/bin/env node
// catalog.json → a real-API-style reference: ONE page per action under category
// dirs (/api/<category>/<action>), plus a category overview and a searchable
// landing page. Pages are generated MDX using native Rspress <Tabs> + markdown
// tables + :::tip (Shiki-highlighted, static). A tiny <ActionHeader> handles the
// badge header; <ApiLanding> handles the landing search/cards. Regenerated on
// prebuild; output is committed so the deploy build is deterministic.
//
// The CATEGORY_SLUG map MUST stay identical to docs/components/ApiLanding.tsx.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(
  await readFile(path.join(root, 'docs/public/api/catalog.json'), 'utf8'),
);

const HOST = 'http://127.0.0.1:3000';

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
  system: 'System', message: 'Message', friend: 'Friend', 'group-info': 'Group Info',
  'group-admin': 'Group Admin', 'group-file': 'Group File', request: 'Request',
  extended: 'Extended', 'group-album': 'Group Album', qzone: 'Qzone',
};

const LOCALES = [
  {
    lang: 'zh',
    prefix: '',
    indexTitle: 'API 参考',
    indexLead: `OneBot v11 兼容 API，共 ${catalog.actions.length} 个动作。每个动作通过 HTTP POST 或 WebSocket 调用，请求体为 JSON，响应为 OneBot 标准应答信封。本页由 \`catalog.json\` 自动生成，与运行时校验同源。`,
    inputTitle: '输入参数',
    noParams: '该动作无需参数。',
    returnTitle: '返回 (data)',
    returnPending: '该动作返回标准 OneBot 信封；`data` 结构待补充。',
    returnEnvelope: '所有响应都包裹在标准信封中：`{ "status": "ok", "retcode": 0, "data": ... }`。下表描述 `data` 字段。',
    rawSchema: '原始 JSON Schema',
    exampleTitle: '调用示例',
    callLine: (n) => `通过 \`POST ${HOST}/${n}\`（请求体为 JSON 参数）或 WebSocket 调用。`,
    th: { param: '参数', type: '类型', required: '必填', def: '默认', desc: '说明', field: '字段' },
    mcpTip: '在用 AI 助手？',
    mcpBody: (p) => `支持 MCP 的客户端可直接发现并调用本动作，无需手写 HTTP。见 [MCP 接入](${p}/mcp/)。`,
    tailNote: '> 注：`extended.ts` 中约 15 个不规则的遗留动作不在自动目录内，详见源码 `packages/onebot/src/actions/extended.ts`。',
    tokenNote: '若已配置 access token',
  },
  {
    lang: 'en',
    prefix: '/en',
    indexTitle: 'API Reference',
    indexLead: `OneBot v11-compatible API — ${catalog.actions.length} actions. Each is called via HTTP POST or WebSocket with a JSON body; responses use the OneBot envelope. Generated from \`catalog.json\`, sharing its source with runtime validation. (Action descriptions are authored in Chinese.)`,
    inputTitle: 'Parameters',
    noParams: 'This action takes no parameters.',
    returnTitle: 'Returns (data)',
    returnPending: 'Returns the standard OneBot envelope; the `data` shape is not yet documented.',
    returnEnvelope: 'Every response is wrapped in the standard envelope: `{ "status": "ok", "retcode": 0, "data": ... }`. The table below describes `data`.',
    rawSchema: 'Raw JSON Schema',
    exampleTitle: 'Examples',
    callLine: (n) => `Call via \`POST ${HOST}/${n}\` (JSON params as the body) or WebSocket.`,
    th: { param: 'Param', type: 'Type', required: 'Required', def: 'Default', desc: 'Description', field: 'Field' },
    mcpTip: 'Using an AI assistant?',
    mcpBody: (p) => `MCP-capable clients can discover and call this action directly — no hand-written HTTP. See [MCP](${p}/mcp/).`,
    tailNote: '> Note: ~15 irregular legacy actions in `extended.ts` are not in the generated catalog; see `packages/onebot/src/actions/extended.ts`.',
    tokenNote: 'if an access token is configured',
  },
];

// ─────────────────────────── grouping ───────────────────────────

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
const labelFor = (lang, slug, actions) =>
  lang === 'en' ? (CATEGORY_LABEL_EN[slug] ?? slug) : (actions[0]?.category ?? slug);

// ─────────────────────────── example params ───────────────────────────

function sampleParams(action) {
  const obj = {};
  for (const p of action.params) {
    if (p.default !== undefined) { obj[p.name] = p.default; continue; }
    if (p.values && p.values.length) { obj[p.name] = p.values[0]; continue; }
    if (p.type === 'uint' || p.type === 'int' || p.type === 'messageId' || p.type === 'number') {
      if (p.name.includes('group_id')) obj[p.name] = 123456;
      else if (p.name.includes('user_id')) obj[p.name] = 10001;
      else if (p.name.includes('message_id')) obj[p.name] = 100001;
      else obj[p.name] = 0;
    } else if (p.type === 'bool') obj[p.name] = false;
    else if (p.type.endsWith('[]')) obj[p.name] = [];
    else if (p.type === 'message') obj[p.name] = '你好';
    else obj[p.name] = '';
  }
  return obj;
}

// JSON → Python literal (True/False/None).
function pyLiteral(v, indent = 0) {
  const pad = '    '.repeat(indent);
  const pad1 = '    '.repeat(indent + 1);
  if (v === null) return 'None';
  if (typeof v === 'boolean') return v ? 'True' : 'False';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    return '[\n' + v.map((x) => pad1 + pyLiteral(x, indent + 1)).join(',\n') + '\n' + pad + ']';
  }
  const keys = Object.keys(v);
  if (keys.length === 0) return '{}';
  return '{\n' + keys.map((k) => `${pad1}${JSON.stringify(k)}: ${pyLiteral(v[k], indent + 1)}`).join(',\n') + '\n' + pad + '}';
}

function examples(action, loc) {
  const name = action.name;
  const params = sampleParams(action);
  const json = JSON.stringify(params, null, 2);
  const jsonCompact = JSON.stringify(params);
  const tk = loc.tokenNote;
  const curl =
    `curl -X POST ${HOST}/${name} \\\n` +
    `  -H 'Content-Type: application/json' \\\n` +
    `  -H 'Authorization: Bearer <access-token>' \\\n` +
    `  -d '${jsonCompact}'`;
  const python =
    `import requests\n\n` +
    `resp = requests.post(\n` +
    `    "${HOST}/${name}",\n` +
    `    json=${pyLiteral(params, 1).replace(/^/, '')},\n` +
    `    headers={"Authorization": "Bearer <access-token>"},  # ${tk}\n` +
    `)\n` +
    `print(resp.json())`;
  const js =
    `const resp = await fetch("${HOST}/${name}", {\n` +
    `  method: "POST",\n` +
    `  headers: {\n` +
    `    "Content-Type": "application/json",\n` +
    `    "Authorization": "Bearer <access-token>", // ${tk}\n` +
    `  },\n` +
    `  body: JSON.stringify(${json}),\n` +
    `});\n` +
    `console.log(await resp.json());`;
  const go =
    `package main\n\n` +
    `import (\n\t"bytes"\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\n` +
    `func main() {\n` +
    `\tbody := []byte(\`${jsonCompact}\`)\n` +
    `\treq, _ := http.NewRequest("POST", "${HOST}/${name}", bytes.NewReader(body))\n` +
    `\treq.Header.Set("Content-Type", "application/json")\n` +
    `\treq.Header.Set("Authorization", "Bearer <access-token>") // ${tk}\n` +
    `\tresp, err := http.DefaultClient.Do(req)\n` +
    `\tif err != nil {\n\t\tpanic(err)\n\t}\n` +
    `\tdefer resp.Body.Close()\n` +
    `\tout, _ := io.ReadAll(resp.Body)\n` +
    `\tfmt.Println(string(out))\n}`;
  const sdk =
    `import { SnowLumaHttpClient } from '@snowluma/sdk';\n\n` +
    `const bot = new SnowLumaHttpClient({\n` +
    `  baseUrl: '${HOST}/',\n` +
    `  accessToken: process.env.SNOWLUMA_TOKEN, // ${tk}\n` +
    `});\n\n` +
    `const data = await bot.call('${name}', ${json});\n` +
    `console.log(data);`;
  return { curl, python, js, go, sdk };
}

function examplesTabs(action, loc) {
  const ex = examples(action, loc);
  const tab = (label, lang, code) =>
    `<Tab label="${label}">\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n</Tab>`;
  return (
    `<Tabs>\n` +
    tab('curl', 'bash', ex.curl) + '\n' +
    tab('Python', 'python', ex.python) + '\n' +
    tab('JavaScript', 'js', ex.js) + '\n' +
    tab('Go', 'go', ex.go) + '\n' +
    tab('SnowLuma SDK', 'ts', ex.sdk) + '\n' +
    `</Tabs>`
  );
}

// ─────────────────────────── tables ───────────────────────────

// Escape characters MDX treats specially in flowing markdown text: `{`/`}`
// start JS expressions and `<` starts a JSX tag. Source-derived prose/summaries
// (e.g. a `returns` of "{ message_id: number }") must be neutralised or MDX
// fails to compile / throws at render.
const mdxText = (s) =>
  String(s ?? '').replace(/([{}<])/g, '\\$1');
// Table cell: MDX-escape, then escape the pipe + collapse newlines.
const cell = (s) => mdxText(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
// Route-safe page slug: rspress's page glob skips dotfiles, so an action whose
// name starts with `.` (e.g. `.get_word_slices`) would be unreachable. Strip
// leading dots for the FILE/route/_meta/link slug; the real `name` is kept for
// display, the call URL, and `bot.call(...)`.
const actionSlug = (name) => name.replace(/^\.+/, '');

function paramTypeLabel(p) {
  if (p.values && p.values.length) return p.values.map((v) => JSON.stringify(v)).join(' / ');
  return p.type;
}

function paramsTable(action, loc) {
  if (!action.params.length) return `${loc.noParams}\n`;
  const t = loc.th;
  const head = `| ${t.param} | ${t.type} | ${t.required} | ${t.def} | ${t.desc} |\n| --- | --- | --- | --- | --- |\n`;
  const rows = action.params
    .map((p) => {
      const def = !p.required && p.default !== undefined ? `\`${cell(JSON.stringify(p.default))}\`` : '';
      return `| \`${cell(p.name)}\` | ${cell(paramTypeLabel(p))} | ${p.required ? '✓' : '–'} | ${def} | ${cell(p.desc ?? '')} |`;
    })
    .join('\n');
  return head + rows + '\n';
}

// Render a JSON-schema property's type as a short label.
function schemaTypeLabel(s) {
  if (!s || typeof s !== 'object') return 'any';
  if (s.enum) return `${s.type ?? 'string'} (${s.enum.join(' / ')})`;
  if (s.type === 'array') {
    const it = s.items;
    if (it && it.type === 'object') return 'object[]';
    return `${(it && it.type) || 'any'}[]`;
  }
  return s.type ?? 'object';
}

// Build the 返回 section from returnsSchema (object | array<object> | primitive).
function returnsSection(action, loc) {
  const t = loc.th;
  const schema = action.returnsSchema;
  const prose = action.returns ? `${mdxText(action.returns)}\n\n` : '';
  if (!schema) return `${prose}${loc.returnPending}\n`;

  let fieldsObj = null;
  let prefix = '';
  if (schema.type === 'object' && schema.properties) {
    fieldsObj = schema;
  } else if (schema.type === 'array' && schema.items && schema.items.type === 'object' && schema.items.properties) {
    fieldsObj = schema.items;
    prefix = loc.lang === 'en' ? '`data` is an array; each element:\n\n' : '`data` 为数组，每个元素：\n\n';
  } else {
    // primitive or opaque array/object — show prose + raw schema only.
    const typeLbl = schemaTypeLabel(schema);
    const line = loc.lang === 'en'
      ? `\`data\` is \`${typeLbl}\`.`
      : `\`data\` 为 \`${typeLbl}\`。`;
    return `${prose}${line}\n\n<details>\n<summary>${loc.rawSchema}</summary>\n\n\`\`\`json\n${JSON.stringify(schema, null, 2)}\n\`\`\`\n\n</details>\n`;
  }

  const required = new Set(fieldsObj.required ?? []);
  const head = `| ${t.field} | ${t.type} | ${t.required} | ${t.desc} |\n| --- | --- | --- | --- |\n`;
  const rows = Object.entries(fieldsObj.properties)
    .map(([k, v]) => `| \`${cell(k)}\` | ${cell(schemaTypeLabel(v))} | ${required.has(k) ? '✓' : '–'} | ${cell(v.description ?? '')} |`)
    .join('\n');
  return (
    `${prose}${loc.returnEnvelope}\n\n${prefix}${head}${rows}\n\n` +
    `<details>\n<summary>${loc.rawSchema}</summary>\n\n\`\`\`json\n${JSON.stringify(schema, null, 2)}\n\`\`\`\n\n</details>\n`
  );
}

// ─────────────────────────── page builders ───────────────────────────

function actionPage(loc, slug, action) {
  const aliasesProp = action.aliases.length ? ` aliases={${JSON.stringify(action.aliases)}}` : '';
  const summaryAttr = action.summary ? ` summary={${JSON.stringify(action.summary)}}` : '';
  const catAttr = action.category ? ` category={${JSON.stringify(action.category)}}` : '';
  return (
    `---\ntitle: "${action.name}"\n---\n\n` +
    `import { ActionHeader } from '../../../components/ActionHeader';\n` +
    `import { Tabs, Tab } from '@theme';\n\n` +
    `<ActionHeader name={${JSON.stringify(action.name)}}${summaryAttr} readOnly={${action.readOnly}}${catAttr}${aliasesProp} />\n\n` +
    `${loc.callLine(action.name)}\n\n` +
    `## ${loc.inputTitle}\n\n${paramsTable(action, loc)}\n` +
    `## ${loc.returnTitle}\n\n${returnsSection(action, loc)}\n` +
    `## ${loc.exampleTitle}\n\n${examplesTabs(action, loc)}\n\n` +
    `:::tip ${loc.mcpTip}\n${loc.mcpBody(loc.prefix)}\n:::\n`
  );
}

function categoryOverview(loc, slug, actions) {
  const label = labelFor(loc.lang, slug, actions);
  const lead = loc.lang === 'en'
    ? `${actions.length} actions.`
    : `共 ${actions.length} 个动作。`;
  const extNote = slug === 'extended'
    ? (loc.lang === 'en'
        ? '\n> gocqhttp / NapCat compatibility extensions. Use the search on the [API index](' + loc.prefix + '/api/) to locate one quickly.\n'
        : '\n> gocqhttp / NapCat 兼容扩展接口。用 [API 首页](' + loc.prefix + '/api/) 的搜索框可快速定位。\n')
    : '';
  const rows = actions
    .map((a) => `| [\`${cell(a.name)}\`](${loc.prefix}/api/${slug}/${actionSlug(a.name)}) | ${a.readOnly ? (loc.lang === 'en' ? 'read' : '只读') : (loc.lang === 'en' ? 'write' : '写')} | ${cell(a.summary ?? '')} |`)
    .join('\n');
  const th = loc.lang === 'en' ? '| Action | Kind | Summary |' : '| 动作 | 性质 | 中文名 |';
  return (
    `---\ntitle: "${label}"\n---\n\n# ${label}\n\n${lead}\n${extNote}\n` +
    `${th}\n| --- | --- | --- |\n${rows}\n`
  );
}

function landingIndex(loc) {
  return (
    `---\ntitle: ${loc.indexTitle}\n---\n\n` +
    `import { ApiLanding } from '../../components/ApiLanding';\n\n` +
    `# ${loc.indexTitle}\n\n${loc.indexLead}\n\n` +
    `:::tip ${loc.mcpTip}\n${loc.mcpBody(loc.prefix)}\n:::\n\n` +
    `<ApiLanding lang="${loc.lang}" />\n\n${loc.tailNote}\n`
  );
}

// ─────────────────────────── emit ───────────────────────────

const groups = groupByCategory(catalog.actions);
const orderedSlugs = [...groups.keys()];

for (const loc of LOCALES) {
  const apiDir = path.join(root, 'docs', loc.lang, 'api');
  await rm(apiDir, { recursive: true, force: true });
  await mkdir(apiDir, { recursive: true });

  // landing
  await writeFile(path.join(apiDir, 'index.mdx'), landingIndex(loc));
  await writeFile(
    path.join(apiDir, '_meta.json'),
    JSON.stringify(
      [
        { type: 'file', name: 'index', label: loc.indexTitle },
        ...orderedSlugs.map((slug) => ({
          type: 'dir', name: slug, label: labelFor(loc.lang, slug, groups.get(slug)), collapsed: true,
        })),
      ],
      null,
      2,
    ) + '\n',
  );

  // per category
  for (const [slug, actions] of groups) {
    const dir = path.join(apiDir, slug);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.mdx'), categoryOverview(loc, slug, actions));
    for (const action of actions) {
      await writeFile(path.join(dir, `${actionSlug(action.name)}.mdx`), actionPage(loc, slug, action));
    }
    await writeFile(
      path.join(dir, '_meta.json'),
      JSON.stringify(
        [
          { type: 'file', name: 'index', label: loc.lang === 'en' ? 'Overview' : '概览' },
          ...actions.map((a) => ({ type: 'file', name: actionSlug(a.name), label: a.name })),
        ],
        null,
        2,
      ) + '\n',
    );
  }
}

console.log(
  `Generated API reference: ${LOCALES.length} locales × (${catalog.actions.length} action pages + ${orderedSlugs.length} category overviews + 1 landing).`,
);
