// src/app/backtesting/page.tsx — Backtesting Results
'use client';
import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { DataTable } from '@/components/ui/data-table';
import { MetricCard } from '@/components/ui/metric-card';
import { TabBar } from '@/components/ui/tab-bar';
import { EmptyState } from '@/components/ui/empty-state';
import { mockBacktests } from '@/lib/mock-data';
import { TrendingUp, Target, DollarSign, Activity } from 'lucide-react';

const markets = ['all', 'US', 'MY'];

export default function BacktestingPage() {
  const [market, setMarket] = useState('all');
  const filtered = market === 'all' ? mockBacktests : mockBacktests.filter(b => b.market === market);

  const avgWinRate = filtered.reduce((s, b) => s + b.winRate, 0) / filtered.length;
  const totalPnl = filtered.reduce((s, b) => s + b.totalPnl, 0);
  const best = filtered.reduce((best, b) => b.winRate > best.winRate ? b : best, filtered[0] || { winRate: 0, ticker: '-' });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-fluid-2xl font-bold">⚡ Backtesting</h1>
        <p className="text-fg-muted text-fluid-sm">Strategy performance, equity curves, and comparison</p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Avg Win Rate" value={`${avgWinRate.toFixed(1)}%`} change={avgWinRate > 60 ? 'Above target' : 'Below target'} changePositive={avgWinRate > 60} glow="green" />
        <MetricCard label="Total P&L" value={`$${totalPnl.toFixed(2)}`} change="All strategies" changePositive={totalPnl > 0} glow={totalPnl > 0 ? 'green' : null} />
        <MetricCard label="Best Performer" value={best.ticker} subtitle={`${best.winRate}% win rate`} glow="blue" />
        <MetricCard label="Strategies" value={new Set(filtered.map(b => b.strategy)).size.toString()} subtitle="tested" glow="purple" />
      </div>

      <TabBar
        tabs={markets.map(m => ({ id: m, label: m === 'all' ? 'All Markets' : m === 'US' ? '🇺🇸 US' : '🇲🇾 MY', count: m === 'all' ? mockBacktests.length : mockBacktests.filter(b => b.market === m).length }))}
        active={market} onChange={setMarket}
      />

      <GlassCard>
        <h2 className="text-fluid-lg font-semibold mb-3">Backtest Results</h2>
        <DataTable
          columns={[
            { key: 'ticker', header: 'Ticker', render: (b) => <span className="font-mono font-semibold">{b.ticker}</span> },
            { key: 'strategy', header: 'Strategy', render: (b) => b.strategy },
            { key: 'market', header: 'Mkt', render: (b) => <span className="text-fg-muted">{b.market}</span> },
            { key: 'trades', header: 'Trades', render: (b) => b.trades },
            { key: 'winRate', header: 'Win Rate', render: (b) => <span className={b.winRate >= 65 ? 'text-buy font-semibold' : b.winRate >= 50 ? 'text-watch' : 'text-danger'}>{b.winRate}%</span> },
            { key: 'totalPnl', header: 'P&L', render: (b) => <span className={b.totalPnl >= 0 ? 'text-buy' : 'text-danger'}>${b.totalPnl.toFixed(2)}</span> },
            { key: 'sharpeRatio', header: 'Sharpe', render: (b) => b.sharpeRatio.toFixed(2) },
            { key: 'maxDrawdown', header: 'Max DD', render: (b) => <span className="text-danger">{b.maxDrawdown}%</span> },
          ]}
          data={filtered}
          keyField="id"
          emptyMessage="No backtests yet. Run your first backtest."
        />
      </GlassCard>
    </div>
  );
}
