// my-scan-department/my-scanner.js — Malaysia market scanner
// Usage: node my-scan-department/my-scanner.js

import { getTickerSymbols } from '../tickers-department/filter.js';
import { fetchBatch } from '../data-department/fetcher.js';
import { normalize, enrich } from '../data-department/normalizer.js';
import { sourceHealth } from '../data-department/health.js';
import { emaColor } from '../indicators-department/trend/ema-color.js';
import { rsi } from '../indicators-department/momentum/rsi.js';
import { momentumRatio } from '../indicators-department/momentum/momentum-ratio.js';
import { engulfingVolume } from '../indicators-department/volume/engulfing-volume.js';
import { adrPercent } from '../indicators-department/volatility/adr-percent.js';
import { logger } from '../shared/logger.js';
import { config } from '../shared/config.js';
import { isMarketOpen, formatSignalTime } from '../shared/dates.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = join(__dirname, 'results');
if (!existsSync(RESULTS_DIR)) mkdirSync(RESULTS_DIR, { recursive: true });

const TIERS = {
  BUY:   { min: config.thresholdBuy,   label: 'BUY',   color: '#22C55E' },
  WATCH: { min: config.thresholdWatch, label: 'WATCH', color: '#EAB308' },
  WEAK:  { min: config.thresholdWeak,  label: 'WEAK',  color: '#F97316' },
  AVOID: { min: 0,                     label: 'AVOID', color: '#EF4444' },
};

function assignTier(composite) {
  for (const [key, tier] of Object.entries(TIERS)) {
    if (composite >= tier.min) return { key, ...tier };
  }
  return { key: 'AVOID', ...TIERS.AVOID };
}

/**
 * Scan a single ticker with all indicators
 */
function scanTicker(ticker, candles) {
  const enriched = enrich(candles);
  const results = {};

  // Apply each indicator
  results.emaColor = emaColor(enriched, 20);
  results.rsi = rsi(enriched, 14, 30, 70);
  results.momentumRatio = momentumRatio(enriched, 10);
  results.engulfing = engulfingVolume(enriched, 5);
  results.adrPercent = adrPercent(enriched, 14);

  // Calculate composite score (weighted average of all indicator scores)
  const weights = {
    emaColor: 2, rsi: 2, momentumRatio: 1.5, engulfing: 1.5, adrPercent: 1
  };
  let totalScore = 0, totalWeight = 0;

  for (const [key, result] of Object.entries(results)) {
    if (result.score !== undefined && result.score !== null) {
      totalScore += result.score * (weights[key] || 1);
      totalWeight += (weights[key] || 1);
    }
  }

  const composite = totalWeight > 0 ? Math.round((totalScore / (totalWeight * 10)) * 100) : 0;
  const tier = assignTier(composite);
  const lastCandle = enriched[enriched.length - 1];

  return {
    ticker,
    close: lastCandle.close,
    composite,
    tier: tier.label,
    tierColor: tier.color,
    signals: Object.entries(results)
      .filter(([, r]) => r.signal === 'BUY')
      .map(([key]) => key),
    details: results,
    timestamp: formatSignalTime(),
  };
}

/**
 * Run full MY scan
 */
export async function runMyScan(options = {}) {
  logger.info('Starting MY scan...');

  // 1. Get tickers
  const symbols = getTickerSymbols({ market: 'MY' });
  logger.info(`Loaded ${symbols.length} MY tickers`);

  // 2. Fetch data
  const { results: fetched, failed } = await fetchBatch(symbols, {
    range: options.range || '5d',
    interval: options.interval || '15m',
    concurrency: 3,
  });

  for (const f of failed) sourceHealth.recordFailure('yahoo');
  logger.info(`Fetched: ${fetched.length} OK, ${failed.length} failed`);

  // 3. Scan each ticker
  const scanResults = [];
  for (const { ticker, candles } of fetched) {
    try {
      const normalized = normalize(candles, { minDataPoints: 20 });
      if (normalized.length < 20) continue;
      const result = scanTicker(ticker, normalized);
      scanResults.push(result);
    } catch (err) {
      logger.warn(`${ticker}: scan error — ${err.message}`);
    }
  }

  // 4. Sort by composite (descending)
  scanResults.sort((a, b) => b.composite - a.composite);

  // 5. Save results
  const today = new Date().toISOString().slice(0, 10);
  const outputPath = join(RESULTS_DIR, `my-scan-${today}.json`);
  writeFileSync(outputPath, JSON.stringify(scanResults, null, 2));
  logger.info(`Saved ${scanResults.length} results to ${outputPath}`);

  // 6. Summary
  const buys = scanResults.filter(r => r.tier === 'BUY');
  const watches = scanResults.filter(r => r.tier === 'WATCH');
  logger.info(`Done: ${buys.length} BUY, ${watches.length} WATCH, ${scanResults.length} total`);

  return {
    market: 'MY',
    timestamp: formatSignalTime(),
    total: scanResults.length,
    buys: buys.map(r => ({ ticker: r.ticker, composite: r.composite, close: r.close, signals: r.signals })),
    watches: watches.map(r => ({ ticker: r.ticker, composite: r.composite, close: r.close, signals: r.signals })),
    all: scanResults,
    health: sourceHealth.getStatus(),
  };
}

// CLI
if (process.argv[1]?.includes('my-scanner.js')) {
  runMyScan().then(r => {
    console.log(`\nMY Scan Complete:`);
    console.log(`  BUY: ${r.buys.length}`);
    console.log(`  WATCH: ${r.watches.length}`);
    console.log(`\nTop BUY signals:`);
    for (const b of r.buys.slice(0, 5)) {
      console.log(`  ${b.ticker} — ${b.composite}% — ${b.signals.join(', ')}`);
    }
  }).catch(err => {
    logger.error('MY scan failed', err);
    process.exit(1);
  });
}
