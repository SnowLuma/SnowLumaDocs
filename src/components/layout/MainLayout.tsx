import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Book, Compass, FileText } from 'lucide-react';
import { Sidebar } from './Sidebar';

export type Page = '指南' | '配置' | '开发者';

interface MainLayoutProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  status: string;
  onLogout: () => void;
  children: ReactNode;
}

const pageMeta: Record<Page, { title: string; subtitle: string; badge: string; icon: typeof Book }> = {
  '指南': { title: '使用指南', subtitle: '安装、运行与发行说明', badge: 'Getting Started', icon: Book },
  '配置': { title: '配置参考', subtitle: 'OneBot 端点、鉴权与账号配置', badge: 'Configuration', icon: Compass },
  '开发者': { title: '开发者文档', subtitle: 'TS 运行时、原生模块与桥接链路', badge: 'Developer', icon: FileText },
};

export function MainLayout({ activePage, onNavigate, status, onLogout, children }: MainLayoutProps) {
  const meta = pageMeta[activePage];
  const PageIcon = meta.icon;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-body)] text-[var(--text-primary)]">
      <Sidebar activePage={activePage} onNavigate={onNavigate} status={status} onLogout={onLogout} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--accent)]">
              <PageIcon size={18} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-semibold tracking-tight">{meta.title}</h1>
                <span className="hidden rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-tertiary)] sm:inline-flex">
                  {meta.badge}
                </span>
              </div>
              <p className="truncate text-sm text-[var(--text-secondary)]">{meta.subtitle}</p>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-6 py-10 lg:px-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>

            <footer className="mt-12 border-t border-[var(--border-subtle)] pt-6 text-center text-xs text-[var(--text-tertiary)]">
              © {new Date().getFullYear()} SnowLuma. Documentation for the next remote protocol framework.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
