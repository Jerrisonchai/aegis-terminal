// indicators-department/trend/above-all-ma.js
// Price above SMA20, SMA50, SMA200 — STUB
// TODO: Port full implementation from v2.1 Scan Outliers system

/**
 * Price above SMA20, SMA50, SMA200
 * @param {Array} candles - OHLCV candle array
 * @param {object} params - Configuration parameters
 * @returns {object} { value, signal, score }
 */
export function aboveAllMA(candles, params = {}) {
  if (candles.length < 20) return { value: null, signal: null, score: 0 };
  // TODO: Implement price above sma20, sma50, sma200
  return { value: null, signal: null, score: 0 };
}
