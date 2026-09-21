'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { routes, site } from '@/content/site';
import { Corners } from './Corners';
import { TransitionLink } from './Transition';

export function Nav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // Высота шапки → --nav-h и распорка под фиксированной шапкой (syncNav в макете).
  useEffect(() => {
    let last = 0;
    const sync = () => {
      const nav = navRef.current;
      if (!nav) return;
      const h = Math.round(nav.getBoundingClientRect().height);
      if (!h || h === last) return;
      last = h;
      document.documentElement.style.setProperty('--nav-h', h + 'px');
      if (spacerRef.current) spacerRef.current.style.height = h + 'px';
    };
    sync();
    requestAnimationFrame(sync);
    const t = window.setTimeout(sync, 400);
    window.addEventListener('resize', sync);
    if (document.fonts?.ready) document.fonts.ready.then(sync).catch(() => {});
    const ro = navRef.current && 'ResizeObserver' in window ? new ResizeObserver(sync) : null;
    if (ro && navRef.current) ro.observe(navRef.current);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', sync);
      ro?.disconnect();
    };
  }, []);

  // Полоса прогресса прокрутки под шапкой.
  useEffect(() => {
    const prg = () => {
      const d = document.documentElement;
      const max = d.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (progRef.current) progRef.current.style.transform = 'scaleX(' + p + ')';
    };
    window.addEventListener('scroll', prg, { passive: true });
    prg();
    return () => window.removeEventListener('scroll', prg);
  }, [pathname]);

  // Мобильное меню: закрывается при переходе, по Esc и при расширении окна.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const mq = window.matchMedia('(min-width: 1101px)');
    const onMq = () => {
      if (mq.matches) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  const close = () => setOpen(false);
  const cur = (href: string) => (pathname === href ? 'page' : undefined);
  const curServices = pathname.startsWith(routes.services) ? 'page' : undefined;

  return (
    <>
      <nav
        ref={navRef}
        className="nav site-nav"
        aria-label="Основная навигация"
        data-open={open ? '' : undefined}
      >
        <TransitionLink href={routes.home} className="nav-brand" onClick={close}>
          <span className="nav-brand-name">Технолидер</span>
          <span className="nav-brand-sub">Научно-производственное предприятие</span>
        </TransitionLink>
        <button
          type="button"
          className="nav-burger"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-burger-icon" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
        <div className="nav-menu" id="site-menu">
          <TransitionLink href={routes.services} aria-current={curServices} onClick={close}>
            Услуги
          </TransitionLink>
          <TransitionLink href={routes.about} aria-current={cur(routes.about)} onClick={close}>
            О компании
          </TransitionLink>
          <TransitionLink href={routes.contacts} aria-current={cur(routes.contacts)} onClick={close}>
            Контакты
          </TransitionLink>
          {site.showPhone && (
            <a href={site.phoneHref} className="nav-phone">
              {site.phone}
            </a>
          )}
          <TransitionLink href={routes.contacts} className="btn blueprint nav-cta" onClick={close}>
            Связаться с нами
            <Corners />
          </TransitionLink>
        </div>
        <span className="progress">
          <i ref={progRef} style={{ transform: 'scaleX(0)' }} />
        </span>
      </nav>
      <div className="nav-spacer" ref={spacerRef} aria-hidden="true" />
    </>
  );
}
