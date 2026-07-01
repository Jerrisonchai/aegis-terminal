# TRADING V3 — Product Requirements Document

> **Codename:** AEGIS (Automated Execution & Global Indicator System)
> **Version:** 3.0.0 | **Status:** Planning | **Owner:** Jerrison
> **Last Updated:** 2026-07-01

---

## 1. EXECUTIVE SUMMARY

### 1.1 Problem Statement
Trading v2.1.1 (Scan Outliers v2.0) is generating reliable daily signals across MY and US markets, but suffers from:
- **No dashboard** — Everything is CLI/Telegram. No visual control center.
- **Fragile cron jobs** — 6/18 disabled, 5+ timeout errors, no unified monitoring.
- **Indicator lock-in** — 13 indicators hardcoded in Node.js. No library, no versioning.
- **Broken backtesting** — Producing 0% returns. Engine needs rewrite.
- **Manual execution** — Signals generated but no trade automation pipeline.
- **No TradingView integration** — Can't leverage Pine Script ecosystem or AI-assisted indicator creation.

### 1.2 Vision
AEGIS transforms the trading hustle from a "scripts + cron" setup into a **professional trading command center**:
- **Dashboard** — One-stop control center with live data, scan triggers, P&L tracking
- **Indicator library** — Curated collection with Pine Script + Node.js dual implementations
- **AI-assisted pipeline** — TradingView Pine Script → AI converts → Node.js backtest → Deploy
- **Reliable automation** — Self-healing cron, multi-source data, graceful degradation
- **Paper-to-live path** — Full paper trading via Moomoo OpenD with approval gates for live

### 1.3 Success Metrics
| Metric | Current | Target |
|--------|---------|--------|
| Cron reliability | 67% (12/18 active) | 95% |
| Backtest accuracy | 0% (broken) | Valid output on all 28 US + 44 MY tickers |
| Scan latency (MY) | 11 min | < 3 min |
| Scan latency (US) | 2.5 min | < 1 min |
| Dashboard uptime | N/A | 99% (during market hours) |
| Indicators in library | 13 (all Node.js only) | 25+ (dual Pine Script + Node.js) |
| Trade execution | Manual only | Semi-auto (paper) with 1-click approval |

---

## 2. SYSTEM ARCHITECTURE

### 2.1 Department Map

```
trading-v3/
├── dashboard-department/    # Next.js web app — control center
├── indicators-department/   # Indicator library (Pine Script + Node.js)
├── backtesting-department/  # Unified backtest engine + results DB
├── converter-department/    # Pine Script → Node.js translator
├── my-scan-department/      # Malaysia market scanner
├── us-scan-department/      # US market scanner
├── signals-department/      # Signal generation, filtering, distribution
├── tickers-department/      # Ticker management, filtering, categorization
├── moomoo-department/       # OpenD integration, paper trading, positions
├── tradingview-department/  # TV integration, Pine Script library, chart links
├── cron-department/         # Unified cron management + monitoring
├── data-department/         # Price data, fundamentals, cache, pipeline
└── docs/                    # PRD, DESIGN, PHASES, runbooks
```

### 2.2 Data Flow

```
TradingView (Pine Script AI)  ──→  Converter Dept  ──→  Indicators Dept
                                                            │
Yahoo Direct API ──→  Data Dept (multi-source)  ──→  MY Scan + US Scan
                                                            │
                                                     Signals Dept ──→ Dashboard
                                                            │
                                                     Telegram / Email
                                                            │
Moomoo OpenD  ←──  Moomoo Dept (paper execution)  ←──  Dashboard (approve)
```

### 2.3 Department Responsibilities

| Department | Input | Output | Tech |
|-----------|-------|--------|------|
| **Dashboard** | All dept APIs | Web UI | Next.js, framer-motion, Recharts |
| **Indicators** | Trading concepts, Pine Script | Node.js indicator functions | TypeScript, technicalindicators |
| **Backtesting** | Indicators + tickers + params | Performance reports | Node.js, JSON DB |
| **Converter** | Pine Script code | Node.js equivalent | AI (DeepSeek) + manual review |
| **MY Scan** | MY tickers + indicators | Composite scores, Buy/Watch/Avoid | Node.js, multi-source data |
| **US Scan** | US tickers + indicators | Composite scores, Buy/Watch/Avoid | Node.js, multi-source data |
| **Signals** | Scan results | Telegram alerts, signal feed | Node.js, Telegram Bot API |
| **Tickers** | Market data, filters | Curated ticker lists | JSON, TTL cache |
| **Moomoo** | OpenD SDK | Paper trades, positions, P&L | Python/Node.js, OpenD |
| **TradingView** | Pine Script, chart links | Indicator library, TV integration | Webhooks, REST |
| **Cron** | Schedule config | Job execution + monitoring | OpenClaw cron, Task Scheduler |
| **Data** | Yahoo, Stooq, cache | Clean price data | Node.js, CSV/JSON |

---

## 3. DASHBOARD REQUIREMENTS

### 3.1 Pages & Views

| Page | Purpose | Key Widgets |
|------|---------|-------------|
| **Overview** | At-a-glance system health | P&L card, active signals count, market status, cron health, recent alerts |
| **Signals** | Live signal feed | Sortable/filterable table, signal detail card, composite breakdown, Telegram preview |
| **Scanners** | Trigger & view scans | Scan trigger buttons (MY/US), last scan results, progress indicator, config panel |
| **Indicators** | Library browser & config | Indicator cards (name, type, params), enable/disable toggles, weight sliders, Pine Script source |
| **Backtesting** | Results history | Strategy comparison table, equity curve chart, win rate %, parameter optimizer |
| **Tickers** | Watchlist management | Search/filter, add/remove, sector tags, market cap filter, last signal |
| **Positions** | Current positions & P&L | Position cards (entry, current, P&L%), daily change, total equity curve |
| **Cron** | Job management | Job list with status dots, run history, manual trigger, error log |
| **Settings** | System config | API keys, webhook URLs, notification prefs, theme toggle |

### 3.2 Real-Time Features
- **Live pulse** on Overview (system heartbeat every 30s)
- **Signal feed** auto-refresh (poll every 60s during market hours)
- **Scan progress** live indicator (fetching → processing → done)
- **Cron status** live dot (green/yellow/red per job)
- **P&L ticker** updates on position changes

### 3.3 Quick Actions (from any page)
- **Trigger MY Scan** — one-click button
- **Trigger US Scan** — one-click button
- **Open TradingView** chart for ticker
- **Open Moomoo** desktop app
- **Toggle paper/live mode** (with confirmation)

### 3.4 Data Display Standards
- All currency in MYR for MY, USD for US
- Composite scores: 0-100 scale with tier colors (Buy ≥50 green, Watch 35-49 yellow, Weak 20-34 orange, Avoid <20 red)
- P&L: Green for profit, red for loss, with % and absolute
- Timestamps in MYT (Asia/Kuala_Lumpur)

---

## 4. INDICATOR LIBRARY

### 4.1 Indicator Format
Each indicator is a self-contained module:
```typescript
{
  id: "ema-color",
  name: "Color-Coded EMA",
  category: "trend",
  params: { period: 20 },
  pineScript: "// Pine Script v5\n...",
  nodeJs: "export function emaColor(close, period) {...}",
  backtestResults: { winRate: 0, sharpe: 0, testedOn: [] },
  version: "1.0.0"
}
```

### 4.2 Indicator Categories
| Category | Examples | Count (existing) | Target |
|----------|----------|------------------|--------|
| Trend | EMA, SMA, MACD, Golden Cross | 4 | 6 |
| Momentum | RSI, Stochastic, Momentum Ratio | 3 | 5 |
| Volatility | Bollinger Bands, ATR, ADR % | 3 | 5 |
| Volume | OBV, Volume Surge, Engulfing+Vol | 2 | 5 |
| Pattern | Engulfing, Doji, Pivot Points | 1 | 4 |
| Composite | Multi-indicator scoring | 1 | 3 |

### 4.3 New Indicators to Add (from YouTube research)
1. **Bull/Bear Momentum Ratio** — Candle body size comparison over N bars
2. **High-Volume Engulfing Detector** — Engulfing pattern + volume > 5-bar average
3. **ADR % Indicator** — % of average daily range consumed (profit target guide)
4. **Daily Boxes** — Previous day high/low as colored S/R zones
5. **Hourly Pivot Points** — Pivots calculated on hourly (not just daily)

---

## 5. 10-PHASE ROADMAP

### Phase 1: Foundation & File Architecture
- [ ] Create full department folder structure
- [ ] Configuration system (YAML/JSON) — markets, tickers, API keys, schedules
- [ ] Shared utilities library (logging, HTTP, date, math)
- [ ] Environment setup (.env, dev/prod modes)
- [ ] README + CONTRIBUTING per department

### Phase 2: Data Pipeline & Tickers Department
- [ ] Multi-source data fetcher (Yahoo Direct primary → Stooq → cache)
- [ ] Price data normalization (OHLCV, multi-timeframe)
- [ ] Ticker registry with metadata (sector, market cap, exchange, active/inactive)
- [ ] Ticker filtering engine (by sector, price range, volume, market)
- [ ] Data health monitoring (source cooldown, cache freshness)

### Phase 3: Indicators Department
- [ ] Indicator interface/schema (id, name, category, params, code)
- [ ] Port all 13 existing indicators to new format
- [ ] Add 5 new indicators from research (momentum ratio, engulfing, ADR%, daily boxes, hourly pivots)
- [ ] Pine Script versions for all 18 indicators
- [ ] Indicator testing framework (unit tests with known inputs/outputs)
- [ ] Weight/sensitivity configuration per indicator

### Phase 4: Converter Department
- [ ] Pine Script → Node.js conversion pipeline (AI-assisted)
- [ ] Conversion template & ruleset
- [ ] Validation: Pine Script output == Node.js output on same data
- [ ] Error handling for unsupported Pine Script features
- [ ] Batch converter for indicator library

### Phase 5: Scanner Engines (MY + US)
- [ ] Unified scan engine (shared core, market-specific config)
- [ ] Parallel ticker processing with concurrency control
- [ ] Composite scoring engine (weighted multi-indicator)
- [ ] Tier assignment (Buy/Watch/Weak/Avoid)
- [ ] Scan result caching with TTL
- [ ] My Scan Department — 44+ MY tickers, EOD + intraday
- [ ] US Scan Department — 28 core + penny candidates

### Phase 6: Backtesting Department
- [ ] Fresh backtest engine (replace broken v2.0 engine)
- [ ] Strategy definition format (indicators + entry/exit rules + position sizing)
- [ ] Multi-strategy comparison (Buy & Hold vs Signal vs Recurring)
- [ ] Metrics: Win rate, Sharpe, Sortino, Max DD, Avg Return, Profit Factor
- [ ] Equity curve visualization data
- [ ] Parameter optimizer (grid search over indicator params)
- [ ] Results database (JSON) with versioning

### Phase 7: Signals Department
- [ ] Signal generation pipeline (scan → filter → format → distribute)
- [ ] Signal format: ticker, composite, tier, indicators triggered, timestamp
- [ ] Telegram integration (rich cards with charts)
- [ ] Signal history with tracking (was it acted on? P&L?)
- [ ] Daily signal digest + weekly summary
- [ ] Alert configuration (thresholds, quiet hours)

### Phase 8: Moomoo Department (Paper Trading)
- [ ] OpenD connection manager (connect, health check, reconnect)
- [ ] Market data streaming via OpenD
- [ ] Paper trade execution (buy/sell with stop loss + take profit)
- [ ] Position tracking (entry price, current price, P&L, P&L%)
- [ ] Trade journal (entry reason, exit reason, psychology notes)
- [ ] Risk management (1% per trade, R:R 2:1 enforcement)
- [ ] **Guard**: Paper-only by default, live requires explicit approval

### Phase 9: TradingView Department
- [ ] TradingView account integration (Jerrison's account)
- [ ] Pine Script library sync (TV ↔ local)
- [ ] Chart link generation (one-click open TV chart for any ticker)
- [ ] Webhook receiver (TV alerts → our signal pipeline)
- [ ] AI prompt templates for indicator generation
- [ ] TV → Converter → Node.js workflow automation

### Phase 10: Dashboard & Cron Department
- [ ] **Dashboard Department** — Full Next.js + framer-motion web app
  - Overview, Signals, Scanners, Indicators, Backtesting, Tickers, Positions, Cron, Settings
  - Real-time data via API endpoints
  - Mobile-responsive (check positions on phone)
  - Dark OLED theme, glass-morphism, live pulse
- [ ] **Cron Department** — Unified job management
  - Job registry with schedules, dependencies, retry logic
  - Status dashboard (green/yellow/red per job)
  - Manual trigger & pause controls
  - Failure alerts after N consecutive errors
  - Self-healing: restart failed jobs, escalate after threshold
- [ ] API layer — Dashboard ↔ all departments via REST/WebSocket
- [ ] Deployment to Vercel

---

## 6. NON-FUNCTIONAL REQUIREMENTS

### 6.1 Performance
- MY scan (44 tickers): < 3 min
- US scan (28 tickers): < 1 min
- Dashboard page load: < 2s
- Signal delivery (scan complete → Telegram): < 10s

### 6.2 Reliability
- Cron self-healing: auto-restart after transient failures
- Data multi-source with exponential cooldown
- Graceful degradation: if one source down, use cache
- Dashboard health endpoint for monitoring

### 6.3 Security
- API keys in .env only, never committed
- Moomoo: paper trading only, live requires manual unlock (OpenD GUI)
- No trade automation from external content (web, email, webhooks)
- Dashboard: local network only by default, optional Vercel deploy

### 6.4 Maintainability
- Each department is independently testable
- Shared utilities in one place
- Documentation per department (README)
- Version-controlled indicator library
- Change log for all signal logic changes

---

## 7. CONSTRAINTS & ASSUMPTIONS

### Constraints
- Windows 10 environment (PowerShell, cmd)
- No dedicated GPU (no ML training)
- 144GB free disk (room for data)
- Node.js v22, Python 3.14
- $0 infrastructure budget (local + free tiers)

### Assumptions
- Yahoo Direct API remains accessible without auth
- Moomoo OpenD continues to work on Windows
- TradingView free tier sufficient for our needs
- Telegram Bot API remains free
- Vercel free tier sufficient for dashboard hosting

---

## 8. SUCCESS GATES (per phase)

| Phase | Gate |
|-------|------|
| 1 | All 13 directories exist, config loads without errors |
| 2 | 30-day price history fetched for all 72 tickers in < 2 min |
| 3 | All 18 indicators produce identical output to v2.1 for same input |
| 4 | 3 Pine Script indicators successfully converted and validated |
| 5 | MY + US scans complete in < 5 min with composite scores |
| 6 | Backtest produces valid win rates and equity curves for 3 strategies |
| 7 | Telegram signal delivered within 10s of scan completion |
| 8 | Paper trade placed via OpenD and tracked with P&L |
| 9 | TV chart opens from dashboard with 1 click |
| 10 | Full dashboard live, all 9 pages functional, all crons green |

---

## 9. GIT WORKFLOW

### 9.1 Repository Strategy
- **Repo**: GitHub `Jerrisonchai/aegis-terminal` (public during development)
- **Lockdown**: Convert to **private** after Phase 10 completion — this is our secret sauce
- **Reasoning**: Public during dev allows free GitHub Actions minutes, easy sharing. Private after production protects proprietary trading algorithms.

### 9.2 Commit Discipline
- **Every phase**: Commit + push at phase completion
- **Every file**: Atomic commits — one logical change per commit
- **Message format**: `phase(N): short description` (e.g., `phase(1): scaffold department structure`)
- **No secrets**: `.env`, API keys, credentials NEVER committed (in `.gitignore`)
- **Always push**: `git push origin main` after every commit — no local-only work

### 9.3 Branch Strategy
- `main` — production-ready code (deployable)
- `develop` — integration branch during multi-step work
- `phase/N-name` — per-phase feature branches

### 9.4 Pre-Push Checklist
- [ ] No `.env` files staged
- [ ] All tests passing
- [ ] PRD updated if scope changed
- [ ] Commit message follows format

---

## 10. OPEN QUESTIONS

1. **TradingView account**: Can we use `jerrcoc1@gmail.com` Google OAuth? → *Try before Phase 9*
2. **Dashboard host**: Vercel (public) vs local-only? → *Jerrison decides at Phase 10*
3. **Historical data depth**: 30 days? 90 days? 1 year?
4. **Penny stocks**: Keep penny scanner separate or integrate into US scan?
5. **Alert channels**: Telegram only, or add email + dashboard native?

---

**EOF**
