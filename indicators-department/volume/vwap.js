// indicators-department/volume/vwap.js
// VWAP — price distance from volume-weighted average — STUB
// TODO: Port full implementation from v2.1 Scan Outliers system

/**
 * VWAP — price distance from volume-weighted average
 * @param {Array} candles - OHLCV candle array
 * @param {object} params - Configuration parameters
 * @returns {object} { value, signal, score }
 */
export function vwap(candles, params = {}) {
  if (candles.length < 20) return { value: null, signal: null, score: 0 };
  // TODO: Implement vwap — price distance from volume-weighted average
  return { value: null, signal: null, score: 0 };
}
