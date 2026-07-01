// indicators-department/momentum/momentum-ratio.js
// Bull/Bear Momentum Ratio — measures candle body sizes to determine who's stronger
// Ratio > 1 = Bulls dominant. Ratio < 1 = Bears dominant.
// Source: YouTube research — "I Made My Own AI Trading Bots & Indicators"

/**
 * Bull/Bear Momentum Ratio
 * @param {Array} candles - OHLCV candle array (must have body field from normalizer.enrich)
 * @param {number} period - lookback period (default 10)
 * @returns {object} { ratio, strength, signal, score }
 */
export function momentumRatio(candles, period = 10) {
  if (candles.length < period) return { ratio: null, strength: null, signal: null, score: 0 };

  const window = candles.slice(-period);

  let bullBodies = 0;
  let bearBodies = 0;

  for (const c of window) {
    if (c.close > c.open) {
      bullBodies += (c.close - c.open);
    } else {
      bearBodies += Math.abs(c.close - c.open);
    }
  }

  const total = bullBodies + bearBodies;
  if (total === 0) return { ratio: 1, strength: 'neutral', signal: 'HOLD', score: 0 };

  const ratio = bullBodies / total; // 0-1 scale: 1 = all bulls, 0 = all bears

  let strength, signal, score;

  if (ratio > 0.65) {
    strength = 'bullish';
    signal = 'BUY';
    score = 7;
  } else if (ratio > 0.55) {
    strength = 'slightly-bullish';
    signal = 'HOLD';
    score = 4;
  } else if (ratio < 0.35) {
    strength = 'bearish';
    signal = 'SELL';
    score = 0;
  } else if (ratio < 0.45) {
    strength = 'slightly-bearish';
    signal = 'HOLD';
    score = 2;
  } else {
    strength = 'neutral';
    signal = 'HOLD';
    score = 1;
  }

  return { ratio: Math.round(ratio * 100) / 100, strength, signal, score };
}
