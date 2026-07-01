// src/app/api/cron/route.ts
import { NextResponse } from 'next/server';
import { mockCronJobs } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ jobs: mockCronJobs });
}
