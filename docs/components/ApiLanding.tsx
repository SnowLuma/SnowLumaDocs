import React, { useMemo, useState } from 'react';
import catalog from '../public/api/catalog.json';
import type { CatalogAction } from './catalog-types';

// Category (Chinese, from the catalog) → ASCII page slug. MUST stay identical to
// CATEGORY_SLUG in tools/generate-api-pages.mjs, or links 404.
const CATEGORY_SLUG: Record<string, string> = {
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
const CATEGORY_META: Record<string, { icon: string; zh: string; en: string; descZh: string; descEn: string }> = {
  system: { icon: '🛈', zh: '信息', en: 'System', descZh: '登录态、版本与能力查询', descEn: 'Login, version & capabilities' },
  message: { icon: '✉️', zh: '消息', en: 'Message', descZh: '发送、撤回、查询消息', descEn: 'Send, recall, fetch messages' },
  friend: { icon: '👤', zh: '好友', en: 'Friend', descZh: '好友与陌生人', descEn: 'Friends & strangers' },
  'group-info': { icon: '👥', zh: '群信息', en: 'Group Info', descZh: '群与成员信息', descEn: 'Groups & members' },
  'group-admin': { icon: '🛡️', zh: '群管理', en: 'Group Admin', descZh: '禁言、踢人、头衔等', descEn: 'Ban, kick, titles…' },
  'group-file': { icon: '📁', zh: '群文件', en: 'Group File', descZh: '群文件系统', descEn: 'Group file system' },
  request: { icon: '📨', zh: '请求', en: 'Request', descZh: '加好友 / 加群请求', descEn: 'Friend / group requests' },
  extended: { icon: '🧩', zh: '扩展', en: 'Extended', descZh: 'gocqhttp / NapCat 兼容接口', descEn: 'gocqhttp / NapCat extensions' },
  'group-album': { icon: '🖼️', zh: '群相册', en: 'Group Album', descZh: '群相册与媒体', descEn: 'Group albums & media' },
  qzone: { icon: '🌐', zh: '空间', en: 'Qzone', descZh: '说说、动态、点赞评论', descEn: 'Feeds, likes, comments' },
};

// Route-safe slug — mirror of actionSlug in the generator (dotfiles unreachable).
const actionSlug = (name: string): string => name.replace(/^\.+/, '');
// zh is the default locale at site root (no /zh segment); others under /<lang>.
const localePrefix = (lang: string): string => (lang === 'zh' ? '' : `/${lang}`);

const ACTIONS = (catalog as { actions: CatalogAction[] }).actions;
const CATEGORIES = (catalog as { categories: { category: string; count: number }[] }).categories;

export const ApiLanding: React.FC<{ lang?: string }> = ({ lang = 'zh' }) => {
  const [q, setQ] = useState('');
  const prefix = localePrefix(lang);
  const en = lang === 'en';

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return null;
    return ACTIONS.filter((a) =>
      a.name.toLowerCase().includes(t) ||
      a.aliases.some((x) => x.toLowerCase().includes(t)) ||
      (a.summary ?? '').toLowerCase().includes(t) ||
      a.params.some((p) => p.name.toLowerCase().includes(t)));
  }, [q]);

  return (
    <div className="api-page">
      <div className="ai-wrap">
        <div className="ai-search-shell">
          <span className="ai-search-icon">🔍</span>
          <input
            className="ai-search"
            placeholder={en ? 'Search actions / aliases / params…' : '搜索动作名 / 别名 / 参数…'}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={en ? 'Search actions' : '搜索动作'}
          />
        </div>
        {filtered && (
          <p className="ai-count">{filtered.length} / {ACTIONS.length} {en ? 'actions' : '个动作'}</p>
        )}
      </div>

      {filtered ? (
        filtered.length === 0 ? (
          <p className="ai-empty">{en ? 'No matching actions.' : '没有匹配的动作。'}</p>
        ) : (
          <ul className="ai-list">
            {filtered.map((a) => {
              const slug = CATEGORY_SLUG[a.category ?? ''] ?? 'extended';
              return (
                <li key={a.name}>
                  <a className="ai-item" href={`${prefix}/api/${slug}/${actionSlug(a.name)}`}>
                    <code>{a.name}</code>
                    {a.summary && <span className="ai-item-sum">{a.summary}</span>}
                    <span className="ai-item-cat">{en ? (CATEGORY_META[slug]?.en ?? slug) : (a.category ?? slug)}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        )
      ) : (
        <div className="cat-grid">
          {CATEGORIES.map(({ category, count }) => {
            const slug = CATEGORY_SLUG[category] ?? 'extended';
            const m = CATEGORY_META[slug];
            return (
              <a key={slug} className="cat-card" href={`${prefix}/api/${slug}/`}>
                <div className="cat-card-top">
                  <span className="cat-icon">{m?.icon ?? '•'}</span>
                  <span className="cat-count">{count}</span>
                </div>
                <span className="cat-name">{en ? (m?.en ?? slug) : (m?.zh ?? category)}</span>
                <span className="cat-desc">{en ? (m?.descEn ?? '') : (m?.descZh ?? '')}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApiLanding;
