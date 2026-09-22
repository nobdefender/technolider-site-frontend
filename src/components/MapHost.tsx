'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { mapSrc, routes, site, ymapsApiKey } from '@/content/site';
import styles from './MapHost.module.css';

/**
 * Карта Яндекса живёт в корневом layout и не перезагружается при переходах между страницами:
 * она готовится заранее (скрытой), а на странице «Контакты» просто накладывается
 * на место блока карты ([data-map] на странице контактов). Поэтому карта готова сразу, без «промаргивания».
 *
 * Два режима:
 *  — JS API v3 (когда задан NEXT_PUBLIC_YMAPS_API_KEY): тёмная тема, своя метка, без рекламы;
 *  — бесплатный виджет-iframe (без ключа): внизу показывается рекламный блок Яндекса.
 */
export function MapHost() {
  const pathname = usePathname();
  const onContacts = pathname === routes.contacts;
  const [mounted, setMounted] = useState(onContacts);
  const [ready, setReady] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const useJsApi = !!ymapsApiKey;

  // На «Контактах» загружаем сразу, иначе — чуть позже, чтобы не мешать первому экрану.
  useEffect(() => {
    if (mounted) return;
    const t = window.setTimeout(() => setMounted(true), onContacts ? 0 : 2500);
    return () => window.clearTimeout(t);
  }, [mounted, onContacts]);

  // Совмещаем карту с блоком [data-map] на странице контактов (координаты документа).
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
      const anchor = document.querySelector<HTMLElement>('[data-map]');
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
    const anchor = document.querySelector<HTMLElement>('[data-map]');
    if (anchor) ro.observe(anchor);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, [onContacts, mounted]);

  // JS API v3: подключаем скрипт и рисуем карту с меткой
  useEffect(() => {
    if (!useJsApi || !mounted) return;
    let cancelled = false;
    let destroy: (() => void) | undefined;

    const load = async () => {
      const src = `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(ymapsApiKey)}&lang=ru_RU`;
      if (!document.querySelector(`script[src^="https://api-maps.yandex.ru/v3/"]`)) {
        await new Promise<void>((resolve, reject) => {
          const el = document.createElement('script');
          el.src = src;
          el.async = true;
          el.onload = () => resolve();
          el.onerror = () => reject(new Error('Не удалось загрузить Яндекс Карты'));
          document.head.appendChild(el);
        });
      }
      const ymaps3 = (window as unknown as { ymaps3?: YMaps3 }).ymaps3;
      if (!ymaps3 || cancelled || !mapRef.current) return;
      await ymaps3.ready;
      if (cancelled || !mapRef.current) return;

      const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;
      const center: [number, number] = [site.map.lon, site.map.lat];
      const map = new YMap(mapRef.current, {
        location: { center, zoom: site.map.zoom },
        behaviors: ['drag', 'pinchZoom', 'dblClick', 'multiTouch'], // без зума колесом: страница не «залипает»
      });
      map.addChild(new YMapDefaultSchemeLayer({ theme: 'dark' }));
      map.addChild(new YMapDefaultFeaturesLayer({}));

      const pin = document.createElement('div');
      pin.className = styles.mapPin;
      pin.innerHTML = '<i></i><b></b>';
      map.addChild(new YMapMarker({ coordinates: center }, pin));

      setReady(true);
      destroy = () => map.destroy();
    };

    load().catch(() => setReady(true)); // ключ неверный или сеть — покажем тёмную подложку
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [useJsApi, mounted]);

  // Страховка: если iframe не сообщил о загрузке, показываем через 4 с
  useEffect(() => {
    if (useJsApi || !mounted) return;
    const t = window.setTimeout(() => setReady(true), 4000);
    return () => window.clearTimeout(t);
  }, [useJsApi, mounted]);

  return (
    <div
      ref={hostRef}
      className={styles.mapHost}
      data-mode={useJsApi ? 'jsapi' : 'widget'}
      data-ready={ready ? '' : undefined}
      aria-hidden={!onContacts}
    >
      {mounted &&
        (useJsApi ? (
          <div ref={mapRef} className={styles.mapCanvas} />
        ) : (
          <iframe title="Карта: Тула" src={mapSrc} onLoad={() => setReady(true)} allowFullScreen />
        ))}
    </div>
  );
}

// Минимальные типы JS API v3 — только то, что используется здесь.
type YMapInstance = { addChild: (child: unknown) => void; destroy: () => void };
type YMaps3 = {
  ready: Promise<void>;
  YMap: new (el: HTMLElement, props: Record<string, unknown>) => YMapInstance;
  YMapDefaultSchemeLayer: new (props: Record<string, unknown>) => unknown;
  YMapDefaultFeaturesLayer: new (props: Record<string, unknown>) => unknown;
  YMapMarker: new (props: Record<string, unknown>, el: HTMLElement) => unknown;
};
