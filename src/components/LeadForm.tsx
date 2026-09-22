'use client';

import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FocusEvent,
  type FormEvent,
} from 'react';
import { Corners } from './Corners';
import { SmartCaptcha } from './SmartCaptcha';
import { TransitionLink } from './Transition';
import { apiBase, routes, smartCaptchaKey } from '@/content/site';
import {
  checkFiles,
  FILE_ACCEPT,
  FILES_MAX,
  FILE_MAX_MB,
  fileSize,
  sanitizeField,
  validateLead,
  type LeadErrors,
  type LeadFields,
} from '@/lib/lead';
import styles from './LeadForm.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY: LeadFields = { name: '', phone: '', email: '', task: '' };

/** Сообщения о неудачной отправке — по причине, понятной посетителю. */
const FAIL_TEXT: Record<string, string> = {
  captcha: 'Подтвердите, что вы не робот, и отправьте заявку ещё раз.',
  rate: 'Вы уже отправили несколько заявок. Попробуйте позже или позвоните нам.',
  size: `Файлы слишком большие: не больше ${FILE_MAX_MB} МБ каждый.`,
  network: 'Не удалось отправить. Позвоните нам или напишите на почту.',
};

/** Форма заявки (страница «Контакты»). Поля проверяются при потере фокуса и при отправке. */
export function LeadForm() {
  const [values, setValues] = useState<LeadFields>(EMPTY);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>();
  const [dragOver, setDragOver] = useState(false);
  // без ключа капчи — прежний чекбокс «Я не робот» (стенд, локальная разработка)
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaOk, setCaptchaOk] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [failReason, setFailReason] = useState<keyof typeof FAIL_TEXT>('network');
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const armed = smartCaptchaKey ? !!captchaToken : captchaOk;

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

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const { files: next, error } = checkFiles(files, Array.from(list));
    setFiles(next);
    setFileError(error);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (i: number) => {
    setFiles((f) => f.filter((_, k) => k !== i));
    setFileError(undefined);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!armed || status === 'sending') return;
    const found = validateLead(values);
    setErrors(found);
    const first = (Object.keys(found) as (keyof LeadFields)[]).find((k) => found[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus('sending');
    const body = new FormData();
    body.set('name', values.name);
    body.set('phone', values.phone);
    if (values.email) body.set('email', values.email);
    body.set('task', values.task);
    body.set('page', typeof window !== 'undefined' ? window.location.pathname : routes.contacts);
    if (captchaToken) body.set('captchaToken', captchaToken);
    // ловушка для ботов: поле скрыто от людей, поэтому у человека всегда пустое
    if (honeypotRef.current?.value) body.set('company', honeypotRef.current.value);
    files.forEach((f) => body.append('files', f));

    try {
      const res = await fetch(`${apiBase}/api/leads`, { method: 'POST', body });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        errors?: LeadErrors;
        error?: string;
      };

      if (res.ok && data.ok) {
        setStatus('sent');
        setValues(EMPTY);
        setFiles([]);
        setFileError(undefined);
        setCaptchaToken('');
        setCaptchaOk(false);
        window.smartCaptcha?.reset();
        return;
      }

      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setStatus('idle');
        return;
      }

      setFailReason(
        data.error === 'captcha'
          ? 'captcha'
          : res.status === 429
            ? 'rate'
            : res.status === 413
              ? 'size'
              : 'network',
      );
      setStatus('error');
      if (data.error === 'captcha') {
        setCaptchaToken('');
        window.smartCaptcha?.reset();
      }
    } catch {
      setFailReason('network');
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

      {/* Вложения: чертёж, спецификация, ТЗ */}
      <div className={`field ${styles.spanAll}`}>
        <label htmlFor="lead-files">Чертёж или ТЗ — если есть</label>
        <div
          className={`blueprint ${styles.drop}`}
          data-over={dragOver ? '' : undefined}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <Corners />
          <input
            ref={fileInputRef}
            id="lead-files"
            type="file"
            multiple
            accept={FILE_ACCEPT}
            className={styles.fileInput}
            onChange={(e) => addFiles(e.target.files)}
          />
          <label htmlFor="lead-files" className={styles.dropLabel}>
            <span className={styles.dropAction}>Выберите файлы</span>
            <span className={styles.dropHint}>
              или перетащите сюда · до {FILES_MAX} файлов по {FILE_MAX_MB} МБ · PDF, DWG, DOC, XLS,
              изображения, архивы
            </span>
          </label>
        </div>
        {files.length > 0 && (
          <ul className={styles.fileList}>
            {files.map((f, i) => (
              <li className={styles.fileItem} key={f.name + f.size}>
                <span className={styles.fileName}>{f.name}</span>
                <span className={styles.fileSize}>{fileSize(f.size)}</span>
                <button
                  type="button"
                  className={styles.fileRemove}
                  onClick={() => removeFile(i)}
                  aria-label={`Убрать файл ${f.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        {fileError && (
          <span className={styles.fileError} role="alert">
            {fileError}
          </span>
        )}
      </div>

      {/* Ловушка для ботов: людям не видна и не доступна с клавиатуры */}
      <input
        ref={honeypotRef}
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className={styles.honeypot}
      />

      {smartCaptchaKey ? (
        <SmartCaptcha onToken={setCaptchaToken} />
      ) : (
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
      )}

      <div className={styles.formFoot}>
        <span className={styles.formNote} role="status">
          {status === 'sent' ? (
            'Заявка отправлена. Ответим в рабочий день.'
          ) : status === 'error' ? (
            FAIL_TEXT[failReason]
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
          data-armed={armed ? '' : undefined}
          disabled={!armed || status === 'sending'}
        >
          {status === 'sending' ? 'Отправка…' : 'Отправить'}
          <Corners />
        </button>
      </div>
    </form>
  );
}
