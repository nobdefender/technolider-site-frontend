// Правила проверки формы заявки — общие для клиента (LeadForm) и сервера (api/lead).

export type LeadFields = { name: string; phone: string; email: string; task: string };
export type LeadErrors = Partial<Record<keyof LeadFields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeLead(input: Partial<Record<keyof LeadFields, unknown>>): LeadFields {
  const str = (v: unknown, max: number) => (typeof v === 'string' ? v : '').trim().slice(0, max);
  return {
    name: str(input.name, 200),
    phone: str(input.phone, 50),
    email: str(input.email, 200),
    task: str(input.task, 5000),
  };
}

/** Российский номер в виде «+7 XXX XXX-XX-XX»; всё, кроме цифр, отбрасывается. */
export function formatPhone(raw: string): string {
  let d = raw.replace(/\D/g, '');
  if (!d) return raw.trim() === '+' ? '+' : '';
  if (d[0] === '8') d = '7' + d.slice(1);
  if (d[0] !== '7') d = '7' + d;
  d = d.slice(0, 11);
  let out = '+7';
  if (d.length > 1) out += ' ' + d.slice(1, 4);
  if (d.length > 4) out += ' ' + d.slice(4, 7);
  if (d.length > 7) out += '-' + d.slice(7, 9);
  if (d.length > 9) out += '-' + d.slice(9, 11);
  return out;
}

/** Фильтры ввода по полям: имя — только буквы, телефон — маска, почта — только латиница, цифры и @._+- */
export const sanitizeField: Record<keyof LeadFields, (value: string) => string> = {
  name: (v) => v.replace(/[^\p{L}\s'’-]/gu, '').replace(/\s{2,}/g, ' ').slice(0, 80),
  phone: formatPhone,
  email: (v) => v.replace(/[^A-Za-z0-9@._+-]/g, '').slice(0, 120),
  task: (v) => v.slice(0, 5000),
};

export function validateLead(fields: LeadFields): LeadErrors {
  const f = normalizeLead(fields);
  const errors: LeadErrors = {};
  if (f.name.length < 2) errors.name = 'Укажите, как к вам обращаться';
  const digits = f.phone.replace(/\D/g, '');
  if (!f.phone) errors.phone = 'Укажите телефон';
  else if (digits.length !== 11 || digits[0] !== '7' || /[^\d\s()+-]/.test(f.phone))
    errors.phone = 'Укажите номер полностью: +7 XXX XXX-XX-XX';
  if (f.email && !EMAIL_RE.test(f.email)) errors.email = 'Укажите корректный адрес почты';
  if (f.task.length < 10) errors.task = 'Опишите задачу — хотя бы в двух словах';
  return errors;
}
