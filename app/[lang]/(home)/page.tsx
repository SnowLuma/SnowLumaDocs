import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DynamicLink } from 'fumadocs-core/dynamic-link';
import { ConnectionFigure } from '@/components/home/connection-figure';
import { SnowMark } from '@/components/snow-mark';

const developerLinks = {
  zh: [
    { href: '/[lang]/docs/api', label: 'API 参考', description: '查找动作、参数和返回值，让每次调用都有据可循。', kind: 'api' },
    { href: '/[lang]/docs/sdk', label: 'TypeScript SDK', description: '用熟悉的类型与方法，构建你自己的客户端。', kind: 'sdk' },
    { href: '/[lang]/docs/mcp', label: 'MCP 接入', description: '把 QQ 的能力，交给支持 MCP 的 AI 工具。', kind: 'mcp' },
  ],
  en: [
    { href: '/[lang]/docs/api', label: 'API reference', description: 'Explore actions, parameters, and responses for every call.', kind: 'api' },
    { href: '/[lang]/docs/sdk', label: 'TypeScript SDK', description: 'Build your own client with familiar types and methods.', kind: 'sdk' },
    { href: '/[lang]/docs/mcp', label: 'Connect with MCP', description: 'Put QQ capabilities in reach of your AI tools.', kind: 'mcp' },
  ],
} as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg className="sl-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GuideIcon({ kind }: { kind: 'api' | 'sdk' | 'mcp' | 'deploy' }) {
  const paths: Record<typeof kind, ReactNode> = {
    api: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20" />,
    sdk: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18m-14 4 2 2-2 2m5 0h4" /></>,
    mcp: <><path d="m5 15 9-9a3 3 0 0 1 4 4l-6 6m-9-5 7-7a3 3 0 0 1 4 0m-6 8-2 2a3 3 0 0 0 0 4l3 3m2-9 2 2a3 3 0 0 1 0 4l-1 1" /></>,
    deploy: <><rect x="4" y="3" width="16" height="7" rx="2" /><rect x="4" y="14" width="16" height="7" rx="2" /><path d="M8 6.5h.01M8 17.5h.01M12 6.5h4m-4 11h4" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}

export function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const zh = lang === 'zh';
  return {
    title: zh ? 'SnowLuma 文档 · 连接 QQ，即刻开始构建' : 'SnowLuma Docs · Native QQ, ready to build',
    description: zh
      ? '通过 OneBot v11，把 QQ 原生会话接入你的机器人、应用与 AI 工具。探索 SnowLuma 部署指南、API、TypeScript SDK 与 MCP 文档。'
      : 'Connect native QQ sessions to your bots, apps, and AI tools with OneBot v11. Explore SnowLuma deployment guides, APIs, the TypeScript SDK, and MCP.',
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const zh = lang === 'zh';

  return (
    <div className="sl-home">
      <a className="sl-skip-link" href="#sl-guide">{zh ? '跳转到文档入口' : 'Skip to documentation'}</a>
      <section className="sl-hero" aria-labelledby="sl-home-title">
        <div className="sl-home-inner sl-hero-grid">
          <div className="sl-hero-copy">
            <p className="sl-eyebrow"><span className="sl-eyebrow-line" /> SNOWLUMA <span className="sl-eyebrow-divider">/</span> DOCUMENTATION</p>
            <h1 id="sl-home-title">
              <span>{zh ? '连接 QQ，' : 'Native QQ.'}</span>
              <span className="sl-title-accent">{zh ? '即刻开始构建。' : 'Ready to build.'}</span>
            </h1>
            <p className="sl-lead">
              {zh
                ? '通过 OneBot v11，把 QQ 原生会话接入你的机器人、应用与 AI 工具。部署、连接、开发，从这里开始。'
                : 'Bring native QQ sessions to your bots, apps, and AI tools with OneBot v11. Your next connection starts here.'}
            </p>
            <div className="sl-actions">
              <DynamicLink className="sl-btn sl-btn-primary" href="/[lang]/docs/guide/quickstart">
                {zh ? '开始使用' : 'Get started'}<Arrow />
              </DynamicLink>
              <DynamicLink className="sl-text-link" href="/[lang]/docs/guide/introduction">
                {zh ? '了解 SnowLuma' : 'Meet SnowLuma'}<Arrow diagonal />
              </DynamicLink>
            </div>
            <div className="sl-hero-details" aria-label={zh ? '平台与协议' : 'Platforms and protocol'}>
              <span>Linux & Windows</span><span>OneBot v11</span><span>TypeScript</span>
            </div>
          </div>
          <ConnectionFigure zh={zh} />
        </div>
      </section>

      <div className="sl-home-inner">
        <section className="sl-ecosystem" aria-label={zh ? '机器人框架接入' : 'Bot framework integrations'}>
          <p>{zh ? '连接你熟悉的生态' : 'Connect with your ecosystem'}</p>
          <div className="sl-frameworks"><span>MaiBot<span className="sl-framework-dot">.</span></span><span>AstrBot</span><span>NoneBot</span></div>
          <DynamicLink className="sl-text-link" href="/[lang]/docs/guide/connect-bot">{zh ? '查看接入指南' : 'Connect a bot'}<Arrow diagonal /></DynamicLink>
        </section>

        <section className="sl-guide" id="sl-guide" aria-labelledby="sl-guide-title" tabIndex={-1}>
          <div className="sl-section-heading">
            <div><p className="sl-eyebrow">FIND YOUR START</p><h2 id="sl-guide-title">{zh ? '下一步，由你选择。' : 'Find your next step.'}</h2></div>
            <p>{zh ? '从首次部署，到第一次 API 调用。' : 'From your first deployment to your first API call.'}</p>
          </div>

          <div className="sl-guide-grid">
            <article className="sl-deploy-card" aria-labelledby="sl-deploy-title">
              <div className="sl-deploy-top"><span className="sl-guide-icon"><GuideIcon kind="deploy" /></span><span className="sl-section-index">01 / SET UP</span></div>
              <h3 id="sl-deploy-title">{zh ? '先让 SnowLuma 运行起来。' : 'Get SnowLuma up and running.'}</h3>
              <p>{zh ? '选择适合你的环境，完成部署与首次登录。' : 'Choose your environment, deploy, and sign in to QQ.'}</p>
              <div className="sl-deploy-options">
                <DynamicLink href="/[lang]/docs/guide/deploy/docker"><span className="sl-platform-symbol" aria-hidden="true">&gt;_</span>Docker<Arrow diagonal /></DynamicLink>
                <DynamicLink href="/[lang]/docs/guide/deploy/windows"><svg className="sl-platform-symbol" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true"><path d="M1 1h7v7H1zm9 0h7v7h-7zM1 10h7v7H1zm9 0h7v7h-7z" /></svg>Windows<Arrow diagonal /></DynamicLink>
              </div>
              <DynamicLink className="sl-text-link sl-deploy-more" href="/[lang]/docs/guide/deploy">{zh ? '查看全部部署方式' : 'Explore all deployment options'}<Arrow /></DynamicLink>
            </article>

            <div className="sl-developer-guides">
              <div className="sl-developer-heading"><span>{zh ? '为构建者准备' : 'Made for builders'}</span><span className="sl-section-index">02 / BUILD</span></div>
              {(zh ? developerLinks.zh : developerLinks.en).map((item) => (
                <DynamicLink key={item.kind} className="sl-guide-link" href={item.href}>
                  <span className="sl-guide-icon"><GuideIcon kind={item.kind} /></span>
                  <div><h3>{item.label}</h3><p>{item.description}</p></div>
                  <Arrow diagonal />
                </DynamicLink>
              ))}
            </div>
          </div>
          <div className="sl-help"><span>{zh ? '已经在使用？' : 'Already up and running?'}</span><DynamicLink href="/[lang]/docs/guide/configuration">{zh ? '配置参考' : 'Configuration'}</DynamicLink><span className="sl-help-separator">/</span><DynamicLink href="/[lang]/docs/guide/faq">{zh ? '常见问题' : 'FAQ'}</DynamicLink></div>
        </section>

        <footer className="sl-footer">
          <div className="sl-footer-brand"><SnowMark /><span className="sl-wordmark">Snow<span>Luma</span></span><span className="sl-footer-note">{zh ? '每一个连接，都从这里开始。' : 'Every connection starts here.'}</span></div>
          <a className="sl-text-link" href="https://github.com/SnowLuma/SnowLuma" target="_blank" rel="noreferrer noopener">GitHub<Arrow diagonal /></a>
        </footer>
      </div>
    </div>
  );
}
