# TradingView Department

## Purpose
TradingView integration hub. Sync Pine Script library, generate chart links, receive webhook alerts.

## Features
- **Account**: Single account via Google OAuth (jerrcoc1@gmail.com)
- **Pine Script Sync**: Library of all our indicators in Pine Script v5
- **Chart Links**: One-click open TV chart for any ticker with our indicators pre-loaded
- **Webhook Receiver**: TV alerts → our signal pipeline
- **AI Prompts**: Templates for generating new indicators via AI

## Chart Link Format
```
https://www.tradingview.com/chart/?symbol=NASDAQ:AAPL
```

## Files
- `pine-library/` — All indicators in Pine Script v5
- `chart-links.js` — Generate TV chart URLs with indicators
- `webhook.js` — Webhook receiver endpoint
- `prompts/` — AI prompt templates
- `sync.js` — Sync between local library and TV
