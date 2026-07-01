# Backtesting Department

## Purpose
Unified backtest engine. Test any strategy (combo of indicators + rules) against historical data. Compare strategies side-by-side.

## Metrics Tracked
| Metric | Description |
|--------|-------------|
| Win Rate | % of trades with positive return |
| Sharpe Ratio | Risk-adjusted return |
| Sortino Ratio | Downside risk-adjusted return (preferred) |
| Max Drawdown | Largest peak-to-trough decline |
| Profit Factor | Gross profit / gross loss |
| Avg Return | Average % return per trade |
| Expectancy | (Win% × AvgWin) - (Loss% × AvgLoss) |

## Strategy Format
```json
{
  "name": "Mean Reversion + MACD",
  "indicators": ["bb", "rsi", "macd"],
  "entry": "rsi < 30 AND close < bb.lower",
  "exit": "close > bb.middle OR rsi > 60",
  "positionSizing": "fixed",
  "riskPerTrade": 0.01,
  "stopLoss": "atr * 2",
  "takeProfit": "atr * 4"
}
```

## Files
- `engine.js` — Core backtest loop
- `metrics.js` — Performance metric calculators
- `optimizer.js` — Grid search parameter optimizer
- `results/` — Backtest results database (JSON)
- `strategies/` — Strategy definition files
