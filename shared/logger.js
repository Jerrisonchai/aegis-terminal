// shared/logger.js — Centralized logging
// Usage: import { logger } from '../shared/logger.js';

const LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const levelColors = { DEBUG: '\x1b[36m', INFO: '\x1b[32m', WARN: '\x1b[33m', ERROR: '\x1b[31m' };
const levelNames = { DEBUG: 'DBG', INFO: 'INF', WARN: 'WRN', ERROR: 'ERR' };

class Logger {
  constructor(source = 'AEGIS') {
    this.source = source;
    this.minLevel = process.env.LOG_LEVEL || 'INFO';
  }

  _log(level, msg, data = null) {
    if (LEVELS[level] < LEVELS[this.minLevel]) return;
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const color = levelColors[level] || '';
    const reset = '\x1b[0m';
    const prefix = `${color}[${ts}] [${levelNames[level]}] [${this.source}]${reset}`;
    console.log(`${prefix} ${msg}`);
    if (data) console.log(data);
  }

  debug(msg, data) { this._log('DEBUG', msg, data); }
  info(msg, data) { this._log('INFO', msg, data); }
  warn(msg, data) { this._log('WARN', msg, data); }
  error(msg, data) { this._log('ERROR', msg, data); }
}

export const logger = new Logger();
export { Logger };
