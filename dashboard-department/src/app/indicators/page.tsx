// src/app/indicators/page.tsx — Indicator Library Manager
'use client';
import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { TabBar } from '@/components/ui/tab-bar';
import { EmptyState } from '@/components/ui/empty-state';
import { mockIndicators, type IndicatorDef } from '@/lib/mock-data';
import { ToggleLeft, ToggleRight, TrendingUp, Activity, Gauge, BarChart3, Shapes } from 'lucide-react';

const categories = ['all', 'trend', 'momentum', 'volatility', 'volume', 'pattern'] as const;
const catIcons: Record<string, any> = { trend: TrendingUp, momentum: Activity, volatility: Gauge, volume: BarChart3, pattern: Shapes };

export default function IndicatorsPage() {
  const [cat, setCat] = useState<string>('all');
  const [indicators, setIndicators] = useState(mockIndicators);

  const toggleIndicator = (id: string) => {
    setIndicators(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
  };

  const filtered = cat === 'all' ? indicators : indicators.filter(i => i.category === cat);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-fluid-2xl font-bold">📈 Indicators</h1>
          <p className="text-fg-muted text-fluid-sm">Enable, disable, and configure your indicator library</p>
        </div>
        <div className="flex items-center gap-2 text-fluid-xs font-mono text-fg-muted">
          <span>{indicators.filter(i => i.enabled).length} active</span>
          <span>·</span>
          <span>{indicators.length} total</span>
        </div>
      </div>

      {/* Category tabs */}
      <TabBar
        tabs={categories.map(c => ({
          id: c,
          label: c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1),
          count: c === 'all' ? indicators.length : indicators.filter(i => i.category === c).length,
        }))}
        active={cat}
        onChange={setCat}
      />

      {/* Indicator cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(ind => {
          const isActive = ind.enabled;
          return (
            <GlassCard key={ind.id} glow={isActive ? 'blue' : null}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-fg-muted bg-muted/50 px-1.5 py-0.5 rounded-full capitalize">
                      {ind.category}
                    </span>
                    <span className="text-[10px] text-fg-muted">{ind.source}</span>
                  </div>
                  <h3 className="text-fluid-base font-semibold mt-1.5">{ind.name}</h3>
                </div>
                <button
                  onClick={() => toggleIndicator(ind.id)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-muted/30 transition-colors"
                >
                  {isActive ? (
                    <ToggleRight size={24} className="text-neon-blue" />
                  ) : (
                    <ToggleLeft size={24} className="text-fg-muted" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-4 text-fluid-xs font-mono text-fg-muted">
                <span>Weight: {ind.weight}/10</span>
                <span>Buy score: {ind.buyScore}/10</span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <EmptyState icon="📈" title="No indicators" description="No indicators in this category." />
      )}
    </div>
  );
}
