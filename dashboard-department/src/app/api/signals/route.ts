// src/app/api/signals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockSignals } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const market = searchParams.get('market');
  const tier = searchParams.get('tier');
  const limit = parseInt(searchParams.get('limit') || '20');

  let signals = [...mockSignals];
  if (market) signals = signals.filter(s => s.market === market);
  if (tier) signals = signals.filter(s => s.tier === tier);

  return NextResponse.json({ signals: signals.slice(0, limit), total: signals.length });
}
