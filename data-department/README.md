# Data Department

## Purpose
Multi-source price data pipeline. Fetches OHLCV from Yahoo Direct API (primary), falls back to Stooq, falls back to local cache. Provides normalized data to all scanner departments.

## Pipeline
```
Yahoo Direct API (primary, 500 candles, no auth)
  → Stooq (fallback, bulk)
    → Local cache (last resort)
```

## Sources
| Source | URL | Auth | Rate Limit |
|--------|-----|------|------------|
| Yahoo Direct | query1.finance.yahoo.com/v8/finance/chart | None | Moderate |
| Stooq | stooq.com/q | None | Unknown |
| Cache | Local CSV/JSON | N/A | N/A |

## API
```js
import { fetchCandles } from './fetcher.js';
const candles = await fetchCandles('AAPL', { range: '5d', interval: '15m' });
// Returns: [{ timestamp, open, high, low, close, volume }]
```

## Files
- `fetcher.js` — Multi-source data fetcher with failover
- `normalizer.js` — OHLCV normalization across sources
- `cache.js` — TTL-based cache layer
- `health.js` — Source health monitoring + cooldown
