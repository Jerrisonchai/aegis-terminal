// shared/http.js — HTTP client with retry, timeout, and cooldown
// Usage: import { fetchJson, fetchWithRetry } from '../shared/http.js';

const DEFAULT_TIMEOUT = 15000;
const DEFAULT_RETRIES = 2;

export async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { 'User-Agent': 'AEGIS/3.0', ...options.headers },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchWithRetry(url, options = {}) {
  const retries = options.retries || DEFAULT_RETRIES;
  let lastError;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fetchJson(url, options);
    } catch (err) {
      lastError = err;
      if (i < retries) {
        const delay = Math.min(1000 * Math.pow(2, i), 8000);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

// Cooldown tracker for source health
export class CooldownTracker {
  constructor() {
    this.failures = new Map(); // source → { count, until }
  }

  fail(source) {
    const entry = this.failures.get(source) || { count: 0, until: 0 };
    entry.count++;
    entry.until = Date.now() + (Math.pow(2, entry.count) * 30000); // 30s * 2^n
    this.failures.set(source, entry);
  }

  isCoolingDown(source) {
    const entry = this.failures.get(source);
    if (!entry) return false;
    return Date.now() < entry.until;
  }

  clear(source) {
    this.failures.delete(source);
  }
}
