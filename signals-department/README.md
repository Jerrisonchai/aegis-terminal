# Signals Department

## Purpose
Signal generation, filtering, and distribution. Takes raw scan results and turns them into actionable alerts.

## Pipeline
```
Scan Results → Filter (score ≥ threshold) → Format (rich cards)
  → Distribute (Telegram + Dashboard API) → Track (was it acted on?)
```

## Signal Format
```json
{
  "id": "sig-20260701-001",
  "ticker": "AAPL",
  "market": "US",
  "composite": 64.4,
  "tier": "BUY",
  "indicators": ["OBV_BULL_DIV", "ABOVE_ALL_MA", "MACD_CROSS"],
  "subScores": { "signalS": 85, "volume": 80, "netSent": 85 },
  "price": 281.74,
  "timestamp": "2026-07-01T09:31:00-04:00"
}
```

## Files
- `generator.js` — Creates signals from scan results
- `filter.js` — Tier/score filtering rules
- `formatter.js` — Rich card formatting for Telegram
- `distributor.js` — Telegram Bot API + Dashboard API
- `tracker.js` — Signal history + P&L tracking
- `history/` — Signal archive (JSON)
