import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <Image
        src="/logo.svg"
        alt="SnowLuma"
        width={96}
        height={96}
        priority
        className="mb-8"
      />
      <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
        SnowLuma
      </h1>
      <p className="mb-2 text-lg text-fd-muted-foreground sm:text-xl">
        Next Remote Protocol Framework for NTQQ
      </p>
      <p className="mb-10 max-w-xl text-sm text-fd-muted-foreground">
        TypeScript + 原生 Hook 架构。OneBot v11 兼容。多账号 / WebUI / 高速迭代。
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/docs"
          className="rounded-full bg-fd-primary px-6 py-2.5 font-medium text-fd-primary-foreground transition hover:opacity-90"
        >
          阅读文档
        </Link>
        <Link
          href="https://github.com/SnowLuma"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-fd-border px-6 py-2.5 font-medium transition hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          GitHub
        </Link>
      </div>
    </main>
  );
}
