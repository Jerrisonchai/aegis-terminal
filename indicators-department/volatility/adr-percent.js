// indicators-department/volatility/adr-percent.js
// ADR % Used — shows what % of Average Daily Range has been consumed
// Helps set profit targets. >80% = extended, likely reversal zone.
// Source: YouTube research

/**
 * ADR % Used indicator
 * @param {Array} candles - OHLCV array
 * @param {number} period - ADR calculation period (default 14)
 * @returns {object} { adr, rangeToday, percentUsed, extended, score }
 */
export function adrPercent(candles, period = 14) {
  if (candles.length < period + 1) return { adr: null, rangeToday: 0, percentUsed: 0, extended: false, signal: null, score: 0 };

  // Calculate ADR from previous N sessions
  let totalRange = 0;
  let count = 0;

  // Use daily candles concept — if we have intraday data, this approximates
  // the range of each day's worth of data
  for (let i = candles.length - period - 1; i < candles.length - 1; i++) {
    const c = candles[i];
    totalRange += Math.abs(c.high - c.low);
    count++;
  }

  const adr = count > 0 ? totalRange / count : 0;
  const last = candles[candles.length - 1];
  const rangeToday = Math.abs(last.high - last.low);
  const percentUsed = adr > 0 ? (rangeToday / adr) * 100 : 0;

  const extended = percentUsed > 80;
  let signal = null;
  let score = 0;

  if (percentUsed < 40) {
    // Still room to move — good for entries
    signal = 'BUY';
    score = 4;
  } else if (percentUsed > 90) {
    // Extended — likely reversal or consolidation
    signal = 'SELL';
    score = 2;
  } else if (percentUsed > 80) {
    signal = 'HOLD';
    score = 1;
  } else {
    signal = 'HOLD';
    score = 0;
  }

  return {
    adr: Math.round(adr * 10000) / 10000,
    rangeToday: Math.round(rangeToday * 10000) / 10000,
    percentUsed: Math.round(percentUsed * 10) / 10,
    extended,
    signal,
    score,
  };
}
