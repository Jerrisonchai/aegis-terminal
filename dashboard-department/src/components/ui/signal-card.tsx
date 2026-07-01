// src/components/ui/signal-card.tsx
'use client';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { TierBadge } from './tier-badge';
import type { Signal } from '@/lib/mock-data';

export function SignalCard({ signal, index = 0 }: { signal: Signal; index?: number }) {
  const isUp = signal.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="glass p-4 hover:border-border/80 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-fluid-base">{signal.ticker}</span>
          <span className="text-fg-muted text-fluid-xs font-sans">{signal.name}</span>
          <span className="text-fg-muted text-[10px] font-mono bg-muted/50 px-1.5 py-0.5 rounded-full">{signal.market}</span>
        </div>
        <TierBadge tier={signal.tier} score={signal.composite} />
      </div>

      <div className="flex items-center gap-4 mb-3">
        <span className="font-mono text-fluid-lg font-bold tabular-nums">${signal.price.toFixed(2)}</span>
        <span className={`flex items-center gap-1 font-mono text-fluid-sm ${isUp ? 'text-buy' : 'text-danger'}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {isUp ? '+' : ''}{signal.change.toFixed(2)} ({isUp ? '+' : ''}{signal.changePct.toFixed(2)}%)
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {signal.indicators.map((ind, i) => (
          <span key={i} className="bg-muted/40 text-fg-muted text-[11px] font-mono px-2 py-0.5 rounded-full">
            {ind}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-fg-muted text-fluid-xs">
        <span>{signal.sector}</span>
        <span className="font-mono">{new Date(signal.timestamp).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </motion.div>
  );
}
