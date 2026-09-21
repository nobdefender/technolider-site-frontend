'use client';

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
    <nav className="pp-toc">
      <span className="tech mb14">Содержание</span>
      {items.map((it) => (
        <button type="button" className="toc-item" key={it.id} onClick={() => jump(it.id)}>
          <span className="toc-n">{it.n}</span>
          <span>{it.t}</span>
        </button>
      ))}
    </nav>
  );
}
