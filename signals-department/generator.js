// signals-department/generator.js — Signal generation & distribution
// Usage: import { generateSignals, sendTelegramAlert } from '../signals-department/generator.js';

import { logger } from '../shared/logger.js';
import { config } from '../shared/config.js';
import { formatSignalTime } from '../shared/dates.js';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HISTORY_DIR = join(__dirname, 'history');
if (!existsSync(HISTORY_DIR)) mkdirSync(HISTORY_DIR, { recursive: true });

/**
 * Generate formatted signals from scan results
 */
export function generateSignals(scanResult) {
  const { market, timestamp, buys, watches, all } = scanResult;

  const signals = [];
  for (const r of all) {
    signals.push({
      id: `sig-${market}-${r.ticker}-${Date.now()}`,
      ticker: r.ticker,
      market,
      composite: r.composite,
      tier: r.tier,
      tierColor: r.tierColor,
      close: r.close,
      indicators: r.signals,
      timestamp,
    });
  }

  // Save to history
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(join(HISTORY_DIR, `signals-${market}-${today}.json`), JSON.stringify(signals, null, 2));

  return {
    market,
    timestamp,
    total: signals.length,
    buyCount: buys.length,
    watchCount: watches.length,
    topBuys: buys.slice(0, 5),
    signals,
  };
}

/**
 * Format a Telegram-ready message
 */
export function formatTelegramMessage(signalReport) {
  const { market, timestamp, total, buyCount, watchCount, topBuys } = signalReport;

  const tierEmoji = { BUY: '🟢', WATCH: '🟡', WEAK: '🟠', AVOID: '🔴' };

  let msg = `📡 *AEGIS Scan — ${market}*\n`;
  msg += `⏰ ${timestamp}\n\n`;
  msg += `📊 Total: ${total} | 🟢 Buy: ${buyCount} | 🟡 Watch: ${watchCount}\n\n`;

  if (topBuys.length > 0) {
    msg += `*Top BUY Signals:*\n`;
    for (const b of topBuys) {
      msg += `🟢 *${b.ticker}* — ${b.composite}% @ $${b.close}\n`;
      msg += `   └ ${b.signals.slice(0, 3).join(', ')}\n`;
    }
  }

  if (buyCount === 0 && watchCount === 0) {
    msg += `📭 No signals today.\n`;
  }

  msg += `\n_🤖 AEGIS v3.0_`;
  return msg;
}

/**
 * Send Telegram alert (if configured)
 */
export async function sendTelegramAlert(signalReport) {
  if (!config.telegramBotToken || !config.telegramChatId) {
    logger.warn('Telegram not configured — skipping alert');
    return false;
  }

  const message = formatTelegramMessage(signalReport);
  const url = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.telegramChatId,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });
    const data = await res.json();
    if (data.ok) {
      logger.info('Telegram alert sent');
      return true;
    }
    logger.warn(`Telegram error: ${data.description}`);
    return false;
  } catch (err) {
    logger.error('Telegram send failed', err.message);
    return false;
  }
}
