// indicators-department/volatility/bollinger.js
// Bollinger Bands — price position + squeeze — STUB
// TODO: Port full implementation from v2.1 Scan Outliers system

/**
 * Bollinger Bands — price position + squeeze
 * @param {Array} candles - OHLCV candle array
 * @param {object} params - Configuration parameters
 * @returns {object} { value, signal, score }
 */
export function bollinger(candles, params = {}) {
  if (candles.length < 20) return { value: null, signal: null, score: 0 };
  // TODO: Implement bollinger bands — price position + squeeze
  return { value: null, signal: null, score: 0 };
}
