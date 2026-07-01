// indicators-department/momentum/rsi-divergence.js
// RSI Bullish/Bearish Divergence detection — STUB
// TODO: Port full implementation from v2.1 Scan Outliers system

/**
 * RSI Bullish/Bearish Divergence detection
 * @param {Array} candles - OHLCV candle array
 * @param {object} params - Configuration parameters
 * @returns {object} { value, signal, score }
 */
export function rsiDivergence(candles, params = {}) {
  if (candles.length < 20) return { value: null, signal: null, score: 0 };
  // TODO: Implement rsi bullish/bearish divergence detection
  return { value: null, signal: null, score: 0 };
}
