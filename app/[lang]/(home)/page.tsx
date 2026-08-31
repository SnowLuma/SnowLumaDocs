import { DynamicLink } from 'fumadocs-core/dynamic-link';

const cards = {
  zh: [
    { href: '/[lang]/docs/guide/quickstart', title: '快速开始', body: '按你手上的环境选路，Linux 上一条安装命令就能扫码。' },
    { href: '/[lang]/docs/guide/deploy', title: '部署', body: 'Docker、Windows、WSL2、宝塔、本机进阶路径都还在。' },
    { href: '/[lang]/docs/guide/connect-bot', title: '对接机器人', body: '把 OneBot HTTP / 正向 WS / 反向 WS 接到 MaiBot、AstrBot、NoneBot。' },
    { href: '/[lang]/docs/api', title: 'API 参考', body: '从运行时目录生成的 OpenAPI，不再手写每一页动作文档。' },
    { href: '/[lang]/docs/mcp', title: 'MCP', body: '让支持 MCP 的客户端发现并调用动作。' },
    { href: '/[lang]/docs/sdk', title: 'SDK', body: 'TypeScript 客户端，HTTP 与 WebSocket。' },
  ],
  en: [
    { href: '/[lang]/docs/guide/quickstart', title: 'Quick start', body: 'Pick a path for your machine. On Linux, one installer command gets you to QR login.' },
    { href: '/[lang]/docs/guide/deploy', title: 'Deploy', body: 'Docker, Windows, WSL2, Baota, and the advanced host path are all still here.' },
    { href: '/[lang]/docs/guide/connect-bot', title: 'Connect a bot', body: 'Wire OneBot HTTP, forward WS, or reverse WS to MaiBot, AstrBot, or NoneBot.' },
    { href: '/[lang]/docs/api', title: 'API reference', body: 'OpenAPI generated from the runtime catalog — not a page per action written by hand.' },
    { href: '/[lang]/docs/mcp', title: 'MCP', body: 'Let MCP clients discover and call actions.' },
    { href: '/[lang]/docs/sdk', title: 'SDK', body: 'TypeScript clients for HTTP and WebSocket.' },
  ],
} as const;

export function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }];
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const zh = lang === 'zh';
  const items = zh ? cards.zh : cards.en;

  return (
    <>
      <section className="sl-hero">
        <p className="sl-kicker">{zh ? 'QQ → OneBot 协议端' : 'QQ → OneBot protocol layer'}</p>
        <h1 style={{ fontFamily: 'var(--font-serif), serif' }}>
          {zh ? (
            <>
              把 QQ 原生能力
              <br />
              <em>交给标准接口</em>
            </>
          ) : (
            <>
              Native QQ,
              <br />
              <em>standard OneBot</em>
            </>
          )}
        </h1>
        <p className="sl-lead">
          {zh
            ? 'SnowLuma 不是机器人框架。它把已登录的 QQ 进程暴露成 OneBot v11，让 MaiBot、AstrBot、NoneBot 或你自己的客户端去用。'
            : 'SnowLuma is not a bot framework. It exposes a logged-in QQ process as OneBot v11 for MaiBot, AstrBot, NoneBot, or your own client.'}
        </p>
        <div className="sl-actions">
          <DynamicLink className="sl-btn sl-btn-primary" href="/[lang]/docs/guide/quickstart">
            {zh ? '开始安装' : 'Install'}
          </DynamicLink>
          <DynamicLink className="sl-btn sl-btn-ghost" href="/[lang]/docs/guide/deploy">
            {zh ? '选择部署方式' : 'Choose a deploy path'}
          </DynamicLink>
        </div>
      </section>
      <div className="sl-grid">
        {items.map((card) => (
          <DynamicLink key={card.href} href={card.href} className="sl-card">
            <h2>{card.title}</h2>
            <p>{card.body}</p>
          </DynamicLink>
        ))}
      </div>
    </>
  );
}
