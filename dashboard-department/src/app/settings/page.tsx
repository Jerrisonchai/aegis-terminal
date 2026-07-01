// src/app/settings/page.tsx — System Configuration
'use client';
import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { getAlertsEngine } from '@/lib/alerts-engine';
import type { AlertRule } from '@/lib/alerts-engine';
import { Bell, Shield, Database, Cable, Moon, Zap, Save } from 'lucide-react';

export default function SettingsPage() {
  const engine = getAlertsEngine();
  const [rules, setRules] = useState<AlertRule[]>(engine.getRules());
  const [saved, setSaved] = useState(false);

  const toggleRule = (id: string) => {
    engine.toggleRule(id);
    setRules(engine.getRules());
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-fluid-2xl font-bold">⚙️ Settings</h1>
        <p className="text-fg-muted text-fluid-sm">System configuration, alert rules, and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Alert Rules */}
        <GlassCard className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-neon-cyan" />
            <h2 className="text-fluid-lg font-semibold">Smart Alert Rules</h2>
          </div>
          <div className="space-y-2">
            {rules.map(rule => (
              <div key={rule.id} className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    rule.severity === 'error' ? 'bg-danger' :
                    rule.severity === 'warning' ? 'bg-watch' :
                    rule.severity === 'success' ? 'bg-buy' : 'bg-neon-blue'
                  }`} />
                  <div>
                    <div className="font-medium text-fluid-sm">{rule.name}</div>
                    <div className="text-fg-muted text-fluid-xs capitalize">{rule.condition.replace(/_/g, ' ')}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    rule.enabled ? 'bg-neon-blue/30 border border-neon-blue/40' : 'bg-muted/50 border border-border/30'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full transition-transform bg-white shadow-sm ${
                    rule.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Data Sources */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Database size={18} className="text-neon-blue" />
            <h2 className="text-fluid-lg font-semibold">Data Sources</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-fluid-sm">Yahoo Finance (Primary)</span>
              <span className="dot-green w-2.5 h-2.5 rounded-full animate-pulse-slow" />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-fluid-sm">Stooq (Fallback)</span>
              <span className="dot-green w-2.5 h-2.5 rounded-full" />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-fluid-sm">Cache (Last Resort)</span>
              <span className="dot-green w-2.5 h-2.5 rounded-full" />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-fluid-sm">Moomoo OpenD</span>
              <span className="dot-yellow w-2.5 h-2.5 rounded-full" />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-fluid-sm">TradingView</span>
              <span className="dot-gray w-2.5 h-2.5 rounded-full" />
            </div>
          </div>
        </GlassCard>

        {/* Security */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-buy" />
            <h2 className="text-fluid-lg font-semibold">Trading Security</h2>
          </div>
          <div className="space-y-3 text-fluid-sm">
            <div className="flex items-center justify-between py-2">
              <span>Environment</span>
              <span className="font-mono text-buy font-semibold">PAPER ONLY</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Max Risk Per Trade</span>
              <span className="font-mono">1%</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Risk:Reward Ratio</span>
              <span className="font-mono">1:2</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Unlock Trade (SDK)</span>
              <span className="font-mono text-danger">DISABLED</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Live Trading</span>
              <span className="font-mono text-danger">BLOCKED</span>
            </div>
          </div>
        </GlassCard>

        {/* Connection */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Cable size={18} className="text-neon-purple" />
            <h2 className="text-fluid-lg font-semibold">Connections</h2>
          </div>
          <div className="space-y-3 text-fluid-sm">
            <div className="flex items-center justify-between py-2">
              <span>OpenClaw Gateway</span>
              <span className="flex items-center gap-1.5"><span className="dot-green" /> <span className="font-mono text-xs">:18789</span></span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Mission Control</span>
              <span className="flex items-center gap-1.5"><span className="dot-green" /> <span className="font-mono text-xs">:18790</span></span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Ollama (AI)</span>
              <span className="flex items-center gap-1.5"><span className="dot-green" /> <span className="font-mono text-xs">:11434</span></span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>GitHub</span>
              <span className="flex items-center gap-1.5"><span className="dot-green" /> <span className="font-mono text-xs">auth'd</span></span>
            </div>
          </div>
        </GlassCard>

        {/* Theme */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Moon size={18} className="text-neon-purple" />
            <h2 className="text-fluid-lg font-semibold">Appearance</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-fluid-sm">Theme</span>
              <span className="font-mono text-xs text-buy font-semibold">OLED DARK</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-fluid-sm">Animations</span>
              <div className="w-12 h-7 rounded-full bg-neon-blue/30 border border-neon-blue/40 flex">
                <span className="w-5 h-5 bg-white rounded-full translate-x-6 mt-0.5 ml-0.5 shadow-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-fluid-sm">Time Zone</span>
              <span className="font-mono text-xs text-fg-muted">Asia/Kuala_Lumpur (GMT+8)</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-fluid-sm">Currency</span>
              <span className="font-mono text-xs text-fg-muted">USD + MYR</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-fluid-sm">AEGIS Version</span>
              <span className="font-mono text-xs text-fg-muted">v3.0.0-alpha</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-accent flex items-center gap-2">
          {saved ? <>✅ Saved</> : <><Save size={16} /> Save Settings</>}
        </button>
      </div>
    </div>
  );
}
