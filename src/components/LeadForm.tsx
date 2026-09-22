'use client';

import { useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import { Corners } from './Corners';
import { TransitionLink } from './Transition';
import { routes } from '@/content/site';
import { sanitizeField, validateLead, type LeadErrors, type LeadFields } from '@/lib/lead';
import styles from './LeadForm.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY: LeadFields = { name: '', phone: '', email: '', task: '' };

/** Форма заявки (страница «Контакты»). Поля проверяются при потере фокуса и при отправке. */
export function LeadForm() {
  const [values, setValues] = useState<LeadFields>(EMPTY);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [captchaOk, setCaptchaOk] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof LeadFields;
    const value = sanitizeField[name](e.target.value);
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
    if (status === 'sent' || status === 'error') setStatus('idle');
  };

  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof LeadFields;
    const next = validateLead({ ...values, [name]: sanitizeField[name](e.target.value) });
    setErrors((er) => ({ ...er, [name]: next[name] }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaOk || status === 'sending') return;
    const found = validateLead(values);
    setErrors(found);
    const first = (Object.keys(found) as (keyof LeadFields)[]).find((k) => found[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: LeadErrors };
      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setStatus('idle');
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setValues(EMPTY);
      setCaptchaOk(false);
    } catch {
      setStatus('error');
    }
  };

  const field = (name: keyof LeadFields) => ({
    name,
    value: values[name],
    onChange,
    onBlur,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `lead-${name}-error` : undefined,
  });

  const err = (name: keyof LeadFields) =>
    errors[name] ? (
      <span className={styles.fieldError} id={`lead-${name}-error`} role="alert">
        {errors[name]}
      </span>
    ) : null;

  return (
    <form className={styles.leadForm} onSubmit={submit} noValidate ref={formRef}>
      <div className="field">
        <label htmlFor="lead-name">Как вас зовут</label>
        <input id="lead-name" className="input" type="text" placeholder="Имя" autoComplete="name" {...field('name')} />
        {err('name')}
      </div>
      <div className="field">
        <label htmlFor="lead-phone">Телефон</label>
        <input id="lead-phone" className="input" type="tel" placeholder="+7 ___ ___-__-__" autoComplete="tel" inputMode="tel" maxLength={16} {...field('phone')} />
        {err('phone')}
      </div>
      <div className={`field ${styles.spanAll}`}>
        <label htmlFor="lead-email">Электронная почта</label>
        <input id="lead-email" className="input" type="email" placeholder="name@company.ru" autoComplete="email" {...field('email')} />
        {err('email')}
      </div>
      <div className={`field ${styles.spanAll}`}>
        <label htmlFor="lead-task">Задача</label>
        <textarea id="lead-task" className="input" placeholder="Что нужно изготовить или разработать" {...field('task')} />
        {err('task')}
      </div>
      <div className={`blueprint ${styles.captcha}`}>
        <Corners />
        <label className={styles.captchaLabel}>
          <input type="checkbox" checked={captchaOk} onChange={(e) => setCaptchaOk(e.target.checked)} />
          Я не робот
        </label>
        <span className={styles.captchaBrand}>
          <span className={styles.captchaName}>SmartCaptcha</span>
          <span className={styles.captchaSub}>Yandex Cloud</span>
        </span>
      </div>
      <div className={styles.formFoot}>
        <span className={styles.formNote} role="status">
          {status === 'sent' ? (
            'Заявка отправлена. Ответим в рабочий день.'
          ) : status === 'error' ? (
            'Не удалось отправить. Позвоните нам или напишите на почту.'
          ) : (
            <>
              Отправляя заявку, вы соглашаетесь с{' '}
              <TransitionLink href={routes.privacy} className={styles.formNoteLink}>
                политикой конфиденциальности
              </TransitionLink>
              .
            </>
          )}
        </span>
        <button
          type="submit"
          className={`btn btn-primary blueprint ${styles.submitBtn}`}
          data-armed={captchaOk ? '' : undefined}
          disabled={!captchaOk || status === 'sending'}
        >
          {status === 'sending' ? 'Отправка…' : 'Отправить'}
          <Corners />
        </button>
      </div>
    </form>
  );
}
