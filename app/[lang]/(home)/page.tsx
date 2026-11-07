import type { Metadata } from 'next';
import { DynamicLink } from 'fumadocs-core/dynamic-link';
import { ScrollyArchitecture } from '@/components/home/scrolly-architecture';
import { SnowMark } from '@/components/snow-mark';

interface DirectoryColumn {
  title: string;
  items: Array<{ href: string; label: string; external?: boolean }>;
}

function getDirectoryColumns(zh: boolean): DirectoryColumn[] {
  return [
    {
      title: zh ? '使用指南' : 'Guides',
      items: [
        { href: '/[lang]/docs/guide/introduction', label: zh ? '项目介绍' : 'Introduction' },
        { href: '/[lang]/docs/guide/quickstart', label: zh ? '快速开始' : 'Quick Start' },
        { href: '/[lang]/docs/guide/configuration', label: zh ? '配置参考' : 'Configuration' },
        { href: '/[lang]/docs/guide/connect-bot', label: zh ? '对接机器人框架' : 'Connect a Bot Framework' },
        { href: '/[lang]/docs/guide/china-network', label: zh ? '中国大陆网络环境' : 'Mainland China Network' },
        { href: '/[lang]/docs/guide/faq', label: zh ? '常见问题' : 'FAQ' },
      ],
    },
    {
      title: zh ? '部署方式' : 'Deployment',
      items: [
        { href: '/[lang]/docs/guide/deploy', label: zh ? '选择部署方式' : 'Choose a Deployment' },
        { href: '/[lang]/docs/guide/deploy/docker', label: zh ? 'Docker 部署' : 'Docker' },
        { href: '/[lang]/docs/guide/deploy/windows', label: zh ? 'Windows 原生部署' : 'Windows Native' },
        { href: '/[lang]/docs/guide/deploy/linux-manual', label: zh ? 'Linux 手动部署' : 'Linux Manual' },
        { href: '/[lang]/docs/guide/deploy/wsl2', label: zh ? 'WSL2 部署' : 'WSL2' },
        { href: '/[lang]/docs/guide/deploy/baota', label: zh ? '宝塔面板部署' : 'Baota Panel' },
      ],
    },
    {
      title: 'TypeScript SDK',
      items: [
        { href: '/[lang]/docs/sdk', label: zh ? 'SDK 总览' : 'SDK Overview' },
        { href: '/[lang]/docs/sdk/messaging', label: zh ? '消息构造与回复' : 'Messaging & Replies' },
        { href: '/[lang]/docs/sdk/streaming', label: zh ? '流式文件传输' : 'Streaming File Transfers' },
        { href: '/[lang]/docs/guide/developer', label: zh ? '开发者指南' : 'Developer Guide' },
      ],
    },
    {
      title: zh ? '协议与 AI' : 'Protocol & AI',
      items: [
        { href: '/[lang]/docs/api', label: zh ? 'OneBot API 参考' : 'OneBot API Reference' },
        { href: '/[lang]/docs/mcp', label: zh ? 'MCP 服务总览' : 'MCP Server Overview' },
        { href: '/[lang]/docs/mcp/actions', label: zh ? '动作发现与执行' : 'Action Discovery & Execution' },
        { href: '/[lang]/docs/mcp/events', label: zh ? '事件与后台任务' : 'Events & Background Tasks' },
        { href: '/[lang]/docs/mcp/transfers', label: zh ? '流式文件传输' : 'File Transfers' },
        { href: '/llms.txt', label: 'llms.txt ↗', external: true },
      ],
    },
  ];
}

export function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const zh = lang === 'zh';
  return {
    title: zh ? 'SnowLuma 文档 · 让 QQ 原生会话，连接你的应用' : 'SnowLuma Docs · Bring native QQ sessions to your applications',
    description: zh
      ? '将桌面端 QQ 会话转换为标准 OneBot v11 动作与事件，通过 WebSocket、HTTP、WebUI、TypeScript SDK 与 MCP 提供统一入口。'
      : 'Translate desktop QQ sessions into standard OneBot v11 actions and events, with a unified runtime across WebSocket, HTTP, WebUI, TypeScript SDK, and MCP.',
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const zh = lang === 'zh';
  const directoryColumns = getDirectoryColumns(zh);

  return (
    <div className="sl-home">
      <a className="sl-skip-link" href="#architecture">
        {zh ? '跳转到核心架构与文档目录' : 'Skip to architecture and documentation'}
      </a>

      <div className="sl-container">
        {/* FIRST VIEWPORT: Calm, Uncluttered, Single Focal Point */}
        <section className="sl-first-screen" aria-labelledby="sl-home-title">
          <div className="sl-hero-stage">
            <div>
              <div className="sl-hero-eyebrow sl-mono">QQ PROTOCOL RUNTIME · ONEBOT V11</div>
              <h1 className="sl-hero-title" id="sl-home-title">
                {zh ? (
                  <>
                    让 QQ 原生会话，
                    <br />
                    连接你的应用。
                  </>
                ) : (
                  <>
                    Bring native QQ sessions
                    <br />
                    to your applications.
                  </>
                )}
              </h1>
              <p className="sl-hero-lead">
                {zh
                  ? '将桌面端 QQ 会话转换为标准 OneBot v11 动作与事件，通过 WebSocket、HTTP、WebUI、SDK 与 MCP 提供统一入口。'
                  : 'Translate desktop QQ sessions into standard OneBot v11 actions and events, with a unified runtime across WebSocket, HTTP, WebUI, SDK, and MCP.'}
              </p>
              <div className="sl-hero-cta">
                <DynamicLink href="/[lang]/docs/guide/quickstart" className="sl-btn-solid">
                  <span>{zh ? '快速开始' : 'Get Started'}</span>
                  <span className="sl-mono">→</span>
                </DynamicLink>
                <DynamicLink href="/[lang]/docs/guide/deploy" className="sl-btn-text">
                  {zh ? '选择部署方式' : 'Deploy Guides'}
                </DynamicLink>
                <DynamicLink href="/[lang]/docs/api" className="sl-btn-text sl-mono">
                  {zh ? 'API 参考' : 'API Reference'}
                </DynamicLink>
              </div>
            </div>

            <div className="sl-hero-art">
              <div className="sl-art-frame">
                <img src="/mascot.png" alt="SnowLuma" />
              </div>
              <div className="sl-art-caption sl-mono">
                <span>SnowLuma Runtime</span>
                <span>Windows x64 · Linux x64 / arm64</span>
              </div>
            </div>
          </div>

          {/* Quiet 4-Pillar Bottom Index */}
          <div className="sl-pillar-strip">
            <a href="#step-bridge" className="sl-pillar-item">
              <span className="sl-pillar-num sl-mono">01</span>
              <span className="sl-pillar-title">{zh ? '多账号会话桥接' : 'Multi-Account Bridge'}</span>
              <span className="sl-pillar-desc">{zh ? '原生进程接入与独立会话管理' : 'Native process hook & isolated sessions'}</span>
            </a>
            <a href="#step-onebot" className="sl-pillar-item">
              <span className="sl-pillar-num sl-mono">02</span>
              <span className="sl-pillar-title">{zh ? 'OneBot v11 协议' : 'OneBot v11 Protocol'}</span>
              <span className="sl-pillar-desc">{zh ? '声明式动作与强类型事件转换' : 'Declarative actions & typed events'}</span>
            </a>
            <a href="#step-sdk" className="sl-pillar-item">
              <span className="sl-pillar-num sl-mono">03</span>
              <span className="sl-pillar-title">TypeScript SDK</span>
              <span className="sl-pillar-desc">{zh ? '@snowluma/sdk 强类型客户端' : 'Typed client & message builders'}</span>
            </a>
            <a href="#step-mcp" className="sl-pillar-item">
              <span className="sl-pillar-num sl-mono">04</span>
              <span className="sl-pillar-title">{zh ? 'MCP 服务' : 'MCP Server'}</span>
              <span className="sl-pillar-desc">{zh ? '@snowluma/mcp 连接 AI 客户端' : 'Connect AI agents via @snowluma/mcp'}</span>
            </a>
          </div>
        </section>

        {/* CHAPTER 01: STATE-DRIVEN SCROLLYTELLING (Zero Layout Shift) */}
        <ScrollyArchitecture zh={zh} />

        {/* CHAPTER 02: QUICK START */}
        <section className="sl-chapter" aria-labelledby="sl-quickstart-title">
          <div className="sl-chapter-head">
            <span className="sl-chapter-num sl-mono">02 / Quick Start</span>
            <div>
              <h2 className="sl-chapter-title" id="sl-quickstart-title">
                {zh ? '三步启动并接入' : 'Up and running in three steps'}
              </h2>
              <p className="sl-chapter-lead">
                {zh
                  ? '支持服务器 Docker 容器常驻，或直接解压预编译发行包在本机运行。'
                  : 'Run in a persistent Docker container on your server, or launch the prebuilt release bundle locally.'}
              </p>
            </div>
          </div>

          <div className="sl-steps-list">
            <div className="sl-step-row">
              <span className="sl-step-idx sl-mono">01</span>
              <div>
                <div className="sl-step-title">{zh ? '启动 SnowLuma' : 'Start SnowLuma'}</div>
                <div className="sl-step-desc">
                  {zh
                    ? '通过 Docker Compose 或预编译发行包启动服务。'
                    : 'Launch the runtime with Docker Compose or a prebuilt release archive.'}
                </div>
              </div>
              <div className="sl-step-cmd sl-mono">docker compose up -d</div>
            </div>

            <div className="sl-step-row">
              <span className="sl-step-idx sl-mono">02</span>
              <div>
                <div className="sl-step-title">{zh ? '登录 WebUI 控制台' : 'Sign in to the WebUI console'}</div>
                <div className="sl-step-desc">
                  {zh
                    ? '使用启动日志中的初始密码登录并接入 QQ 进程。'
                    : 'Sign in with the initial password from startup logs and attach a QQ process.'}
                </div>
              </div>
              <div className="sl-step-cmd sl-mono">http://localhost:5099</div>
            </div>

            <div className="sl-step-row">
              <span className="sl-step-idx sl-mono">03</span>
              <div>
                <div className="sl-step-title">{zh ? '连接你的机器人或应用' : 'Connect your bot or application'}</div>
                <div className="sl-step-desc">
                  {zh
                    ? '通过 OneBot v11、TypeScript SDK 或 MCP 发起调用。'
                    : 'Call actions and subscribe to events over OneBot v11, the TypeScript SDK, or MCP.'}
                </div>
              </div>
              <div className="sl-step-cmd sl-mono">pnpm add @snowluma/sdk</div>
            </div>
          </div>
        </section>

        {/* CHAPTER 03: DOCUMENTATION INDEX */}
        <section className="sl-chapter" aria-labelledby="sl-index-title">
          <div className="sl-chapter-head">
            <span className="sl-chapter-num sl-mono">03 / Index</span>
            <div>
              <h2 className="sl-chapter-title" id="sl-index-title">
                {zh ? '文档目录' : 'Documentation Index'}
              </h2>
            </div>
          </div>

          <div className="sl-dir-grid">
            {directoryColumns.map((col) => (
              <div key={col.title}>
                <div className="sl-dir-col-title sl-mono">{col.title}</div>
                <ul className="sl-dir-links">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      {item.external ? (
                        <a href={item.href}>{item.label}</a>
                      ) : (
                        <DynamicLink href={item.href}>{item.label}</DynamicLink>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="sl-site-footer">
          <div className="sl-footer-row">
            <span className="sl-footer-brand sl-mono">
              <SnowMark />
              <span className="sl-wordmark">
                Snow<span>Luma</span>
              </span>
            </span>
            <p>
              {zh
                ? 'SnowLuma 是独立的第三方项目，与腾讯 / QQ 无隶属或授权关系。项目采用源码可见非商业许可，仅供学习与技术研究，软件按“现状”提供。'
                : 'SnowLuma is an independent third-party project and is not affiliated with or endorsed by Tencent or QQ. Distributed under a source-available non-commercial license for research and learning, provided "AS IS".'}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
