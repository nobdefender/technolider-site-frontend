'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { workSteps } from '@/content/site';

const STEPS = workSteps;

/** Плавная прокрутка с замедлением — нативная smooth на телефонах слишком резкая. */
function easeScrollTo(top: number, duration = 1100) {
  const start = window.scrollY;
  const delta = top - start;
  if (Math.abs(delta) < 2) return;
  const t0 = performance.now();
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / duration);
    window.scrollTo({ top: start + delta * ease(k), behavior: 'instant' });
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** «Как мы работаем» — закреплённый блок, шаги подсвечиваются по мере прокрутки (pinLoop в макете). */
export function HowWeWork() {
  const pinRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(1);
  const idxRef = useRef(1);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const el = pinRef.current;
      if (el && window.innerWidth > 1100) {
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
        const i = Math.min(5, Math.max(1, Math.floor(p * 5.0001) + 1));
        if (i !== idxRef.current) {
          idxRef.current = i;
          setIdx(i);
        }
      } else if (el) {
        // без закрепления (планшет/телефон): шаг подсвечивается, когда доходит до 66% высоты экрана
        const line = window.innerHeight * 0.66;
        let n = 0;
        el.querySelectorAll('.pin-step').forEach((st) => {
          if (st.getBoundingClientRect().top < line) n++;
        });
        const i = Math.min(5, Math.max(1, n));
        if (i !== idxRef.current) {
          idxRef.current = i;
          setIdx(i);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pinGo = (e: MouseEvent<HTMLDivElement>) => {
    const t = e.currentTarget;
    const el = t.closest('.pin-wrap') || pinRef.current;
    const i = +(t.getAttribute('data-step') || 1);
    if (!el || window.innerWidth <= 1100) {
      // без закреплённой прокрутки подводим выбранный шаг к линии подсветки
      const r = t.getBoundingClientRect();
      easeScrollTo(r.top + window.scrollY - window.innerHeight * 0.5);
      return;
    }
    const r = el.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    if (total <= 40) return;
    window.scrollTo({ top: r.top + window.scrollY + total * ((i - 0.5) / 5), behavior: 'smooth' });
  };

  return (
    <section className="sec-how" data-dark>
      <div className="wrap how-inner">
        <div className="pin-wrap" ref={pinRef}>
          <div className="pin-stage">
            <div className="sheet-head">
              <span className="tech tech-700">04 · Как мы работаем</span>
              <span className="tech">Лист 04 / 05 · Маршрутная карта</span>
            </div>
            <div className="how-head">
              <h2 className="h2-lg how-title">
                Пять шагов
                <br />
                от заявки
                <br />
                до готового изделия
              </h2>
              <span className="tech how-counter">
                {String(idx).padStart(2, '0')}
                <span className="how-total"> / 05</span>
              </span>
            </div>
            <div className="steps" data-steps>
              <i className="pin-line" style={{ width: idx * 20 + '%' }} />
              {STEPS.map((s, i) => (
                <div
                  key={s.n}
                  className="step pin-step"
                  data-on={idx >= i + 1 ? '' : undefined}
                  data-step={i + 1}
                  onClick={pinGo}
                >
                  <span className="step-n">{s.n}</span>
                  <h3 className="step-t">{s.t}</h3>
                  <p className="step-p">{s.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
