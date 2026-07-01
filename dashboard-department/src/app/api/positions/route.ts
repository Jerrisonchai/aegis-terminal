// src/app/api/positions/route.ts
import { NextResponse } from 'next/server';
import { mockPositions } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({ positions: mockPositions });
}
