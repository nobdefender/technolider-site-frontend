'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { routeLabels, routeSheets, site } from '@/content/site';
import pre from './Preloader.module.css';
import styles from './Transition.module.css';

type Navigate = (href: string) => void;

const TransitionCtx = createContext<Navigate>(() => {});

/**
 * Переходы между страницами со «шторкой» (curtain) — как go(p) в макете:
 * шторка закрывает экран, под ней меняется страница, затем шторка уезжает вверх.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<{ in?: boolean; out?: boolean; href: string; seq: number }>({
    href: '',
    seq: 0,
  });
  const busy = useRef(false);
  const pending = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  // Пауза после смены страницы, чтобы экран перехода успел «дорисоваться» (заголовок, шкала).
  const HOLD_MS = 750;

  const release = useCallback(() => {
    later(() => {
      setState((s) => ({ ...s, in: false, out: true }));
    }, HOLD_MS);
    later(() => {
      setState((s) => ({ ...s, out: false }));
      busy.current = false;
      pending.current = null;
    }, HOLD_MS + 660);
  }, [later]);

  // Как только новая страница смонтирована — открываем шторку.
  useEffect(() => {
    if (pending.current && pathname === pending.current) release();
  }, [pathname, release]);

  const navigate = useCallback<Navigate>(
    (href) => {
      if (href === pathname) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (busy.current) return;
      busy.current = true;
      pending.current = href;
      setState((s) => ({ in: true, out: false, href, seq: s.seq + 1 }));
      later(() => {
        router.push(href, { scroll: true });
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 560);
      // Страховка: если маршрут не сменился (например, ошибка), всё равно открываем шторку.
      later(() => {
        if (busy.current && pending.current) release();
      }, 3000);
    },
    [pathname, router, release, later],
  );

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);

  const label = routeLabels[state.href] || '';
  const sheet = routeSheets[state.href] || { n: '—', of: '—', kicker: '' };

  return (
    <TransitionCtx.Provider value={navigate}>
      {children}
      <div
        className={styles.curtain}
        data-in={state.in ? '' : undefined}
        data-out={state.out ? '' : undefined}
        aria-hidden="true"
      >
        {/* key перезапускает анимации содержимого при каждом переходе */}
        <div className={styles.curtainInner} key={state.seq}>
          <div className={`${pre.preloadGrid} ${styles.curtainGrid}`} />
          <div className={pre.preloadFrame}>
            <i className={pre.tl} />
            <i className={pre.tr} />
            <i className={pre.bl} />
            <i className={pre.br} />
          </div>
          <span className={pre.preloadCnr}>{site.legalShort} · г. Тула</span>
          <div className={styles.curtainBody}>
            <span className={styles.curtainKicker}>
              Лист {sheet.n} / {sheet.of} · {sheet.kicker}
            </span>
            <span className={styles.curtainLabel}>{label}</span>
            <span className={styles.curtainSub}>Инжиниринг · Производство · Сборка</span>
            <div className={styles.curtainBar}>
              <b />
              <i />
              <b />
            </div>
            <div className={styles.curtainMeta}>
              <span>Переход на лист</span>
              <span>{sheet.n} / {sheet.of}</span>
            </div>
          </div>
          <div className={pre.preloadStamp}>
            <div>
              <span>Лист</span>
              <b>{sheet.n}</b>
            </div>
            <div>
              <span>Формат</span>
              <b>A1</b>
            </div>
            <div>
              <span>Масштаб</span>
              <b>1:1</b>
            </div>
          </div>
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}

export function useTransitionNavigate() {
  return useContext(TransitionCtx);
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
};

/** Ссылка на внутреннюю страницу с переходом через шторку (prefetch от next/link сохраняется). */
export function TransitionLink({ href, onClick, children, ...rest }: LinkProps) {
  const navigate = useTransitionNavigate();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(href);
  };
  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
