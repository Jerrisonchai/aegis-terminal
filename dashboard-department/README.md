# Dashboard Department

## Purpose
One-stop trading command center. 9-page Next.js web app with real-time data, scan controls, and P&L tracking.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4
- **Animation**: framer-motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Fonts**: Inter + JetBrains Mono

## Pages
| Route | Page | Purpose |
|-------|------|---------|
| `/` | Overview | System health, P&L, active signals, market status |
| `/signals` | Signals | Live signal feed with filtering |
| `/scanners` | Scanners | Trigger MY/US scans, view results |
| `/indicators` | Indicators | Library browser, enable/disable, weights |
| `/backtesting` | Backtesting | Results history, equity curves, comparison |
| `/tickers` | Tickers | Watchlist management, filtering |
| `/positions` | Positions | Current positions, P&L tracking |
| `/cron` | Cron | Job management, run history, manual triggers |
| `/settings` | Settings | API keys, notifications, config |

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/signals` | GET | Latest signals (filterable) |
| `/api/scan/trigger` | POST | Trigger MY or US scan |
| `/api/scan/status` | GET | Current scan progress |
| `/api/positions` | GET | Current positions + P&L |
| `/api/cron` | GET | Cron job status list |
| `/api/cron/trigger` | POST | Manually trigger a cron job |
| `/api/health` | GET | System health check |

## Files
- `src/app/` — Next.js App Router pages
- `src/components/` — Reusable UI components
- `src/lib/` — API clients, data fetching (SWR)
- `src/hooks/` — Custom React hooks
- `package.json` — Dependencies
- `tailwind.config.ts` — Design token config
- `next.config.ts` — Next.js config
