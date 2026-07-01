// tickers-department/filter.js — Ticker filtering engine
// Usage: import { filterTickers } from '../tickers-department/filter.js';

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let _myCache = null;
let _usCache = null;

function loadJson(file) {
  return JSON.parse(readFileSync(join(__dirname, file), 'utf-8'));
}

function getMyTickers() {
  if (!_myCache) _myCache = loadJson('my-tickers.json');
  return _myCache;
}

function getUsTickers() {
  if (!_usCache) _usCache = loadJson('us-tickers.json');
  return _usCache;
}

/**
 * Filter tickers by criteria
 * @param {object} criteria
 *   market: 'MY' | 'US' | 'ALL'
 *   sector: string or array of sector names
 *   tags: string or array of tag names
 *   activeOnly: boolean (default true)
 *   search: string — partial match on symbol or name
 * @returns {Array} filtered ticker objects
 */
export function filterTickers(criteria = {}) {
  let tickers = [];

  if (criteria.market === 'MY') tickers = getMyTickers();
  else if (criteria.market === 'US') tickers = getUsTickers();
  else tickers = [...getMyTickers(), ...getUsTickers()];

  // Active filter
  if (criteria.activeOnly !== false) {
    tickers = tickers.filter(t => t.active);
  }

  // Sector filter
  if (criteria.sector) {
    const sectors = Array.isArray(criteria.sector) ? criteria.sector : [criteria.sector];
    tickers = tickers.filter(t => sectors.some(s => s.toLowerCase() === t.sector.toLowerCase()));
  }

  // Tag filter
  if (criteria.tags) {
    const tags = Array.isArray(criteria.tags) ? criteria.tags : [criteria.tags];
    tickers = tickers.filter(t => tags.some(tag => t.tags.includes(tag)));
  }

  // Search filter
  if (criteria.search) {
    const q = criteria.search.toLowerCase();
    tickers = tickers.filter(t =>
      t.symbol.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q)
    );
  }

  return tickers;
}

/**
 * Get just the symbol strings (for scan input)
 */
export function getTickerSymbols(criteria = {}) {
  return filterTickers(criteria).map(t => t.symbol);
}

/**
 * Get ticker by exact symbol
 */
export function getTicker(symbol) {
  const all = [...getMyTickers(), ...getUsTickers()];
  return all.find(t => t.symbol.toUpperCase() === symbol.toUpperCase()) || null;
}

/**
 * Get unique sectors for a market
 */
export function getSectors(market = 'ALL') {
  const tickers = filterTickers({ market, activeOnly: false });
  return [...new Set(tickers.map(t => t.sector))].sort();
}

/**
 * Get all tags for a market
 */
export function getTags(market = 'ALL') {
  const tickers = filterTickers({ market, activeOnly: false });
  const tagSet = new Set();
  tickers.forEach(t => t.tags.forEach(tag => tagSet.add(tag)));
  return [...tagSet].sort();
}
