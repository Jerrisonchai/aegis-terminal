// indicators-department/trend/breakout-20.js
// Price breaks above 20-day high — STUB
// TODO: Port full implementation from v2.1 Scan Outliers system

/**
 * Price breaks above 20-day high
 * @param {Array} candles - OHLCV candle array
 * @param {object} params - Configuration parameters
 * @returns {object} { value, signal, score }
 */
export function breakout20(candles, params = {}) {
  if (candles.length < 20) return { value: null, signal: null, score: 0 };
  // TODO: Implement price breaks above 20-day high
  return { value: null, signal: null, score: 0 };
}
