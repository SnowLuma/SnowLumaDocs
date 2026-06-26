import React, { useMemo, useState } from 'react';
import './ActionIndex.css';
import catalog from '../public/api/catalog.json';
import type { CatalogAction } from './catalog-types';

// Category (Chinese, from the catalog) → ASCII page slug. Kept identical to the
// map in tools/generate-api-pages.mjs; the two MUST agree or index links 404.
export const CATEGORY_SLUG: Record<string, string> = {
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

const ACTIONS = (catalog as { actions: CatalogAction[] }).actions;

// zh is the default locale and is served at the site root (no `/zh` segment);
// every other locale is served under `/<lang>`. Match the actual static output
// so deep links work on direct load, not just in-SPA navigation.
const localePrefix = (lang: string): string => (lang === 'zh' ? '' : `/${lang}`);

export const ActionIndex: React.FC<{ lang?: string }> = ({ lang = 'zh' }) => {
  const [q, setQ] = useState('');
  const prefix = localePrefix(lang);
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return ACTIONS;
    return ACTIONS.filter((a) =>
      a.name.toLowerCase().includes(t) ||
      a.aliases.some((x) => x.toLowerCase().includes(t)) ||
      (a.summary ?? '').toLowerCase().includes(t) ||
      a.params.some((p) => p.name.toLowerCase().includes(t)));
  }, [q]);
  return (
    <div className="ai-wrap">
      <input
        className="ai-search"
        placeholder="搜索动作名 / 别名 / 参数…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <p className="ai-count">{filtered.length} / {ACTIONS.length} 个动作</p>
      <ul className="ai-list">
        {filtered.map((a) => {
          const slug = CATEGORY_SLUG[a.category ?? ''] ?? 'extended';
          return (
            <li key={a.name}>
              <a href={`${prefix}/api/${slug}#action-${a.name}`}><code>{a.name}</code></a>
              {a.summary && <span className="ai-sum">{a.summary}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ActionIndex;
