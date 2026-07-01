// indicators-department/momentum/rsi.js
// RSI (Relative Strength Index) — ported from v2.1
// Usage: import { rsi } from '../momentum/rsi.js';

function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return [];

  const gains = [];
  const losses = [];

  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }

  let avgGain = gains.reduce((s, v) => s + v, 0) / period;
  let avgLoss = losses.reduce((s, v) => s + v, 0) / period;

  const rsiValues = [];
  rsiValues.push(avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss)));

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rsiValues.push(avgLoss === 0 ? 100 : 100 - (100 / (1 + avgGain / avgLoss)));
  }

  return rsiValues;
}

/**
 * RSI indicator
 * @param {Array} candles - OHLCV array
 * @param {number} period - RSI period (default 14)
 * @param {number} oversold - oversold threshold (default 30)
 * @param {number} overbought - overbought threshold (default 70)
 * @returns {object} { value, zone, signal, score }
 */
export function rsi(candles, period = 14, oversold = 30, overbought = 70) {
  if (candles.length < period + 1) return { value: null, zone: null, signal: null, score: 0 };

  const closes = candles.map(c => c.close);
  const rsiValues = calcRSI(closes, period);
  const lastRSI = rsiValues[rsiValues.length - 1];

  let zone, signal, score;

  if (lastRSI < oversold) {
    zone = 'oversold';
    signal = 'BUY';
    score = 7;
  } else if (lastRSI > overbought) {
    zone = 'overbought';
    signal = 'SELL';
    score = 0;
  } else if (lastRSI < 50) {
    zone = 'bearish-bias';
    signal = 'HOLD';
    score = 3;
  } else {
    zone = 'bullish-bias';
    signal = 'HOLD';
    score = 5;
  }

  return {
    value: Math.round(lastRSI * 100) / 100,
    zone,
    signal,
    score,
  };
}
