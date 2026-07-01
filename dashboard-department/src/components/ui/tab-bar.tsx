// src/components/ui/tab-bar.tsx
'use client';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabBarProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative px-4 py-2.5 text-fluid-sm font-medium rounded-full transition-all whitespace-nowrap min-h-[40px] ${
            active === tab.id
              ? 'text-neon-blue'
              : 'text-fg-muted hover:text-foreground hover:bg-muted/30'
          }`}
        >
          {active === tab.id && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute inset-0 bg-neon-blue/10 border border-neon-blue/30 rounded-full"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                active === tab.id ? 'bg-neon-blue/20 text-neon-blue' : 'bg-muted/40 text-fg-muted'
              }`}>
                {tab.count}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
