# Indicators Department

## Purpose
Curated library of technical indicators. Each indicator exists in TWO forms:
1. **Pine Script v5** — for TradingView prototyping & backtesting
2. **Node.js/TypeScript** — for our scan pipeline execution

## Indicator Format
```typescript
interface Indicator {
  id: string;           // e.g., "ema-color"
  name: string;         // e.g., "Color-Coded EMA"
  category: 'trend' | 'momentum' | 'volatility' | 'volume' | 'pattern';
  params: Record<string, number>;
  pineScript: string;   // Pine Script v5 source
  nodeJs: string;       // Node.js implementation
  output: { buy: number; sell: number; neutral: number }; // 0-10 sub-scores
  version: string;
}
```

## Categories
| Category | Count | Examples |
|----------|-------|---------|
| Trend | 6 | EMA, SMA, MACD, Golden Cross, Supertrend, ADX |
| Momentum | 5 | RSI, Stochastic, Momentum Ratio, CCI, Williams %R |
| Volatility | 5 | Bollinger Bands, ATR, ADR%, Keltner Channel, Donchian |
| Volume | 5 | OBV, Volume Surge, Engulfing+Vol, MFI, VWAP |
| Pattern | 4 | Engulfing, Doji, Pivot Points, Daily Boxes |

## Files
- `schema.ts` — Indicator interface & types
- `registry.json` — Master list of all indicators
- `trend/` — Trend indicators
- `momentum/` — Momentum indicators
- `volatility/` — Volatility indicators
- `volume/` — Volume indicators
- `pattern/` — Pattern indicators
- `testing/` — Unit tests per indicator
