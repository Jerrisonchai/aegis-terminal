// src/components/top-bar.tsx
'use client';
import { useEffect, useState } from 'react';
import { Activity, Zap, Clock, Wifi } from 'lucide-react';
import { StatusDot } from './ui/status-dot';

export function TopBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleString('en-MY', {
      weekday: 'short', day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZone: 'Asia/Kuala_Lumpur',
    }));
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur-xl border-b border-border/30">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        {/* Left: Logo + market status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center">
              <Zap size={16} className="text-neon-blue" />
            </div>
            <span className="font-mono font-bold text-fluid-base hidden sm:inline">AEGIS</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <StatusDot status="green" />
              <span className="text-fluid-xs font-mono text-buy">MY OPEN</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusDot status="gray" pulse={false} />
              <span className="text-fluid-xs font-mono text-fg-muted">US CLOSED</span>
            </div>
          </div>
        </div>

        {/* Right: Time + health */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-fg-muted text-fluid-xs font-mono">
            <span className="flex items-center gap-1"><Wifi size={12} /> Online</span>
            <span className="flex items-center gap-1"><Activity size={12} /> CPU 34%</span>
          </div>
          <span className="font-mono text-fluid-sm text-fg-muted tabular-nums">{time} MYT</span>
        </div>
      </div>
    </header>
  );
}
