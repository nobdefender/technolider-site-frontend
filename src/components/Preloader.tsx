'use client';

import { useEffect, useState } from 'react';

/** Экран загрузки при первом открытии сайта (как в макете: 1.3 c счётчик, затем уезжает вверх). */
export function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t0 = Date.now();
    const iv = window.setInterval(() => {
      const k = Math.min(1, (Date.now() - t0) / 1300);
      setPct(Math.round(k * 100));
      if (k >= 1) window.clearInterval(iv);
    }, 40);
    const a = window.setTimeout(() => setDone(true), 1500);
    const b = window.setTimeout(() => setGone(true), 2300);
    return () => {
      window.clearInterval(iv);
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  if (gone) return null;

  return (
    <div className="preload" data-done={done ? '' : undefined} aria-hidden="true">
      <div className="preload-grid" />
      <div className="preload-frame">
        <i className="tl" />
        <i className="tr" />
        <i className="bl" />
        <i className="br" />
      </div>
      <span className="preload-cnr">ООО НПП «Технолидер» · г. Тула</span>
      <div className="preload-body">
        <span className="preload-kicker">Научно-производственное предприятие</span>
        <div className="preload-brand">Технолидер</div>
        <div className="preload-sub">Инжиниринг · Производство · Сборка</div>
        <div className="preload-bar">
          <b />
          <i />
          <b />
        </div>
        <div className="preload-meta">
          <span>Загрузка чертежей и моделей</span>
          <span className="preload-num">{pct}%</span>
        </div>
      </div>
      <div className="preload-stamp">
        <div>
          <span>Лист</span>
          <b>01</b>
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
  );
}
