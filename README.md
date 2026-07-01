# AEGIS — Automated Execution & Global Indicator System

> **Trading Command Center v3**
> Private sauce. This repo goes private after production.

## Architecture
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
├── shared/                  # Common utilities across all departments
└── docs/                    # PRD, DESIGN, phase tracking
```

## Quick Start
```bash
# 1. Copy environment config
cp .env.example .env
# Fill in API keys

# 2. Install dependencies
cd dashboard-department && npm install

# 3. Run dashboard
npm run dev
# → http://localhost:3100

# 4. Run a scan
node my-scan-department/my-scanner.js
```

## Phase Status
| Phase | Name | Status |
|-------|------|--------|
| 1 | Foundation & Architecture | ⏳ In Progress |
| 2 | Data Pipeline & Tickers | ⏳ |
| 3 | Indicators Library | ⏳ |
| 4 | Pine Script Converter | ⏳ |
| 5 | Scanner Engines (MY + US) | ⏳ |
| 6 | Backtesting Engine | ⏳ |
| 7 | Signals Pipeline | ⏳ |
| 8 | Moomoo Paper Trading | ⏳ |
| 9 | TradingView Integration | ⏳ |
| 10 | Dashboard & Cron | ⏳ |

## Security
- **Never commit `.env`** — it's in `.gitignore`
- **Paper trading only** — Moomoo `SIMULATE` mode by default
- **No unlock_trade via SDK** — manual OpenD GUI only
- **Repo goes PRIVATE** after Phase 10 — this is our secret sauce
