# Tickers Department

## Purpose
Centralized ticker registry. Manage, filter, and categorize all tracked stocks across MY and US markets.

## Ticker Schema
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "market": "US",
  "exchange": "NASDAQ",
  "sector": "Technology",
  "marketCap": 2800000000000,
  "active": true,
  "tags": ["tech", "large-cap", "faang"],
  "addedAt": "2026-01-15"
}
```

## Filtering
- By sector (e.g., only Technology + Finance)
- By market cap (e.g., > $1B)
- By price range (e.g., $10-$500)
- By volume (e.g., avg > 1M)
- By market (MY / US / Both)
- By active status

## Files
- `registry.json` — Master ticker database
- `my-tickers.json` — MY ticker subset
- `us-tickers.json` — US core tickers
- `us-penny.json` — US penny candidates
- `filter.js` — Filtering engine
- `sync.js` — Sync & cleanup (remove delisted, add new)
