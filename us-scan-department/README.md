# US Scan Department (US Market)

## Purpose
Daily scanner for US stocks (28 core + 892 penny candidates). Runs pre-market (9:00 AM ET) and post-close (4:00 PM ET).

## Ticker Sources
- `../tickers-department/us-tickers.json` — 28 core tickers
- `../tickers-department/us-penny.json` — 892 candidates (low-cap filter)

## Scan Process
```
1. Filter active tickers → 2. Fetch OHLCV (Yahoo → Stooq → cache)
  → 3. Apply all enabled indicators → 4. Composite scoring
    → 5. Tier assignment → 6. Filter: only Buy/Watch tiers
      → 7. Output to signals-department/
```

## Files
- `us-scanner.js` — Main US scan engine
- `us-penny-scanner.js` — Penny stock scanner (separate, lighter)
- `us-config.json` — Market-specific config (hours, holidays)
- `results/` — Scan output cache
