// src/components/bottom-nav.tsx
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutDashboard, Radio, Search, Briefcase, Clock } from 'lucide-react';

const mobileNav = [
  { href: '/', icon: LayoutDashboard, label: 'Home' },
  { href: '/signals', icon: Radio, label: 'Signals' },
  { href: '/scanners', icon: Search, label: 'Scan' },
  { href: '/positions', icon: Briefcase, label: 'Positions' },
  { href: '/cron', icon: Clock, label: 'Cron' },
];

export function BottomNav() {
  const pathname = usePathname();
  const activeHref = pathname === '/' ? '/' : `/${pathname.split('/')[1]}`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-t border-border/30 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-1">
        {mobileNav.map(item => {
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] rounded-2xl transition-all ${
                isActive ? 'text-neon-blue' : 'text-fg-muted'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-active"
                  className="absolute inset-1 bg-neon-blue/10 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <item.icon size={22} className="relative z-10" />
              <span className="text-[10px] font-medium relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
