'use client';

import { useEffect, useState } from 'react';
import styles from './Preloader.module.css';

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
    <div className={styles.preload} data-done={done ? '' : undefined} aria-hidden="true">
      <div className={styles.preloadGrid} />
      <div className={styles.preloadFrame}>
        <i className={styles.tl} />
        <i className={styles.tr} />
        <i className={styles.bl} />
        <i className={styles.br} />
      </div>
      <span className={styles.preloadCnr}>ООО НПП «Технолидер» · г. Тула</span>
      <div className={styles.preloadBody}>
        <span className={styles.preloadKicker}>Научно-производственное предприятие</span>
        <div className={styles.preloadBrand}>Технолидер</div>
        <div className={styles.preloadSub}>Инжиниринг · Производство · Сборка</div>
        <div className={styles.preloadBar}>
          <b />
          <i />
          <b />
        </div>
        <div className={styles.preloadMeta}>
          <span>Загрузка чертежей и моделей</span>
          <span className={styles.preloadNum}>{pct}%</span>
        </div>
      </div>
      <div className={styles.preloadStamp}>
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
