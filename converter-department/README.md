# Converter Department

## Purpose
Convert Pine Script v5 indicators into Node.js/TypeScript equivalents. AI-assisted with human validation.

## Pipeline
```
Pine Script v5 (TradingView)
  → AI Translation (DeepSeek/Claude)
    → Manual Review (human)
      → Validation (same input → same output)
        → Deploy to indicators-department/
```

## Conversion Rules
1. `ta.ema(src, len)` → `ema(src, len)` from `technicalindicators` npm
2. `ta.rsi(src, len)` → `rsi(src, len)`
3. `ta.crossover(a, b)` → `a[i] > b[i] && a[i-1] <= b[i-1]`
4. `request.security()` → Multi-timeframe data pre-fetch
5. `plot()` → Return value in output object

## Files
- `converter.js` — Main conversion engine
- `templates/` — Conversion templates per Pine Script function
- `validator.js` — Output comparison between Pine Script & Node.js
- `prompts/` — AI prompt templates for conversion
