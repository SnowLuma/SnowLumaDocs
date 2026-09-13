import { SnowMark } from '@/components/snow-mark';

export function ConnectionFigure({ zh }: { zh: boolean }) {
  return (
    <figure className="sl-connection">
      <div className="sl-connection-drawing" aria-hidden="true">
        <div className="sl-diagram-label"><span /> THE CONNECTION LAYER</div>
        <div className="sl-orbit sl-orbit-outer" />
        <div className="sl-orbit sl-orbit-inner" />
        <svg className="sl-wires" viewBox="0 0 560 420" fill="none">
          <path className="sl-wire" d="M86 153H210M322 153H456M485 183V259Q485 275 469 275H112Q96 275 96 291V319M280 275V319M464 275V319" />
          <path className="sl-wire-flow" d="M86 153H210M322 153H456M485 183V259Q485 275 469 275H112Q96 275 96 291V319M280 275V319M464 275V319" />
          <circle cx="280" cy="275" r="3" className="sl-wire-junction" />
          <circle cx="464" cy="275" r="3" className="sl-wire-junction" />
        </svg>
        <div className="sl-source-node">
          <div className="sl-endpoint-icon">QQ</div>
          <span>{zh ? '原生会话' : 'Native session'}</span>
        </div>
        <div className="sl-hub">
          <div className="sl-hub-shadow" />
          <div className="sl-hub-layer sl-hub-layer-back" />
          <div className="sl-hub-layer sl-hub-layer-front"><SnowMark /></div>
          <span className="sl-hub-name">SnowLuma</span>
        </div>
        <div className="sl-protocol-node">
          <div className="sl-endpoint-icon"><span>{'{ }'}</span></div>
          <span>OneBot v11</span>
        </div>
        <div className="sl-output sl-output-http"><span>HTTP / WS</span><small>{zh ? '你的机器人' : 'Your bots'}</small></div>
        <div className="sl-output sl-output-sdk"><span>TypeScript</span><small>{zh ? '你的应用' : 'Your apps'}</small></div>
        <div className="sl-output sl-output-mcp"><span>MCP</span><small>{zh ? '你的 AI 工具' : 'Your AI tools'}</small></div>
        <div className="sl-diagram-coordinate">QQ → SNOWLUMA → YOU</div>
      </div>
      <figcaption className="sl-visually-hidden">
        {zh
          ? 'QQ 原生会话通过 SnowLuma 转换为 OneBot v11，再通过 HTTP、WebSocket、TypeScript SDK 和 MCP 连接机器人、应用与 AI 工具。'
          : 'SnowLuma bridges native QQ sessions to OneBot v11, connecting your bots, apps, and AI tools through HTTP, WebSocket, the TypeScript SDK, and MCP.'}
      </figcaption>
    </figure>
  );
}
