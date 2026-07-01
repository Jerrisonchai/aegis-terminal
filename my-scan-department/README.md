# MY Scan Department (Malaysia Market)

## Purpose
Daily scanner for Bursa Malaysia stocks (~44 tickers). Runs EOD after market close (5:00 PM MYT) and optionally intraday.

## Ticker Sources
- `../tickers-department/my-tickers.json`
- Categories: Finance, Tech, Plantation, Energy, Consumer, REIT

## Scan Process
```
1. Load MY tickers → 2. Fetch OHLCV (Yahoo → Stooq → cache)
  → 3. Apply all enabled indicators → 4. Composite scoring
    → 5. Tier assignment (Buy≥50, Watch≥35, Weak≥20, Avoid<20)
      → 6. Output to signals-department/
```

## Files
- `my-scanner.js` — Main MY scan engine
- `my-config.json` — Market-specific config (hours, holidays)
- `results/` — Scan output cache
