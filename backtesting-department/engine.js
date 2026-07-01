// backtesting-department/engine.js — Unified backtest engine
// Usage: node backtesting-department/engine.js [my|us]
// Replaces broken v2.1 backtester (was producing 0% returns)

import { getTickerSymbols } from '../tickers-department/filter.js';
import { fetchCandles } from '../data-department/fetcher.js';
import { normalize, enrich } from '../data-department/normalizer.js';
import { logger } from '../shared/logger.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = join(__dirname, 'results');
if (!existsSync(RESULTS_DIR)) mkdirSync(RESULTS_DIR, { recursive: true });

/**
 * Simple strategy: Buy when momentum ratio > 0.65, sell when < 0.35
 * Uses single-instrument backtest with position tracking
 */
function meanReversionStrategy(candles) {
  const enriched = enrich(candles);
  const trades = [];
  let position = null;
  let capital = 10000;
  const equityCurve = [{ time: enriched[0].timestamp, value: capital }];

  for (let i = 10; i < enriched.length; i++) {
    const window = enriched.slice(0, i + 1);

    // Simple momentum calculation
    let bullBody = 0, bearBody = 0;
    for (let j = Math.max(0, i - 10); j <= i; j++) {
      if (enriched[j].isBullish) bullBody += enriched[j].body;
      else bearBody += Math.abs(enriched[j].body);
    }

    const total = bullBody + bearBody;
    const ratio = total > 0 ? bullBody / total : 0.5;

    const price = enriched[i].close;

    if (!position) {
      // Entry: strong bullish momentum
      if (ratio > 0.65) {
        const qty = Math.floor(capital * 0.01 / price); // 1% risk
        if (qty > 0) {
          position = { entry: price, qty, entryTime: enriched[i].timestamp };
        }
      }
    } else {
      // Exit: bearish flip or trailing stop
      const pnlPct = (price - position.entry) / position.entry;
      if (ratio < 0.35 || pnlPct < -0.02 || pnlPct > 0.04) {
        const pnl = (price - position.entry) * position.qty;
        capital += pnl;
        trades.push({
          entry: position.entry,
          exit: price,
          pnl,
          pnlPct: Math.round(pnlPct * 10000) / 100,
          holdingBars: i - enriched.indexOf(enriched.find(c => c.timestamp === position.entryTime)),
          win: pnl > 0,
        });
        position = null;
      }
    }

    if (i % 5 === 0) {
      equityCurve.push({ time: enriched[i].timestamp, value: capital + (position ? (price - position.entry) * position.qty : 0) });
    }
  }

  return { trades, equityCurve, finalCapital: capital };
}

/**
 * Run backtest for a ticker
 */
async function backtestTicker(ticker) {
  try {
    const { candles } = await fetchCandles(ticker, { range: '1mo', interval: '1d' });
    const normalized = normalize(candles, { minDataPoints: 30 });
    if (normalized.length < 30) return { ticker, error: 'Not enough data', trades: 0 };

    const { trades, equityCurve, finalCapital } = meanReversionStrategy(normalized);

    const wins = trades.filter(t => t.win).length;
    const winRate = trades.length > 0 ? Math.round((wins / trades.length) * 100) : 0;
    const totalPnl = trades.reduce((s, t) => s + t.pnl, 0);
    const avgReturn = trades.length > 0 ? Math.round((totalPnl / trades.length / 10000) * 10000) / 100 : 0;

    return {
      ticker,
      trades: trades.length,
      wins,
      winRate,
      totalPnl: Math.round(totalPnl * 100) / 100,
      avgReturn,
      finalCapital: Math.round(finalCapital * 100) / 100,
    };
  } catch (err) {
    return { ticker, error: err.message, trades: 0 };
  }
}

/**
 * Run backtest for all tickers in a market
 */
export async function runBacktest(market = 'US', options = {}) {
  const symbols = getTickerSymbols({ market });
  logger.info(`Backtesting ${symbols.length} ${market} tickers...`);

  const results = [];
  for (let i = 0; i < symbols.length; i++) {
    const ticker = symbols[i];
    if (i % 5 === 0) logger.info(`[${i + 1}/${symbols.length}] ${ticker}...`);
    const result = await backtestTicker(ticker);
    results.push(result);
    await new Promise(r => setTimeout(r, 200)); // rate limit
  }

  const valid = results.filter(r => !r.error);
  const errors = results.filter(r => r.error);

  // Summary
  let totalTrades = 0, totalWins = 0;
  for (const r of valid) { totalTrades += r.trades; totalWins += r.wins; }

  const summary = {
    market,
    timestamp: new Date().toISOString(),
    tickers: valid.length,
    errors: errors.map(e => e.ticker),
    totalTrades,
    overallWinRate: totalTrades > 0 ? Math.round((totalWins / totalTrades) * 100) : 0,
    results: valid.sort((a, b) => b.trades - a.trades),
  };

  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(join(RESULTS_DIR, `backtest-${market}-${today}.json`), JSON.stringify(summary, null, 2));
  logger.info(`Backtest done: ${totalTrades} trades, ${summary.overallWinRate}% win rate`);
  return summary;
}

// CLI
if (process.argv[1]?.includes('engine.js')) {
  const market = (process.argv[2] || 'US').toUpperCase();
  runBacktest(market).then(s => {
    console.log(`\nBacktest ${s.market}:
  Tickers: ${s.tickers}
  Total Trades: ${s.totalTrades}
  Win Rate: ${s.overallWinRate}%
  Errors: ${s.errors.length}
  ${s.errors.length > 0 ? '  Failed: ' + s.errors.join(', ') : ''}`);
  }).catch(err => {
    logger.error('Backtest failed', err);
    process.exit(1);
  });
}
