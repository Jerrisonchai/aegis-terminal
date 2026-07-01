// src/components/sidebar.tsx
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Radio, Search, TrendingUp, BarChart3, Tags,
  Briefcase, Clock, Settings, ChevronLeft,
} from 'lucide-react';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Overview', shortcut: '1' },
  { href: '/signals', icon: Radio, label: 'Signals', shortcut: '2' },
  { href: '/scanners', icon: Search, label: 'Scanners', shortcut: '3' },
  { href: '/indicators', icon: TrendingUp, label: 'Indicators', shortcut: '4' },
  { href: '/backtesting', icon: BarChart3, label: 'Backtesting', shortcut: '5' },
  { href: '/tickers', icon: Tags, label: 'Tickers', shortcut: '6' },
  { href: '/positions', icon: Briefcase, label: 'Positions', shortcut: '7' },
  { href: '/cron', icon: Clock, label: 'Cron', shortcut: '8' },
  { href: '/settings', icon: Settings, label: 'Settings', shortcut: '9' },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const activeHref = pathname === '/' ? '/' : `/${pathname.split('/')[1]}`;

  return (
    <aside className={`hidden md:flex flex-col fixed left-0 top-14 bottom-8 bg-surface/50 backdrop-blur-xl border-r border-border/30 transition-all duration-300 z-30 ${
      collapsed ? 'w-[64px]' : 'w-[220px]'
    }`}>
      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-fg-muted hover:text-foreground transition-colors z-10"
      >
        <ChevronLeft size={12} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Nav items */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-xl transition-all duration-200 min-h-[44px] ${
                collapsed ? 'justify-center px-2' : 'px-3'
              } ${
                isActive
                  ? 'text-neon-blue'
                  : 'text-fg-muted hover:text-foreground hover:bg-muted/30'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-1 bg-neon-blue/10 border border-neon-blue/20 rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <item.icon size={20} className="relative z-10 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="relative z-10 text-fluid-sm font-medium">{item.label}</span>
                  <span className="relative z-10 ml-auto text-[10px] text-fg-muted font-mono">{item.shortcut}</span>
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: version */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-border/30">
          <span className="text-[10px] font-mono text-fg-muted">AEGIS v3.0.0</span>
        </div>
      )}
    </aside>
  );
}
