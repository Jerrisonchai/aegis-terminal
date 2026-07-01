// src/app/scanners/page.tsx — Scanner Control Center
'use client';
import { ScanButton } from '@/components/ui/scan-button';
import { GlassCard } from '@/components/ui/glass-card';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { getAlertsEngine } from '@/lib/alerts-engine';
import { mockScans, mockSignals } from '@/lib/mock-data';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function ScannersPage() {
  const handleScan = (market: 'MY' | 'US') => {
    getAlertsEngine().fire('rule-scan', `${market === 'MY' ? 'Bursa MY' : 'NYSE/NASDAQ'} scan started — ${market === 'MY' ? 51 : 28} tickers`, 'info');
  };

  const recentSignals = mockSignals.slice(0, 8);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-fluid-2xl font-bold">🔍 Scanners</h1>
        <p className="text-fg-muted text-fluid-sm">Trigger market scans and review results</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScanButton market="MY" lastScan={{ time: '9:14 AM', ok: true, signals: 7 }} onTrigger={handleScan} />
        <ScanButton market="US" lastScan={{ time: '9:30 AM', ok: true, signals: 5 }} onTrigger={handleScan} />
      </div>

      {/* Scan history */}
      <GlassCard>
        <h2 className="text-fluid-lg font-semibold mb-3">Scan History</h2>
        <DataTable
          columns={[
            { key: 'market', header: 'Market',
              render: (s) => <span className="font-semibold">{s.market === 'MY' ? '🇲🇾 MY' : '🇺🇸 US'}</span> },
            { key: 'status', header: 'Status',
              render: (s) => s.status === 'done' ? <CheckCircle2 size={16} className="text-buy" /> : s.status === 'error' ? <XCircle size={16} className="text-danger" /> : <Clock size={16} className="text-watch animate-spin" /> },
            { key: 'tickersScanned', header: 'Tickers', render: (s) => `${s.tickersScanned}/${s.totalTickers}` },
            { key: 'signalsFound', header: 'Signals', render: (s) => s.signalsFound },
            { key: 'duration', header: 'Time', render: (s) => `${s.duration}s` },
            { key: 'timestamp', header: 'When', render: (s) => new Date(s.timestamp).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }) },
          ]}
          data={[...mockScans].reverse()}
          keyField="id"
          emptyMessage="No scans yet. Trigger your first scan above."
        />
      </GlassCard>

      {/* Recent scan signals */}
      <GlassCard glow="blue">
        <h2 className="text-fluid-lg font-semibold mb-3">Latest Scan Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {recentSignals.map((signal, i) => (
            <div key={signal.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-fluid-sm">{signal.ticker}</span>
                <span className="text-fg-muted text-fluid-xs">{signal.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-fluid-xs font-mono font-bold ${
                  signal.tier === 'BUY' ? 'text-buy' : signal.tier === 'WATCH' ? 'text-watch' : signal.tier === 'WEAK' ? 'text-weak' : 'text-avoid'
                }`}>{signal.tier} {signal.composite.toFixed(1)}</span>
                <span className="font-mono text-fluid-sm">${signal.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
