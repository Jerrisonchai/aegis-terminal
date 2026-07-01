// tickers-department/sync.js — Keep ticker lists clean and current
// Usage: node tickers-department/sync.js

import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { fetchCandles } from '../data-department/fetcher.js';
import { logger } from '../shared/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Verify all tickers still have valid data.
 * Marks tickers as inactive if they fail to return data.
 */
export async function verifyTickers(market = 'ALL') {
  const files = market === 'MY'
    ? ['my-tickers.json']
    : market === 'US'
      ? ['us-tickers.json']
      : ['my-tickers.json', 'us-tickers.json'];

  let changed = false;

  for (const file of files) {
    const path = join(__dirname, file);
    const tickers = JSON.parse(readFileSync(path, 'utf-8'));

    for (let i = 0; i < tickers.length; i++) {
      const t = tickers[i];
      if (!t.active) continue;

      try {
        const { source } = await fetchCandles(t.symbol, { range: '1d', interval: '1d' });
        logger.debug(`${t.symbol}: OK via ${source}`);
      } catch (err) {
        logger.warn(`${t.symbol}: DATA FAILED — marking inactive. ${err.message}`);
        tickers[i].active = false;
        changed = true;
      }

      // Rate limit
      await new Promise(r => setTimeout(r, 200));
    }

    if (changed) {
      writeFileSync(path, JSON.stringify(tickers, null, 2));
      logger.info(`Updated ${file} — some tickers marked inactive`);
    }
  }
}

/**
 * Add a new ticker to the registry
 */
export function addTicker(market, ticker) {
  const file = join(__dirname, market === 'MY' ? 'my-tickers.json' : 'us-tickers.json');
  const tickers = JSON.parse(readFileSync(file, 'utf-8'));

  if (tickers.find(t => t.symbol === ticker.symbol)) {
    logger.warn(`${ticker.symbol} already exists`);
    return false;
  }

  tickers.push(ticker);
  writeFileSync(file, JSON.stringify(tickers, null, 2));
  logger.info(`Added ${ticker.symbol} to ${market} tickers`);
  return true;
}

// CLI: node tickers-department/sync.js [my|us|all]
if (process.argv[1]?.includes('sync.js')) {
  const market = process.argv[2] || 'ALL';
  logger.info(`Verifying ${market} tickers...`);
  verifyTickers(market.toUpperCase()).then(() => {
    logger.info('Ticker verification complete');
  });
}
