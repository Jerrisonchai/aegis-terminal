// src/app/signals/page.tsx — Signals Feed
'use client';
import { SignalCard } from '@/components/ui/signal-card';
import { GlobalControls } from '@/components/ui/global-controls';
import { TabBar } from '@/components/ui/tab-bar';
import { EmptyState } from '@/components/ui/empty-state';
import { useFilters } from '@/hooks/use-filters';
import { mockSignals, type Tier } from '@/lib/mock-data';
import { useState } from 'react';

export default function SignalsPage() {
  const { filters, filtered, updateFilter, resetFilters } = useFilters(mockSignals);
  const [view, setView] = useState('all');

  const tabCounts = {
    all: mockSignals.length,
    buy: mockSignals.filter(s => s.tier === 'BUY').length,
    watch: mockSignals.filter(s => s.tier === 'WATCH').length,
    weak: mockSignals.filter(s => s.tier === 'WEAK').length,
    avoid: mockSignals.filter(s => s.tier === 'AVOID').length,
  };

  const displaySignals = filtered.filter(s => {
    if (view === 'all') return true;
    return s.tier === view.toUpperCase();
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-fluid-2xl font-bold">📡 Signals</h1>
        <p className="text-fg-muted text-fluid-sm">Live trading signals — filtered, sorted, actionable</p>
      </div>

      <TabBar
        tabs={[
          { id: 'all', label: 'All', count: tabCounts.all },
          { id: 'buy', label: '🟢 Buy', count: tabCounts.buy },
          { id: 'watch', label: '🟡 Watch', count: tabCounts.watch },
          { id: 'weak', label: '🟠 Weak', count: tabCounts.weak },
          { id: 'avoid', label: '🔴 Avoid', count: tabCounts.avoid },
        ]}
        active={view}
        onChange={setView}
      />

      <GlobalControls filters={filters} onUpdate={updateFilter} onReset={resetFilters} />

      <div className="text-fg-muted text-fluid-xs font-mono">
        Showing {displaySignals.length} of {mockSignals.length} signals
      </div>

      {displaySignals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displaySignals.map((signal, i) => (
            <SignalCard key={signal.id} signal={signal} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📡"
          title="No signals match"
          description="Try adjusting your filters or run a scan to generate fresh signals."
        />
      )}
    </div>
  );
}
