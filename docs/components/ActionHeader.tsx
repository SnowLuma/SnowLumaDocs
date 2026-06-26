import React from 'react';

// Per-action page header: monospace action name, Chinese summary, nature badge
// (只读/写操作), category badge, and aliases. Pure presentational. Styled by
// docs/styles/api.css (.ah-*), registered globally via rspress globalStyles.

export const ActionHeader: React.FC<{
  name: string;
  summary?: string;
  readOnly: boolean;
  category?: string;
  aliases?: string[];
}> = ({ name, summary, readOnly, category, aliases = [] }) => (
  <div className="ah">
    <div className="ah-top">
      <span className="ah-name">{name}</span>
      {readOnly ? (
        <span className="ah-badge ah-badge-ro">只读</span>
      ) : (
        <span className="ah-badge ah-badge-rw">写操作</span>
      )}
      {category && <span className="ah-badge ah-badge-cat">{category}</span>}
    </div>
    {summary && <div className="ah-summary">{summary}</div>}
    {aliases.length > 0 && (
      <div className="ah-aliases">
        别名：{aliases.map((a) => <code key={a}>{a}</code>)}
      </div>
    )}
  </div>
);

export default ActionHeader;
