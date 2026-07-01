// src/lib/mock-data.ts — Simulated data for all dashboard pages

export type Tier = 'BUY' | 'WATCH' | 'WEAK' | 'AVOID';

export interface Signal {
  id: string;
  ticker: string;
  name: string;
  market: 'MY' | 'US';
  price: number;
  change: number;
  changePct: number;
  tier: Tier;
  composite: number;
  indicators: string[];
  timestamp: string;
  sector: string;
}

export interface Position {
  ticker: string;
  name: string;
  qty: number;
  entry: number;
  current: number;
  pnl: number;
  pnlPct: number;
  market: 'MY' | 'US';
  stopLoss: number;
  takeProfit: number;
  openedAt: string;
}

export interface ScanResult {
  id: string;
  market: 'MY' | 'US';
  status: 'idle' | 'running' | 'done' | 'error';
  progress: number;
  tickersScanned: number;
  totalTickers: number;
  signalsFound: number;
  duration: number;
  timestamp: string;
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  status: 'ok' | 'warn' | 'error' | 'disabled';
  lastRun: string;
  lastDuration: number;
  nextRun: string;
  consecutiveErrors: number;
}

export interface BacktestResult {
  id: string;
  strategy: string;
  market: 'US' | 'MY';
  ticker: string;
  trades: number;
  wins: number;
  winRate: number;
  totalPnl: number;
  avgReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  timestamp: string;
}

export interface IndicatorDef {
  id: string;
  name: string;
  category: 'trend' | 'momentum' | 'volatility' | 'volume' | 'pattern';
  enabled: boolean;
  weight: number;
  buyScore: number;
  source: string;
}

// ─── Signals ────────────────────────────────────────
export const mockSignals: Signal[] = [
  { id: 'sig-001', ticker: 'AAPL', name: 'Apple Inc.', market: 'US', price: 289.36, change: 2.14, changePct: 0.74, tier: 'BUY', composite: 82.4, indicators: ['OBV Bull Div', 'Above All MA', 'Momentum Ratio 0.77'], timestamp: '2026-07-01T09:35:00', sector: 'Technology' },
  { id: 'sig-002', ticker: 'INTC', name: 'Intel Corp.', market: 'US', price: 131.72, change: -0.83, changePct: -0.63, tier: 'BUY', composite: 78.1, indicators: ['Golden Cross', 'RSI Divergence', 'BB Squeeze'], timestamp: '2026-07-01T09:32:00', sector: 'Technology' },
  { id: 'sig-003', ticker: 'TSLA', name: 'Tesla Inc.', market: 'US', price: 342.81, change: 5.67, changePct: 1.68, tier: 'WATCH', composite: 62.3, indicators: ['EMA-Color green', 'Breakout 20d', 'ADR% 45%'], timestamp: '2026-07-01T09:36:00', sector: 'Automotive' },
  { id: 'sig-004', ticker: 'NVDA', name: 'NVIDIA Corp.', market: 'US', price: 847.52, change: -12.30, changePct: -1.43, tier: 'WATCH', composite: 58.7, indicators: ['Momentum Ratio 0.55', 'VWAP bearish'], timestamp: '2026-07-01T09:33:00', sector: 'Technology' },
  { id: 'sig-005', ticker: 'UNH', name: 'UnitedHealth', market: 'US', price: 419.82, change: 3.45, changePct: 0.83, tier: 'WEAK', composite: 41.2, indicators: ['RSI overbought', 'ADR% 82%'], timestamp: '2026-07-01T09:31:00', sector: 'Healthcare' },
  { id: 'sig-006', ticker: '1155.KL', name: 'MAYBANK', market: 'MY', price: 10.74, change: 0.12, changePct: 1.13, tier: 'BUY', composite: 76.8, indicators: ['SMA Cross', 'OBV rising', 'EMA-Color green'], timestamp: '2026-07-01T09:15:00', sector: 'Finance' },
  { id: 'sig-007', ticker: '1295.KL', name: 'PBBANK', market: 'MY', price: 4.68, change: -0.04, changePct: -0.85, tier: 'BUY', composite: 71.2, indicators: ['BB Low touch', 'RSI oversold', 'Bullish engulfing'], timestamp: '2026-07-01T09:18:00', sector: 'Finance' },
  { id: 'sig-008', ticker: '5347.KL', name: 'TENAGA', market: 'MY', price: 14.20, change: 0.28, changePct: 2.01, tier: 'WATCH', composite: 55.3, indicators: ['Breakout 20d', 'ATR expansion'], timestamp: '2026-07-01T09:20:00', sector: 'Utilities' },
  { id: 'sig-009', ticker: '7277.KL', name: 'DIALOG', market: 'MY', price: 2.35, change: 0.05, changePct: 2.17, tier: 'WATCH', composite: 53.9, indicators: ['Golden Cross', 'Momentum 0.68'], timestamp: '2026-07-01T09:16:00', sector: 'Energy' },
  { id: 'sig-010', ticker: '6012.KL', name: 'MAXIS', market: 'MY', price: 3.82, change: -0.01, changePct: -0.26, tier: 'WEAK', composite: 38.5, indicators: ['RSI flat', 'Volume low'], timestamp: '2026-07-01T09:19:00', sector: 'Telecom' },
  { id: 'sig-011', ticker: 'GOOGL', name: 'Alphabet Inc.', market: 'US', price: 185.34, change: -1.22, changePct: -0.65, tier: 'AVOID', composite: 18.9, indicators: ['RSI overbought 78', 'Momentum fading'], timestamp: '2026-07-01T09:34:00', sector: 'Technology' },
  { id: 'sig-012', ticker: '5225.KL', name: 'IHH', market: 'MY', price: 7.15, change: 0.18, changePct: 2.58, tier: 'BUY', composite: 74.5, indicators: ['EMA-Color green', 'OBV Bull Div', 'Engulfing volume 6x'], timestamp: '2026-07-01T09:17:00', sector: 'Healthcare' },
];

// ─── Positions ──────────────────────────────────────
export const mockPositions: Position[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', qty: 4, entry: 287.22, current: 289.36, pnl: 8.56, pnlPct: 0.75, market: 'US', stopLoss: 281.48, takeProfit: 298.70, openedAt: '2026-07-01T09:35:00' },
  { ticker: '1155.KL', name: 'MAYBANK', qty: 100, entry: 10.62, current: 10.74, pnl: 12.00, pnlPct: 1.13, market: 'MY', stopLoss: 10.41, takeProfit: 11.05, openedAt: '2026-07-01T09:15:00' },
  { ticker: 'INTC', name: 'Intel Corp.', qty: 8, entry: 132.55, current: 131.72, pnl: -6.64, pnlPct: -0.63, market: 'US', stopLoss: 129.90, takeProfit: 137.86, openedAt: '2026-07-01T09:32:00' },
];

// ─── Scans ──────────────────────────────────────────
export const mockScans: ScanResult[] = [
  { id: 'scan-001', market: 'MY', status: 'done', progress: 100, tickersScanned: 51, totalTickers: 51, signalsFound: 7, duration: 48, timestamp: '2026-07-01T09:14:00' },
  { id: 'scan-002', market: 'US', status: 'done', progress: 100, tickersScanned: 28, totalTickers: 28, signalsFound: 5, duration: 32, timestamp: '2026-07-01T09:30:00' },
];

// ─── Cron Jobs ──────────────────────────────────────
export const mockCronJobs: CronJob[] = [
  { id: 'cron-personal-growth', name: 'Personal Growth', schedule: 'Daily midnight', status: 'ok', lastRun: '2026-07-01T00:00:00', lastDuration: 45, nextRun: '2026-07-02T00:00:00', consecutiveErrors: 0 },
  { id: 'cron-system-evolution', name: 'System Evolution', schedule: 'Daily 2AM', status: 'ok', lastRun: '2026-07-01T02:00:00', lastDuration: 120, nextRun: '2026-07-02T02:00:00', consecutiveErrors: 0 },
  { id: 'cron-morning-briefing', name: 'Morning Briefing', schedule: 'Daily 6AM', status: 'ok', lastRun: '2026-07-01T06:00:00', lastDuration: 90, nextRun: '2026-07-02T06:00:00', consecutiveErrors: 0 },
  { id: 'cron-daily-scan', name: 'Daily Trading Scan', schedule: 'Weekdays 9AM', status: 'ok', lastRun: '2026-07-01T09:00:00', lastDuration: 55, nextRun: '2026-07-02T09:00:00', consecutiveErrors: 0 },
  { id: 'cron-my-market', name: 'MY Market Data', schedule: 'Weekdays 8AM', status: 'ok', lastRun: '2026-07-01T08:00:00', lastDuration: 35, nextRun: '2026-07-02T08:00:00', consecutiveErrors: 0 },
  { id: 'cron-us-market', name: 'US Market Data', schedule: 'Weekdays 7PM', status: 'warn', lastRun: '2026-06-30T19:00:00', lastDuration: 580, nextRun: '2026-07-01T19:00:00', consecutiveErrors: 1 },
  { id: 'cron-us-preopen', name: 'US Pre-Open', schedule: 'Weekdays 9AM ET', status: 'ok', lastRun: '2026-06-30T21:00:00', lastDuration: 42, nextRun: '2026-07-01T21:00:00', consecutiveErrors: 0 },
  { id: 'cron-my-scan', name: 'MY Scan', schedule: 'Weekdays 5:30PM', status: 'disabled', lastRun: '2026-06-28T17:30:00', lastDuration: 664, nextRun: '-', consecutiveErrors: 3 },
  { id: 'cron-us-scan', name: 'US Scan', schedule: 'Weekdays 8:30PM ET', status: 'ok', lastRun: '2026-07-01T08:30:00', lastDuration: 28, nextRun: '2026-07-01T20:30:00', consecutiveErrors: 0 },
  { id: 'cron-weekend-my', name: 'Weekend MY', schedule: 'Sat 10AM', status: 'ok', lastRun: '2026-06-28T10:00:00', lastDuration: 75, nextRun: '2026-07-05T10:00:00', consecutiveErrors: 0 },
  { id: 'cron-weekend-us', name: 'Weekend US', schedule: 'Sat 8AM ET', status: 'ok', lastRun: '2026-06-28T08:00:00', lastDuration: 90, nextRun: '2026-07-05T08:00:00', consecutiveErrors: 0 },
  { id: 'cron-weekly-backtest', name: 'Weekly Backtest', schedule: 'Sun 3AM', status: 'error', lastRun: '2026-06-29T03:00:00', lastDuration: 0, nextRun: '2026-07-06T03:00:00', consecutiveErrors: 2 },
];

// ─── Backtests ──────────────────────────────────────
export const mockBacktests: BacktestResult[] = [
  { id: 'bt-001', strategy: 'Mean Reversion', market: 'US', ticker: 'AAPL', trades: 24, wins: 16, winRate: 66.7, totalPnl: 142.50, avgReturn: 0.59, sharpeRatio: 1.82, maxDrawdown: -4.2, timestamp: '2026-07-01T09:00:00' },
  { id: 'bt-002', strategy: 'Mean Reversion', market: 'US', ticker: 'INTC', trades: 18, wins: 14, winRate: 77.8, totalPnl: 98.30, avgReturn: 0.41, sharpeRatio: 1.95, maxDrawdown: -3.1, timestamp: '2026-07-01T09:01:00' },
  { id: 'bt-003', strategy: 'Mean Reversion', market: 'MY', ticker: '1155.KL', trades: 31, wins: 22, winRate: 71.0, totalPnl: 56.20, avgReturn: 0.17, sharpeRatio: 2.10, maxDrawdown: -1.8, timestamp: '2026-07-01T09:02:00' },
  { id: 'bt-004', strategy: 'Mean Reversion', market: 'MY', ticker: '1295.KL', trades: 27, wins: 18, winRate: 66.7, totalPnl: 38.40, avgReturn: 0.13, sharpeRatio: 1.68, maxDrawdown: -2.5, timestamp: '2026-07-01T09:03:00' },
  { id: 'bt-005', strategy: 'MACD Cross', market: 'US', ticker: 'TSLA', trades: 15, wins: 11, winRate: 73.3, totalPnl: 210.80, avgReturn: 0.94, sharpeRatio: 1.45, maxDrawdown: -7.8, timestamp: '2026-06-30T18:00:00' },
  { id: 'bt-006', strategy: 'MACD Cross', market: 'US', ticker: 'NVDA', trades: 12, wins: 9, winRate: 75.0, totalPnl: 185.60, avgReturn: 1.03, sharpeRatio: 1.55, maxDrawdown: -5.2, timestamp: '2026-06-30T18:01:00' },
];

// ─── Indicators ─────────────────────────────────────
export const mockIndicators: IndicatorDef[] = [
  { id: 'ema-color', name: 'Color-Coded EMA', category: 'trend', enabled: true, weight: 6, buyScore: 6, source: 'v2.1 port' },
  { id: 'sma-cross', name: 'SMA Crossover', category: 'trend', enabled: true, weight: 5, buyScore: 5, source: 'v2.1 port' },
  { id: 'ema-cross', name: 'EMA Crossover', category: 'trend', enabled: false, weight: 5, buyScore: 5, source: 'v2.1 port' },
  { id: 'golden-cross', name: 'Golden Cross', category: 'trend', enabled: true, weight: 8, buyScore: 8, source: 'v2.1 port' },
  { id: 'above-all-ma', name: 'Above All MA', category: 'trend', enabled: true, weight: 7, buyScore: 7, source: 'v2.1 port' },
  { id: 'breakout-20', name: '20-Day Breakout', category: 'trend', enabled: true, weight: 8, buyScore: 8, source: 'v2.1 port' },
  { id: 'rsi', name: 'RSI', category: 'momentum', enabled: true, weight: 7, buyScore: 7, source: 'v2.1 port' },
  { id: 'stochastic', name: 'Stochastic', category: 'momentum', enabled: false, weight: 6, buyScore: 6, source: 'v2.1 port' },
  { id: 'rsi-divergence', name: 'RSI Divergence', category: 'momentum', enabled: true, weight: 7, buyScore: 7, source: 'v2.1 port' },
  { id: 'momentum-ratio', name: 'Momentum Ratio', category: 'momentum', enabled: true, weight: 6, buyScore: 6, source: 'new (YouTube)' },
  { id: 'bollinger', name: 'Bollinger Bands', category: 'volatility', enabled: true, weight: 7, buyScore: 7, source: 'v2.1 port' },
  { id: 'atr', name: 'ATR Expansion', category: 'volatility', enabled: false, weight: 5, buyScore: 5, source: 'v2.1 port' },
  { id: 'bb-squeeze', name: 'BB Squeeze', category: 'volatility', enabled: true, weight: 5, buyScore: 5, source: 'v2.1 port' },
  { id: 'adr-percent', name: 'ADR % Used', category: 'volatility', enabled: true, weight: 4, buyScore: 4, source: 'new (YouTube)' },
  { id: 'obv', name: 'On-Balance Volume', category: 'volume', enabled: true, weight: 6, buyScore: 6, source: 'v2.1 port' },
  { id: 'engulfing-volume', name: 'High-Volume Engulfing', category: 'volume', enabled: true, weight: 7, buyScore: 7, source: 'new (YouTube)' },
  { id: 'vwap', name: 'VWAP', category: 'volume', enabled: false, weight: 5, buyScore: 5, source: 'v2.1 port' },
  { id: 'pivot-points', name: 'Pivot Points', category: 'pattern', enabled: true, weight: 4, buyScore: 4, source: 'new (YouTube)' },
];

// ─── Market Status ──────────────────────────────────
export const mockMarketStatus = {
  my: { name: 'Bursa Malaysia', isOpen: true, nextEvent: 'Closes at 5:00 PM', timeLeft: '3h 35m' },
  us: { name: 'NYSE / NASDAQ', isOpen: false, nextEvent: 'Opens at 9:30 PM ET', timeLeft: '8h 15m' },
};

// ─── System Health ──────────────────────────────────
export const mockSystemHealth = {
  cpu: 34,
  memory: { used: 13.8, total: 19.4, unit: 'GB' },
  disk: { used: 346, total: 475, free: 129, unit: 'GB' },
  gateway: 'online',
  missionControl: 'online',
  ollama: 'online',
  uptime: '14d 7h 22m',
  lastSentry: '2m ago',
};
