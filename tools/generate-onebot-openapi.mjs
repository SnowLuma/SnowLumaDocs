#!/usr/bin/env node
// Scan every `h.registerAction('<name>', async (params) => { ... })`
// in `<SnowLuma>/packages/core/src/onebot/actions/` and emit an
// OpenAPI 3.1 document that Fumadocs OpenAPI can compile into MDX
// pages.
//
// The docs site is a separate repository from SnowLuma proper. By
// default this script looks for SnowLuma at `../../` (relative to
// the docs repo root) — the layout developers see when they have
// the docs repo checked out under SnowLuma's `dev/` directory.
//
// Override the source location:
//   SNOWLUMA_SRC=/abs/path/to/SnowLuma pnpm openapi:generate
//
// The generated `content/api/openapi.json` is committed, so the
// production docs build (which doesn't have access to SnowLuma's
// source tree) doesn't need to run this — only developers do, when
// a `registerAction` call is added or renamed.
//
// Inference rules (best effort — we don't run TS, just AST):
//   - Action name: the string literal first argument to registerAction.
//   - Request params: every `asNumber/asString/asBoolean/asMessage(params.<field>, [default])`
//     call. Type comes from the asX helper. Default → optional;
//     `if (!<field>)` failure check → required.
//   - Response: schema is the standard OneBot envelope; we don't try to
//     synthesise per-action `data` shapes (too lossy from AST alone),
//     just expose `data` as freeform.
//   - Tag: derived from source filename (group-admin → "Group · Admin").
//
// Usage:
//   pnpm openapi:generate
//   pnpm openapi:generate ./content/api/openapi.json   # explicit output

import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, '..');

// Locate the SnowLuma source tree.
//   1. $SNOWLUMA_SRC overrides everything.
//   2. Otherwise assume the docs repo lives under <SnowLuma>/dev/ —
//      walk up two levels and check for the expected layout.
function resolveSnowLumaSrc() {
  if (process.env.SNOWLUMA_SRC) {
    const abs = path.resolve(process.env.SNOWLUMA_SRC);
    if (!existsSync(path.join(abs, 'packages/core/src/onebot/actions'))) {
      console.error(
        `SNOWLUMA_SRC=${abs} does not contain packages/core/src/onebot/actions/`,
      );
      process.exit(1);
    }
    return abs;
  }
  const guess = path.resolve(docsRoot, '../..');
  if (existsSync(path.join(guess, 'packages/core/src/onebot/actions'))) {
    return guess;
  }
  console.error(
    'Could not locate SnowLuma source. Set SNOWLUMA_SRC=/path/to/SnowLuma.',
  );
  process.exit(1);
}

const snowLumaSrc = resolveSnowLumaSrc();
const actionsDir = path.join(snowLumaSrc, 'packages/core/src/onebot/actions');
const defaultOut = path.join(docsRoot, 'content/api/openapi.json');
const outPath = path.resolve(docsRoot, process.argv[2] ?? defaultOut);

const TYPE_MAP = {
  asNumber: { type: 'integer', format: 'int64' },
  asString: { type: 'string' },
  asBoolean: { type: 'boolean' },
  asMessage: {
    oneOf: [
      { type: 'string', description: '消息文本或 CQ 码字符串' },
      {
        type: 'array',
        items: { type: 'object', additionalProperties: true },
        description: 'OneBot 消息段数组',
      },
    ],
  },
};

/** Pick a tag for an action from its file location. */
function tagFor(file) {
  const base = path.basename(file, '.ts');
  switch (base) {
    case 'friend':       return 'Friend';
    case 'group-admin':  return 'Group · Admin';
    case 'group-file':   return 'Group · File';
    case 'group-info':   return 'Group · Info';
    case 'info':         return 'System';
    case 'message':      return 'Message';
    case 'request':      return 'Request';
    case 'extended':     return 'Extended';
    default:             return base;
  }
}

/** Collect all `.ts` files in actionsDir. */
async function listActionFiles() {
  const entries = await readdir(actionsDir);
  return entries.filter((e) => e.endsWith('.ts')).map((e) => path.join(actionsDir, e));
}

/**
 * Walk a TypeScript source file and yield {name, file, params, comment}
 * for every registerAction call.
 */
function* extractActions(filePath, source) {
  const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);

  const walk = function* (node) {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'registerAction'
    ) {
      const [nameArg, handlerArg] = node.arguments;
      if (!nameArg || !ts.isStringLiteral(nameArg)) {
        // dynamic name; skip
      } else {
        const params = collectParams(handlerArg);
        const comment = leadingComment(node, source);
        yield { name: nameArg.text, params, comment };
      }
    }
    for (const child of node.getChildren(sf)) {
      yield* walk(child);
    }
  };
  yield* walk(sf);
}

/** Extract every `asX(params.foo, default?)` and `if (!foo)` reference inside a handler. */
function collectParams(handler) {
  /** @type {Map<string, { helper: string, hasDefault: boolean, required: boolean }>} */
  const seen = new Map();
  const requiredNames = new Set();
  const declaredVars = new Map(); // const varName → field
  if (!handler) return [];

  const visit = (node) => {
    // const x = asX(params.foo[, default])
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const helper = node.expression.text;
      if (helper in TYPE_MAP) {
        const [src, def] = node.arguments;
        const field = paramsField(src);
        if (field) {
          const prev = seen.get(field);
          const hasDefault = def !== undefined;
          if (!prev) {
            seen.set(field, { helper, hasDefault, required: false });
          } else {
            // Keep the more specific helper if multiple readers exist
            if (!hasDefault) prev.hasDefault = false;
          }
          // Try to map the assigned variable name → field, so we can
          // resolve `if (!variable)` checks later.
          const parent = node.parent;
          if (parent && ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
            declaredVars.set(parent.name.text, field);
          }
        }
      }
    }
    // `if (!foo)` or `if (!foo || ...)` ⇒ mark foo as required
    if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.ExclamationToken) {
      const operand = node.operand;
      if (ts.isIdentifier(operand)) {
        requiredNames.add(operand.text);
      } else {
        const field = paramsField(operand);
        if (field) requiredNames.add(field);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(handler);

  // Resolve required-ness: any local var referenced in `if (!var)` whose
  // declaration was `asX(params.field)` flags that field as required.
  for (const [name, info] of seen) {
    if (requiredNames.has(name) && !info.hasDefault) info.required = true;
  }
  for (const [varName, field] of declaredVars) {
    if (requiredNames.has(varName)) {
      const info = seen.get(field);
      if (info && !info.hasDefault) info.required = true;
    }
  }

  return [...seen.entries()].map(([name, info]) => ({
    name,
    helper: info.helper,
    required: info.required,
  }));
}

/** Return the field name if `expr` is `params.foo`, else null. */
function paramsField(expr) {
  if (
    expr &&
    ts.isPropertyAccessExpression(expr) &&
    ts.isIdentifier(expr.expression) &&
    expr.expression.text === 'params'
  ) {
    return expr.name.text;
  }
  return null;
}

/** Pull a leading `// ...` block immediately above the node, if any. */
function leadingComment(node, source) {
  const ranges = ts.getLeadingCommentRanges(source, node.getFullStart());
  if (!ranges?.length) return undefined;
  const range = ranges[ranges.length - 1];
  const text = source.slice(range.pos, range.end).trim();
  return text
    .split('\n')
    .map((l) => l.replace(/^\/\/\s?|^\/\*\*?|\*\/$|^\s*\*\s?/, '').trim())
    .filter(Boolean)
    .join(' ')
    .trim() || undefined;
}

/** Convert a single inferred action into an OpenAPI operation. */
function toOperation(action, tag) {
  const properties = {};
  const required = [];

  for (const p of action.params) {
    properties[p.name] = {
      ...TYPE_MAP[p.helper],
      description: undefined,
    };
    if (p.required) required.push(p.name);
  }

  const requestSchema = action.params.length
    ? {
        type: 'object',
        properties,
        ...(required.length ? { required } : {}),
        additionalProperties: false,
      }
    : { type: 'object', additionalProperties: false };

  return {
    summary: action.name,
    description: action.comment,
    operationId: action.name,
    tags: [tag],
    requestBody: {
      required: required.length > 0,
      content: {
        'application/json': {
          schema: requestSchema,
        },
      },
    },
    responses: {
      '200': {
        description: 'OneBot 标准应答信封。',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiResponse' },
          },
        },
      },
    },
  };
}

async function main() {
  const files = await listActionFiles();
  /** @type {Record<string, any>} */
  const paths = {};
  let total = 0;

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const tag = tagFor(file);
    for (const action of extractActions(file, source)) {
      const route = `/${action.name}`;
      if (paths[route]) {
        // Last writer wins; aliases like `send_packet`/`.send_packet`
        // share a handler so we end up keeping whichever was scanned
        // last — that's fine for ref docs.
      }
      paths[route] = { post: toOperation(action, tag) };
      total++;
    }
  }

  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'SnowLuma OneBot API',
      version: '0.1.0',
      description:
        'SnowLuma 对外暴露的 OneBot v11 兼容 API。所有动作通过 HTTP POST 或 WebSocket 调用，' +
        '请求体为 JSON。响应统一用 OneBot 标准应答信封。本文档由 SnowLumaDocs 的 ' +
        '`tools/generate-onebot-openapi.mjs` 从 SnowLuma 主仓的 ' +
        '`packages/core/src/onebot/actions/` 源代码静态扫描生成。',
    },
    servers: [
      { url: 'http://localhost:3000', description: '默认 HTTP 端点' },
    ],
    tags: [
      { name: 'System', description: '系统信息与状态。' },
      { name: 'Message', description: '消息发送、撤回、查询。' },
      { name: 'Friend', description: '好友与陌生人。' },
      { name: 'Group · Info', description: '群信息与成员。' },
      { name: 'Group · Admin', description: '群管理动作。' },
      { name: 'Group · File', description: '群文件。' },
      { name: 'Request', description: '加好友 / 加群请求处理。' },
      { name: 'Extended', description: 'gocqhttp / NapCat 兼容扩展接口。' },
    ],
    paths,
    components: {
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok', 'failed'] },
            retcode: {
              type: 'integer',
              description: '0 表示成功；非 0 表示失败。',
            },
            data: {
              description: '动作返回值，类型随动作不同；失败时为 null。',
            },
            wording: { type: 'string', description: '失败时的可读消息。' },
            echo: { description: '调用方传入的 echo 值，用于异步请求关联。' },
          },
          required: ['status', 'retcode', 'data'],
        },
      },
    },
  };

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(spec, null, 2) + '\n', 'utf8');
  console.log(
    `Generated ${total} actions from ${snowLumaSrc}\n  → ${outPath}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
