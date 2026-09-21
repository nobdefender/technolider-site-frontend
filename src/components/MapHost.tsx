'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { mapSrc, routes } from '@/content/site';

/**
 * Карта Яндекса живёт в корневом layout и не перезагружается при переходах между страницами:
 * iframe загружается заранее (скрытым), а на странице «Контакты» просто накладывается
 * на место блока `.map-wrap`. Поэтому карта готова сразу, без «промаргивания».
 */
export function MapHost() {
  const pathname = usePathname();
  const onContacts = pathname === routes.contacts;
  const [mounted, setMounted] = useState(onContacts);
  const [ready, setReady] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  // На «Контактах» загружаем сразу, иначе — чуть позже, чтобы не мешать первому экрану.
  useEffect(() => {
    if (mounted) return;
    const t = window.setTimeout(() => setMounted(true), onContacts ? 0 : 2500);
    return () => window.clearTimeout(t);
  }, [mounted, onContacts]);

  // Совмещаем iframe с блоком .map-wrap на странице контактов (координаты документа).
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!onContacts) {
      host.removeAttribute('data-on');
      host.style.cssText = '';
      return;
    }
    let raf = 0;
    const sync = () => {
      raf = 0;
      const anchor = document.querySelector<HTMLElement>('.map-wrap');
      if (!anchor) return;
      const r = anchor.getBoundingClientRect();
      host.style.left = Math.round(r.left + window.scrollX) + 'px';
      host.style.top = Math.round(r.top + window.scrollY) + 'px';
      host.style.width = Math.round(r.width) + 'px';
      host.style.height = Math.round(r.height) + 'px';
      host.setAttribute('data-on', '');
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };
    schedule();
    const timers = [100, 400, 1000, 2000].map((ms) => window.setTimeout(schedule, ms));
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    const anchor = document.querySelector<HTMLElement>('.map-wrap');
    if (anchor) ro.observe(anchor);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, [onContacts, mounted]);

  return (
    <div ref={hostRef} className="map-host" data-ready={ready ? '' : undefined} aria-hidden={!onContacts}>
      {mounted && (
        <iframe title="Карта: Тула" src={mapSrc} onLoad={() => setReady(true)} allowFullScreen />
      )}
    </div>
  );
}
