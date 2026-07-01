// src/app/tickers/page.tsx — Ticker Watchlist
'use client';
import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { DataTable } from '@/components/ui/data-table';
import { GlobalControls } from '@/components/ui/global-controls';
import { TabBar } from '@/components/ui/tab-bar';
import { TierBadge } from '@/components/ui/tier-badge';
import { useFilters } from '@/hooks/use-filters';
import { mockSignals } from '@/lib/mock-data';

const sectors = ['all', 'Technology', 'Finance', 'Healthcare', 'Energy', 'Utilities', 'Automotive', 'Telecom'];

export default function TickersPage() {
  const { filters, filtered, updateFilter, resetFilters } = useFilters(mockSignals);
  const [sector, setSector] = useState('all');

  const display = sector === 'all' ? filtered : filtered.filter(s => s.sector === sector);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-fluid-2xl font-bold">🏷️ Tickers</h1>
        <p className="text-fg-muted text-fluid-sm">Watchlist management — {mockSignals.length} tickers tracked</p>
      </div>

      <GlobalControls filters={filters} onUpdate={updateFilter} onReset={resetFilters} />

      <TabBar
        tabs={sectors.map(s => ({ id: s, label: s === 'all' ? 'All Sectors' : s, count: s === 'all' ? filtered.length : filtered.filter(t => t.sector === s).length }))}
        active={sector} onChange={setSector}
      />

      <GlassCard>
        <DataTable
          columns={[
            { key: 'ticker', header: 'Ticker', render: (s) => <span className="font-mono font-bold">{s.ticker}</span> },
            { key: 'name', header: 'Name', render: (s) => s.name },
            { key: 'market', header: 'Mkt', render: (s) => <span className="text-fg-muted text-xs">{s.market}</span> },
            { key: 'sector', header: 'Sector', render: (s) => <span className="bg-muted/40 px-2 py-0.5 rounded-full text-xs">{s.sector}</span> },
            { key: 'price', header: 'Price', render: (s) => <span className="font-mono tabular-nums">${s.price.toFixed(2)}</span> },
            { key: 'change', header: 'Change', render: (s) => <span className={`font-mono tabular-nums ${s.change >= 0 ? 'text-buy' : 'text-danger'}`}>{s.change >= 0 ? '+' : ''}{s.change.toFixed(2)} ({s.change >= 0 ? '+' : ''}{s.changePct.toFixed(1)}%)</span> },
            { key: 'tier', header: 'Tier', render: (s) => <TierBadge tier={s.tier} score={s.composite} /> },
          ]}
          data={display}
          keyField="id"
          emptyMessage="No tickers match your filters."
        />
      </GlassCard>
    </div>
  );
}
