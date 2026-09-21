import { NextResponse, type NextRequest } from 'next/server';

/**
 * HTTP Basic Auth на весь сайт (пока он не запущен публично).
 *   BASIC_AUTH_USER / BASIC_AUTH_PASS — логин и пароль (по умолчанию proton / proton);
 *   BASIC_AUTH=off — отключить защиту.
 * Переменные читаются при запуске контейнера (не вшиваются в сборку).
 */
const USER = process.env.BASIC_AUTH_USER || 'proton';
const PASS = process.env.BASIC_AUTH_PASS || 'proton';
const ENABLED = (process.env.BASIC_AUTH || 'on').toLowerCase() !== 'off';

function decode(b64: string): string {
  try {
    return atob(b64);
  } catch {
    return '';
  }
}

export function proxy(req: NextRequest) {
  if (!ENABLED) return NextResponse.next();

  const header = req.headers.get('authorization') || '';
  if (header.startsWith('Basic ')) {
    const [user, ...rest] = decode(header.slice(6)).split(':');
    const pass = rest.join(':');
    if (user === USER && pass === PASS) return NextResponse.next();
  }

  return new NextResponse('Требуется авторизация', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Technolider", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export const config = {
  // healthcheck для Docker — без пароля; всё остальное (страницы, статика, API) — под защитой
  matcher: ['/((?!api/health).*)'],
};
