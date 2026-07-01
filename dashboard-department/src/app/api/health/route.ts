// src/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    gateway: 'online',
    missionControl: 'online',
    ollama: 'online',
    cpu: 34,
    memory: { used: 13.8, total: 19.4, unit: 'GB' },
    disk: { free: 129, total: 475, unit: 'GB' },
    uptime: '14d 7h 22m',
    timestamp: new Date().toISOString(),
  });
}
