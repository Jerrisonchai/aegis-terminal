// src/components/status-bar.tsx
import { StatusDot } from './ui/status-dot';

export function StatusBar() {
  return (
    <footer className="hidden md:flex fixed bottom-0 left-0 right-0 h-8 bg-surface/80 backdrop-blur-xl border-t border-border/30 items-center justify-between px-4 z-30 text-[10px] font-mono text-fg-muted">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5"><StatusDot status="green" size={6} /> Gateway</span>
        <span className="flex items-center gap-1.5"><StatusDot status="green" size={6} /> Mission Control</span>
        <span className="flex items-center gap-1.5"><StatusDot status="green" size={6} /> Ollama</span>
        <span className="ml-2">Data fresh: 2m ago</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Mem: 5.6 / 19.4 GB</span>
        <span>Disk: 129 GB free</span>
        <span>Uptime: 14d 7h</span>
      </div>
    </footer>
  );
}
