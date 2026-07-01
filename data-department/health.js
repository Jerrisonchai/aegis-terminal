// data-department/health.js — Source health monitoring with cooldown
// Usage: import { sourceHealth } from '../data-department/health.js';

import { logger } from '../shared/logger.js';

/**
 * Source health tracker — exponential cooldown on failures
 */
class SourceHealth {
  constructor() {
    this.sources = new Map(); // sourceName → { failures, cooldownUntil, totalFails, totalSuccess }
  }

  recordSuccess(source) {
    let s = this.sources.get(source);
    if (!s) {
      s = { failures: 0, cooldownUntil: 0, totalFails: 0, totalSuccess: 0 };
      this.sources.set(source, s);
    }
    s.failures = 0;
    s.cooldownUntil = 0;
    s.totalSuccess++;
  }

  recordFailure(source) {
    let s = this.sources.get(source);
    if (!s) {
      s = { failures: 0, cooldownUntil: 0, totalFails: 0, totalSuccess: 0 };
      this.sources.set(source, s);
    }
    s.failures++;
    s.totalFails++;
    // Exponential cooldown: 30s * 2^failures, max 5 min
    s.cooldownUntil = Date.now() + Math.min(30000 * Math.pow(2, s.failures), 300000);
    logger.warn(`Source ${source} failed (${s.failures}x) — cooldown until ${new Date(s.cooldownUntil).toLocaleTimeString()}`);
  }

  isAvailable(source) {
    const s = this.sources.get(source);
    if (!s) return true;
    return Date.now() >= s.cooldownUntil;
  }

  getStatus() {
    const report = {};
    for (const [name, s] of this.sources) {
      report[name] = {
        available: this.isAvailable(name),
        recentFailures: s.failures,
        totalSuccess: s.totalSuccess,
        totalFails: s.totalFails,
        successRate: s.totalFails + s.totalSuccess > 0
          ? Math.round((s.totalSuccess / (s.totalFails + s.totalSuccess)) * 100)
          : 100,
      };
    }
    return report;
  }

  summary() {
    const status = this.getStatus();
    const lines = [];
    for (const [name, s] of Object.entries(status)) {
      const icon = s.available ? 'OK' : 'DOWN';
      lines.push(`${icon} ${name}: ${s.successRate}% success (${s.totalSuccess} ok, ${s.totalFails} fail)`);
    }
    return lines.join('\n');
  }
}

export const sourceHealth = new SourceHealth();
