// src/components/ui/metric-card.tsx
'use client';
import { motion } from 'framer-motion';

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon?: string;
  glow?: 'green' | 'blue' | 'purple' | 'cyan' | null;
  subtitle?: string;
}

export function MetricCard({ label, value, change, changePositive, icon, glow, subtitle }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`glass p-4 ${glow === 'green' ? 'neon-glow-green' : glow === 'blue' ? 'neon-glow-blue' : glow === 'purple' ? 'neon-glow-purple' : glow === 'cyan' ? 'neon-glow-cyan' : ''}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-fg-muted text-fluid-xs font-sans">{label}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="font-mono text-fluid-xl font-bold text-foreground tabular-nums">{value}</div>
      {change && (
        <div className={`flex items-center gap-1 mt-1 text-fluid-xs font-mono ${changePositive ? 'text-buy' : 'text-danger'}`}>
          <span>{changePositive ? '▲' : '▼'}</span>
          <span>{change}</span>
        </div>
      )}
      {subtitle && <div className="text-fg-muted text-fluid-xs mt-1">{subtitle}</div>}
    </motion.div>
  );
}
