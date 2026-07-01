// src/lib/alerts-engine.ts — JavaScript SmartAlerts Engine
// Client-side alert system: rules, evaluation, toast queue, history

export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';
export type AlertCondition = 'price_above' | 'price_below' | 'signal_found' | 'scan_complete' | 'pnl_target' | 'stop_loss_hit' | 'cron_failed';

export interface AlertRule {
  id: string;
  name: string;
  condition: AlertCondition;
  ticker?: string;
  threshold?: number;
  severity: AlertSeverity;
  enabled: boolean;
  cooldownMs: number; // min time between repeats
  lastFired?: number;
}

export interface Alert {
  id: string;
  rule: AlertRule;
  message: string;
  severity: AlertSeverity;
  timestamp: number;
  read: boolean;
  dismissed: boolean;
}

type Listener = (alert: Alert) => void;

class SmartAlertsEngine {
  private rules: AlertRule[] = [];
  private alerts: Alert[] = [];
  private listeners: Set<Listener> = new Set();
  private maxAlerts = 50;

  constructor() {
    this.loadFromStorage();
    this.setupDefaultRules();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('aegis-alerts');
      if (saved) this.alerts = JSON.parse(saved);
      const savedRules = localStorage.getItem('aegis-alert-rules');
      if (savedRules) this.rules = JSON.parse(savedRules);
    } catch { /* ignore */ }
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('aegis-alerts', JSON.stringify(this.alerts.slice(-this.maxAlerts)));
    localStorage.setItem('aegis-alert-rules', JSON.stringify(this.rules));
  }

  private setupDefaultRules() {
    if (this.rules.length > 0) return;
    this.rules = [
      { id: 'rule-scan', name: 'Scan complete', condition: 'scan_complete', severity: 'info', enabled: true, cooldownMs: 300000 },
      { id: 'rule-signal-buy', name: 'BUY signal detected', condition: 'signal_found', severity: 'success', enabled: true, cooldownMs: 60000 },
      { id: 'rule-cron-fail', name: 'Cron job failed', condition: 'cron_failed', severity: 'error', enabled: true, cooldownMs: 300000 },
      { id: 'rule-pnl-10', name: 'P&L +10% target', condition: 'pnl_target', threshold: 10, severity: 'success', enabled: true, cooldownMs: 3600000 },
      { id: 'rule-stop-loss', name: 'Stop-loss warning', condition: 'stop_loss_hit', severity: 'warning', enabled: true, cooldownMs: 300000 },
      { id: 'rule-price-drop', name: 'Price -5% alert', condition: 'price_below', threshold: -5, severity: 'warning', enabled: false, cooldownMs: 600000 },
    ];
    this.save();
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  fire(ruleId: string, message: string, severity?: AlertSeverity) {
    const rule = this.rules.find(r => r.id === ruleId);
    if (!rule || !rule.enabled) return;

    const now = Date.now();
    if (rule.lastFired && (now - rule.lastFired) < rule.cooldownMs) return;

    const alert: Alert = {
      id: `alert-${now}-${Math.random().toString(36).slice(2, 7)}`,
      rule: { ...rule },
      message,
      severity: severity || rule.severity,
      timestamp: now,
      read: false,
      dismissed: false,
    };

    rule.lastFired = now;
    this.alerts.push(alert);
    if (this.alerts.length > this.maxAlerts) this.alerts.shift();
    this.save();

    for (const listener of this.listeners) listener(alert);
  }

  getAlerts(limit = 20, unreadOnly = false): Alert[] {
    const result = [...this.alerts].reverse();
    const filtered = unreadOnly ? result.filter(a => !a.read) : result;
    return filtered.slice(0, limit);
  }

  markRead(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) { alert.read = true; this.save(); }
  }

  markAllRead() {
    this.alerts.forEach(a => { a.read = true; });
    this.save();
  }

  dismiss(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) { alert.dismissed = true; this.save(); }
  }

  clear() {
    this.alerts = [];
    this.save();
  }

  getRules(): AlertRule[] { return this.rules; }

  toggleRule(ruleId: string) {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = !rule.enabled;
      this.save();
    }
  }

  getUnreadCount(): number {
    return this.alerts.filter(a => !a.read && !a.dismissed).length;
  }
}

// Singleton
let instance: SmartAlertsEngine | null = null;
export function getAlertsEngine(): SmartAlertsEngine {
  if (!instance) instance = new SmartAlertsEngine();
  return instance;
}
