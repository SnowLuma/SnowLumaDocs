import { Book, Compass, FileText, Moon, Monitor, Sun } from 'lucide-react';
import { useTheme, type ThemeMode } from '../../contexts/ThemeContext';
import type { Page } from './MainLayout';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  status: string;
  onLogout: () => void;
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

export function Sidebar({ activePage, onNavigate, status }: SidebarProps) {
  const { mode, setMode } = useTheme();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-sidebar)]">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[var(--border-subtle)] px-5">
        <img src="/logo.svg" alt="SnowLuma" className="size-9 rounded-xl" />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold tracking-tight text-[var(--text-primary)]">SnowLuma</div>
          <div className="truncate text-xs text-[var(--text-tertiary)]">Remote Protocol Framework</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">文档</div>
        <div className="space-y-1">
          {navItems.map(({ page, label, icon: Icon }) => {
            const active = activePage === page;
            return (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors"
                style={{
                  background: active ? 'var(--bg-active)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                <Icon size={16} strokeWidth={2} />
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-[var(--border-subtle)] p-4">
        <div className="mb-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2">
          <div className="text-[11px] font-medium text-[var(--text-tertiary)]">状态</div>
          <div className="mt-0.5 truncate text-sm text-[var(--text-secondary)]">{status}</div>
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-lg bg-[var(--bg-card)] p-1">
          {themeOptions.map(({ mode: value, icon: Icon, label }) => {
            const active = mode === value;
            return (
              <button
                key={value}
                title={label}
                onClick={() => setMode(value)}
                className="flex h-8 items-center justify-center rounded-md transition-colors"
                style={{
                  background: active ? 'var(--bg-surface)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-tertiary)',
                }}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
