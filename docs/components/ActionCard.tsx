import React, { useState } from 'react';
import './ActionCard.css';

// Mirror of @snowluma/mcp's CatalogAction (the docs build's only contract with
// the main repo — see catalog.json). Kept in sync via the sync-docs-catalog
// workflow; the shape is the seam, not a shared type.
export interface CatalogParam {
  name: string;
  type: string;
  required: boolean;
  default?: unknown;
  desc?: string;
  values?: ReadonlyArray<string | number>;
  schema?: Record<string, unknown>;
}
export interface CatalogAction {
  name: string;
  aliases: string[];
  category?: string;
  summary?: string;
  returns?: string;
  returnsSchema?: Record<string, unknown>;
  readOnly: boolean;
  params: CatalogParam[];
  invariants: string[];
  inputSchema: Record<string, unknown>;
}

function sampleBody(a: CatalogAction): string {
  const obj: Record<string, unknown> = {};
  for (const p of a.params) {
    if (p.default !== undefined) obj[p.name] = p.default;
    else if (p.type === 'uint' || p.type === 'int' || p.type === 'messageId') obj[p.name] = 0;
    else if (p.type === 'bool') obj[p.name] = false;
    else if (p.type.endsWith('[]')) obj[p.name] = [];
    else obj[p.name] = '';
  }
  return JSON.stringify(obj, null, 2);
}

export const ActionCard: React.FC<{ action: CatalogAction }> = ({ action }) => {
  const [showSchema, setShowSchema] = useState(false);
  return (
    <div className="ac-card" id={`action-${action.name}`}>
      <div className="ac-head">
        <code className="ac-name">{action.name}</code>
        {action.readOnly
          ? <span className="ac-badge ac-ro">只读</span>
          : <span className="ac-badge ac-rw">写操作</span>}
        {action.summary && <span className="ac-summary">{action.summary}</span>}
      </div>
      {action.aliases.length > 0 && (
        <div className="ac-aliases">
          别名：{action.aliases.map((x) => <code key={x}>{x}</code>)}
        </div>
      )}
      {action.params.length > 0 ? (
        <table className="ac-params">
          <thead>
            <tr><th>参数</th><th>类型</th><th>必填</th><th>默认</th><th>说明</th></tr>
          </thead>
          <tbody>
            {action.params.map((p) => (
              <tr key={p.name}>
                <td><code>{p.name}</code></td>
                <td>{p.values ? p.values.map((v) => JSON.stringify(v)).join(' | ') : p.type}</td>
                <td>{p.required ? '✓' : '–'}</td>
                <td>{!p.required && p.default !== undefined ? <code>{JSON.stringify(p.default)}</code> : ''}</td>
                <td>{p.desc ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="ac-noparams">无参数。</p>
      )}
      {action.invariants.length > 0 && (
        <ul className="ac-invariants">
          {action.invariants.map((x, i) => <li key={i}>{x}</li>)}
        </ul>
      )}
      <details className="ac-req">
        <summary>请求示例</summary>
        <pre><code>{`POST /${action.name}\nContent-Type: application/json\n\n${sampleBody(action)}`}</code></pre>
      </details>
      <div className="ac-returns">
        <strong>返回</strong>（OneBot 信封的 <code>data</code> 字段）：{action.returns ?? '见下方结构。'}
        {action.returnsSchema && (
          <div>
            <button className="ac-toggle" onClick={() => setShowSchema((v) => !v)}>
              {showSchema ? '收起 data 结构' : '展开 data 结构'}
            </button>
            {showSchema && <pre><code>{JSON.stringify(action.returnsSchema, null, 2)}</code></pre>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionCard;
