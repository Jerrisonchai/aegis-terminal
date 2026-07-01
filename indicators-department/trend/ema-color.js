// indicators-department/trend/ema-color.js
// Color-Coded EMA: green when price > EMA, red when price < EMA
// Usage: import { emaColor } from '../trend/ema-color.js';

// Simple EMA calculation (no external dependency)
function calcEMA(data, period) {
  const closes = data.map(d => d.close);
  const k = 2 / (period + 1);
  const result = [closes[0]];
  for (let i = 1; i < closes.length; i++) {
    result.push(closes[i] * k + result[i - 1] * (1 - k));
  }
  return result;
}

/**
 * Color-Coded EMA indicator
 * @param {Array} candles - OHLCV candle array
 * @param {number} period - EMA period (default 20)
 * @returns {object} { value, color, signal, score }
 *   color: 'green' (bullish), 'red' (bearish)
 *   signal: 'BUY' (price crossed above EMA), 'SELL' (crossed below), 'HOLD'
 *   score: 0-10 sub-score for composite
 */
export function emaColor(candles, period = 20) {
  if (candles.length < period + 1) return { value: null, color: null, signal: null, score: 0 };

  const ema = calcEMA(candles, period);
  const lastClose = candles[candles.length - 1].close;
  const prevClose = candles[candles.length - 2].close;
  const lastEMA = ema[ema.length - 1];
  const prevEMA = ema[ema.length - 2];

  const aboveEMA = lastClose > lastEMA;
  const wasAboveEMA = prevClose > prevEMA;

  let signal = 'HOLD';
  let score = 0;

  if (aboveEMA && !wasAboveEMA) {
    signal = 'BUY';
    score = 8;
  } else if (!aboveEMA && wasAboveEMA) {
    signal = 'SELL';
    score = 3;
  } else if (aboveEMA) {
    score = 6; // bullish bias
  } else {
    score = 2; // bearish bias
  }

  return {
    value: lastEMA,
    color: aboveEMA ? 'green' : 'red',
    signal,
    score,
  };
}
