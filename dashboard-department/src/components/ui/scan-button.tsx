// src/components/ui/scan-button.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, CheckCircle2, XCircle } from 'lucide-react';

type ScanStatus = 'idle' | 'running' | 'done' | 'error';

interface ScanButtonProps {
  market: 'MY' | 'US';
  lastScan?: { time: string; ok: boolean; signals: number };
  onTrigger: (market: 'MY' | 'US') => void;
}

export function ScanButton({ market, lastScan, onTrigger }: ScanButtonProps) {
  const [status, setStatus] = useState<ScanStatus>('idle');

  const handleClick = () => {
    if (status === 'running') return;
    setStatus('running');
    onTrigger(market);
    setTimeout(() => setStatus('done'), 2000 + Math.random() * 2000);
    setTimeout(() => setStatus('idle'), 5000);
  };

  const marketLabel = market === 'MY' ? 'Bursa MY' : 'NYSE / NASDAQ';
  const tickerCount = market === 'MY' ? 51 : 28;

  return (
    <motion.button
      onClick={handleClick}
      disabled={status === 'running'}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden rounded-2xl p-4 w-full text-left transition-all duration-300 ${
        status === 'running' ? 'border-neon-blue animate-glow' :
        status === 'done' ? 'border-buy' :
        status === 'error' ? 'border-danger' :
        'border-border/50 hover:border-border'
      } glass border`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            status === 'running' ? 'bg-neon-blue/20' :
            status === 'done' ? 'bg-buy/20' :
            'bg-muted/30'
          }`}>
            {status === 'running' ? <Loader2 className="w-5 h-5 text-neon-blue animate-spin" /> :
             status === 'done' ? <CheckCircle2 className="w-5 h-5 text-buy" /> :
             status === 'error' ? <XCircle className="w-5 h-5 text-danger" /> :
             <Search className="w-5 h-5 text-fg-muted" />}
          </div>
          <div>
            <div className="font-semibold text-fluid-base">{marketLabel}</div>
            <div className="text-fg-muted text-fluid-xs font-mono">{tickerCount} tickers</div>
          </div>
        </div>
        {status === 'running' && (
          <span className="text-neon-blue text-fluid-sm font-mono animate-pulse">Scanning...</span>
        )}
        {status === 'done' && (
          <span className="text-buy text-fluid-sm font-mono">Complete ✓</span>
        )}
      </div>

      {status === 'running' && (
        <div className="w-full h-1 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-neon-blue rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>
      )}

      {lastScan && status === 'idle' && (
        <div className="text-fg-muted text-fluid-xs font-mono mt-1">
          Last: {lastScan.time} · {lastScan.ok ? '✅' : '❌'} {lastScan.signals} signals
        </div>
      )}
    </motion.button>
  );
}
