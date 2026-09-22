'use client';

import { useEffect, useRef } from 'react';
import { smartCaptchaKey } from '@/content/site';
import styles from './SmartCaptcha.module.css';

declare global {
  interface Window {
    smartCaptcha?: {
      render: (
        el: HTMLElement,
        params: {
          sitekey: string;
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          hl?: string;
          test?: boolean;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      destroy: (widgetId: string) => void;
    };
  }
}

const SRC = 'https://smartcaptcha.yandexcloud.net/captcha.js';

/**
 * Виджет Yandex SmartCaptcha. Токен отдаётся наружу через onToken
 * (пустая строка — токен просрочен, нужно пройти проверку заново).
 */
export function SmartCaptcha({ onToken }: { onToken: (token: string) => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const cbRef = useRef(onToken);

  // ссылку на обработчик обновляем в эффекте: виджет создаётся один раз,
  // а callback должен вызывать актуальную функцию
  useEffect(() => {
    cbRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!smartCaptchaKey) return;
    let widgetId: string | undefined;
    let cancelled = false;

    const render = () => {
      if (cancelled || !boxRef.current || !window.smartCaptcha) return;
      widgetId = window.smartCaptcha.render(boxRef.current, {
        sitekey: smartCaptchaKey,
        hl: 'ru',
        callback: (token) => cbRef.current(token),
        'expired-callback': () => cbRef.current(''),
      });
    };

    if (window.smartCaptcha) {
      render();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src^="${SRC}"]`);
      const el = existing || document.createElement('script');
      if (!existing) {
        el.src = SRC;
        el.async = true;
        document.head.appendChild(el);
      }
      el.addEventListener('load', render);
      return () => {
        cancelled = true;
        el.removeEventListener('load', render);
        if (widgetId && window.smartCaptcha) window.smartCaptcha.destroy(widgetId);
      };
    }

    return () => {
      cancelled = true;
      if (widgetId && window.smartCaptcha) window.smartCaptcha.destroy(widgetId);
    };
  }, []);

  return <div ref={boxRef} className={styles.captcha} />;
}
