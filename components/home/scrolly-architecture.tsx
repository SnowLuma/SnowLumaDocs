'use client';

import { useEffect, useRef, useState } from 'react';
import { DynamicLink } from 'fumadocs-core/dynamic-link';

interface StageMeta {
  counter: string;
  nodeLabel: string;
  headTitle: string;
  headBadge: string;
  footLeft: string;
  footRight: string;
  stepId: string;
  stepIndex: string;
  titleLine1: string;
  titleLine2: string;
  body: string;
  specs: [string, string, string];
  linkHref: string;
  linkLabel: string;
}

function getStages(zh: boolean): StageMeta[] {
  return [
    {
      counter: '01 / 04 · NATIVE BRIDGE',
      nodeLabel: zh ? '会话桥接' : 'Bridge',
      headTitle: '@snowluma/bridge · Session & Identity',
      headBadge: 'per-UIN Isolation',
      footLeft: zh ? 'WebUI :5099 · 被动登录观察' : 'WebUI :5099 · Passive Login Watch',
      footRight: zh ? '01 / 会话桥接' : '01 / Native Bridge',
      stepId: 'step-bridge',
      stepIndex: '01 // NATIVE SESSION & BRIDGE',
      titleLine1: zh ? '直接桥接桌面端 QQ，' : 'Bridge desktop QQ directly,',
      titleLine2: zh ? '多账号独立并行运行' : 'with isolated multi-account sessions',
      body: zh
        ? 'SnowLuma 通过原生组件接入正在运行的桌面 QQ 进程，无需协议号与独立扫码协议栈。登录识别由本地数据库变化与登录帧被动触发，不做周期探测；每个账号独立维护会话、UIN ↔ UID 身份映射、消息存储与网络配置，并在内置 WebUI 中集中管理。'
        : 'SnowLuma attaches to running desktop QQ processes without emulated sign-in stacks. Login detection is driven passively by local database changes and login frames; each account maintains its own session, UIN ↔ UID identity map, message store, and network adapters inside the built-in WebUI.',
      specs: zh
        ? ['被动登录观察', '心跳看门狗', '内置 WebUI (:5099)']
        : ['Passive Login Detection', 'Heartbeat Watchdog', 'Built-in WebUI (:5099)'],
      linkHref: '/[lang]/docs/guide/introduction',
      linkLabel: zh ? '阅读架构与运行说明' : 'Read architecture overview',
    },
    {
      counter: '02 / 04 · ONEBOT V11',
      nodeLabel: 'OneBot v11',
      headTitle: '@snowluma/onebot · Event & Adapters',
      headBadge: 'HTTP · WS · SSE',
      footLeft: 'HTTP :3000 · WebSocket :3001',
      footRight: '02 / OneBot v11',
      stepId: 'step-onebot',
      stepIndex: '02 // ONEBOT V11 PROTOCOL',
      titleLine1: zh ? '声明式动作与事件管线，' : 'Declarative actions and events across',
      titleLine2: zh ? '四类网络适配器任意组合' : 'four combinable network adapters',
      body: zh
        ? '内部数据包经纯函数解码后转换为标准 OneBot v11 事件与可执行动作，支持文本、图片、语音、视频、文件、回复、合并转发与系统表情。每个账号可同时开启 HTTP 服务端、HTTP 事件上报、正向 WebSocket 与反向 WebSocket。'
        : 'Internal packets decode through pure pipelines into standard OneBot v11 events and executable actions covering text, images, voice, video, files, replies, forward chains, and reactions. Enable HTTP Server, HTTP Post (+SSE), Forward WS, and Reverse WS simultaneously per account.',
      specs: zh
        ? ['HTTP :3000 / WS :3001', '有符号 32 位 ID', '持久媒体快照']
        : ['HTTP :3000 / WS :3001', 'Signed 32-bit IDs', 'Durable Media Store'],
      linkHref: '/[lang]/docs/api',
      linkLabel: zh ? '浏览 OneBot API 动作参考' : 'Browse OneBot API reference',
    },
    {
      counter: '03 / 04 · TYPESCRIPT SDK',
      nodeLabel: 'TS SDK',
      headTitle: '@snowluma/sdk · WebSocket & Message Builder',
      headBadge: 'NodeNext Typed',
      footLeft: 'pnpm add @snowluma/sdk',
      footRight: '03 / TypeScript SDK',
      stepId: 'step-sdk',
      stepIndex: '03 // TYPESCRIPT CLIENT SDK',
      titleLine1: zh ? '类型完备的客户端开发，' : 'End-to-end typed client SDK,',
      titleLine2: zh ? '与服务端动作目录同源同步' : 'synced with the server action catalog',
      body: zh
        ? '@snowluma/sdk 的动作定义与服务端保持编译期同步。内置 HTTP 与 WebSocket 客户端、Node 反向 WebSocket 监听器、链式消息段构造器（如 text().at()）、事件中间件、命令路由以及有界缓冲的流式文件传输接口。'
        : '@snowluma/sdk stays verified against the server action catalog at build time. Includes HTTP and WebSocket clients, a Node reverse-WebSocket listener, chainable segment builders like text().at(), event middleware, command routing, and bounded-buffer file streaming.',
      specs: zh
        ? ['全量动作强类型', '链式消息构造', '流式文件传输']
        : ['Full Action Types', 'Chainable Builders', 'Bounded File Streams'],
      linkHref: '/[lang]/docs/sdk',
      linkLabel: zh ? '查看 TypeScript SDK 文档' : 'Explore TypeScript SDK docs',
    },
    {
      counter: '04 / 04 · AI & MCP SERVER',
      nodeLabel: 'AI MCP',
      headTitle: '@snowluma/mcp · Docs & Execution Modes',
      headBadge: 'docs / read / write',
      footLeft: 'npx -y @snowluma/mcp',
      footRight: zh ? '04 / MCP 服务' : '04 / MCP Server',
      stepId: 'step-mcp',
      stepIndex: '04 // MODEL CONTEXT PROTOCOL',
      titleLine1: zh ? '三态权限门控的 MCP 服务，' : 'Three-mode gated MCP server',
      titleLine2: zh ? '让 AI 客户端安全查询与调用' : 'for safe AI discovery and execution',
      body: zh
        ? '单一二进制支持三态权限门控：默认 docs 模式无需连接实例，让大模型按需检索任意动作的参数约束与 JSON Schema；连接运行实例后可开启只读查询（query_action）或受控执行（invoke_action），大文件流直接在主机本地目录落盘。'
        : 'A single server binary gated across three modes: default docs mode works offline so AI agents can inspect schemas and examples on demand; connected instances unlock read-only queries (query_action) or full execution (invoke_action) with host-local file streaming.',
      specs: zh
        ? ['docs / read / write 门控', '主机流式落盘', 'llms.txt 索引']
        : ['docs / read / write Gates', 'Host-Local Streaming', 'llms.txt Index'],
      linkHref: '/[lang]/docs/mcp',
      linkLabel: zh ? '查看 MCP 接入指南' : 'Read the MCP integration guide',
    },
  ];
}

export function ScrollyArchitecture({ zh }: { zh: boolean }) {
  const stages = getStages(zh);
  const [activeIdx, setActiveIdx] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const onScroll = () => {
      const triggerY = window.innerHeight * 0.42;
      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      stepRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height * 0.38;
        const dist = Math.abs(center - triggerY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = idx;
        }
      });

      setActiveIdx(bestIdx);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeMeta = stages[activeIdx] ?? stages[0];

  const handleNodeClick = (idx: number) => {
    setActiveIdx(idx);
    const el = stepRefs.current[idx];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="sl-scrolly-section" id="architecture" aria-label={zh ? '核心架构与能力' : 'Architecture and capabilities'}>
      {/* Left Sticky Viewport Stage */}
      <div className="sl-scrolly-sticky">
        <div className="sl-scrolly-eyebrow sl-mono">
          <span>{activeMeta.counter}</span>
          <span>{zh ? '滚动检视 · SCROLL TO INSPECT' : 'SCROLL TO INSPECT'}</span>
        </div>

        <div className="sl-stage-flow-nodes" role="tablist" aria-label={zh ? '架构阶段切换' : 'Architecture stages'}>
          {stages.map((stage, idx) => (
            <button
              key={stage.stepId}
              type="button"
              role="tab"
              aria-selected={activeIdx === idx}
              className={`sl-stage-node${activeIdx === idx ? ' active' : ''}`}
              onClick={() => handleNodeClick(idx)}
            >
              <div className="sl-stage-node-num sl-mono">0{idx + 1}</div>
              <div className="sl-stage-node-label">{stage.nodeLabel}</div>
            </button>
          ))}
        </div>

        <div className="sl-stage-window">
          <div className="sl-stage-window-bar sl-mono">
            <span>{activeMeta.headTitle}</span>
            <span className="sl-stage-window-badge">{activeMeta.headBadge}</span>
          </div>

          {/* 4 Pre-Rendered Stacked Scenes in 1 Fixed Grid Cell (0px Shift) */}
          <div className="sl-stage-deck sl-mono">
            {/* Scene 01: Bridge & Multi-Account Topology */}
            <div className={`sl-stage-scene${activeIdx === 0 ? ' active' : ''}`} aria-hidden={activeIdx !== 0}>
              <div className="sl-topology-bar">
                <div className="sl-topo-node">
                  <strong>QQ Desktop</strong>
                  <span>NamedPipe · login.db</span>
                </div>
                <span className="sl-topo-arrow">──▶</span>
                <div className="sl-topo-node">
                  <strong>BridgeManager</strong>
                  <span>statusFor · 7 States</span>
                </div>
                <span className="sl-topo-arrow">──▶</span>
                <div className="sl-topo-node">
                  <strong>IdentityService</strong>
                  <span>UIN ⇄ UID Roster</span>
                </div>
              </div>

              <div className="sl-session-table">
                <div className="sl-session-row">
                  <span>UIN 10001</span>
                  <span className="sl-status-online">online</span>
                  <span className="sl-fg-secondary">receiveHealthy: true</span>
                  <span className="sl-fg-muted">PID 48210</span>
                </div>
                <div className="sl-session-row">
                  <span>UIN 28491</span>
                  <span className="sl-status-online">online</span>
                  <span className="sl-fg-secondary">receiveHealthy: true</span>
                  <span className="sl-fg-muted">PID 51094</span>
                </div>
              </div>

              <pre className="sl-scene-code-block">
                <span className="sl-syn-cmt">
                  {zh
                    ? '// 纯函数状态派生，心跳看门狗独立于登录态'
                    : '// Pure state derivation; watchdog tracked independently'}
                </span>
                {'\n'}
                <span className="sl-syn-kw">const</span> status = <span className="sl-syn-fn">statusFor</span>({'{'}
                {'\n'}
                {'  '}injected: <span className="sl-syn-num">true</span>, connected: <span className="sl-syn-num">true</span>,{'\n'}
                {'  '}loggedIn: <span className="sl-syn-num">true</span>, wasLoggedIn: <span className="sl-syn-num">true</span>
                {'\n'}
                {'}'}); <span className="sl-syn-cmt">{'// => "online" (good = true)'}</span>
              </pre>
            </div>

            {/* Scene 02: OneBot v11 Event & 4 Adapters */}
            <div className={`sl-stage-scene${activeIdx === 1 ? ' active' : ''}`} aria-hidden={activeIdx !== 1}>
              <div className="sl-adapter-strip">
                <div className="sl-adapter-cell">
                  <strong>HTTP Server</strong>
                  <span className="sl-status-text">:3000 applied</span>
                </div>
                <div className="sl-adapter-cell">
                  <strong>WS Server</strong>
                  <span className="sl-status-text">:3001 applied</span>
                </div>
                <div className="sl-adapter-cell">
                  <strong>Reverse WS</strong>
                  <span className="sl-status-text">connected</span>
                </div>
                <div className="sl-adapter-cell">
                  <strong>HTTP Post</strong>
                  <span className="sl-status-text">active + SSE</span>
                </div>
              </div>

              <pre className="sl-scene-code-block">
                {'{\n'}
                {'  '}<span className="sl-syn-fn">&quot;post_type&quot;</span>: <span className="sl-syn-str">&quot;message&quot;</span>,{'\n'}
                {'  '}<span className="sl-syn-fn">&quot;message_type&quot;</span>: <span className="sl-syn-str">&quot;group&quot;</span>,{'\n'}
                {'  '}<span className="sl-syn-fn">&quot;message_id&quot;</span>: <span className="sl-syn-num">-148290412</span>, <span className="sl-syn-cmt">{'// signed int32'}</span>{'\n'}
                {'  '}<span className="sl-syn-fn">&quot;group_id&quot;</span>: <span className="sl-syn-num">79120488</span>,{'\n'}
                {'  '}<span className="sl-syn-fn">&quot;user_id&quot;</span>: <span className="sl-syn-num">2849102</span>,{'\n'}
                {'  '}<span className="sl-syn-fn">&quot;message&quot;</span>: [{'\n'}
                {'    '}{'{ '}<span className="sl-syn-fn">&quot;type&quot;</span>: <span className="sl-syn-str">&quot;at&quot;</span>, <span className="sl-syn-fn">&quot;data&quot;</span>: {'{ '}<span className="sl-syn-fn">&quot;qq&quot;</span>: <span className="sl-syn-str">&quot;10001&quot;</span>{' } },'}{'\n'}
                {'    '}{'{ '}<span className="sl-syn-fn">&quot;type&quot;</span>: <span className="sl-syn-str">&quot;text&quot;</span>, <span className="sl-syn-fn">&quot;data&quot;</span>: {'{ '}<span className="sl-syn-fn">&quot;text&quot;</span>: <span className="sl-syn-str">&quot; /status&quot;</span>{' } }'}{'\n'}
                {'  ]\n}'}
              </pre>
            </div>

            {/* Scene 03: TypeScript SDK with Twoslash IntelliSense */}
            <div className={`sl-stage-scene${activeIdx === 2 ? ' active' : ''}`} aria-hidden={activeIdx !== 2}>
              <pre className="sl-scene-code-block">
                <span className="sl-syn-kw">import</span> {'{ SnowLumaWebSocketClient, text }'} <span className="sl-syn-kw">from</span> <span className="sl-syn-str">&apos;@snowluma/sdk&apos;</span>;{'\n\n'}
                <span className="sl-syn-kw">const</span> bot = <span className="sl-syn-kw">new</span> <span className="sl-syn-fn">SnowLumaWebSocketClient</span>({'{'}
                {'\n'}
                {'  '}url: <span className="sl-syn-str">&apos;ws://127.0.0.1:3001/&apos;</span>,{'\n'}
                {'  '}accessToken: process.env.SNOWLUMA_TOKEN,{'\n'}
                {'}'});{'\n\n'}
                bot.<span className="sl-syn-fn">onGroupMessage</span>(<span className="sl-syn-kw">async</span> (event, ctx) =&gt; {'{'}
                {'\n'}
                {'  '}<span className="sl-syn-kw">if</span> (event.raw_message === <span className="sl-syn-str">&apos;/ping&apos;</span>) {'{'}
                {'\n'}
                {'    '}<span className="sl-syn-kw">await</span> ctx.<span className="sl-syn-fn">reply</span>(<span className="sl-syn-fn">text</span>(<span className="sl-syn-str">&apos;pong&apos;</span>).<span className="sl-syn-fn">at</span>(event.user_id));{'\n'}
                {'  }'}{'\n'}
                {'}'});
              </pre>

              <div className="sl-twoslash-box">
                <span>
                  <strong className="sl-accent-text">ctx.reply</strong>(message: MessageInput)
                </span>
                <span className="sl-fg-muted">Promise&lt;{'{ message_id: number }'}&gt;</span>
              </div>
            </div>

            {/* Scene 04: MCP Server & Host-Local Stream */}
            <div className={`sl-stage-scene${activeIdx === 3 ? ' active' : ''}`} aria-hidden={activeIdx !== 3}>
              <pre className="sl-scene-code-block">
                {'{\n'}
                {'  '}<span className="sl-syn-fn">&quot;mcpServers&quot;</span>: {'{\n'}
                {'    '}<span className="sl-syn-fn">&quot;snowluma&quot;</span>: {'{\n'}
                {'      '}<span className="sl-syn-fn">&quot;command&quot;</span>: <span className="sl-syn-str">&quot;npx&quot;</span>,{'\n'}
                {'      '}<span className="sl-syn-fn">&quot;args&quot;</span>: [<span className="sl-syn-str">&quot;-y&quot;</span>, <span className="sl-syn-str">&quot;@snowluma/mcp&quot;</span>],{'\n'}
                {'      '}<span className="sl-syn-fn">&quot;env&quot;</span>: {'{\n'}
                {'        '}<span className="sl-syn-fn">&quot;SNOWLUMA_MCP_ENDPOINT&quot;</span>: <span className="sl-syn-str">&quot;http://127.0.0.1:3000/&quot;</span>,{'\n'}
                {'        '}<span className="sl-syn-fn">&quot;SNOWLUMA_MCP_MODE&quot;</span>: <span className="sl-syn-str">&quot;read&quot;</span> <span className="sl-syn-cmt">{'// docs | read | write'}</span>{'\n'}
                {'      }\n    }\n  }\n}'}
              </pre>

              <div className="sl-twoslash-box">
                <span>
                  <strong className="sl-status-text">●</strong> list_actions · get_action · query_action
                </span>
                <span className="sl-fg-muted">snowluma://onebot/actions</span>
              </div>
            </div>
          </div>

          <div className="sl-stage-window-foot sl-mono">
            <span>{activeMeta.footLeft}</span>
            <span>{activeMeta.footRight}</span>
          </div>
        </div>
      </div>

      {/* Right Scrolling Narrative Track */}
      <div className="sl-scrolly-track">
        {stages.map((stage, idx) => (
          <article
            key={stage.stepId}
            id={stage.stepId}
            ref={(el) => {
              stepRefs.current[idx] = el;
            }}
            className={`sl-scrolly-step${activeIdx === idx ? ' active' : ''}`}
          >
            <div className="sl-scrolly-step-index sl-mono">{stage.stepIndex}</div>
            <h2 className="sl-scrolly-step-title">
              {stage.titleLine1}
              <br />
              {stage.titleLine2}
            </h2>
            <p className="sl-scrolly-step-body">{stage.body}</p>
            <div className="sl-scrolly-step-specs sl-mono">
              {stage.specs.map((spec) => (
                <span key={spec}>{spec}</span>
              ))}
            </div>
            <DynamicLink href={stage.linkHref} className="sl-scrolly-step-link">
              {stage.linkLabel} <span>→</span>
            </DynamicLink>
          </article>
        ))}
      </div>
    </section>
  );
}
