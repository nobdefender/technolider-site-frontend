import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** Проверка живости для Docker HEALTHCHECK и мониторинга. */
export function GET() {
  return NextResponse.json({ ok: true, ts: Date.now() }, { headers: { 'Cache-Control': 'no-store' } });
}
