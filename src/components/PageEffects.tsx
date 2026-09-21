'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Скролл-эффекты страницы (setupReveal в макете):
 *  — появление блоков при прокрутке ([data-reveal] → [data-inview]);
 *  — пословное появление заголовков h2 (.words);
 *  — счётчик чисел ([data-count]);
 *  — параллакс фотографий (.photo-cell .par).
 * Запускается заново при смене маршрута.
 */
export function PageEffects() {
  const pathname = usePathname();
  const io = useRef<IntersectionObserver | null>(null);
  const parInstalled = useRef(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    if (!io.current) {
      io.current = new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.setAttribute('data-inview', '');
              io.current?.unobserve(e.target);
            }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
    }
    const obs = io.current;

    const run = () => {
      const roots = document.querySelectorAll(
        'main > section:not(.marquee):not(.hero-root), main > section:not(.hero-root) > div.wrap, main > div.duotone',
      );
      const targets = new Set<HTMLElement>();
      roots.forEach((r) => {
        if (r.matches('div.duotone')) {
          targets.add(r as HTMLElement);
          return;
        }
        Array.from(r.children).forEach((c) => {
          if (c.closest('.hero-root')) return;
          const grid = getComputedStyle(c).display === 'grid';
          if (grid && c.children.length > 1 && c.children.length <= 8 && !c.matches('form'))
            Array.from(c.children).forEach((g) => targets.add(g as HTMLElement));
          else targets.add(c as HTMLElement);
        });
      });
      targets.forEach((t) => {
        if (t.hasAttribute('data-reveal')) return;
        const parent = t.parentElement;
        const idx = parent ? Array.from(parent.children).indexOf(t) : 0;
        t.style.transitionDelay = Math.min(idx, 6) * 90 + 'ms';
        t.setAttribute('data-reveal', '');
        const r = t.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9 && r.bottom > 0)
          requestAnimationFrame(() => t.setAttribute('data-inview', ''));
        else obs.observe(t);
      });
    };

    const extras = () => {
      document.querySelectorAll<HTMLElement>('main h2:not(.words-done)').forEach((el) => {
        // Заголовок может содержать <br> для принудительного переноса строки; другие вложенные элементы — не анимируем.
        const hasOther = Array.from(el.children).some((c) => c.tagName !== 'BR');
        if (el.closest('.hero-root, .row-link, .next-link') || hasOther) {
          el.classList.add('words-done');
          return;
        }
        const nodes = Array.from(el.childNodes);
        el.textContent = '';
        el.classList.add('words', 'words-done');
        let i = 0;
        nodes.forEach((node) => {
          if (node instanceof HTMLBRElement) {
            el.appendChild(document.createElement('br'));
            return;
          }
          const words = (node.textContent || '').split(' ').filter((w) => w.length);
          words.forEach((w, j) => {
            const o = document.createElement('span');
            const inner = document.createElement('span');
            inner.textContent = w;
            inner.style.transitionDelay = i * 60 + 'ms';
            i++;
            o.appendChild(inner);
            el.appendChild(o);
            if (j < words.length - 1) el.appendChild(document.createTextNode(' '));
          });
        });
        if (!el.closest('[data-reveal]')) {
          el.setAttribute('data-reveal', '');
          obs.observe(el);
        }
      });
      document.querySelectorAll<HTMLElement>('[data-count]:not(.counted)').forEach((el) => {
        el.classList.add('counted');
        const cio = new IntersectionObserver(
          (es) => {
            if (!es[0].isIntersecting) return;
            cio.disconnect();
            const target = +(el.dataset.count || 0);
            const suf = el.dataset.suffix || '';
            const t0 = performance.now();
            const step = (now: number) => {
              const p = Math.min(1, (now - t0) / 1600);
              const e = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.round(target * e) + suf;
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          },
          { threshold: 0.4 },
        );
        cio.observe(el);
      });
      document.querySelectorAll<HTMLElement>('.photo-cell .image-slot:not(.par)').forEach((el) => {
        el.classList.add('par');
        el.style.display = 'block';
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.transform = 'scale(1.15)';
      });
    };

    // На телефонах (≤600px) заголовки первых экранов растягиваются на всю ширину:
    // кегль подбирается так, чтобы самое длинное слово занимало ширину колонки.
    const fitHeadings = () => {
      document.querySelectorAll<HTMLElement>('main .hero-root h1').forEach((h) => {
        if (window.innerWidth > 600) {
          h.style.fontSize = '';
          return;
        }
        const cs = getComputedStyle(h);
        const probe = document.createElement('span');
        probe.style.cssText =
          'position:absolute;visibility:hidden;white-space:nowrap;font-size:100px;letter-spacing:0.01em;' +
          'font-family:' + cs.fontFamily + ';font-weight:' + cs.fontWeight + ';text-transform:' + cs.textTransform;
        document.body.appendChild(probe);
        let ratio = 0;
        (h.textContent || '').split(/\s+/).forEach((w) => {
          if (!w) return;
          probe.textContent = w;
          ratio = Math.max(ratio, probe.getBoundingClientRect().width / 100);
        });
        probe.remove();
        if (!ratio) return;
        const cap = 56;
        const size = Math.max(24, Math.min(cap, (h.clientWidth - 2) / ratio));
        h.style.fontSize = size.toFixed(1) + 'px';
      });
    };
    let fitTimer = 0;
    const onResize = () => {
      window.clearTimeout(fitTimer);
      fitTimer = window.setTimeout(fitHeadings, 120);
    };
    window.addEventListener('resize', onResize);

    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        fitHeadings();
        run();
        extras();
      });
    });

    if (!parInstalled.current) {
      parInstalled.current = true;
      const par = () => {
        document.querySelectorAll<HTMLElement>('.photo-cell').forEach((c) => {
          const r = c.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
          const img = c.querySelector<HTMLElement>('.par');
          if (img && !c.matches(':hover'))
            img.style.transform = 'scale(1.15) translateY(' + p * -8 + '%)';
        });
      };
      window.addEventListener('scroll', par, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fitTimer);
      window.removeEventListener('resize', onResize);
    };
  }, [pathname]);

  return null;
}
