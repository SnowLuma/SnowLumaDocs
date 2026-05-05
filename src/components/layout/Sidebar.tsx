import { Book, Compass, FileText, Moon, Monitor, Sun, X } from 'lucide-react';
import { useTheme, type ThemeMode } from '../../contexts/ThemeContext';
import type { Page } from './MainLayout';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  status: string;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems: { page: Page; label: string; icon: typeof Book }[] = [
  { page: '指南', label: '使用指南', icon: Book },
  { page: '配置', label: '配置参考', icon: Compass },
  { page: '开发者', label: '开发者', icon: FileText },
];

const themeOptions: { mode: ThemeMode; icon: typeof Sun; label: string }[] = [
  { mode: 'system', icon: Monitor, label: '系统' },
  { mode: 'light', icon: Sun, label: '浅色' },
  { mode: 'dark', icon: Moon, label: '深色' },
];

export function Sidebar({ activePage, onNavigate, status, isOpen, onClose }: SidebarProps) {
  const { mode, setMode } = useTheme();

  const content = (
    <div className="flex h-full w-full flex-col px-6 py-10">
      <div className="flex h-16 shrink-0 items-center justify-between px-2 pb-12">
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="SnowLuma" className="size-11" />
          <div className="min-w-0">
            <div className="truncate text-lg font-black tracking-tighter text-[var(--text-primary)]">SNOWLUMA</div>
            <div className="truncate text-[10px] uppercase tracking-widest text-[var(--text-tertiary)] font-bold">Protocol</div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[var(--text-tertiary)] md:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-8 py-4">
        <div className="space-y-2">
          {navItems.map(({ page, label, icon: Icon }) => {
            const active = activePage === page;
            return (
              <button
                key={page}
                onClick={() => {
                  onNavigate(page);
                  onClose?.();
                }}
                className="group flex h-12 w-full items-center gap-4 rounded-xl px-4 text-left transition-all duration-300"
                style={{
                  background: active ? 'var(--bg-active)' : 'transparent',
                }}
              >
                <div className="relative flex items-center justify-center">
                  <Icon 
                    size={20} 
                    strokeWidth={active ? 2.5 : 2} 
                    className="transition-colors duration-300"
                    style={{ color: active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
                  />
                  {active && (
                    <motion.div 
                      layoutId="active-nav"
                      className="absolute -left-6 h-5 w-0.5 rounded-r-full bg-[var(--accent)]"
                    />
                  )}
                </div>
                <span className={`text-sm tracking-tight transition-colors duration-300 ${active ? 'font-medium text-[var(--text-primary)]' : 'font-normal text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="pt-8">
        <div className="flex items-center justify-center gap-2 rounded-full bg-[var(--bg-hover)] p-1.5">
          {themeOptions.map(({ mode: value, icon: Icon, label }) => {
            const active = mode === value;
            return (
              <button
                key={value}
                title={label}
                onClick={() => setMode(value)}
                className="flex aspect-square flex-1 items-center justify-center rounded-full transition-all duration-300"
                style={{
                  background: active ? 'var(--bg-body)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: active ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col md:flex">
        {content}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-[var(--bg-sidebar)] shadow-2xl md:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
