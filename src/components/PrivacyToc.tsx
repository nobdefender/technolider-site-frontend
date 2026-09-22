'use client';

import styles from './PrivacyToc.module.css';

/** Оглавление политики конфиденциальности — прокрутка к разделу с отступом под шапку. */
export function PrivacyToc({ items }: { items: { id: string; n: string; t: string }[] }) {
  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el)
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 96,
        behavior: 'smooth',
      });
  };
  return (
    <nav className={styles.ppToc}>
      <span className="tech mb14">Содержание</span>
      {items.map((it) => (
        <button type="button" className={styles.tocItem} key={it.id} onClick={() => jump(it.id)}>
          <span className={styles.tocN}>{it.n}</span>
          <span>{it.t}</span>
        </button>
      ))}
    </nav>
  );
}
