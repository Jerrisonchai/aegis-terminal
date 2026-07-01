// src/app/cron/page.tsx — Cron Job Management
'use client';
import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { DataTable } from '@/components/ui/data-table';
import { MetricCard } from '@/components/ui/metric-card';
import { StatusDot } from '@/components/ui/status-dot';
import { TabBar } from '@/components/ui/tab-bar';
import { mockCronJobs } from '@/lib/mock-data';
import { Play, Pause, Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const statusFilters = ['all', 'ok', 'warn', 'error', 'disabled'];

export default function CronPage() {
  const [status, setStatus] = useState('all');
  const filtered = status === 'all' ? mockCronJobs : mockCronJobs.filter(j => j.status === status);

  const ok = mockCronJobs.filter(j => j.status === 'ok').length;
  const warn = mockCronJobs.filter(j => j.status === 'warn').length;
  const err = mockCronJobs.filter(j => j.status === 'error').length;
  const disabled = mockCronJobs.filter(j => j.status === 'disabled').length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-fluid-2xl font-bold">⏰ Cron Jobs</h1>
        <p className="text-fg-muted text-fluid-sm">Unified job management and monitoring</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Healthy" value={ok.toString()} subtitle="Running OK" glow="green" />
        <MetricCard label="Warning" value={warn.toString()} subtitle="Needs attention" glow={warn > 0 ? null : 'cyan'} />
        <MetricCard label="Failed" value={err.toString()} subtitle="Action required" glow={err > 0 ? null : 'cyan'} />
        <MetricCard label="Total Active" value={(ok + warn + err).toString()} subtitle={`${disabled} disabled`} glow="blue" />
      </div>

      <TabBar
        tabs={statusFilters.map(s => ({
          id: s, label: s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1),
          count: s === 'all' ? mockCronJobs.length : mockCronJobs.filter(j => j.status === s).length,
        }))}
        active={status} onChange={setStatus}
      />

      <GlassCard>
        <DataTable
          columns={[
            { key: 'status', header: '', render: (j) => {
              const icons = { ok: <CheckCircle2 size={16} className="text-buy" />, warn: <AlertTriangle size={16} className="text-watch" />, error: <XCircle size={16} className="text-danger" />, disabled: <Pause size={16} className="text-fg-muted" /> };
              return icons[j.status] || null;
            }},
            { key: 'name', header: 'Job', render: (j) => <span className="font-semibold">{j.name}</span> },
            { key: 'schedule', header: 'Schedule', render: (j) => <span className="text-fg-muted text-xs">{j.schedule}</span> },
            { key: 'lastRun', header: 'Last Run', render: (j) => <span className="font-mono text-xs">{new Date(j.lastRun).toLocaleString('en-MY', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span> },
            { key: 'lastDuration', header: 'Duration', render: (j) => <span className={`font-mono text-xs ${j.lastDuration > 120 ? 'text-watch' : ''}`}>{j.lastDuration}s</span> },
            { key: 'nextRun', header: 'Next', render: (j) => <span className="font-mono text-xs text-fg-muted">{j.nextRun === '-' ? '-' : new Date(j.nextRun).toLocaleString('en-MY', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span> },
            { key: 'consecutiveErrors', header: 'Errors', render: (j) => j.consecutiveErrors > 0 ? <span className="text-danger font-mono font-bold">{j.consecutiveErrors}</span> : <span className="text-buy">0</span> },
            { key: 'actions', header: '', render: (j) => (
              <button className={`btn ${j.status === 'disabled' ? 'btn-accent' : j.status === 'error' ? 'btn-danger' : 'btn-ghost'} text-xs !px-3 !py-1.5 !min-h-[32px]`}>
                {j.status === 'disabled' ? 'Enable' : j.status === 'error' ? 'Retry' : 'Run'}
              </button>
            )},
          ]}
          data={filtered}
          keyField="id"
          emptyMessage="No cron jobs match this status."
        />
      </GlassCard>
    </div>
  );
}
