// src/app/api/cron/trigger/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { jobId } = await req.json();
  if (!jobId) return NextResponse.json({ error: 'jobId required' }, { status: 400 });

  return NextResponse.json({
    status: 'triggered',
    jobId,
    triggeredAt: new Date().toISOString(),
  });
}
