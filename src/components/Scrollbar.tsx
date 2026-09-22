'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import styles from './Scrollbar.module.css';

const MIN_THUMB = 40;

/**
 * Собственная полоса прокрутки: нативная скрыта (см. globals.css), поверх страницы
 * рисуется только ползунок — без трека и фона. Тянется мышью, клик по дорожке
 * прокручивает к месту. На сенсорных устройствах не показывается.
 */
export function Scrollbar() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startY: number; startScroll: number; ratio: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const thumb = thumbRef.current;
      const track = trackRef.current;
      if (!thumb || !track) return;
      const doc = document.documentElement;
      const view = window.innerHeight;
      const total = doc.scrollHeight;
      const trackH = track.clientHeight;
      if (total <= view + 1) {
        setVisible(false);
        return;
      }
      setVisible(true);
      const h = Math.max(MIN_THUMB, Math.round((view / total) * trackH));
      const max = total - view;
      const y = Math.round((window.scrollY / max) * (trackH - h));
      thumb.style.height = h + 'px';
      thumb.style.transform = 'translateY(' + y + 'px)';
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, [enabled, pathname]);

  const onThumbDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const free = track.clientHeight - thumb.offsetHeight;
    drag.current = { startY: e.clientY, startScroll: window.scrollY, ratio: free > 0 ? max / free : 0 };
    setDragging(true);
    thumb.setPointerCapture(e.pointerId);
  };
  const onThumbMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    window.scrollTo({ top: d.startScroll + (e.clientY - d.startY) * d.ratio, behavior: 'instant' });
  };
  const onThumbUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    thumbRef.current?.releasePointerCapture(e.pointerId);
  };
  const onTrackDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current) return;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;
    const rect = track.getBoundingClientRect();
    const free = track.clientHeight - thumb.offsetHeight;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = Math.min(free, Math.max(0, e.clientY - rect.top - thumb.offsetHeight / 2));
    window.scrollTo({ top: free > 0 ? (y / free) * max : 0, behavior: 'smooth' });
  };

  if (!enabled) return null;

  return (
    <div
      ref={trackRef}
      className={styles.scrollbar}
      data-visible={visible ? '' : undefined}
      data-dragging={dragging ? '' : undefined}
      onPointerDown={onTrackDown}
      aria-hidden="true"
    >
      <div
        ref={thumbRef}
        className={styles.scrollbarThumb}
        onPointerDown={onThumbDown}
        onPointerMove={onThumbMove}
        onPointerUp={onThumbUp}
        onPointerCancel={onThumbUp}
      />
    </div>
  );
}
