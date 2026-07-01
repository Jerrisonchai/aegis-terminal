// src/app/positions/page.tsx — Portfolio Positions
'use client';
import { GlassCard } from '@/components/ui/glass-card';
import { DataTable } from '@/components/ui/data-table';
import { MetricCard } from '@/components/ui/metric-card';
import { EmptyState } from '@/components/ui/empty-state';
import { mockPositions } from '@/lib/mock-data';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PositionsPage() {
  const totalPnl = mockPositions.reduce((s, p) => s + p.pnl, 0);
  const totalValue = mockPositions.reduce((s, p) => s + p.current * p.qty, 0);
  const totalCost = mockPositions.reduce((s, p) => s + p.entry * p.qty, 0);
  const winCount = mockPositions.filter(p => p.pnl >= 0).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-fluid-2xl font-bold">💼 Positions</h1>
        <p className="text-fg-muted text-fluid-sm">Active positions & P&L tracking</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Value" value={`$${totalValue.toFixed(2)}`} glow="blue" />
        <MetricCard label="Total P&L" value={`${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`}
          change={`${totalPnl >= 0 ? '+' : ''}${((totalPnl / totalCost) * 100).toFixed(1)}%`} changePositive={totalPnl >= 0} glow={totalPnl >= 0 ? 'green' : null} />
        <MetricCard label="Open Positions" value={mockPositions.length.toString()} subtitle={`${winCount} winning`} glow="purple" />
        <MetricCard label="R:R Ratio" value="2:1" subtitle="Avg target" glow="cyan" />
      </div>

      <GlassCard>
        <h2 className="text-fluid-lg font-semibold mb-3">Open Positions</h2>
        {mockPositions.length > 0 ? (
          <DataTable
            columns={[
              { key: 'ticker', header: 'Ticker', render: (p) => <span className="font-mono font-bold">{p.ticker}</span> },
              { key: 'name', header: 'Name', render: (p) => p.name },
              { key: 'qty', header: 'Qty', render: (p) => <span className="font-mono tabular-nums">{p.qty}</span> },
              { key: 'entry', header: 'Entry', render: (p) => <span className="font-mono tabular-nums">${p.entry.toFixed(2)}</span> },
              { key: 'current', header: 'Current', render: (p) => <span className="font-mono tabular-nums">${p.current.toFixed(2)}</span> },
              { key: 'pnl', header: 'P&L', render: (p) => (
                <span className={`font-mono tabular-nums font-semibold flex items-center gap-1 ${p.pnl >= 0 ? 'text-buy' : 'text-danger'}`}>
                  {p.pnl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {p.pnl >= 0 ? '+' : ''}${p.pnl.toFixed(2)} ({p.pnl >= 0 ? '+' : ''}{p.pnlPct.toFixed(1)}%)
                </span>
              )},
              { key: 'stopLoss', header: 'SL', render: (p) => <span className="font-mono text-danger tabular-nums">${p.stopLoss.toFixed(2)}</span> },
              { key: 'takeProfit', header: 'TP', render: (p) => <span className="font-mono text-buy tabular-nums">${p.takeProfit.toFixed(2)}</span> },
              { key: 'openedAt', header: 'Opened', render: (p) => <span className="text-fg-muted text-xs">{new Date(p.openedAt).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}</span> },
            ]}
            data={mockPositions}
            keyField="ticker"
          />
        ) : (
          <EmptyState icon="💼" title="No open positions" description="When you place trades, your positions will appear here with real-time P&L tracking." />
        )}
      </GlassCard>
    </div>
  );
}
