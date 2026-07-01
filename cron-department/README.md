# Cron Department

## Purpose
Unified cron job management — schedule, monitor, heal. Replaces the fragmented v2.1 cron setup.

## Job Schema
```json
{
  "id": "my-daily-scan",
  "name": "MY Daily Scan",
  "schedule": "0 17 * * 1-5",
  "timezone": "Asia/Kuala_Lumpur",
  "department": "my-scan",
  "enabled": true,
  "retryCount": 2,
  "retryDelayMs": 60000,
  "timeoutMs": 600000,
  "alertOnFailure": true,
  "lastRun": "2026-06-30T17:30:00+08:00",
  "lastStatus": "OK"
}
```

## Monitoring
- **Green**: Last run OK
- **Yellow**: 1 consecutive failure
- **Red**: 2+ consecutive failures → alert
- **Gray**: Disabled

## Self-Healing
- Auto-retry on transient failures (up to 2 retries)
- Escalate to Telegram alert after 3 consecutive failures
- Circuit breaker: pause job after 5 consecutive failures

## Files
- `registry.json` — All cron job definitions
- `scheduler.js` — Cron scheduling engine
- `monitor.js` — Job health dashboard data
- `history/` — Run history per job
