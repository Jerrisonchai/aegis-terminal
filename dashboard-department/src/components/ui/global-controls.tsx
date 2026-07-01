// src/components/ui/global-controls.tsx
'use client';
import { Search, RefreshCw, SlidersHorizontal, Bell, BellOff } from 'lucide-react';
import type { MarketFilter, TierFilter, SortField, GlobalFilters } from '@/lib/filters';
import type { Tier } from '@/lib/mock-data';

interface GlobalControlsProps {
  filters: GlobalFilters;
  onUpdate: <K extends keyof GlobalFilters>(key: K, value: GlobalFilters[K]) => void;
  onReset: () => void;
  unreadAlerts?: number;
  onToggleAlerts?: () => void;
  alertsMuted?: boolean;
}

const marketOptions: { value: MarketFilter; label: string }[] = [
  { value: 'ALL', label: 'All Markets' },
  { value: 'MY', label: '🇲🇾 MY' },
  { value: 'US', label: '🇺🇸 US' },
];

const tierOptions: { value: TierFilter; label: string }[] = [
  { value: 'ALL', label: 'All Tiers' },
  { value: 'BUY', label: '🟢 BUY' },
  { value: 'WATCH', label: '🟡 WATCH' },
  { value: 'WEAK', label: '🟠 WEAK' },
  { value: 'AVOID', label: '🔴 AVOID' },
];

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'composite', label: 'Score' },
  { value: 'price', label: 'Price' },
  { value: 'change', label: 'Change' },
  { value: 'ticker', label: 'Ticker' },
];

export function GlobalControls({
  filters, onUpdate, onReset, unreadAlerts = 0, onToggleAlerts, alertsMuted = false,
}: GlobalControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      {/* Search */}
      <div className="relative flex-1 min-w-[160px] max-w-[320px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
        <input
          type="text"
          placeholder="Search ticker or name..."
          value={filters.search}
          onChange={e => onUpdate('search', e.target.value)}
          className="w-full bg-muted/40 border border-border/40 rounded-full pl-10 pr-4 py-2.5 text-fluid-sm text-foreground placeholder:text-fg-muted focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all min-h-[44px]"
        />
      </div>

      {/* Market filter */}
      <div className="flex gap-1 bg-muted/30 rounded-full p-1">
        {marketOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => onUpdate('market', opt.value)}
            className={`px-3 py-2 text-fluid-xs font-medium rounded-full transition-all min-h-[36px] ${
              filters.market === opt.value ? 'bg-neon-blue/20 text-neon-blue' : 'text-fg-muted hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Tier filter */}
      <div className="flex gap-1 bg-muted/30 rounded-full p-1 overflow-x-auto scrollbar-hide">
        {tierOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => onUpdate('tier', opt.value)}
            className={`px-3 py-2 text-fluid-xs font-medium rounded-full transition-all whitespace-nowrap min-h-[36px] ${
              filters.tier === opt.value ? 'bg-neon-blue/20 text-neon-blue font-semibold' : 'text-fg-muted hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        value={filters.sortBy}
        onChange={e => onUpdate('sortBy', e.target.value as SortField)}
        className="bg-muted/40 border border-border/40 rounded-full px-3 py-2.5 text-fluid-xs text-foreground focus:outline-none focus:border-neon-blue/50 appearance-none cursor-pointer min-h-[44px]"
      >
        {sortOptions.map(opt => (
          <option key={opt.value} value={opt.value}>Sort: {opt.label}</option>
        ))}
      </select>

      {/* Sort order */}
      <button
        onClick={() => onUpdate('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
        className="btn-icon text-fg-muted hover:text-foreground"
        title={filters.sortOrder === 'desc' ? 'Descending' : 'Ascending'}
      >
        {filters.sortOrder === 'desc' ? '↓' : '↑'}
      </button>

      {/* Reset */}
      <button onClick={onReset} className="btn-icon text-fg-muted hover:text-foreground" title="Reset filters">
        <RefreshCw size={16} />
      </button>

      {/* Alerts toggle */}
      {onToggleAlerts && (
        <button
          onClick={onToggleAlerts}
          className={`btn relative ${alertsMuted ? 'btn-ghost' : 'btn-primary'}`}
          title={alertsMuted ? 'Unmute alerts' : 'Mute alerts'}
        >
          {alertsMuted ? <BellOff size={16} /> : <Bell size={16} />}
          {unreadAlerts > 0 && !alertsMuted && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full text-[10px] font-bold flex items-center justify-center">
              {unreadAlerts}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
