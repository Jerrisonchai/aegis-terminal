// indicators-department/volume/engulfing-volume.js
// High-Volume Engulfing Detector
// Bullish engulfing candle with volume > 5-bar average = strong reversal signal
// Source: YouTube research

/**
 * Detect high-volume bullish engulfing pattern
 * @param {Array} candles - OHLCV array
 * @param {number} volLookback - volume average period (default 5)
 * @returns {object} { detected, signal, ratio, score }
 */
export function engulfingVolume(candles, volLookback = 5) {
  if (candles.length < volLookback + 1) return { detected: false, signal: null, score: 0 };

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];

  // Average volume of previous N candles (excluding current)
  const prevVols = candles.slice(-volLookback - 1, -1).map(c => c.volume);
  const avgVol = prevVols.reduce((s, v) => s + v, 0) / prevVols.length;

  // Bullish engulfing: prev bearish, current bullish, current body > prev body, current engulfs
  const prevBearish = prev.close < prev.open;
  const currBullish = last.close > last.open;
  const bodyPrev = Math.abs(prev.close - prev.open);
  const bodyCurr = Math.abs(last.close - last.open);
  const engulfs = last.open < prev.close && last.close > prev.open;
  const highVolume = last.volume > avgVol * 1.5;

  const detected = prevBearish && currBullish && engulfs && highVolume;

  let signal = null;
  let score = 0;

  if (detected) {
    signal = 'BUY';
    const volumeRatio = last.volume / avgVol;
    score = Math.min(10, 5 + Math.round(volumeRatio)); // higher volume = higher score
  }

  return {
    detected,
    signal,
    volumeRatio: avgVol > 0 ? Math.round((last.volume / avgVol) * 10) / 10 : 0,
    score,
  };
}

/**
 * Bearish engulfing (for sell signals)
 */
export function engulfingVolumeBearish(candles, volLookback = 5) {
  if (candles.length < volLookback + 1) return { detected: false, signal: null, score: 0 };

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];

  const prevVols = candles.slice(-volLookback - 1, -1).map(c => c.volume);
  const avgVol = prevVols.reduce((s, v) => s + v, 0) / prevVols.length;

  const prevBullish = prev.close > prev.open;
  const currBearish = last.close < last.open;
  const bodyPrev = Math.abs(prev.close - prev.open);
  const bodyCurr = Math.abs(last.close - last.open);
  const engulfs = last.open > prev.close && last.close < prev.open;
  const highVolume = last.volume > avgVol * 1.5;

  const detected = prevBullish && currBearish && engulfs && highVolume;

  return {
    detected,
    signal: detected ? 'SELL' : null,
    volumeRatio: avgVol > 0 ? Math.round((last.volume / avgVol) * 10) / 10 : 0,
    score: detected ? 7 : 0,
  };
}
