#!/usr/bin/env node
// catalog.json → OpenAPI 3.1 (public/openapi/snowluma.json).
// One POST /{actionName} per catalog action. Request body is inputSchema
// (x-role stripped). HTTP 200 is the OneBot envelope with data from returnsSchema.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Keep in sync with tools/generate-api-pages.mjs (+ sys-face / stream).
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
  '系统表情': 'sys-face',
  '流式接口': 'stream',
};

const HOST = 'http://127.0.0.1:3000';

async function resolveCatalogPath() {
  const candidates = [
    path.join(root, 'docs/public/api/catalog.json'),
    path.join(root, 'public/api/catalog.json'),
  ];
  for (const p of candidates) {
    try {
      await access(p);
      return p;
    } catch {
      // try next
    }
  }
  throw new Error(
    'catalog.json not found (tried docs/public/api/catalog.json and public/api/catalog.json)',
  );
}

function stripXRole(value) {
  if (Array.isArray(value)) return value.map(stripXRole);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === 'x-role') continue;
      out[k] = stripXRole(v);
    }
    return out;
  }
  return value;
}

function actionDescription(action) {
  const parts = [];
  if (action.returns?.trim()) parts.push(action.returns.trim());
  if (action.aliases?.length) {
    parts.push(`别名：${action.aliases.map((a) => `\`${a}\``).join(', ')}`);
  }
  if (action.readOnly) parts.push('只读。');
  return parts.length ? parts.join('\n\n') : undefined;
}

function enrichInputSchema(action) {
  const schema = stripXRole(action.inputSchema ?? { type: 'object' });
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return schema;
  const properties = schema.properties && typeof schema.properties === 'object' ? { ...schema.properties } : {};
  for (const param of action.params ?? []) {
    if (!param?.name) continue;
    const current = properties[param.name] && typeof properties[param.name] === 'object' ? properties[param.name] : {};
    const next = { ...current };
    if (param.desc && !next.description) next.description = param.desc;
    if (param.schema && typeof param.schema === 'object') {
      for (const [k, v] of Object.entries(param.schema)) {
        if (next[k] === undefined) next[k] = v;
      }
    }
    if (!next.type && param.type === 'uint') {
      next.type = 'integer';
      if (next.minimum === undefined) next.minimum = 0;
    }
    properties[param.name] = next;
  }
  const required = Array.isArray(schema.required)
    ? schema.required
    : (action.params ?? []).filter((p) => p.required).map((p) => p.name);
  return {
    ...schema,
    type: schema.type ?? 'object',
    properties,
    ...(required.length ? { required } : {}),
  };
}

function actionResponse(action) {
  const dataDescription = action.returns?.trim();
  const data = action.returnsSchema
    ? stripXRole(action.returnsSchema)
    : { description: dataDescription || 'Action payload' };
  return {
    description: dataDescription || 'OneBot HTTP envelope',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok', 'failed'] },
            retcode: { type: 'integer', description: '0 means success' },
            data,
            message: { type: 'string' },
            wording: { type: 'string' },
          },
        },
      },
    },
  };
}

function buildOpenApi(catalog) {
  const tagNames = [];
  const seen = new Set();
  for (const action of catalog.actions) {
    const tag = action.category ?? '扩展';
    if (!seen.has(tag)) {
      seen.add(tag);
      tagNames.push(tag);
    }
  }
  // Stable order by slug when known, else by Chinese name.
  tagNames.sort((a, b) => {
    const sa = CATEGORY_SLUG[a] ?? a;
    const sb = CATEGORY_SLUG[b] ?? b;
    return sa.localeCompare(sb);
  });

  const paths = {};
  for (const action of catalog.actions) {
    const category = action.category ?? '扩展';
    const tag = CATEGORY_SLUG[category] ?? 'extended';
    const bodySchema = enrichInputSchema(action);
    const hasBody = Boolean(bodySchema?.properties && Object.keys(bodySchema.properties).length);
    const op = {
      operationId: action.name,
      summary: action.summary ?? action.name,
      tags: [tag],
      security: [{ BearerAuth: [] }, { AccessTokenQuery: [] }],
      requestBody: {
        required: hasBody,
        content: {
          'application/json': {
            schema: bodySchema,
          },
        },
      },
      responses: {
        '200': actionResponse(action),
      },
    };
    const desc = actionDescription(action);
    if (desc) op.description = desc;

    paths[`/${action.name}`] = { post: op };
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'SnowLuma OneBot HTTP API',
      version: '1.0.0',
      description:
        `OneBot v11-compatible HTTP API generated from catalog.json (${catalog.actions.length} actions). ` +
        'POST `/{action}` with a JSON body. Authenticate with `Authorization: Bearer <token>` or `?access_token=<token>` when a token is configured. ' +
        'Every response is a OneBot envelope: `status`, `retcode`, `data`.',
    },
    servers: [
      { url: HOST, description: 'Default HTTP server on the host' },
      { url: 'http://snowluma:3000', description: 'Docker Compose service name on the same network' },
    ],
    tags: tagNames.map((name) => {
      const slug = CATEGORY_SLUG[name] ?? 'extended';
      return { name: slug, description: name, 'x-displayName': name, 'x-category': name };
    }),
    paths,
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'Authorization: Bearer <access_token>',
        },
        AccessTokenQuery: {
          type: 'apiKey',
          in: 'query',
          name: 'access_token',
          description: 'Query parameter access_token=<token>',
        },
      },
    },
    security: [{ BearerAuth: [] }, { AccessTokenQuery: [] }],
  };
}

const catalogPath = await resolveCatalogPath();
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
if (!Array.isArray(catalog.actions)) {
  throw new Error(`invalid catalog at ${catalogPath}: missing actions[]`);
}

const outDir = path.join(root, 'public/openapi');
await mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, 'snowluma.json');
await writeFile(outPath, `${JSON.stringify(buildOpenApi(catalog), null, 2)}\n`, 'utf8');
console.log(`Wrote ${path.relative(root, outPath)} from ${path.relative(root, catalogPath)} (${catalog.actions.length} actions)`);
