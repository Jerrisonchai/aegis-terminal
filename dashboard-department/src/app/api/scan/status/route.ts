// src/app/api/scan/status/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    my: { status: 'done', progress: 100, lastScan: '2026-07-01T09:14:00+08:00', signals: 7 },
    us: { status: 'done', progress: 100, lastScan: '2026-07-01T09:30:00+08:00', signals: 5 },
  });
}
