// moomoo-department/paper-trader.js — Moomoo OpenD paper trading
// ⚠️ SECURITY: Paper-only (SIMULATE). Live trading requires manual unlock in OpenD GUI.
// Usage: import { connectOpend, placeTrade, getPositions } from '../moomoo-department/paper-trader.js';

import { logger } from '../shared/logger.js';
import { config } from '../shared/config.js';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JOURNAL_DIR = join(__dirname, 'journal');
const POSITIONS_FILE = join(__dirname, 'positions.json');
if (!existsSync(JOURNAL_DIR)) mkdirSync(JOURNAL_DIR, { recursive: true });

// Risk limits
const MAX_RISK_PER_TRADE = 0.01;   // 1% of capital
const MIN_RISK_REWARD = 2.0;        // 2:1 minimum
const TRADE_ENV = 'SIMULATE';       // ALWAYS paper — NEVER change to REAL via code

/**
 * Placeholder for OpenD connection.
 * Real implementation uses @anthropic/opend or direct TCP socket to OpenD daemon.
 * OpenD runs on localhost:11111 by default.
 */
export async function connectOpend() {
  logger.info(`Connecting to OpenD at ${config.moomooHost}:${config.moomooPort}...`);

  // TODO: Replace with actual OpenD SDK connection
  // const { OpenD } = await import('@anthropic/opend');
  // const client = new OpenD({ host: config.moomooHost, port: config.moomooPort });

  logger.info(`OpenD connected — ENV: ${TRADE_ENV} (PAPER ONLY)`);
  return {
    connected: true,
    env: TRADE_ENV,
    host: config.moomooHost,
    port: config.moomooPort,
  };
}

/**
 * Calculate position size based on 1% risk rule
 * @param {number} capital - Total account capital
 * @param {number} entryPrice - Entry price per share
 * @param {number} stopLoss - Stop loss price
 * @returns {number} quantity to buy
 */
function calculatePosition(capital, entryPrice, stopLoss) {
  const riskAmount = capital * MAX_RISK_PER_TRADE;
  const riskPerShare = Math.abs(entryPrice - stopLoss);
  if (riskPerShare <= 0) return 0;
  return Math.floor(riskAmount / riskPerShare);
}

/**
 * Place a paper trade
 * @param {string} ticker - Stock symbol
 * @param {string} side - 'BUY' or 'SELL'
 * @param {number} price - Limit price
 * @param {number} capital - Account capital for position sizing
 * @returns {object} trade confirmation
 */
export async function placeTrade(ticker, side, price, capital = 100) {
  if (TRADE_ENV !== 'SIMULATE') {
    logger.warn(`⚠️ ATTEMPTED ${TRADE_ENV} TRADE — blocking`);
    return { executed: false, reason: 'Live trading blocked by AEGIS security. Use OpenD GUI to unlock.' };
  }

  // Position sizing with risk management
  const stopLoss = side === 'BUY' ? price * 0.98 : price * 1.02; // 2% stop
  const takeProfit = side === 'BUY' ? price * 1.04 : price * 0.96; // 4% target (2:1 R:R)
  const qty = calculatePosition(capital, price, stopLoss);

  if (qty <= 0) {
    return { executed: false, reason: 'Position size too small for capital' };
  }

  // TODO: Actually place trade via OpenD
  // const order = await client.placeOrder({ symbol: ticker, side, qty, price, env: TRADE_ENV });

  const trade = {
    id: `trade-${Date.now()}`,
    ticker,
    side,
    qty,
    entryPrice: price,
    stopLoss: Math.round(stopLoss * 100) / 100,
    takeProfit: Math.round(takeProfit * 100) / 100,
    riskAmount: Math.round((capital * MAX_RISK_PER_TRADE) * 100) / 100,
    riskReward: 2.0,
    env: TRADE_ENV,
    timestamp: new Date().toISOString(),
    status: 'PENDING', // PENDING → FILLED → CLOSED
  };

  // Save to journal
  const journalFile = join(JOURNAL_DIR, `trade-${trade.id}.json`);
  writeFileSync(journalFile, JSON.stringify(trade, null, 2));

  // Update positions
  savePosition(trade);

  logger.info(`Paper trade placed: ${side} ${qty} ${ticker} @ $${price} (stop: $${trade.stopLoss}, target: $${trade.takeProfit})`);
  return { executed: true, trade };
}

/**
 * Get current positions
 */
export function getPositions() {
  if (!existsSync(POSITIONS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(POSITIONS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function savePosition(trade) {
  const positions = getPositions();
  positions.push({
    ticker: trade.ticker,
    qty: trade.qty,
    entry: trade.entryPrice,
    stopLoss: trade.stopLoss,
    takeProfit: trade.takeProfit,
    opened: trade.timestamp,
    status: 'OPEN',
  });
  writeFileSync(POSITIONS_FILE, JSON.stringify(positions, null, 2));
}

/**
 * Calculate P&L for open positions
 * @param {Array} currentPrices - [{ ticker, price }]
 */
export function calculatePnL(positions, currentPrices) {
  const priceMap = {};
  for (const p of currentPrices) priceMap[p.ticker] = p.price;

  let totalPnl = 0;
  const details = [];

  for (const pos of positions) {
    const current = priceMap[pos.ticker] || pos.entry;
    const pnl = (current - pos.entry) * pos.qty;
    const pnlPct = ((current - pos.entry) / pos.entry) * 100;
    totalPnl += pnl;

    details.push({
      ...pos,
      currentPrice: current,
      pnl: Math.round(pnl * 100) / 100,
      pnlPct: Math.round(pnlPct * 100) / 100,
    });
  }

  return { totalPnl: Math.round(totalPnl * 100) / 100, positions: details };
}

// ⚠️ NEVER export anything that unlocks live trading
export const SECURITY_NOTE = 'AEGIS v3 enforceert paper trading only. Live trading requires manual unlock_trade in OpenD GUI.';
