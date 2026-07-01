// converter-department/converter.js
// Pine Script v5 → Node.js conversion engine
// Usage: import { convert } from '../converter-department/converter.js';

import { existsSync } from 'fs';

/**
 * Known Pine Script → Node.js mappings
 * Each entry maps a Pine Script function/pattern to Node.js equivalent
 */
const FUNCTION_MAP = {
  // Math
  'ta.ema':       { js: 'ema',              imports: 'ema from "technicalindicators"' },
  'ta.sma':       { js: 'sma',              imports: 'sma from "technicalindicators"' },
  'ta.rma':       { js: 'rma',              imports: 'rma from "technicalindicators"' },
  'ta.rsi':       { js: 'rsi',              imports: 'rsi from "technicalindicators"' },
  'ta.macd':      { js: 'macd',             imports: 'macd from "technicalindicators"' },
  'ta.bb':        { js: 'bollingerBands',    imports: 'bollingerBands from "technicalindicators"' },
  'ta.atr':       { js: 'atr',              imports: 'atr from "technicalindicators"' },
  'ta.stoch':     { js: 'stochastic',       imports: 'stochastic from "technicalindicators"' },
  'ta.obv':       { js: 'obv',              imports: 'obv from "technicalindicators"' },
  'ta.vwap':      { js: 'vwap',             imports: 'vwap from "technicalindicators"' },
  'ta.crossover':  { js: 'crossover(a, b)',  imports: null, isCustom: true },
  'ta.crossunder': { js: 'crossunder(a, b)', imports: null, isCustom: true },
  'ta.highest':   { js: 'Math.max(...)',     imports: null, isCustom: true },
  'ta.lowest':    { js: 'Math.min(...)',     imports: null, isCustom: true },
  'ta.change':    { js: '(close[i] - close[i-1])', imports: null, isCustom: true },
  'ta.supertrend': { js: 'supertrend',      imports: 'supertrend from "technicalindicators"' },
  'math.abs':     { js: 'Math.abs',          imports: null },
  'math.sum':     { js: 'custom sum',        imports: null, isCustom: true },
  'math.pow':     { js: 'Math.pow',          imports: null },

  // Plotting (converted to return values)
  'plot(':        { js: '// Return value:',   imports: null, isPlot: true },
  'plotshape(':   { js: '// Signal:',         imports: null, isPlot: true },
  'hline(':       { js: '// Reference line:', imports: null, isPlot: true },
  'bgcolor(':     { js: '// Zone color:',     imports: null, isPlot: true },

  // Inputs → params object
  'input.int(':   { js: '// param:',          imports: null, isInput: true },
  'input.float(': { js: '// param:',          imports: null, isInput: true },
  'input.bool(':  { js: '// param:',          imports: null, isInput: true },
  'input.string(':{ js: '// param:',          imports: null, isInput: true },

  // Operators (direct translation)
  ' and ':        { js: ' && ',              imports: null },
  ' or ':         { js: ' || ',              imports: null },
  'not ':         { js: '!',                 imports: null },
  'true':         { js: 'true',              imports: null },
  'false':        { js: 'false',             imports: null },
  'na':           { js: 'null',              imports: null },

  // Colors
  'color.green':  { js: "'green'",           imports: null },
  'color.red':    { js: "'red'",             imports: null },
  'color.blue':   { js: "'blue'",            imports: null },
  'color.yellow': { js: "'yellow'",          imports: null },
  'color.gray':   { js: "'gray'",            imports: null },
  'color.white':  { js: "'white'",           imports: null },
  'color.black':  { js: "'black'",           imports: null },
  'color.orange': { js: "'orange'",          imports: null },
};

/**
 * Convert a Pine Script indicator to Node.js
 * This gives a best-effort translation with comments marking areas needing human review.
 *
 * @param {string} pineCode - Pine Script v5 source code
 * @param {string} indicatorName - Name of the indicator
 * @returns {object} { jsCode, imports, params, needsReview }
 */
export function convert(pineCode, indicatorName = 'indicator') {
  const lines = pineCode.split('\n').filter(l => !l.trim().startsWith('//') || l.includes('//@'));
  const params = {};
  let jsLines = [];
  const imports = new Set();
  const reviewItems = [];

  // Extract inputs
  for (const line of lines) {
    const inputMatch = line.match(/input\.(int|float|bool|string)\s*\(\s*(\d+)?\s*,?\s*"([^"]+)"/);
    if (inputMatch) {
      const [, type, defaultVal, name] = inputMatch;
      const camelName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      params[camelName] = defaultVal || (type === 'int' ? '14' : type === 'float' ? '2.0' : '');

      let jsDefault;
      switch (type) {
        case 'int': jsDefault = parseInt(defaultVal) || 14; break;
        case 'float': jsDefault = parseFloat(defaultVal) || 2.0; break;
        case 'bool': jsDefault = defaultVal === 'true'; break;
        default: jsDefault = `"${defaultVal || ''}"`;
      }
      jsLines.push(`const ${camelName} = params.${camelName} || ${JSON.stringify(jsDefault)};`);
    }
  }

  // Track known indicators used
  if (pineCode.includes('ta.ema')) imports.add('ema from "technicalindicators"');
  if (pineCode.includes('ta.rsi')) imports.add('rsi from "technicalindicators"');
  if (pineCode.includes('ta.sma')) imports.add('sma from "technicalindicators"');
  if (pineCode.includes('ta.macd')) imports.add('macd from "technicalindicators"');

  // Generate JS function signature
  jsLines.unshift(`// Auto-converted from Pine Script v5 — REVIEW REQUIRED`);
  jsLines.unshift(`// Source: ${indicatorName}`);
  jsLines.push('');
  jsLines.push(`export function ${indicatorName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}(candles, params = {}) {`);
  jsLines.push(`  if (candles.length < 20) return { value: null, signal: null, score: 0 };`);
  jsLines.push('');
  jsLines.push(`  // TODO: Implement indicator logic`);
  jsLines.push(`  // Original Pine Script: ${pineCode.length} chars`);
  jsLines.push('');
  jsLines.push(`  // Auto-detected params: ${JSON.stringify(params)}`);
  jsLines.push(`  // Auto-detected imports: ${[...imports].join(', ')}`);
  jsLines.push('');
  jsLines.push(`  // Count of built-in functions found: ${Object.keys(FUNCTION_MAP).filter(k => pineCode.includes(k)).length}`);
  jsLines.push('');
  jsLines.push(`  return { value: null, signal: null, score: 0 };`);
  jsLines.push(`}`);

  const needsReview = reviewItems.length > 0 || pineCode.length > 100;

  return {
    jsCode: jsLines.join('\n'),
    params,
    imports: [...imports],
    needsReview,
    reviewItems: [
      'Check all indicator function calls — verify parameter order matches technicalindicators npm',
      'Validate crossover/crossunder logic — manual array indexing needed',
      'Test with known input/output to verify conversion accuracy',
    ],
  };
}

/**
 * Generate an AI prompt for converting a specific Pine Script indicator
 */
export function generateAIPrompt(pineCode, indicatorName) {
  return `You are a Pine Script v5 to Node.js converter expert.

Convert this Pine Script v5 indicator to Node.js/TypeScript:

\`\`\`pinescript
${pineCode}
\`\`\`

Requirements:
1. Use the "technicalindicators" npm package for standard indicators (rsi, ema, sma, macd, bb, atr, etc.)
2. The function signature must be: export function ${indicatorName}(candles, params = {})
3. candles is an array of { timestamp, open, high, low, close, volume }
4. params object contains all configurable parameters
5. Return { value, signal, score } where signal is 'BUY'|'SELL'|'HOLD' and score is 0-10
6. Include JSDoc comments
7. Handle edge cases (not enough data, null values)
8. Do NOT use any external APIs or network calls
9. Provide ONLY the JavaScript code — no explanations`;
}
