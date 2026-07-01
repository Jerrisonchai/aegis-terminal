// src/app/api/scan/trigger/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { market } = await req.json();
  if (!market || !['MY', 'US'].includes(market)) {
    return NextResponse.json({ error: 'Invalid market. Use MY or US.' }, { status: 400 });
  }

  // Mock: would trigger actual scan script
  return NextResponse.json({
    status: 'started',
    market,
    tickers: market === 'MY' ? 51 : 28,
    startedAt: new Date().toISOString(),
    estimatedDuration: market === 'MY' ? 60 : 30,
  });
}
