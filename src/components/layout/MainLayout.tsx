import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Book, Compass, FileText, Menu } from 'lucide-react';
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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const meta = pageMeta[activePage];
  const PageIcon = meta.icon;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-body)] text-[var(--text-primary)]">
      {/* 侧边栏独立 - 移除外层包裹 */}
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        status={status}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 主内容区：全开放、去卡片化布局 */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between px-6 md:px-12 lg:px-16">
          <div className="flex min-w-0 items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors md:hidden"
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-bold tracking-tight">{meta.title}</h1>
                <span className="hidden rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-tertiary)] sm:inline-flex">
                  {meta.badge}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full px-6 py-12 md:px-12 md:py-16 lg:px-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* 标题区独立排版 */}
                <div className="mb-16 border-b border-[var(--border-subtle)] pb-12">
                  <div className="mb-4 flex items-center gap-2 text-[var(--text-tertiary)]">
                    <PageIcon size={18} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{meta.badge}</span>
                  </div>
                  <h2 className="text-4xl font-black tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-7xl">
                    {meta.title}
                  </h2>
                  <p className="mt-6 text-xl text-[var(--text-secondary)] md:text-2xl">{meta.subtitle}</p>
                </div>

                {/* 正文内容 */}
                <div className="prose-container">
                  {children}
                </div>
              </motion.div>
            </AnimatePresence>

            <footer className="mt-40 border-t border-[var(--border-subtle)] pt-12 text-center text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] pb-32">
              © {new Date().getFullYear()} SnowLuma. Built for clarity and speed.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
