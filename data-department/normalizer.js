// data-department/normalizer.js — Normalize OHLCV data across sources
// Usage: import { normalize } from '../data-department/normalizer.js';

/**
 * Normalize candles to standard format, fill gaps, remove anomalies
 * @param {Array} candles - Raw candle array
 * @param {object} opts - { minDataPoints: 120, fillGaps: true }
 * @returns {Array} normalized candles
 */
export function normalize(candles, opts = {}) {
  const minPoints = opts.minDataPoints || 20;

  // Sort by timestamp ascending
  const sorted = [...candles].sort((a, b) => a.timestamp - b.timestamp);

  if (sorted.length < minPoints) {
    return sorted; // not enough data to normalize — return as-is
  }

  // Remove zero-volume bars (likely errors)
  const filtered = sorted.filter(c => c.volume > 0);

  // Remove price anomalies (bars where high < low or negative prices)
  const clean = filtered.filter(c =>
    c.high >= c.low &&
    c.open > 0 &&
    c.high > 0 &&
    c.low > 0 &&
    c.close > 0
  );

  // Validate OHLC relationships
  for (const c of clean) {
    if (c.high < c.open) c.high = Math.max(c.open, c.close, c.low);
    if (c.high < c.close) c.high = Math.max(c.open, c.close, c.low);
    if (c.low > c.open) c.low = Math.min(c.open, c.close, c.high);
    if (c.low > c.close) c.low = Math.min(c.open, c.close, c.high);

    // Ensure realistic high/low relationship
    if (c.high < c.low) [c.high, c.low] = [c.low, c.high];
  }

  return clean;
}

/**
 * Resample candles to a different interval (e.g., 15m → 1h)
 */
export function resample(candles, targetIntervalMs) {
  if (candles.length === 0) return [];

  const sorted = [...candles].sort((a, b) => a.timestamp - b.timestamp);
  const result = [];

  let current = null;
  for (const c of sorted) {
    const bucket = Math.floor(c.timestamp / targetIntervalMs) * targetIntervalMs;

    if (!current || current.bucket !== bucket) {
      if (current) result.push(current.candle);
      current = {
        bucket,
        candle: {
          timestamp: bucket,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
          volume: c.volume,
        },
      };
    } else {
      current.candle.high = Math.max(current.candle.high, c.high);
      current.candle.low = Math.min(current.candle.low, c.low);
      current.candle.close = c.close;
      current.candle.volume += c.volume;
    }
  }

  if (current) result.push(current.candle);
  return result;
}

/**
 * Calculate derived fields commonly used by indicators
 */
export function enrich(candles) {
  if (candles.length === 0) return candles;

  const result = [];

  for (let i = 0; i < candles.length; i++) {
    const c = { ...candles[i] };

    // Body size
    c.body = c.close - c.open;
    c.bodyPct = c.open !== 0 ? (c.body / c.open) * 100 : 0;
    c.isBullish = c.close > c.open;
    c.isBearish = c.close < c.open;

    // Range
    c.range = c.high - c.low;

    // Upper/lower wick
    c.upperWick = c.high - Math.max(c.open, c.close);
    c.lowerWick = Math.min(c.open, c.close) - c.low;

    // Typical price
    c.typical = (c.high + c.low + c.close) / 3;

    result.push(c);
  }

  return result;
}
