// indicators-department/volume/obv.js
// On-Balance Volume — trend divergence — STUB
// TODO: Port full implementation from v2.1 Scan Outliers system

/**
 * On-Balance Volume — trend divergence
 * @param {Array} candles - OHLCV candle array
 * @param {object} params - Configuration parameters
 * @returns {object} { value, signal, score }
 */
export function obv(candles, params = {}) {
  if (candles.length < 20) return { value: null, signal: null, score: 0 };
  // TODO: Implement on-balance volume — trend divergence
  return { value: null, signal: null, score: 0 };
}
