// src/app/page.tsx — Overview Dashboard
'use client';
import { useState } from 'react';
import { MetricCard } from '@/components/ui/metric-card';
import { GlassCard } from '@/components/ui/glass-card';
import { SignalCard } from '@/components/ui/signal-card';
import { ScanButton } from '@/components/ui/scan-button';
import { StatusDot } from '@/components/ui/status-dot';
import { GlobalControls } from '@/components/ui/global-controls';
import { useFilters } from '@/hooks/use-filters';
import { useAlerts } from '@/hooks/use-alerts';
import { getAlertsEngine } from '@/lib/alerts-engine';
import { mockSignals, mockPositions, mockScans, mockSystemHealth, mockCronJobs } from '@/lib/mock-data';

export default function OverviewPage() {
  const { filters, filtered, updateFilter, resetFilters } = useFilters(mockSignals);
  const { unreadCount } = useAlerts();
  const [alertsMuted, setAlertsMuted] = useState(false);

  const totalPnl = mockPositions.reduce((s, p) => s + p.pnl, 0);
  const totalPnlPct = mockPositions.reduce((s, p) => s + p.entry * p.qty, 0) > 0
    ? (totalPnl / mockPositions.reduce((s, p) => s + p.entry * p.qty, 0)) * 100 : 0;
  const activeSignals = mockSignals.filter(s => s.tier === 'BUY').length;
  const okCron = mockCronJobs.filter(j => j.status === 'ok').length;
  const totalCron = mockCronJobs.filter(j => j.status !== 'disabled').length;

  const handleScan = (market: 'MY' | 'US') => {
    getAlertsEngine().fire('rule-scan', `${market === 'MY' ? 'Bursa MY' : 'NYSE/NASDAQ'} scan triggered`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-fluid-2xl font-bold">Overview</h1>
          <p className="text-fg-muted text-fluid-sm">Trading command center · {new Date().toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total P&L" value={`${totalPnl >= 0 ? '+' : ''}RM ${totalPnl.toFixed(2)}`}
          change={`${totalPnlPct >= 0 ? '+' : ''}${totalPnlPct.toFixed(1)}%`} changePositive={totalPnl >= 0}
          glow={totalPnl >= 0 ? 'green' : null} icon="💰" />
        <MetricCard label="Active Signals" value={activeSignals.toString()}
          subtitle={`${mockSignals.length} total today`} glow="blue" icon="📡" />
        <MetricCard label="Win Rate" value="71.3%"
          subtitle="This week" glow="purple" icon="🎯" />
        <MetricCard label="Cron Health" value={`${okCron}/${totalCron}`}
          subtitle={`${Math.round(okCron / totalCron * 100)}% healthy`}
          glow={okCron / totalCron > 0.8 ? 'green' : 'cyan'} icon="⏰" />
      </div>

      {/* System health */}
      <GlassCard>
        <div className="flex items-center gap-4 flex-wrap text-fluid-xs font-mono">
          <span className="flex items-center gap-1.5"><StatusDot status="green" size={6} /> Gateway</span>
          <span className="flex items-center gap-1.5"><StatusDot status="green" size={6} /> MC</span>
          <span className="flex items-center gap-1.5"><StatusDot status="green" size={6} /> Ollama</span>
          <span className="text-fg-muted ml-auto">CPU {mockSystemHealth.cpu}% · Mem {mockSystemHealth.memory.used}/{mockSystemHealth.memory.total} GB · Disk {mockSystemHealth.disk.free} GB free</span>
        </div>
      </GlassCard>

      {/* Global controls */}
      <GlobalControls filters={filters} onUpdate={updateFilter} onReset={resetFilters}
        unreadAlerts={unreadCount} alertsMuted={alertsMuted}
        onToggleAlerts={() => setAlertsMuted(!alertsMuted)} />

      {/* Scan buttons + Latest signals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-3">
          <ScanButton market="MY" lastScan={{ time: '9:14 AM', ok: true, signals: 7 }} onTrigger={handleScan} />
          <ScanButton market="US" lastScan={{ time: '9:30 AM', ok: true, signals: 5 }} onTrigger={handleScan} />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-fluid-lg font-semibold mb-3">Latest Signals</h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filtered.slice(0, 6).map((signal, i) => (
              <SignalCard key={signal.id} signal={signal} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
