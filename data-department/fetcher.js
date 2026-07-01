// data-department/fetcher.js — Multi-source OHLCV data fetcher
// Yahoo Direct API (primary) → Stooq (fallback) → Cache (last resort)
// Usage: import { fetchCandles, fetchBatch } from '../data-department/fetcher.js';

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { fetchJson } from '../shared/http.js';
import { logger } from '../shared/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, 'cache');
const CACHE_TTL_MS = 300_000; // 5 min default

// Ensure cache directory
if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });

/**
 * Fetch OHLCV candles from Yahoo Direct API
 * @param {string} ticker - Ticker symbol (e.g., 'AAPL', '1155.KL')
 * @param {object} opts - { range: '5d', interval: '15m' }
 * @returns {Promise<Array>} candles array
 */
export async function fetchYahoo(ticker, opts = {}) {
  const range = opts.range || '5d';
  const interval = opts.interval || '15m';
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${range}&interval=${interval}&includePrePost=false`;

  try {
    const data = await fetchJson(url, { timeout: 10000 });
    const result = data?.chart?.result?.[0];
    if (!result) throw new Error('No chart data');

    const { timestamp, indicators } = result;
    const quote = indicators?.quote?.[0];
    if (!quote || !timestamp) throw new Error('No OHLCV data');

    const candles = [];
    for (let i = 0; i < timestamp.length; i++) {
      if (quote.open[i] === null) continue; // skip null bars
      candles.push({
        timestamp: timestamp[i] * 1000, // ms
        open: quote.open[i],
        high: quote.high[i],
        low: quote.low[i],
        close: quote.close[i],
        volume: quote.volume[i] || 0,
      });
    }
    if (candles.length === 0) throw new Error('All bars were null');
    return candles;
  } catch (err) {
    throw new Error(`Yahoo ${ticker}: ${err.message}`);
  }
}

/**
 * Fetch from Stooq (fallback for failed Yahoo)
 * Stooq format: TICKER,DATE,OPEN,HIGH,LOW,CLOSE,VOLUME
 */
export async function fetchStooq(ticker, opts = {}) {
  const range = opts.range || '5d';
  // Stooq uses different ticker format
  const stooqSymbol = ticker.replace('.KL', '').toLowerCase();

  // Stooq doesn't support range parameter well — fetch enough by limit
  const days = range === '5d' ? '30' : '60';
  const url = `https://stooq.com/q/d/l/?s=${stooqSymbol}&i=d&l=${days}`;

  try {
    const res = await fetch(url, { timeout: 10000, headers: { 'User-Agent': 'AEGIS/3.0' } });
    const text = await res.text();
    const lines = text.trim().split('\n');
    if (lines.length < 2) throw new Error('Stooq empty response');

    // Parse CSV: Date,Open,High,Low,Close,Volume
    const candles = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',');
      if (cols.length < 5) continue;
      const d = new Date(cols[0]);
      candles.push({
        timestamp: d.getTime(),
        open: parseFloat(cols[1]),
        high: parseFloat(cols[2]),
        low: parseFloat(cols[3]),
        close: parseFloat(cols[4]),
        volume: parseInt(cols[5]) || 0,
      });
    }
    if (candles.length === 0) throw new Error('No valid Stooq rows');
    return candles;
  } catch (err) {
    throw new Error(`Stooq ${ticker}: ${err.message}`);
  }
}

/**
 * Multi-source fetch with failover
 * Yahoo → Stooq → cache
 */
export async function fetchCandles(ticker, opts = {}) {
  const errors = [];

  // Try Yahoo first
  try {
    const candles = await fetchYahoo(ticker, opts);
    cacheSave(ticker, candles);
    return { candles, source: 'yahoo' };
  } catch (e) {
    errors.push(e.message);
  }

  // Try Stooq
  try {
    const candles = await fetchStooq(ticker, opts);
    cacheSave(ticker, candles);
    return { candles, source: 'stooq' };
  } catch (e) {
    errors.push(e.message);
  }

  // Try cache as last resort
  const cached = cacheLoad(ticker);
  if (cached && cached.length > 0) {
    const age = Date.now() - (cached[0].timestamp || 0);
    logger.warn(`${ticker}: using cached data (${Math.round(age / 60000)}min old)`);
    return { candles: cached, source: 'cache' };
  }

  throw new Error(`${ticker}: all sources failed — ${errors.join('; ')}`);
}

/**
 * Fetch multiple tickers in parallel with concurrency control
 */
export async function fetchBatch(tickers, opts = {}) {
  const concurrency = opts.concurrency || 3;
  const results = [];
  const failed = [];

  for (let i = 0; i < tickers.length; i += concurrency) {
    const batch = tickers.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(t => fetchCandles(t, opts))
    );

    for (let j = 0; j < batchResults.length; j++) {
      const r = batchResults[j];
      if (r.status === 'fulfilled') {
        results.push({ ticker: batch[j], ...r.value });
      } else {
        failed.push({ ticker: batch[j], error: r.reason.message });
      }
    }

    if (i + concurrency < tickers.length) {
      await new Promise(r => setTimeout(r, 500)); // rate limit
    }
  }

  return { results, failed };
}

// --- Cache Layer ---

function cachePath(ticker) {
  return join(CACHE_DIR, `${ticker.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
}

function cacheSave(ticker, candles) {
  try {
    writeFileSync(cachePath(ticker), JSON.stringify({ ticker, updated: Date.now(), candles }));
  } catch (e) {
    // silently fail — cache is non-critical
  }
}

function cacheLoad(ticker) {
  try {
    const file = cachePath(ticker);
    if (!existsSync(file)) return null;
    const data = JSON.parse(readFileSync(file, 'utf-8'));
    if (Date.now() - data.updated > CACHE_TTL_MS) return null; // expired
    return data.candles;
  } catch {
    return null;
  }
}

export { cacheSave, cacheLoad };
