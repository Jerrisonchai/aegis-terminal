// shared/config.js — Config loader from .env + defaults
// Usage: import { config } from '../shared/config.js';

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadDotEnv() {
  try {
    const envPath = resolve(__dirname, '..', '.env');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env file not found — use system env vars or defaults
  }
}

loadDotEnv();

export const config = {
  // Yahoo
  yahooBaseUrl: process.env.YAHOO_BASE_URL || 'https://query1.finance.yahoo.com/v8/finance/chart',
  stooqBaseUrl: process.env.STOOQ_BASE_URL || 'https://stooq.com/q',
  cacheTtl: parseInt(process.env.DATA_CACHE_TTL_SECONDS || '300'),

  // Scan defaults
  defaultScanInterval: process.env.DEFAULT_SCAN_INTERVAL || '15m',
  thresholdBuy: parseFloat(process.env.COMPOSITE_THRESHOLD_BUY || '50'),
  thresholdWatch: parseFloat(process.env.COMPOSITE_THRESHOLD_WATCH || '35'),
  thresholdWeak: parseFloat(process.env.COMPOSITE_THRESHOLD_WEAK || '20'),

  // Telegram
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
  telegramChatId: process.env.TELEGRAM_CHAT_ID || '',

  // Moomoo
  moomooHost: process.env.MOOMOO_HOST || '127.0.0.1',
  moomooPort: parseInt(process.env.MOOMOO_PORT || '11111'),
  moomooTradeEnv: process.env.MOOMOO_TRADE_ENV || 'SIMULATE',

  // Dashboard
  dashboardPort: parseInt(process.env.DASHBOARD_PORT || '3100'),
  dashboardHost: process.env.DASHBOARD_HOST || 'localhost',
};
