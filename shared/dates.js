// shared/dates.js — Timezone-aware date utilities
// Usage: import { nowMyt, isMarketOpen, formatSignalTime } from '../shared/dates.js';

const MYT_OFFSET = 8 * 60; // UTC+8 in minutes

export function nowMyt() {
  const d = new Date();
  // MYT = UTC + 8
  return new Date(d.getTime() + (MYT_OFFSET * 60000));
}

export function formatMyt(date = new Date()) {
  return date.toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' });
}

export function formatSignalTime(date = new Date()) {
  return date.toISOString().replace('T', ' ').slice(0, 19) + ' MYT';
}

export function isMarketOpen(market = 'MY') {
  const now = new Date();
  const mytHour = now.getUTCHours() + 8 + (now.getUTCMinutes() / 60);
  const day = now.getUTCDay(); // 0=Sun, 6=Sat

  if (day === 0 || day === 6) return false; // Weekend

  if (market === 'MY') {
    // Bursa: 9:00 AM - 12:30 PM, 2:30 PM - 5:00 PM MYT
    return (mytHour >= 9 && mytHour < 12.5) || (mytHour >= 14.5 && mytHour < 17);
  }

  if (market === 'US') {
    // US: 9:30 AM - 4:00 PM ET (ET = UTC-5, MYT = UTC+8 → ET+13)
    const etHour = (mytHour - 13 + 24) % 24;
    return etHour >= 9.5 && etHour < 16;
  }

  return false;
}

export function nextMarketOpen(market = 'MY') {
  const now = new Date();
  // Simple approximation — finds next weekday 9:00 AM MYT
  let target = new Date(now);
  target.setUTCHours(1, 0, 0, 0); // 9:00 AM MYT = 1:00 AM UTC
  while (target <= now || target.getUTCDay() === 0 || target.getUTCDay() === 6) {
    target.setUTCDate(target.getUTCDate() + 1);
  }
  return target;
}
