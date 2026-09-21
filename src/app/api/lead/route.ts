import { NextResponse } from 'next/server';
import { normalizeLead, validateLead } from '@/lib/lead';

/**
 * Приём заявки с формы «Контакты».
 * Поля проверяются теми же правилами, что и на клиенте (src/lib/lead.ts).
 * Сейчас заявка пишется в лог сервера — подключите сюда отправку
 * на почту / в CRM (например, через nodemailer или webhook).
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }
  const lead = normalizeLead((body && typeof body === 'object' ? body : {}) as Record<string, unknown>);
  const errors = validateLead(lead);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }
  console.log('[lead]', new Date().toISOString(), lead);
  return NextResponse.json({ ok: true });
}
