// indicators-department/volatility/atr.js
// ATR — volatility expansion detection — STUB
// TODO: Port full implementation from v2.1 Scan Outliers system

/**
 * ATR — volatility expansion detection
 * @param {Array} candles - OHLCV candle array
 * @param {object} params - Configuration parameters
 * @returns {object} { value, signal, score }
 */
export function atr(candles, params = {}) {
  if (candles.length < 20) return { value: null, signal: null, score: 0 };
  // TODO: Implement atr — volatility expansion detection
  return { value: null, signal: null, score: 0 };
}
