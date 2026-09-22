'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './CopyButton.module.css';

type Props = {
  text: string;
  title: string;
  className?: string;
  /** accent — вариант для светлого фона (цвет accent-700) */
  variant?: 'default' | 'accent';
  children: ReactNode;
};

/** Кнопка «скопировать» с галочкой-подтверждением (copy-line + copy-mark в макете). */
export function CopyButton({ text, title, className, variant = 'default', children }: Props) {
  const [on, setOn] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const done = () => {
    setOn(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOn(false), 1800);
  };
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch {}
    document.body.removeChild(ta);
    done();
  };
  const copy = () => {
    try {
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    } catch {
      fallback();
    }
  };

  return (
    <button
      type="button"
      className={[styles.copyLine, variant === 'accent' && styles.accent, className].filter(Boolean).join(' ')}
      onClick={copy}
      title={title}
    >
      {children}
      <i className={styles.copyMark} data-on={on ? '' : undefined} aria-hidden="true">
        <b className={styles.cmBox} />
        <b className={styles.cmTick} />
      </i>
    </button>
  );
}
